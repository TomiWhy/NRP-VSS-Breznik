import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscriptions = await prisma.subscription.findMany({
        where: { userId: (session.user as any).id },
        orderBy: { renewalDate: "asc" },
    });

    return NextResponse.json(subscriptions);
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const data = await req.json();
        
        const parsedDate = new Date(data.renewalDate);
        if (isNaN(parsedDate.getTime()) || parsedDate.getFullYear() > 2100) {
            return NextResponse.json({ error: "Invalid renewal date or year is too far in the future" }, { status: 400 });
        }

        const subscription = await prisma.subscription.create({
            data: {
                ...data,
                userId: (session.user as any).id,
                renewalDate: parsedDate,
            },
        });

        return NextResponse.json(subscription, { status: 201 });
    } catch (error) {
        console.error("Failed to create subscription:", error);
        return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 });
    }
}
