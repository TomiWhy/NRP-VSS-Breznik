"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
    TrendingDown,
    CreditCard,
    DollarSign,
    Calendar,
    CheckCircle2,
    MoreHorizontal
} from "lucide-react";
import Link from "next/link";

const ICON_MAP: Record<string, any> = {
    DollarSign,
    CreditCard,
    Calendar,
    CheckCircle2
};

export default function DashboardWrapper({
    stats,
    subscriptions,
    user,
    pieData = [],
    areaData = []
}: {
    stats: any[],
    subscriptions: any[],
    user: any,
    pieData?: any[],
    areaData?: any[]
}) {
    const totalPieValue = pieData.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
                    <p className="text-slate-500 dark:text-slate-400">Welcome back, {user?.name || "User"}. Here&apos;s what&apos;s happening with your subscriptions.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat) => (
                        <div key={stat.name} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                                    {ICON_MAP[stat.icon] && (
                                        (() => {
                                            const Icon = ICON_MAP[stat.icon];
                                            return <Icon className="w-6 h-6" />;
                                        })()
                                    )}
                                </div>
                                <TrendingDown className="w-4 h-4 text-green-500" />
                            </div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.name}</p>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{stat.value}</h3>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Chart Section */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-bold text-slate-900 dark:text-white">Monthly Spending</h3>
                                <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-xs font-bold py-2 px-3 outline-none">
                                    <option>Last 6 Months</option>
                                    <option>Last Year</option>
                                </select>
                            </div>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={areaData}>
                                        <defs>
                                            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#2b6cee" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#2b6cee" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#fff',
                                                borderRadius: '12px',
                                                border: 'none',
                                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                                            }}
                                            formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Amount']}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="amount"
                                            stroke="#2b6cee"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorAmount)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                <h3 className="font-bold text-slate-900 dark:text-white">Upcoming Renewals</h3>
                                <Link
                                    href="/subscriptions"
                                    className="text-sm font-bold text-primary hover:underline"
                                >
                                    View All
                                </Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-widest">
                                            <th className="px-6 py-4 font-bold">Subscription</th>
                                            <th className="px-6 py-4 font-bold">Renewal Date</th>
                                            <th className="px-6 py-4 font-bold">Price</th>
                                            <th className="px-6 py-4 font-bold">Status</th>
                                            <th className="px-6 py-4 font-bold text-right pr-8">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {subscriptions.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                                    No upcoming renewals.
                                                </td>
                                            </tr>
                                        ) : (
                                            subscriptions.slice(0, 5).map((sub: any) => (
                                                <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center font-bold text-primary">
                                                                {sub.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-slate-900 dark:text-white">{sub.name}</p>
                                                                <p className="text-xs text-slate-500">{sub.category}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="text-sm text-slate-900 dark:text-white font-medium">
                                                            {new Date(sub.renewalDate).toLocaleDateString()}
                                                        </p>
                                                    </td>
                                                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                                                        ${sub.price.toFixed(2)}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs font-bold rounded-full">
                                                            {sub.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right pr-8">
                                                        <Link
                                                            href="/subscriptions"
                                                            className="text-slate-400 hover:text-primary transition-colors flex justify-end"
                                                        >
                                                            <MoreHorizontal className="w-5 h-5" />
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-primary p-8 rounded-3xl text-white relative overflow-hidden shadow-xl shadow-primary/20">
                            <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                            <h4 className="text-sm font-bold uppercase tracking-widest mb-4 opacity-80">Recovered to Date</h4>
                            <p className="text-4xl font-black mb-6">{stats.find(s => s.name === "Money Recovered")?.value || "$0.00"}</p>
                            <Link
                                href="/refunds"
                                className="block w-full py-3 bg-white text-primary font-bold rounded-xl text-sm text-center transition-transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                New Refund Request
                            </Link>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-6">Spend by Category</h3>
                            <div className="h-[200px] w-full mb-6 relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Spend']} />
                                    </PieChart>
                                </ResponsiveContainer>
                                {/* Center Text */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <p className="text-2xl font-black text-slate-900 dark:text-white">${totalPieValue.toFixed(2)}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {pieData.map((item) => (
                                    <div key={item.name} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                                            <span className="text-slate-600 dark:text-slate-400">{item.name}</span>
                                        </div>
                                        <span className="font-bold">${item.value.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
