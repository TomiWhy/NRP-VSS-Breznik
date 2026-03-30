import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import RefundsClient from "./RefundsClient";

export default async function RefundsPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const userId = (session.user as any).id;

    const refunds = await prisma.refundRequest.findMany({
        where: { userId },
        include: { subscription: true },
        orderBy: { createdAt: "desc" },
    });

    const subscriptions = await prisma.subscription.findMany({
        where: { userId },
    });

    const userProfile = await prisma.user.findUnique({
        where: { id: userId },
    });
    
    const referralsCount = (userProfile as any)?.referralsCount || 0;
    const accountLocked = (userProfile as any)?.accountLocked || false;

    // Serialize for client components
    const serializedRefunds = refunds.map(r => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
        subscription: {
            ...r.subscription,
            renewalDate: r.subscription.renewalDate.toISOString(),
            createdAt: r.subscription.createdAt.toISOString(),
            updatedAt: r.subscription.updatedAt.toISOString(),
        }
    }));

    const serializedSubscriptions = subscriptions.map(s => ({
        ...s,
        renewalDate: s.renewalDate.toISOString(),
        createdAt: s.createdAt.toISOString(),
        updatedAt: s.updatedAt.toISOString(),
    }));

    return (
        <RefundsClient
            initialRefunds={serializedRefunds}
            subscriptions={serializedSubscriptions}
            referralsCount={referralsCount}
            accountLocked={accountLocked}
        />
    );
}
