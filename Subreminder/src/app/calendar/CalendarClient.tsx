"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Bell,
    CreditCard,
    TrendingUp,
    ShieldCheck
} from "lucide-react";

export default function CalendarClient({
    initialSubscriptions
}: {
    initialSubscriptions: any[]
}) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(currentDate);

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));

    const renderHeader = () => {
        return (
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                        <CalendarIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-slate-900 dark:text-white">Renewal Calendar</h1>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{monthName} {year}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-500">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold rounded-xl hover:bg-slate-100 transition-all">
                        Today
                    </button>
                    <button onClick={nextMonth} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-500">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        );
    };

    const renderDays = () => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return (
            <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                {days.map((day) => (
                    <div key={day} className="py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {day}
                    </div>
                ))}
            </div>
        );
    };

    const renderCells = () => {
        const cells = [];

        // Prev month padding
        for (let i = firstDayOfMonth - 1; i >= 0; i--) {
            cells.push(
                <div key={`prev-${i}`} className="min-h-[120px] p-2 border-r border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 opacity-30">
                    <span className="text-xs font-bold text-slate-400">{prevMonthDays - i}</span>
                </div>
            );
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            const isToday = new Date().toDateString() === date.toDateString();

            const daySubs = initialSubscriptions.filter(s => {
                const subDate = new Date(s.renewalDate);
                const subYear = subDate.getFullYear();
                const subMonth = subDate.getMonth();
                const subDay = subDate.getDate();

                // If the calendar month is before the subscription start, don't show it
                if (year < subYear || (year === subYear && month < subMonth && s.billingInterval !== 'yearly')) {
                    if (!(s.billingInterval === 'yearly' && year > subYear && month === subMonth)) {
                        return false;
                    }
                }

                if (s.billingInterval === 'monthly') {
                    const isLastDayOfMonth = i === daysInMonth;
                    return subDay === i || (subDay > daysInMonth && isLastDayOfMonth);
                } else if (s.billingInterval === 'yearly') {
                    return subDay === i && subMonth === month && year >= subYear;
                }

                return subDay === i && subMonth === month && subYear === year;
            });

            cells.push(
                <div key={i} className={`min-h-[120px] p-2 border-r border-b border-slate-100 dark:border-slate-800 transition-all hover:bg-slate-50/50 dark:hover:bg-slate-800/20 ${isToday ? "bg-primary/5 shadow-inner" : "bg-white dark:bg-slate-900"}`}>
                    <div className="flex justify-between items-center mb-2">
                        <span className={`text-xs font-bold ${isToday ? "w-6 h-6 flex items-center justify-center bg-primary text-white rounded-lg shadow-md shadow-primary/20" : "text-slate-500 dark:text-slate-400"}`}>
                            {i}
                        </span>
                        {daySubs.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>}
                    </div>
                    <div className="space-y-1">
                        {daySubs.map(sub => (
                            <div key={sub.id} className="px-2 py-1 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-200 truncate flex items-center gap-1 shadow-sm">
                                <div className="w-1 h-1 rounded-full bg-primary"></div>
                                {sub.name}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        // Next month padding
        const totalCells = cells.length;
        const remainingCells = 42 - totalCells;
        for (let i = 1; i <= remainingCells; i++) {
            cells.push(
                <div key={`next-${i}`} className="min-h-[120px] p-2 border-r border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 opacity-30">
                    <span className="text-xs font-bold text-slate-400">{i}</span>
                </div>
            );
        }

        return <div className="grid grid-cols-7">{cells}</div>;
    };

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
                    {renderHeader()}
                    {renderDays()}
                    {renderCells()}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-xs font-black mb-4 flex items-center gap-2 text-primary uppercase tracking-widest">
                            <TrendingUp className="w-4 h-4" />
                            Next Renewal Insights
                        </h3>
                        <div className="space-y-4">
                            {initialSubscriptions.slice(0, 3).length > 0 ? initialSubscriptions.slice(0, 3).map(sub => (
                                <div key={sub.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-center font-bold text-xs">
                                            {sub.name[0]}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold">{sub.name}</p>
                                            <p className="text-[10px] text-slate-500">{new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(sub.renewalDate))}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-black">${sub.price}</span>
                                </div>
                            )) : <p className="text-xs text-slate-500 italic">No upcoming renewals found.</p>}
                        </div>
                    </div>

                    <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 shadow-sm relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all"></div>
                        <h3 className="text-xs font-black mb-4 flex items-center gap-2 text-primary uppercase tracking-widest">
                            <ShieldCheck className="w-4 h-4" />
                            Security Audit
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed font-medium">
                            All your subscription data is encrypted and monitored 24/7. No unexpected renewals will slip through.
                        </p>
                        <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">View Audit Log</button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
