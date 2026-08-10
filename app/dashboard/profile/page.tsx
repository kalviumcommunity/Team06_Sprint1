"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { useProfile } from "@/components/profile/ProfileProvider";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Shield,
  Clock,
  Edit3,
  Save,
  X,
} from "lucide-react";

interface ProfileData {
  id?: string;
  name: string;
  email: string;
  phone?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null;
  address?: string | null;
  role?: string;
  createdAt?: string | null;
}

export default function ProfilePage() {
  const { profile, updateProfileState } = useProfile();

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    address: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/user/profile");
        const json = await res.json();
        if (json.success && json.data) {
          setProfileData(json.data);
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      }
    }
    loadProfile();
  }, []);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleStartEdit = () => {
    const currentName = profileData?.name || profile?.name || "";
    const currentPhone = profileData?.phone || "";
    const currentGender = profileData?.gender || "";
    const currentDOB = profileData?.dateOfBirth
      ? new Date(profileData.dateOfBirth).toISOString().split("T")[0]
      : "";
    const currentAddress = profileData?.address || "";

    setEditForm({
      name: currentName,
      phone: currentPhone,
      gender: currentGender,
      dateOfBirth: currentDOB,
      address: currentAddress,
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!editForm.name.trim()) {
      showToast("Full Name is required.", "error");
      return;
    }

    if (editForm.phone && !/^[\d\s\-+()]{7,20}$/.test(editForm.phone)) {
      showToast("Please enter a valid phone number.", "error");
      return;
    }

    try {
      setIsSaving(true);
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.name.trim(),
          phone: editForm.phone.trim() || null,
          gender: editForm.gender || null,
          dateOfBirth: editForm.dateOfBirth || null,
          address: editForm.address.trim() || null,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setProfileData(json.data);
        updateProfileState({ name: json.data.name, email: json.data.email });
        setIsEditing(false);
        showToast("Profile updated successfully!", "success");
      } else {
        showToast(json.message || "Failed to update profile.", "error");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      showToast("An unexpected error occurred.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const avatarInitial =
    (profileData?.name || profile?.name || "U").trim().charAt(0).toUpperCase() || "U";

  const displayName = profileData?.name || profile?.name || "User";
  const displayEmail = profileData?.email || profile?.email || "user@example.com";
  const displayRole = profileData?.role || "USER";

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "—";
    }
  };

  return (
    <DashboardLayout title="Profile">
      <div className="w-full space-y-6">
        <PageHeader title="My Profile" showBack={true} />

        {/* Toast */}
        {toast && (
          <div
            className={`fixed bottom-6 right-6 z-50 rounded-2xl px-5 py-3 shadow-xl font-medium text-sm text-white transition-all ${
              toast.type === "success" ? "bg-[#00b386]" : "bg-red-500"
            }`}
          >
            {toast.type === "success" ? "✓" : "⚠️"} {toast.message}
          </div>
        )}

        {/* Profile Hero Card */}
        <section className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-[0_20px_60px_-20px_rgba(15,23,42,0.15)]">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-[#00b386] via-[#00b386]/90 to-[#009e76] relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0VjZIMjR2OGgtNHYtOEgxMnY4SDh2LThIMHYyMGg4di04aDR2OGg4di04aDR2OGg4di04aDRWMj2aDR2LThoNFYxNGgtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />
          </div>

          {/* Profile Info */}
          <div className="px-8 pb-8 -mt-14 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              {/* Avatar */}
              <div className="w-28 h-28 rounded-3xl bg-white dark:bg-slate-800 border-4 border-white dark:border-slate-900 shadow-xl flex items-center justify-center flex-shrink-0">
                <span className="text-4xl font-bold text-[#00b386] dark:text-[#00b386]">
                  {avatarInitial}
                </span>
              </div>

              <div className="flex-1 min-w-0 pt-2">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white truncate">
                  {displayName}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  {displayEmail}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#e6f7f3] text-[#00b386] dark:bg-[#00b386]/10 dark:text-[#00b386] border border-[#00b386]/30 dark:border-[#00b386]/20">
                    <Shield size={12} />
                    {displayRole}
                  </span>
                  {profileData?.createdAt && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      <Clock size={12} />
                      Joined {formatDate(profileData.createdAt)}
                    </span>
                  )}
                </div>
              </div>

              {/* Edit / Save / Cancel buttons */}
              <div className="flex gap-2 self-start sm:self-end">
                {!isEditing ? (
                  <button
                    onClick={handleStartEdit}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#00b386] hover:bg-[#009e76] text-white font-bold rounded-xl shadow-[0_10px_20px_-10px_rgba(0,179,134,0.4)] transition-all text-sm cursor-pointer"
                  >
                    <Edit3 size={16} />
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center gap-2 px-4 py-2.5 border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm cursor-pointer"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#00b386] hover:bg-[#009e76] text-white font-bold rounded-xl shadow-[0_10px_20px_-10px_rgba(0,179,134,0.4)] transition-all text-sm disabled:opacity-50 cursor-pointer"
                    >
                      <Save size={16} />
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Personal Information Section */}
        <section className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200/80 dark:border-slate-800 p-8 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.15)]">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <User className="text-[#00b386] dark:text-[#00b386]" size={24} />
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Enter full name"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00b386]/50 transition-all"
                />
              ) : (
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <User size={16} className="text-slate-400" />
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{displayName}</span>
                </div>
              )}
            </div>

            {/* Email — always read-only */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Email Address
                {isEditing && (
                  <span className="ml-2 text-[10px] text-slate-400 dark:text-slate-500 normal-case tracking-normal">(Read-only)</span>
                )}
              </label>
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <Mail size={16} className="text-slate-400" />
                <span className="text-sm font-medium text-slate-900 dark:text-white truncate">{displayEmail}</span>
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00b386]/50 transition-all"
                />
              ) : (
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <Phone size={16} className="text-slate-400" />
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{profileData?.phone || "—"}</span>
                </div>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Gender
              </label>
              {isEditing ? (
                <select
                  value={editForm.gender}
                  onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00b386]/50 transition-all"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              ) : (
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <User size={16} className="text-slate-400" />
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{profileData?.gender || "—"}</span>
                </div>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Date of Birth
              </label>
              {isEditing ? (
                <input
                  type="date"
                  value={editForm.dateOfBirth}
                  onChange={(e) => setEditForm({ ...editForm, dateOfBirth: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00b386]/50 transition-all"
                />
              ) : (
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <Calendar size={16} className="text-slate-400" />
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{formatDate(profileData?.dateOfBirth)}</span>
                </div>
              )}
            </div>

            {/* Address — full width */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Address
              </label>
              {isEditing ? (
                <textarea
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  placeholder="Enter your address"
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00b386]/50 transition-all resize-none"
                />
              ) : (
                <div className="flex items-start gap-3 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 min-h-[44px]">
                  <MapPin size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{profileData?.address || "—"}</span>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
