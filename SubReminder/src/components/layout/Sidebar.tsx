"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    CreditCard,
    History,
    Settings,
    LogOut,
    Bell,
    Calendar,
    Users,
    Activity
} from "lucide-react";
import { signOut } from "next-auth/react";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Subscriptions", href: "/subscriptions", icon: CreditCard },
    { name: "Calendar", href: "/calendar", icon: Calendar },
    { name: "Refund History", href: "/refunds", icon: History },
    { name: "Integrations", href: "/integrations", icon: Activity },
    { name: "Referrals", href: "/referrals", icon: Users },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen sticky top-0">
            <div className="p-6">
                <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
                    <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-xl">account_balance_wallet</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">SubReminder</span>
                </Link>
            </div>

            <nav className="flex-1 px-4 mt-4 space-y-1">
                {navigation.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all",
                            pathname === item.href
                                ? "bg-primary/10 text-primary"
                                : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                        )}
                    >
                        <item.icon className="w-5 h-5" />
                        {item.name}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 rounded-xl transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
