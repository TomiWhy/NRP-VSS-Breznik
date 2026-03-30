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
        const body = await req.json();
        const { name, category, price, currency, billingInterval, renewalDate, usageLevel, status, providerEmail } = body;

        // Check ownership first
        const existing = await prisma.subscription.findUnique({
            where: { id }
        });

        if (!existing || existing.userId !== (session.user as any).id) {
            return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
        }

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (category !== undefined) updateData.category = category;
        if (price !== undefined) updateData.price = parseFloat(price);
        if (currency !== undefined) updateData.currency = currency;
        if (billingInterval !== undefined) updateData.billingInterval = billingInterval;
        if (usageLevel !== undefined) updateData.usageLevel = usageLevel;
        if (status !== undefined) updateData.status = status;
        if (providerEmail !== undefined) updateData.providerEmail = providerEmail;

        if (renewalDate) {
            const parsedDate = new Date(renewalDate);
            if (isNaN(parsedDate.getTime()) || parsedDate.getFullYear() > 2100) {
                return NextResponse.json({ error: "Invalid renewal date" }, { status: 400 });
            }
            updateData.renewalDate = parsedDate;
        }

        const subscription = await prisma.subscription.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(subscription);
    } catch (error) {
        console.error("Failed to update subscription:", error);
        return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Check ownership first
        const existing = await prisma.subscription.findUnique({
            where: { id }
        });

        if (!existing || existing.userId !== (session.user as any).id) {
            return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
        }

        await prisma.subscription.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Subscription deleted" });
    } catch (error) {
        console.error("Failed to delete subscription:", error);
        return NextResponse.json({ error: "Failed to delete subscription" }, { status: 500 });
    }
}
