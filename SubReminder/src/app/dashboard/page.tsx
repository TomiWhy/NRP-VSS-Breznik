import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardWrapper from "./DashboardWrapper";
import {
    CheckCircle2,
    Calendar,
    DollarSign,
    CreditCard as CreditCardIcon
} from "lucide-react";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const user = session.user;
    const subscriptions = await prisma.subscription.findMany({
        where: { userId: (user as any).id },
        orderBy: { renewalDate: "asc" },
    });

    const totalMonthlySpend = subscriptions
        .filter((s: any) => s.status === "active")
        .reduce((acc: number, s: any) => acc + (s.billingInterval === "monthly" ? s.price : s.price / 12), 0);

    const upcomingRenewals = subscriptions
        .filter((s: any) => {
            const diff = new Date(s.renewalDate).getTime() - new Date().getTime();
            return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000;
        });

    const refunds = await prisma.refundRequest.findMany({
        where: { userId: (user as any).id, status: "approved" },
    });

    const totalRecovered = refunds.reduce((acc: number, r: any) => acc + r.amountRequested, 0);

    const stats = [
        { name: "Monthly Spend", value: `$${totalMonthlySpend.toFixed(2)}`, icon: "DollarSign", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
        { name: "Subscriptions", value: subscriptions.length.toString(), icon: "CreditCard", color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
        { name: "Upcoming Renewals", value: upcomingRenewals.length.toString(), icon: "Calendar", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
        { name: "Money Recovered", value: `$${totalRecovered.toFixed(2)}`, icon: "CheckCircle2", color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
    ];

    // Chart Data calculations
    const categories = Array.from(new Set(subscriptions.map((s: any) => s.category)));
    const pieData = (categories as string[]).map((cat: string) => {
        const value = subscriptions
            .filter((s: any) => s.category === cat && s.status === "active")
            .reduce((acc: number, s: any) => acc + (s.billingInterval === "monthly" ? s.price : s.price / 12), 0);

        let color = "#94a3b8";
        if (cat === "streaming") color = "#2b6cee";
        if (cat === "productivity") color = "#a855f7";
        if (cat === "music") color = "#ec4899";
        if (cat === "education") color = "#10b981";

        return { name: cat.charAt(0).toUpperCase() + cat.slice(1), value, color };
    }).filter(item => item.value > 0);

    // Area Data: Calculate deterministic historical spending for the past 6 months
    const pastMonths = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setDate(1); // Prevent end-of-month rollovers (e.g. Feb 30 -> Mar 2)
        d.setMonth(d.getMonth() - (5 - i));
        return d;
    });

    const areaData = pastMonths.map((date) => {
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59).getTime();

        const amount = subscriptions.reduce((acc: number, s: any) => {
            const createdTime = new Date(s.createdAt).getTime();
            const updatedTime = new Date(s.updatedAt).getTime();
            
            if (createdTime > monthEnd) return acc;
            if (s.status === "cancelled" && updatedTime < monthStart) return acc;

            const cost = s.billingInterval === "monthly" ? s.price : s.price / 12;
            return acc + cost;
        }, 0);

        return {
            name: date.toLocaleString('default', { month: 'short' }),
            amount: Number(amount.toFixed(2))
        };
    });

    // Serialize dates for client components
    const serializedSubscriptions = subscriptions.map((sub: any) => ({
        ...sub,
        renewalDate: sub.renewalDate.toISOString(),
        createdAt: sub.createdAt.toISOString(),
        updatedAt: sub.updatedAt.toISOString(),
    }));

    return (
        <DashboardWrapper
            stats={stats}
            subscriptions={serializedSubscriptions}
            user={user}
            pieData={pieData}
            areaData={areaData}
        />
    );
}
