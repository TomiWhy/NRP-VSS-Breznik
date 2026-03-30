"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
    Plus,
    Filter,
    Edit2,
    Trash2,
    X,
    Calendar,
    DollarSign,
    Mail,
    MoreHorizontal,
    Download,
    Archive,
    RotateCcw,
    Zap
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useToast } from "@/context/ToastContext";
import { ChevronUp, ChevronDown } from "lucide-react";

export default function SubscriptionsClient({
    initialSubscriptions
}: {
    initialSubscriptions: any[]
}) {
    const { showToast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
    const [showArchived, setShowArchived] = useState(false);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>({ key: 'renewalDate', direction: 'asc' });

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedSubscriptions = useMemo(() => {
        let filtered = subscriptions.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

        if (!showArchived) {
            filtered = filtered.filter(s => s.status !== 'archived');
        } else {
            filtered = filtered.filter(s => s.status === 'archived');
        }

        if (!sortConfig) return filtered;

        return [...filtered].sort((a: any, b: any) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (sortConfig.key === 'renewalDate') {
                return sortConfig.direction === 'asc'
                    ? new Date(aValue).getTime() - new Date(bValue).getTime()
                    : new Date(bValue).getTime() - new Date(aValue).getTime();
            }

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [subscriptions, searchTerm, sortConfig]);

    useEffect(() => {
        const query = searchParams.get("search");
        if (query) setSearchTerm(query);
    }, [searchParams]);

    // Modal states
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        category: "streaming",
        price: "",
        currency: "USD",
        billingInterval: "monthly",
        renewalDate: "",
        usageLevel: "high",
        providerEmail: "",
        status: "active" as "active" | "cancelled"
    });

    const resetForm = () => {
        setFormData({
            name: "",
            category: "streaming",
            price: "",
            currency: "USD",
            billingInterval: "monthly",
            renewalDate: "",
            usageLevel: "high",
            providerEmail: "",
            status: "active"
        });
        setEditingId(null);
        setError("");
    };

    const handleAddClick = () => {
        setModalMode("add");
        resetForm();
        setIsModalOpen(true);
    };

    const handleEditClick = (sub: any) => {
        setModalMode("edit");
        setEditingId(sub.id);
        setFormData({
            name: sub.name,
            category: sub.category,
            price: sub.price.toString(),
            currency: sub.currency,
            billingInterval: sub.billingInterval,
            renewalDate: new Date(sub.renewalDate).toISOString().split('T')[0],
            usageLevel: sub.usageLevel,
            providerEmail: sub.providerEmail,
            status: sub.status as "active" | "cancelled"
        });
        setError("");
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this subscription?")) return;

        try {
            const res = await fetch(`/api/subscriptions/${id}`, { method: "DELETE" });
            if (res.ok) {
                setSubscriptions(subscriptions.filter((s: any) => s.id !== id));
                showToast("Subscription deleted successfully");
                router.refresh();
            }
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    const toggleArchive = async (sub: any) => {
        const newStatus = sub.status === 'archived' ? 'active' : 'archived';
        try {
            const res = await fetch(`/api/subscriptions/${sub.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                const data = await res.json();
                setSubscriptions(subscriptions.map(s => s.id === sub.id ? data : s));
                showToast(`Subscription ${newStatus === 'archived' ? 'archived' : 'restored'}`);
                router.refresh();
            }
        } catch (err) {
            showToast("Failed to update status", "error");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const url = modalMode === "add" ? "/api/subscriptions" : `/api/subscriptions/${editingId}`;
        const method = modalMode === "add" ? "POST" : "PATCH";

        try {
            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                }),
            });

            if (res.ok) {
                const data = await res.json();
                if (modalMode === "add") {
                    setSubscriptions([...subscriptions, data]);
                } else {
                    setSubscriptions(subscriptions.map(s => s.id === editingId ? data : s));
                }
                setIsModalOpen(false);
                showToast(`Subscription ${modalMode === "add" ? "added" : "updated"} successfully`);
                router.refresh();
            }
            else {
                const data = await res.json();
                setError(data.error || `Failed to ${modalMode} subscription`);
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const exportToCSV = () => {
        const headers = ["Name", "Category", "Price", "Currency", "Interval", "Renewal Date", "Status", "Provider Email"];
        const rows = subscriptions.map(sub => [
            sub.name,
            sub.category,
            sub.price,
            sub.currency,
            sub.billingInterval,
            new Date(sub.renewalDate).toLocaleDateString(),
            sub.status,
            sub.providerEmail
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(e => e.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `subscriptions_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div className="flex flex-wrap justify-between items-end gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Your Subscriptions</h1>
                        <p className="text-slate-500 dark:text-slate-400">Manage all your recurring services in one place.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={exportToCSV}
                            className="flex h-12 items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-6 text-sm font-bold text-slate-700 dark:text-slate-300 gap-2 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                        >
                            <Download className="w-5 h-5" />
                            Export CSV
                        </button>
                        <button
                            onClick={handleAddClick}
                            className="flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-white gap-2 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
                        >
                            <Plus className="w-5 h-5" />
                            Add New Subscription
                        </button>
                    </div>
                </div>

                {/* Filters & Table */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Filter by name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none w-64 transition-all"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setShowArchived(false)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${!showArchived ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                >
                                    Active
                                </button>
                                <button
                                    onClick={() => setShowArchived(true)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${showArchived ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                >
                                    Archived
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-2 text-sm font-medium text-slate-500">
                            <span className="text-slate-900 dark:text-white">{subscriptions.length}</span> Services Total
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-widest">
                                    <th className="px-8 py-5 font-bold cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('name')}>
                                        <div className="flex items-center gap-1">
                                            Service
                                            {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                                        </div>
                                    </th>
                                    <th className="px-8 py-5 font-bold">Category</th>
                                    <th className="px-8 py-5 font-bold cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('price')}>
                                        <div className="flex items-center gap-1">
                                            Price
                                            {sortConfig?.key === 'price' && (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                                        </div>
                                    </th>
                                    <th className="px-8 py-5 font-bold cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('renewalDate')}>
                                        <div className="flex items-center gap-1">
                                            Renewal
                                            {sortConfig?.key === 'renewalDate' && (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                                        </div>
                                    </th>
                                    <th className="px-8 py-5 font-bold">Status</th>
                                    <th className="px-8 py-5 font-bold text-right pr-12">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {sortedSubscriptions.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-12 text-center text-slate-500">
                                            {searchTerm ? `No subscriptions matching "${searchTerm}"` : (showArchived ? 'No archived subscriptions.' : 'No active subscriptions found. Click "Add New Subscription" to get started!')}
                                        </td>
                                    </tr>
                                ) : (
                                    sortedSubscriptions.map((sub: any) => (
                                        <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center font-bold text-primary">
                                                        {sub.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 dark:text-white">{sub.name}</p>
                                                        <p className="text-xs text-slate-500 flex items-center gap-1">
                                                            {sub.billingInterval}
                                                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                            {sub.providerEmail}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg capitalize">
                                                    {sub.category}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <p className="font-bold text-slate-900 dark:text-white">${sub.price.toFixed(2)}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{sub.category}</span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                    <div className="flex items-center gap-1">
                                                        <Zap className="w-3 h-3 text-green-500 fill-green-500/20" />
                                                        <span className="text-[9px] font-black text-green-500 uppercase">Live</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                                                        {new Date(sub.renewalDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                    <span className={`text-[10px] font-bold uppercase ${Math.ceil((new Date(sub.renewalDate).getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000)) <= 7 ? 'text-red-500 animate-pulse' : 'text-amber-600'}`}>
                                                        {Math.max(0, Math.ceil((new Date(sub.renewalDate).getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000)))} Days Left
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${sub.status === 'cancelled'
                                                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                                                    : (sub.status === 'archived'
                                                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                                        : (sub.usageLevel === 'low'
                                                            ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
                                                            : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'))
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${sub.status === 'cancelled' ? 'bg-red-500' : (sub.status === 'archived' ? 'bg-slate-400' : (sub.usageLevel === 'low' ? 'bg-amber-500' : 'bg-green-500'))
                                                        }`}></span>
                                                    {sub.status === 'active' ? (sub.usageLevel === 'low' ? 'Low Usage' : 'Active') : (sub.status === 'archived' ? 'Archived' : 'Cancelled')}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right pr-12">
                                                <div className="flex justify-end items-center gap-2">
                                                    <button
                                                        onClick={() => toggleArchive(sub)}
                                                        className="p-2 text-slate-400 hover:text-primary transition-colors"
                                                        title={sub.status === 'archived' ? "Restore" : "Archive"}
                                                    >
                                                        {sub.status === 'archived' ? <RotateCcw className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditClick(sub)}
                                                        className="p-2 text-slate-400 hover:text-primary transition-colors"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(sub.id)}
                                                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal (Unified Add/Edit) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black">{modalMode === "add" ? "Add New Subscription" : "Edit Subscription"}</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Service Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Netflix, Spotify, etc."
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary outline-none transition-all"
                                    >
                                        <option value="streaming">Streaming</option>
                                        <option value="productivity">Productivity</option>
                                        <option value="music">Music</option>
                                        <option value="education">Education</option>
                                        <option value="fitness">Fitness</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Price</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="9.99"
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Renewal Date</label>
                                    <input
                                        type="date"
                                        required
                                        max="2099-12-31"
                                        value={formData.renewalDate}
                                        onChange={(e) => setFormData({ ...formData, renewalDate: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Interval</label>
                                    <select
                                        value={formData.billingInterval}
                                        onChange={(e) => setFormData({ ...formData, billingInterval: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary outline-none transition-all"
                                    >
                                        <option value="monthly">Monthly</option>
                                        <option value="yearly">Yearly</option>
                                    </select>
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Usage Level</label>
                                    <select
                                        value={formData.usageLevel}
                                        onChange={(e) => setFormData({ ...formData, usageLevel: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary outline-none transition-all"
                                    >
                                        <option value="high">High</option>
                                        <option value="medium">Medium</option>
                                        <option value="low">Low</option>
                                    </select>
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary outline-none transition-all"
                                    >
                                        <option value="active">Active</option>
                                        <option value="cancelled">Cancelled</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Support Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.providerEmail}
                                        onChange={(e) => setFormData({ ...formData, providerEmail: e.target.value })}
                                        placeholder="support@service.com"
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-3 rounded-xl text-sm font-bold bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50"
                                >
                                    {loading ? "Saving..." : "Save Subscription"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
