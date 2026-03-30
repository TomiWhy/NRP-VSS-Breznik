import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { status } = await req.json();

        // Check ownership first
        const existing = await prisma.refundRequest.findUnique({
            where: { id },
            include: { user: true }
        });

        if (!existing || existing.userId !== (session.user as any).id) {
            return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
        }

        let updateData: any = { status };

        // Honor System Logic
        if (status === "approved" && existing.status !== "payment_pending" && existing.status !== "completed") {
            // Intercept and enforce payment phase
            updateData.status = "payment_pending";

            // Calculate Commission Fee (same math as frontend)
            const amt = Math.max(0, existing.amountRequested);
            let baseRate = 0.35;
            if (amt > 100) baseRate = 0.15;
            else if (amt > 50) baseRate = 0.20;
            else if (amt > 20) baseRate = 0.25;
            
            const discount = Math.floor(((existing.user as any).referralsCount || 0) / 10) * 0.005;
            const finalRate = Math.max(0.05, baseRate - discount);
            
            updateData.commissionFee = amt * finalRate;
        }

        if (status === "completed" && existing.status === "payment_pending") {
            updateData.paidAt = new Date();
        }

        const refund = await prisma.refundRequest.update({
            where: { id },
            data: updateData,
            include: { subscription: true }
        });

        // Unlock Account if no other overdue payments exist
        if (status === "completed") {
            try {
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

                const otherOverdue = await prisma.refundRequest.findFirst({
                    where: {
                        userId: (session.user as any).id,
                        status: "payment_pending",
                        updatedAt: { lte: sevenDaysAgo },
                        id: { not: id } // Don't count the current one we just paid
                    }
                });

                if (!otherOverdue) {
                    await prisma.user.update({
                        where: { id: (session.user as any).id },
                        data: { accountLocked: false }
                    });
                    console.log(`[SECURITY] User ${(session.user as any).id} account unlocked after payment.`);
                }
            } catch (unlockError) {
                console.error("Failed to unlock account after payment:", unlockError);
            }
        }

        // Create In-App Notification on Approval
        if (updateData.status === "payment_pending") {
            try {
                await prisma.notification.create({
                    data: {
                        userId: (session.user as any).id,
                        subscriptionId: refund.subscriptionId,
                        type: "refund",
                        message: `Refund for ${refund.subscription.name} approved! Please pay the $${(updateData.commissionFee || 0).toFixed(2)} success fee to continue using the Assistant.`
                    }
                });
            } catch (notifyError) {
                console.error("Failed to create approval notification:", notifyError);
            }
        }

        return NextResponse.json(refund);
    } catch (error) {
        console.error("Failed to update refund status:", error);
        return NextResponse.json({ error: "Failed to update refund status" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await context.params;

        const refund = await prisma.refundRequest.findUnique({
            where: { id },
        });

        if (!refund || refund.userId !== (session.user as any).id) {
            return NextResponse.json({ error: "Refund request not found" }, { status: 404 });
        }

        // Anti-Cheat: Prevent deletion of sent or pending payment requests
        if (refund.status === "sent" || refund.status === "payment_pending") {
            return NextResponse.json(
                { error: "You cannot delete a refund request once it has been sent. Please provide the support reply first." },
                { status: 403 }
            );
        }

        await prisma.refundRequest.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Refund request deleted successfully" });
    } catch (error) {
        console.error("Failed to delete refund request:", error);
        return NextResponse.json({ error: "Failed to delete refund request" }, { status: 500 });
    }
}
