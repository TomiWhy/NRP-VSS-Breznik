import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const userId = (session.user as any).id;

        // Security Check: Check for overdue payments (7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const overdueRefund = await prisma.refundRequest.findFirst({
            where: {
                userId,
                OR: [
                    { status: "payment_pending", updatedAt: { lte: sevenDaysAgo } },
                    { status: "sent", updatedAt: { lte: sevenDaysAgo } }
                ]
            }
        });

        if (overdueRefund) {
            await prisma.user.update({
                where: { id: userId },
                data: { accountLocked: true }
            });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                name: true,
                email: true,
                emailNotifications: true,
                appNotifications: true,
                image: true,
                accountLocked: true,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error("Failed to fetch user or enforce lock:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { name, image, currentPassword, newPassword, mode, emailNotifications, appNotifications } = await req.json();

        if (mode === "profile") {
            const updateData: any = {};
            if (name !== undefined) updateData.name = name;
            if (image !== undefined) updateData.image = image;

            const updatedUser = await prisma.user.update({
                where: { id: (session.user as any).id },
                data: updateData,
            });
            return NextResponse.json(updatedUser);
        }

        if (mode === "password") {
            const user = await prisma.user.findUnique({
                where: { id: (session.user as any).id }
            });

            if (!user || !user.passwordHash) {
                return NextResponse.json({ error: "User not found" }, { status: 404 });
            }

            const isCorrect = await bcrypt.compare(currentPassword, user.passwordHash);
            if (!isCorrect) {
                return NextResponse.json({ error: "Incorrect current password" }, { status: 400 });
            }

            const hashed = await bcrypt.hash(newPassword, 10);
            await prisma.user.update({
                where: { id: user.id },
                data: { passwordHash: hashed },
            });

            return NextResponse.json({ message: "Password updated successfully" });
        }

        if (mode === "preferences") {
            const updatedUser = await prisma.user.update({
                where: { id: (session.user as any).id },
                data: {
                    emailNotifications,
                    appNotifications
                },
            });
            return NextResponse.json(updatedUser);
        }

        return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
    } catch (error) {
        console.error("User update failed:", error);
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}
