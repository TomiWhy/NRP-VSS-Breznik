"use client";

import { Sidebar } from "./Sidebar";
import {
    Search,
    Bell,
    ChevronDown,
    Moon,
    Sun,
    CheckCircle2,
    Info,
    AlertCircle,
    Clock,
    Menu,
    X,
    User as UserIcon
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogOut, Settings, Gift } from "lucide-react";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { data: session } = useSession();
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [darkMode, setDarkMode] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [userImage, setUserImage] = useState<string | null>(null);

    useEffect(() => {
        const isDark = localStorage.getItem('theme') === 'dark' ||
            (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        setDarkMode(isDark);
        if (isDark) document.documentElement.classList.add('dark');
    }, []);

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        if (newDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await fetch("/api/notifications");
                if (res.ok) {
                    const data = await res.json();
                    setNotifications(data);
                    setUnreadCount(data.filter((n: any) => !n.read).length);
                }
            } catch (err) {
                console.error("Failed to fetch notifications:", err);
            }
        };

        const fetchUserProfile = async () => {
            try {
                const res = await fetch("/api/user");
                if (res.ok) {
                    const data = await res.json();
                    setUserImage(data.image || null);
                }
            } catch (err) {}
        };

        if (session) {
            fetchNotifications();
            fetchUserProfile();
            const interval = setInterval(fetchNotifications, 60000);
            return () => clearInterval(interval);
        }
    }, [session]);

    const markAsRead = async (id: string) => {
        try {
            await fetch("/api/notifications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error("Failed to mark notification as read:", err);
        }
    };
    const markAllAsRead = async () => {
        try {
            await fetch("/api/notifications/clear", { method: "POST" });
            setNotifications(notifications.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error("Failed to clear notifications:", err);
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Sidebar Desktop */}
            <div className={`fixed inset-0 z-50 md:relative md:flex ${mobileMenuOpen ? 'flex' : 'hidden'}`}>
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm md:hidden" onClick={() => setMobileMenuOpen(false)}></div>
                <Sidebar />
            </div>

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Navbar */}
                <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>

                        <div className="relative group hidden lg:block">
                            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Global search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && router.push(`/subscriptions?search=${encodeURIComponent(searchQuery)}`)}
                                className="pl-12 pr-6 py-3 bg-slate-100 dark:bg-slate-800 border-transparent focus:bg-white dark:focus:bg-slate-950 border-2 focus:border-primary/20 rounded-[20px] text-sm font-bold outline-none w-80 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleDarkMode}
                            className="p-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all"
                        >
                            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="p-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all relative"
                            >
                                <Bell className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-800 animate-pulse"></span>
                                )}
                            </button>

                            {showNotifications && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                                    <div className="absolute right-0 mt-4 w-96 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Notifications</h3>
                                            <span className="text-[10px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full uppercase">
                                                {unreadCount} New
                                            </span>
                                        </div>
                                        <div className="max-h-[400px] overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="p-12 text-center">
                                                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                                                        <Bell className="w-8 h-8" />
                                                    </div>
                                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Inbox Empty</p>
                                                    <p className="text-[10px] text-slate-300 mt-1 uppercase font-bold tracking-tighter">Everything is up to date.</p>
                                                </div>
                                            ) : (
                                                notifications.map((n) => (
                                                    <div
                                                        key={n.id}
                                                        onClick={() => markAsRead(n.id)}
                                                        className={`p-5 border-b border-slate-50 dark:border-slate-800 transition-all cursor-pointer group flex gap-4 ${!n.read ? 'bg-primary/5 dark:bg-primary/5' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                                                    >
                                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${n.type === 'renewal' ? 'bg-amber-100 text-amber-600' :
                                                            n.type === 'refund' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                                                            }`}>
                                                            {n.type === 'renewal' ? <Clock className="w-6 h-6" /> :
                                                                n.type === 'refund' ? <CheckCircle2 className="w-6 h-6" /> : <Info className="w-6 h-6" />}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className={`text-xs leading-relaxed ${!n.read ? 'font-black text-slate-900 dark:text-white' : 'font-medium text-slate-500'}`}>
                                                                {n.message}
                                                            </p>
                                                            <p className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-widest flex items-center gap-2">
                                                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                                {new Date(n.createdAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        {!n.read && (
                                                            <div className="w-2.5 h-2.5 bg-primary rounded-full mt-2 shadow-sm shadow-primary/40"></div>
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                        <button
                                            onClick={markAllAsRead}
                                            className="w-full py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20"
                                        >
                                            Mark All as Read
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="relative">
                            <div 
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="h-10 w-10 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xs shadow-lg shadow-primary/20 cursor-pointer hover:scale-110 active:scale-95 transition-all overflow-hidden border border-white/10"
                            >
                                {userImage ? (
                                    <img src={userImage} alt="User Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    session?.user?.name?.substring(0, 1) || <UserIcon className="w-5 h-5" />
                                )}
                            </div>

                            {showProfileMenu && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)}></div>
                                    <div className="absolute right-0 mt-4 w-64 bg-white dark:bg-slate-900 rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
                                        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                                            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Signed in as</p>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{session?.user?.email}</p>
                                        </div>
                                        <div className="p-2 flex flex-col gap-1">
                                            <button 
                                                onClick={() => { setShowProfileMenu(false); router.push('/settings'); }}
                                                className="w-full text-left px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-3"
                                            >
                                                <Settings className="w-4 h-4 text-slate-400" />
                                                Profile Settings
                                            </button>
                                            <button 
                                                onClick={() => { setShowProfileMenu(false); router.push('/referrals'); }}
                                                className="w-full text-left px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-3"
                                            >
                                                <Gift className="w-4 h-4 text-primary" />
                                                Refer & Earn
                                            </button>
                                        </div>
                                        <div className="p-2 border-t border-slate-100 dark:border-slate-800">
                                            <button 
                                                onClick={() => signOut({ callbackUrl: '/' })}
                                                className="w-full text-left px-4 py-3 text-sm font-bold text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors flex items-center gap-3"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto px-8 py-10 max-w-7xl mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
