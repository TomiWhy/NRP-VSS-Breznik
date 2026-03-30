"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
    Zap,
    Shield,
    CheckCircle2,
    AlertCircle,
    Settings2,
    Database,
    Cloud,
    Slack,
    Github,
    Trello,
    Plus
} from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function IntegrationsClient() {
    const { showToast } = useToast();

    const [integrations, setIntegrations] = useState([
        {
            id: 'aws',
            name: 'AWS CloudWatch',
            icon: Cloud,
            status: 'active',
            lastSync: '12 mins ago',
            usage: '94%',
            color: 'text-orange-500',
            bg: 'bg-orange-50'
        },
        {
            id: 'slack',
            name: 'Slack Workspace',
            icon: Slack,
            status: 'active',
            lastSync: '1 hour ago',
            usage: '12%',
            color: 'text-purple-500',
            bg: 'bg-purple-50'
        },
        {
            id: 'github',
            name: 'GitHub Enterprise',
            icon: Github,
            status: 'warning',
            lastSync: '2 days ago',
            usage: 'High',
            color: 'text-slate-900',
            bg: 'bg-slate-100'
        }
    ]);

    const handleReconnect = (id: string) => {
        showToast("Reconnecting to service...");
        setTimeout(() => showToast(`Successfully synced with ${id.toUpperCase()}`), 1000);
    };

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-8 pb-20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Usage Integrations</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Connect your SaaS providers to monitor real-time usage and optimize costs.</p>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-4 bg-primary text-white font-black rounded-[20px] shadow-xl shadow-primary/20 hover:scale-[1.05] active:scale-[0.95] transition-all">
                        <Plus className="w-5 h-5" />
                        Connect New Service
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {integrations.map((item) => (
                        <div key={item.id} className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden hover:border-primary transition-all group">
                            <div className="p-8 space-y-6">
                                <div className="flex items-start justify-between">
                                    <div className={`w-14 h-14 ${item.bg} dark:bg-slate-800 ${item.color} rounded-2xl flex items-center justify-center shadow-inner`}>
                                        <item.icon className="w-7 h-7" />
                                    </div>
                                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                                        }`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`}></div>
                                        {item.status}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white">{item.name}</h3>
                                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest flex items-center gap-2">
                                        <Database className="w-3 h-3" />
                                        Last sync: {item.lastSync}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Usage Health</span>
                                        <span className="text-xs font-black text-slate-900 dark:text-white">{item.usage}</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${item.status === 'active' ? 'bg-primary' : 'bg-amber-500'} transition-all duration-1000`}
                                            style={{ width: item.usage.includes('%') ? item.usage : '85%' }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="pt-2 flex gap-3">
                                    <button
                                        onClick={() => handleReconnect(item.id)}
                                        className="flex-1 py-3 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
                                    >
                                        Reconnect
                                    </button>
                                    <button className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-xl hover:text-primary transition-all border border-slate-200 dark:border-slate-700">
                                        <Settings2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-8 text-center space-y-4 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer group">
                        <div className="w-14 h-14 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform shadow-sm">
                            <Plus className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-slate-900 dark:text-white">Add Database</p>
                            <p className="text-xs font-medium text-slate-400 mt-1">Connect your SQL/NoSQL stores</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-10 rounded-[50px] text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-20 opacity-10">
                        <Shield className="w-64 h-64" />
                    </div>
                    <div className="relative max-w-2xl space-y-6">
                        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                            <Zap className="w-6 h-6" />
                        </div>
                        <h2 className="text-3xl font-black tracking-tight">Enterprise Compliance</h2>
                        <p className="text-slate-400 font-medium leading-relaxed font-premium">
                            Your integrations are protected by SOC2-compliant encryption. We only access billing and usage metadata, ensuring your private cloud data never leaves your environment.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <button className="px-8 py-4 bg-white text-slate-900 font-black rounded-2xl text-xs uppercase tracking-widest hover:scale-[1.02] transition-all">
                                Security Whitepaper
                            </button>
                            <button className="px-8 py-4 bg-white/10 text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10">
                                View Logs
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
