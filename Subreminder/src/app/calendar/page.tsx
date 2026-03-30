import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import CalendarClient from "./CalendarClient";

export default async function CalendarPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const subscriptions = await prisma.subscription.findMany({
        where: {
            userId: (session.user as any).id,
            status: "active"
        },
        orderBy: { renewalDate: "asc" },
    });

    return <CalendarClient initialSubscriptions={subscriptions} />;
}
