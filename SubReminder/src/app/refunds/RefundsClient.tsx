"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
    History,
    Clock,
    CheckCircle2,
    XCircle,
    ChevronRight,
    Copy,
    Mail,
    ArrowRight,
    Plus,
    X,
    Trash2,
    Filter,
    ChevronUp,
    ChevronDown,
    Archive
} from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { useMemo } from "react";

export default function RefundsClient({
    initialRefunds,
    subscriptions,
    referralsCount = 0,
    accountLocked = false
}: {
    initialRefunds: any[],
    subscriptions: any[],
    referralsCount?: number,
    accountLocked?: boolean
}) {
    const { showToast } = useToast();
    const [refunds, setRefunds] = useState(initialRefunds);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [mailContent, setMailContent] = useState("");
    const [sendingEmail, setSendingEmail] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedRefund, setSelectedRefund] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>({ key: 'createdAt', direction: 'desc' });

    const calculateCommissionDetails = (amount: number, referrals: number) => {
        const amt = Math.max(0, amount);
        let baseRate = 0.35;
        if (amt > 100) baseRate = 0.15;
        else if (amt > 50) baseRate = 0.20;
        else if (amt > 20) baseRate = 0.25;
        
        const discount = Math.floor(referrals / 10) * 0.005;
        const finalRate = Math.max(0.05, baseRate - discount);
        return {
            percent: parseFloat((finalRate * 100).toFixed(1)),
            fee: parseFloat((amt * finalRate).toFixed(2)),
            kept: parseFloat((amt - (amt * finalRate)).toFixed(2))
        };
    };

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedRefunds = useMemo(() => {
        const filtered = refunds.filter(r => r.subscription?.name.toLowerCase().includes(searchTerm.toLowerCase()));
        if (!sortConfig) return filtered;

        return [...filtered].sort((a: any, b: any) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            if (sortConfig.key === 'subscription') {
                aValue = a.subscription?.name || "";
                bValue = b.subscription?.name || "";
            }

            if (sortConfig.key === 'createdAt') {
                return sortConfig.direction === 'asc'
                    ? new Date(aValue).getTime() - new Date(bValue).getTime()
                    : new Date(bValue).getTime() - new Date(aValue).getTime();
            }

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [refunds, searchTerm, sortConfig]);

    const [formData, setFormData] = useState({
        subscriptionId: "",
        reason: "",
        amount: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/refunds", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                const newRefund = await res.json();
                const sub = subscriptions.find(s => s.id === formData.subscriptionId);
                setRefunds([{ ...newRefund, subscription: sub }, ...refunds]);
                setIsModalOpen(false);
                setFormData({ subscriptionId: "", reason: "", amount: "" });
                showToast("Refund request generated!");
            } else {
                const errorData = await res.json().catch(() => ({}));
                showToast(errorData.error || "Failed to generate request.", "error");
            }
        } catch (err) {
            console.error("Refund request failed:", err);
            showToast("Network error. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/refunds/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                const updated = await res.json();
                setRefunds(refunds.map(r => r.id === id ? { ...updated, subscription: r.subscription } : r));
                if (selectedRefund?.id === id) {
                    setSelectedRefund({ ...updated, subscription: selectedRefund.subscription });
                }
                showToast(`Status updated to ${newStatus}`);
            }
        } catch (err) {
            console.error("Failed to update status:", err);
        }
    };

    const deleteRefund = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this refund request?")) return;
        try {
            const res = await fetch(`/api/refunds/${id}`, { method: "DELETE" });
            if (res.ok) {
                setRefunds(refunds.filter(r => r.id !== id));
                if (selectedRefund?.id === id) setSelectedRefund(null);
                showToast("Refund request deleted");
            }
        } catch (err) {
            console.error("Failed to delete refund:", err);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending": return <span className="px-3 py-1 bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 text-xs font-bold rounded-full flex items-center gap-1.5"><Clock className="w-3 h-3" /> AI Draft</span>;
            case "sent": return <span className="px-3 py-1 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 text-xs font-bold rounded-full flex items-center gap-1.5"><Mail className="w-3 h-3" /> Email Sent</span>;
            case "approved": return <span className="px-3 py-1 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 text-xs font-bold rounded-full flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> Approved</span>;
            case "payment_pending": return <span className="px-3 py-1 bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 text-xs font-bold rounded-full flex items-center gap-1.5"><Clock className="w-3 h-3" /> Invoice Due</span>;
            case "completed": return <span className="px-3 py-1 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 text-xs font-bold rounded-full flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> Completed</span>;
            case "rejected": return <span className="px-3 py-1 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 text-xs font-bold rounded-full flex items-center gap-1.5"><XCircle className="w-3 h-3" /> Rejected</span>;
            default: return null;
        }
    };

    const handleVerifyReply = async () => {
        if (!selectedRefund || !mailContent) return;
        setVerifying(true);
        try {
            const res = await fetch("/api/refunds/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    refundId: selectedRefund.id,
                    mailContent: mailContent
                })
            });

            if (res.ok) {
                const data = await res.json();
                setRefunds(refunds.map(r => r.id === selectedRefund.id ? { ...data.refund, subscription: selectedRefund.subscription } : r));
                setSelectedRefund({ ...data.refund, subscription: selectedRefund.subscription });
                showToast(data.result.status === "approved" ? "Refund approved and verified by AI!" : "Refund status updated based on provider's reply.");
                setIsVerifyModalOpen(false);
                setMailContent("");
                
                // If it was rejected, we might need a page refresh to update account lock state
                if (data.result.status !== "approved") {
                    window.location.reload();
                }
            } else {
                const errorData = await res.json().catch(() => ({}));
                showToast(errorData.error || "AI Verification failed.", "error");
            }
        } catch (err) {
            console.error(err);
            showToast("Network error during verification.", "error");
        } finally {
            setVerifying(false);
        }
    };

    const handleSendMail = async () => {
        if (!selectedRefund) return;
        setSendingEmail(true);
        try {
            const res = await fetch("/api/refunds/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refundId: selectedRefund.id })
            });

            if (res.ok) {
                const updated = await res.json();
                setRefunds(refunds.map(r => r.id === selectedRefund.id ? { ...updated, subscription: selectedRefund.subscription } : r));
                setSelectedRefund({ ...updated, subscription: selectedRefund.subscription });
                showToast("Email dispatched securely to provider!");
            } else {
                showToast("Failed to send proxy email.", "error");
            }
        } catch (err) {
            console.error(err);
            showToast("Network error. Could not send.", "error");
        } finally {
            setSendingEmail(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {accountLocked && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-8 rounded-3xl flex items-center gap-6 shadow-lg shadow-red-500/10">
                        <div className="w-14 h-14 bg-red-100 dark:bg-red-900/40 text-red-600 rounded-2xl flex items-center justify-center shrink-0">
                            <XCircle className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="font-black text-red-700 dark:text-red-400 text-lg">Account Access Restricted</h3>
                            <p className="text-sm font-bold text-red-600/80 dark:text-red-400/80 mt-1">
                                Your account is locked due to unpaid success fees OR because you haven't reported the outcome of sent refund requests within the 7-day window. 
                                Please pay outstanding invoices or verify support replies to restore access.
                            </p>
                        </div>
                    </div>
                )}

                <div className="flex flex-wrap justify-between items-end gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Refund Assistant</h1>
                        <p className="text-slate-500 dark:text-slate-400">Request refunds for unused time and track your savings.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        disabled={accountLocked}
                        className="flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-white gap-2 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus className="w-5 h-5" />
                        New Refund Assistant
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Active / History list */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <History className="w-5 h-5 text-primary" />
                                Recent Requests
                            </h3>
                            <div className="relative">
                                <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Filter by service..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none w-64 transition-all shadow-sm"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleSort('subscription')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1 ${sortConfig?.key === 'subscription' ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800 hover:bg-slate-50'}`}
                                >
                                    Name
                                    {sortConfig?.key === 'subscription' && (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                                </button>
                                <button
                                    onClick={() => handleSort('amountRequested')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1 ${sortConfig?.key === 'amountRequested' ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800 hover:bg-slate-50'}`}
                                >
                                    Amount
                                    {sortConfig?.key === 'amountRequested' && (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                                </button>
                                <button
                                    onClick={() => handleSort('createdAt')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1 ${sortConfig?.key === 'createdAt' ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800 hover:bg-slate-50'}`}
                                >
                                    Date
                                    {sortConfig?.key === 'createdAt' && (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                                </button>
                            </div>
                        </div>
                        {refunds.length === 0 ? (
                            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center">
                                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Mail className="w-8 h-8 text-slate-300" />
                                </div>
                                <p className="text-slate-500 font-medium">No refund requests found. Start one to save money!</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {sortedRefunds.map((refund) => (
                                    <div
                                        key={refund.id}
                                        onClick={() => setSelectedRefund(refund)}
                                        className={`bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group ${selectedRefund?.id === refund.id ? 'ring-2 ring-primary border-transparent' : ''}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-bold">
                                                    {refund.subscription?.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900 dark:text-white">{refund.subscription?.name}</h4>
                                                    <p className="text-xs text-slate-500">Requested on {new Date(refund.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="font-black text-slate-900 dark:text-white">${refund.amountRequested.toFixed(2)}</p>
                                                    {getStatusBadge(refund.status)}
                                                </div>
                                                <div className="flex items-center gap-2 relative z-10">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => { 
                                                            e.preventDefault(); 
                                                            e.stopPropagation(); 
                                                            deleteRefund(refund.id); 
                                                        }}
                                                        className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Trash2 className="w-4 h-4 pointer-events-none" />
                                                    </button>
                                                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors pointer-events-none" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details / Draft View */}
                    <div className="space-y-6">
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <ArrowRight className="w-5 h-5 text-primary" />
                            Request Details
                        </h3>
                        {selectedRefund ? (
                            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 sticky top-24">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-black text-xl">{selectedRefund.subscription?.name}</h4>
                                    <div className="relative group">
                                        <button className="text-primary hover:underline text-xs font-bold uppercase tracking-widest pb-2">Update Status</button>
                                        <div className="absolute right-0 top-full bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 p-2 hidden group-hover:block z-10 w-32">
                                            <button onClick={() => updateStatus(selectedRefund.id, "pending")} className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg">AI Draft</button>
                                            <button onClick={() => updateStatus(selectedRefund.id, "approved")} className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg text-green-600">Approved</button>
                                            <button onClick={() => updateStatus(selectedRefund.id, "rejected")} className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg text-red-600">Rejected</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Draft</p>
                                    <div className="relative group">
                                        <pre className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-400 whitespace-pre-wrap font-sans overflow-y-auto max-h-[300px] border border-slate-100 dark:border-slate-700">
                                            {selectedRefund.emailDraft}
                                        </pre>
                                        <button
                                            onClick={() => navigator.clipboard.writeText(selectedRefund.emailDraft)}
                                            className="absolute top-2 right-2 p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm border border-slate-100 dark:border-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Copy className="w-4 h-4 text-primary" />
                                        </button>
                                    </div>
                                </div>

                                {selectedRefund && (() => {
                                        const { percent, fee, kept } = calculateCommissionDetails(selectedRefund.amountRequested, referralsCount);
                                        return (
                                            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 mt-6 mb-6">
                                                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">Success Fee Calculation</p>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium">Estimated Commission ({percent}%)</span>
                                                    <span className="font-bold text-primary">${fee.toFixed(2)}</span>
                                                </div>
                                                <p className="text-[9px] text-slate-500 mt-2 uppercase font-bold">*Only payable if refund is confirmed. You keep ${kept.toFixed(2)}!</p>
                                            </div>
                                        );
                                })()}

                                {selectedRefund.status === "payment_pending" ? (
                                    <div className="p-6 bg-orange-50 dark:bg-orange-900/10 rounded-2xl border border-orange-200 dark:border-orange-800/30 flex flex-col items-center justify-center gap-4 text-center">
                                        <div>
                                            <p className="font-black text-orange-600 dark:text-orange-400 text-lg">Action Required: Pay Success Fee</p>
                                            <p className="text-xs text-orange-500 font-bold max-w-[280px] mx-auto mt-1">
                                                To continue using SubReminder, please pay the ${(selectedRefund.commissionFee || 0).toFixed(2)} success fee for this approved refund.
                                            </p>
                                        </div>
                                        <button 
                                            onClick={() => updateStatus(selectedRefund.id, "completed")}
                                            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/30 rounded-xl font-bold text-sm transition-all w-full flex items-center justify-center gap-2">
                                            Simulate Invoice Payment (Test)
                                        </button>
                                    </div>
                                ) : selectedRefund.status === "sent" ? (
                                    <button
                                        onClick={() => setIsVerifyModalOpen(true)}
                                        className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                                    >
                                        <History className="w-5 h-5" />
                                        Verify Provider Reply ✨
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSendMail}
                                        disabled={sendingEmail || selectedRefund.status !== "pending"}
                                        className={`w-full py-4 text-white font-bold rounded-2xl text-sm transition-all flex items-center justify-center gap-2 ${
                                            selectedRefund.status !== "pending" 
                                            ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed" 
                                            : "bg-primary shadow-lg shadow-primary/20 hover:bg-primary/90"
                                        }`}
                                    >
                                        <Mail className="w-4 h-4" />
                                        {sendingEmail ? "Sending Securely..." : (selectedRefund.status !== "pending" ? "Email Already Evaluated" : "Send via SubReminder Proxy")}
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 text-center flex flex-col items-center justify-center h-64">
                                <Mail className="w-12 h-12 text-slate-300 mb-4" />
                                <p className="text-slate-400 text-sm font-medium">Select a request to view details and email draft.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* New Request Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-black">Start Refund Assistant</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Select Subscription</label>
                                <select
                                    required
                                    value={formData.subscriptionId}
                                    onChange={(e) => {
                                        const subId = e.target.value;
                                        const sub = subscriptions.find((s: any) => s.id === subId);
                                        setFormData({ 
                                            ...formData, 
                                            subscriptionId: subId,
                                            amount: sub ? String(sub.price) : ""
                                        });
                                    }}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary outline-none transition-all"
                                >
                                    <option value="">Choose a service...</option>
                                    {subscriptions.map((sub: any) => (
                                        <option key={sub.id} value={sub.id}>{sub.name} (${sub.price}/mo)</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Refund Reason</label>
                                <textarea
                                    required
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                    placeholder="I haven't used the service lately..."
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Estimated Amount</label>
                                <div className="relative mb-3">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        required
                                        value={formData.amount}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/-/g, '');
                                            setFormData({ ...formData, amount: val });
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === '-') e.preventDefault();
                                        }}
                                        placeholder="0.00"
                                        className="w-full pl-8 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary outline-none transition-all"
                                    />
                                </div>
                                
                                {formData.amount && !isNaN(Number(formData.amount)) && (() => {
                                    const { percent, fee } = calculateCommissionDetails(Number(formData.amount), referralsCount);
                                    return (
                                        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex justify-between items-center border border-slate-200 dark:border-slate-700">
                                            <span className="text-xs font-bold text-slate-500">Our success fee ({percent}%)</span>
                                            <span className="text-sm font-black text-primary">${fee.toFixed(2)}</span>
                                        </div>
                                    );
                                })()}
                            </div>

                            <div className="flex justify-end gap-3 pt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || !formData.subscriptionId}
                                    className="px-8 py-3 rounded-xl text-sm font-bold bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50"
                                >
                                    {loading ? "Generating..." : "Generate Assistant"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* AI Verification Modal */}
            {isVerifyModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 overflow-hidden relative">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                    <History className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="text-xl font-black">AI Verification Profile</h3>
                            </div>
                            <button onClick={() => setIsVerifyModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><X className="w-5 h-5" /></button>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                    Did you receive a reply from {selectedRefund?.subscription?.name}?
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                    Paste the entire email content below. Our Gemini AI will analyze it to verify your refund status and automatically unlock your account if approved or rejected.
                                </p>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Paste Provider Email Content</label>
                                <textarea
                                    required
                                    value={mailContent}
                                    onChange={(e) => setMailContent(e.target.value)}
                                    placeholder="Paste the email text here..."
                                    rows={8}
                                    className="w-full px-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none text-sm"
                                />
                            </div>

                            <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    onClick={() => setIsVerifyModalOpen(false)}
                                    className="flex-1 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all font-sans"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleVerifyReply}
                                    disabled={verifying || !mailContent}
                                    className="flex-[2] py-4 rounded-xl text-sm font-bold bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {verifying ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            AI is Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <History className="w-4 h-4" />
                                            Verify with Gemini AI ✨
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
