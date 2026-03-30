"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
    User,
    Bell,
    Shield,
    CreditCard,
    ChevronRight,
    Camera,
    Mail,
    Save,
    CheckCircle2,
    XCircle,
    Eye,
    EyeOff,
    Lock
} from "lucide-react";
import { useToast } from "@/context/ToastContext";

type ActiveTab = "profile" | "notifications" | "security";

export default function SettingsClient() {
    const { data: session, update } = useSession();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState<ActiveTab>("profile");
    const [preferences, setPreferences] = useState({
        emailNotifications: true,
        appNotifications: true,
    });
    const [updatingPreferences, setUpdatingPreferences] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await fetch("/api/user");
                if (res.ok) {
                    const data = await res.json();
                    setProfileData({
                        name: data.name || "",
                        email: data.email || "",
                        image: data.image || ""
                    });
                    setPreferences({
                        emailNotifications: data.emailNotifications ?? true,
                        appNotifications: data.appNotifications ?? true,
                    });
                }
            } catch (err) {
                console.error("Failed to fetch user data:", err);
            }
        };
        fetchUserData();
    }, []);

    const handleUpdatePreferences = async () => {
        setLoading(true);
        setSuccess("");
        setError("");
        try {
            const res = await fetch("/api/user", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mode: "preferences",
                    ...preferences
                }),
            });
            if (res.ok) {
                setSuccess("Preferences updated successfully!");
                showToast("Preferences saved!");
            } else {
                setError("Failed to update preferences");
                showToast("Failed to save preferences", "error");
            }
        } catch (err) {
            setError("Something went wrong");
            showToast("An error occurred", "error");
        } finally {
            setLoading(false);
        }
    };

    // Profile Form
    const [profileData, setProfileData] = useState({
        name: session?.user?.name || "",
        email: session?.user?.email || "",
        image: "",
    });

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Create a URL for the selected file
        const objectUrl = URL.createObjectURL(file);
        const img = new Image();

        img.onload = () => {
            // Define max dimensions (e.g. 256x256 for an avatar)
            const MAX_WIDTH = 256;
            const MAX_HEIGHT = 256;
            let width = img.width;
            let height = img.height;

            // Calculate scaling ratio
            if (width > height) {
                if (width > MAX_WIDTH) {
                    height = Math.round((height *= MAX_WIDTH / width));
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width = Math.round((width *= MAX_HEIGHT / height));
                    height = MAX_HEIGHT;
                }
            }

            // Draw to canvas
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(img, 0, 0, width, height);
                // Compress to WebP or JPEG heavily (0.8 quality drops size drastically)
                const compressedBase64 = canvas.toDataURL("image/jpeg", 0.8);
                setProfileData({ ...profileData, image: compressedBase64 });
            }
            URL.revokeObjectURL(objectUrl);
        };
        img.src = objectUrl;
    };

    // Password Form
    const [showPasswords, setShowPasswords] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess("");
        setError("");

        try {
            const res = await fetch("/api/user", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mode: "profile",
                    name: profileData.name,
                    image: profileData.image
                }),
            });

            if (res.ok) {
                setSuccess("Profile updated successfully!");
                showToast("Profile updated!");
                update({ name: profileData.name });
                // Force a reload to sync the avatar globally in DashboardLayout
                setTimeout(() => window.location.reload(), 1000);
            } else {
                const data = await res.json();
                setError(data.error || "Failed to update profile");
                showToast("Update failed", "error");
            }
        } catch (err) {
            setError("Something went wrong");
            showToast("An error occurred", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        setSuccess("");
        setError("");

        try {
            const res = await fetch("/api/user", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mode: "password",
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                }),
            });

            if (res.ok) {
                setSuccess("Password updated successfully!");
                showToast("Password changed successfully");
                setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            } else {
                const data = await res.json();
                setError(data.error || "Failed to update password");
                showToast("Password update failed", "error");
            }
        } catch (err) {
            setError("Something went wrong");
            showToast("An error occurred", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Settings</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage your profile and application preferences.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Navigation */}
                    <div className="md:col-span-1 space-y-2">
                        <button
                            onClick={() => { setActiveTab("profile"); setSuccess(""); setError(""); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'profile' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        >
                            <User className="w-4 h-4" />
                            Profile
                        </button>
                        <button
                            onClick={() => { setActiveTab("notifications"); setSuccess(""); setError(""); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'notifications' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        >
                            <Bell className="w-4 h-4" />
                            Notifications
                        </button>
                        <button
                            onClick={() => { setActiveTab("security"); setSuccess(""); setError(""); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'security' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        >
                            <Shield className="w-4 h-4" />
                            Security
                        </button>
                    </div>

                    {/* Content */}
                    <div className="md:col-span-3 space-y-6">
                        {success && (
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm font-bold rounded-xl flex items-center gap-2 border border-green-100 dark:border-green-800 animate-in fade-in slide-in-from-top-2">
                                <CheckCircle2 className="w-4 h-4" />
                                {success}
                            </div>
                        )}
                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-bold rounded-xl flex items-center gap-2 border border-red-100 dark:border-red-800 animate-in fade-in slide-in-from-top-2">
                                <XCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        {activeTab === "profile" && (
                            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="p-8 border-b border-slate-100 dark:border-slate-800">
                                    <h3 className="text-xl font-bold">Public Profile</h3>
                                    <p className="text-sm text-slate-500">How you appear on the platform.</p>
                                </div>
                                <div className="p-8">
                                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                                        <div className="flex items-center gap-6 mb-8">
                                            <div className="relative group rounded-full overflow-hidden w-24 h-24 bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-inner shrink-0 border border-slate-200 dark:border-slate-700">
                                                {profileData.image ? (
                                                    <img src={profileData.image} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="w-10 h-10 text-slate-400" />
                                                )}
                                                <label className="absolute inset-0 bg-black/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm">
                                                    <Camera className="w-6 h-6 mb-1" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">Change</span>
                                                    <input type="file" accept="image/jpeg, image/png, image/webp" className="hidden" onChange={handleImageUpload} />
                                                </label>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Profile Picture</h4>
                                                <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">JPG, PNG or WEBP. Max 2MB. Stored securely on our servers using Base64 encoding.</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Full Name</label>
                                                <input
                                                    type="text"
                                                    value={profileData.name}
                                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary outline-none transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Email Address</label>
                                                <div className="relative">
                                                    <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                                    <input
                                                        type="email"
                                                        disabled
                                                        value={profileData.email}
                                                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none opacity-60 cursor-not-allowed"
                                                    />
                                                </div>
                                                <p className="text-[10px] text-slate-400 mt-2 font-medium italic">Email cannot be changed contact support for help.</p>
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                                            >
                                                {loading ? "Saving..." : "Save Changes"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {activeTab === "notifications" && (
                            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div>
                                    <h3 className="text-xl font-bold">Preferences</h3>
                                    <p className="text-sm text-slate-500">Manage how you get notified.</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                                        <div>
                                            <p className="font-bold text-sm">Email Reminders</p>
                                            <p className="text-xs text-slate-500">Get notified about upcoming renewals via email.</p>
                                        </div>
                                        <button
                                            onClick={() => setPreferences({ ...preferences, emailNotifications: !preferences.emailNotifications })}
                                            className={`w-12 h-6 rounded-full relative transition-colors ${preferences.emailNotifications ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${preferences.emailNotifications ? 'right-1' : 'left-1'}`}></div>
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                                        <div>
                                            <p className="font-bold text-sm">In-app Notifications</p>
                                            <p className="text-xs text-slate-500">Real-time alerts in your dashboard.</p>
                                        </div>
                                        <button
                                            onClick={() => setPreferences({ ...preferences, appNotifications: !preferences.appNotifications })}
                                            className={`w-12 h-6 rounded-full relative transition-colors ${preferences.appNotifications ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${preferences.appNotifications ? 'right-1' : 'left-1'}`}></div>
                                        </button>
                                    </div>
                                </div>
                                <button
                                    onClick={handleUpdatePreferences}
                                    disabled={loading}
                                    className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                                >
                                    {loading ? "Saving..." : "Save Preferences"}
                                </button>
                            </div>
                        )}

                        {activeTab === "security" && (
                            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold">Security</h3>
                                        <p className="text-sm text-slate-500">Update your account password.</p>
                                    </div>
                                    <button
                                        onClick={() => setShowPasswords(!showPasswords)}
                                        className="p-2 text-slate-400 hover:text-primary transition-colors"
                                    >
                                        {showPasswords ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                <div className="p-8">
                                    <form onSubmit={handleUpdatePassword} className="space-y-6">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Current Password</label>
                                                <input
                                                    type={showPasswords ? "text" : "password"}
                                                    required
                                                    value={passwordData.currentPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary outline-none transition-all"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">New Password</label>
                                                    <input
                                                        type={showPasswords ? "text" : "password"}
                                                        required
                                                        value={passwordData.newPassword}
                                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary outline-none transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Confirm New Password</label>
                                                    <input
                                                        type={showPasswords ? "text" : "password"}
                                                        required
                                                        value={passwordData.confirmPassword}
                                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary outline-none transition-all"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="px-8 py-3 bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                                            >
                                                {loading ? "Updating..." : "Update Password"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
