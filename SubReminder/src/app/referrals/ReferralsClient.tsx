"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
    Users,
    Gift,
    Copy,
    Award,
    TrendingUp,
    CheckCircle2,
    DollarSign,
    Share2
} from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function ReferralsClient({ referralsCount = 0 }: { referralsCount?: number }) {
    const { showToast } = useToast();
    const referralCode = "SAVE20-SUB";
    const referralLink = `https://subreminder.com/ref/${referralCode}`;

    const [stats] = useState([
        { label: "Total Referrals", value: referralsCount.toString(), icon: Users },
        { label: "Active Discount", value: `-${(Math.floor(referralsCount / 10) * 0.5).toFixed(1)}%`, icon: TrendingUp },
        { label: "Account Credit", value: "$0.00", icon: Gift },
    ]);

    const [history] = useState([
        { name: "John Doe", date: "Mar 2, 2026", status: "Joined", reward: "$10.00" },
        { name: "Sarah Wilson", date: "Feb 28, 2026", status: "Joined", reward: "$10.00" },
        { name: "Mike Johnson", date: "Feb 25, 2026", status: "Active", reward: "$5.00" },
        { name: "Alex Brown", date: "Feb 20, 2026", status: "Joined", reward: "$10.00" },
    ]);

    const copyToClipboard = (text: string, message: string) => {
        navigator.clipboard.writeText(text);
        showToast(message);
    };

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Referral Dashboard</h1>
                        <p className="text-slate-500 dark:text-slate-400">Invite friends and earn credit for every successful referral.</p>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-3xl border border-primary/10">
                        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-primary uppercase tracking-widest">Your Reward</p>
                            <p className="text-sm font-black text-slate-900 dark:text-white">-0.5% Fee Discount / 10 Friends</p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat) => (
                        <div key={stat.label} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:border-primary transition-all group">
                            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-primary transition-colors">
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                                <p className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Sharing Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-8">
                        <div>
                            <h3 className="text-2xl font-black mb-2">Share & Save</h3>
                            <p className="text-slate-500 text-sm font-medium">Use your unique link to invite others. For every 10 successful referrals, you unlock a permanent <strong>0.5% discount</strong> on our success fee for any future refunds!</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Your Referral Link</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        readOnly
                                        value={referralLink}
                                        className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold truncate"
                                    />
                                    <button
                                        onClick={() => copyToClipboard(referralLink, "Link copied!")}
                                        className="p-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.05] active:scale-[0.95] transition-all"
                                    >
                                        <Copy className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Referral Code</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        readOnly
                                        value={referralCode}
                                        className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold tracking-widest"
                                    />
                                    <button
                                        onClick={() => copyToClipboard(referralCode, "Code copied!")}
                                        className="p-3 bg-slate-800 dark:bg-slate-700 text-white rounded-2xl shadow-lg hover:scale-[1.05] active:scale-[0.95] transition-all"
                                    >
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex gap-4">
                            <button className="flex-1 py-4 bg-[#1DA1F2] text-white rounded-2xl font-black shadow-lg shadow-blue-500/20 hover:bg-[#1a91da] transition-all flex items-center justify-center gap-2">
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                                Tweet It
                            </button>
                            <button className="flex-1 py-4 bg-[#0A66C2] text-white rounded-2xl font-black shadow-lg shadow-blue-700/20 hover:bg-[#09529d] transition-all flex items-center justify-center gap-2">
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                Share
                            </button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-8">
                        <div>
                            <h3 className="text-2xl font-black mb-2 flex items-center gap-3">
                                <Award className="w-7 h-7 text-primary" />
                                Referral History
                            </h3>
                            <p className="text-slate-500 text-sm font-medium">Track your performance and pending rewards.</p>
                        </div>

                        <div className="space-y-4">
                            {history.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-transparent hover:border-primary/20 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center font-black text-xs shadow-sm">
                                            {item.name[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">{item.name}</p>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{item.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 justify-end text-green-500">
                                            <CheckCircle2 className="w-3 h-3" />
                                            <span className="text-sm font-black">{item.reward}</span>
                                        </div>
                                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">{item.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
