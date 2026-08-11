"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/theme/ThemeProvider";
import { ChangePasswordModal } from "@/components/settings/ChangePasswordModal";

export default function AdminSettingsPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  // Admin Profile States
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<string>("ADMIN");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileToast, setProfileToast] = useState<string | null>(null);

  // Notification States
  const [newUserAlerts, setNewUserAlerts] = useState(true);
  const [subscriptionAlerts, setSubscriptionAlerts] = useState(true);
  const [paymentAlerts, setPaymentAlerts] = useState(true);
  const [orderAlerts, setOrderAlerts] = useState(true);
  const [settingsToast, setSettingsToast] = useState<string | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // 1. Load Admin Profile on mount
  useEffect(() => {
    async function loadAdminProfile() {
      try {
        const res = await fetch("/api/admin/profile");
        const json = await res.json();
        if (json.success && json.data) {
          setName(json.data.name || "");
          setEmail(json.data.email || "");
          setRole(json.data.role || "ADMIN");
        }
      } catch (error) {
        console.error("Failed to load admin profile:", error);
      }
    }

    loadAdminProfile();
  }, []);

  // 2. Load Admin Settings on mount
  useEffect(() => {
    async function loadAdminSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        const json = await res.json();
        if (json.success && json.data) {
          setNewUserAlerts(json.data.newUserRegistrationAlerts ?? true);
          setSubscriptionAlerts(json.data.subscriptionAlerts ?? true);
          setPaymentAlerts(json.data.failedPaymentAlerts ?? true);
          setOrderAlerts(json.data.orderAlerts ?? true);
        }
      } catch (error) {
        console.error("Failed to load admin settings:", error);
      }
    }

    loadAdminSettings();
  }, []);

  // Helper for Auto-saving Notification Settings Toggles
  const autoSaveSettings = async (updatedFields: {
    newUserRegistrationAlerts?: boolean;
    subscriptionAlerts?: boolean;
    failedPaymentAlerts?: boolean;
    orderAlerts?: boolean;
  }) => {
    try {
      const payload = {
        newUserRegistrationAlerts: updatedFields.newUserRegistrationAlerts ?? newUserAlerts,
        subscriptionAlerts: updatedFields.subscriptionAlerts ?? subscriptionAlerts,
        failedPaymentAlerts: updatedFields.failedPaymentAlerts ?? paymentAlerts,
        orderAlerts: updatedFields.orderAlerts ?? orderAlerts,
      };

      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSettingsToast("Setting updated");
        setTimeout(() => setSettingsToast(null), 2000);
      }
    } catch (error) {
      console.error("Failed to auto-save admin setting:", error);
    }
  };

  // Toggle Handlers
  const handleToggleNewUser = () => {
    const nextVal = !newUserAlerts;
    setNewUserAlerts(nextVal);
    autoSaveSettings({ newUserRegistrationAlerts: nextVal });
  };

  const handleToggleSubscription = () => {
    const nextVal = !subscriptionAlerts;
    setSubscriptionAlerts(nextVal);
    autoSaveSettings({ subscriptionAlerts: nextVal });
  };

  const handleTogglePayment = () => {
    const nextVal = !paymentAlerts;
    setPaymentAlerts(nextVal);
    autoSaveSettings({ failedPaymentAlerts: nextVal });
  };

  const handleToggleOrder = () => {
    const nextVal = !orderAlerts;
    setOrderAlerts(nextVal);
    autoSaveSettings({ orderAlerts: nextVal });
  };

  // Profile Form Submission Handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingProfile(true);
      setProfileToast(null);

      const res = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setName(json.data.name);
        setEmail(json.data.email);
        setProfileToast("Admin profile updated successfully!");
        setTimeout(() => setProfileToast(null), 3000);
      } else {
        setProfileToast("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error saving admin profile:", error);
      setProfileToast("Error saving profile.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleLogout = () => {
    router.push("/login");
  };

  const avatarInitial = name.trim().charAt(0).toUpperCase() || "A";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 w-full flex-1 transition-colors">
      <div className="w-full px-4 md:px-8 py-6">
        <div className="space-y-6">
          <PageHeader title="Settings" />

          {settingsToast && (
            <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-blue-600 text-white px-5 py-3 shadow-xl font-medium text-sm transition-all">
              ✓ {settingsToast}
            </div>
          )}

          <div className="w-full space-y-6">
            {/* Admin Profile Section */}
            <section className="bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-200/80 dark:border-slate-800 p-8 shadow-[0_10px_40px_-20px_rgba(15,23,42,0.35)]">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Admin Profile
              </h2>

              {profileToast && (
                <div className="mb-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-emerald-600 dark:text-emerald-400 font-semibold text-sm transition-all shadow-sm">
                  ✓ {profileToast}
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 text-3xl font-bold border-4 border-white dark:border-slate-800 shadow-md">
                      {avatarInitial}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 w-full">
                    <div>
                      <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1.5">Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Admin Name"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1.5">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@example.com"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1.5">Role</label>
                      <input
                        type="text"
                        value={role}
                        disabled
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed font-semibold"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-[0_10px_20px_-10px_rgba(37,99,235,0.5)] transition-all disabled:opacity-50"
                  >
                    {isSavingProfile ? "Saving..." : "Save Profile Changes"}
                  </button>
                </div>
              </form>
            </section>

            {/* System Preferences Section */}
            <section className="bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-200/80 dark:border-slate-800 p-8 shadow-[0_10px_40px_-20px_rgba(15,23,42,0.35)]">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                System Preferences
              </h2>
              <div className="max-w-xl">
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Dark Mode</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Toggle dark theme appearance</p>
                  </div>
                  <button 
                    type="button"
                    onClick={toggleTheme}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isDark ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDark ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </section>

            {/* Notification Preferences Section */}
            <section className="bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-200/80 dark:border-slate-800 p-8 shadow-[0_10px_40px_-20px_rgba(15,23,42,0.35)]">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                Notification Preferences
              </h2>
              <div className="space-y-4">
                {[
                  { title: "New User Registration Alerts", desc: "Get notified when a new user registers.", state: newUserAlerts, handler: handleToggleNewUser },
                  { title: "Subscription Alerts", desc: "Receive alerts for new or modified subscriptions.", state: subscriptionAlerts, handler: handleToggleSubscription },
                  { title: "Failed Payment Alerts", desc: "Get immediate alerts for payment failures.", state: paymentAlerts, handler: handleTogglePayment },
                  { title: "Order Alerts", desc: "Receive status updates on incoming orders.", state: orderAlerts, handler: handleToggleOrder },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                    </div>
                    <button 
                      type="button"
                      onClick={item.handler}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${item.state ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${item.state ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Security Section */}
            <section className="bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-200/80 dark:border-slate-800 p-8 shadow-[0_10px_40px_-20px_rgba(15,23,42,0.35)]">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Security
              </h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <button type="button" onClick={() => setIsPasswordModalOpen(true)} className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/></svg>
                  Change Password
                </button>
                <button 
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-semibold rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg>
                  Logout
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        apiEndpoint="/api/admin/change-password"
        accentColor="blue"
      />
    </div>
  );
}
