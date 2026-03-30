import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
        where: { userId: (session.user as any).id },
        orderBy: { createdAt: "desc" },
        take: 20,
    });

    return NextResponse.json(notifications);
}

export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await req.json();
        const existing = await prisma.notification.findUnique({
            where: { id }
        });

        if (!existing || existing.userId !== (session.user as any).id) {
            return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
        }

        await prisma.notification.update({
            where: { id },
            data: { read: true },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update notification" }, { status: 500 });
    }
}
