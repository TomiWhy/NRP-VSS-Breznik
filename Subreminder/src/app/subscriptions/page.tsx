import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SubscriptionsClient from "./SubscriptionsClient";

export default async function SubscriptionsPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const subscriptions = await prisma.subscription.findMany({
        where: { userId: (session.user as any).id },
        orderBy: { renewalDate: "asc" },
    });

    const serializedSubscriptions = subscriptions.map(sub => ({
        ...sub,
        renewalDate: sub.renewalDate.toISOString(),
        createdAt: sub.createdAt.toISOString(),
        updatedAt: sub.updatedAt.toISOString(),
    }));

    return <SubscriptionsClient initialSubscriptions={serializedSubscriptions} />;
}
