"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  role?: string;
}

interface ProfileContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  refreshProfile: () => Promise<void>;
  updateProfileState: (updated: Partial<UserProfile>) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/user/profile");
      const json = await res.json();
      if (json.success && json.data) {
        setProfile({
          id: json.data.id,
          name: json.data.name || "User",
          email: json.data.email || "user@example.com",
          role: json.data.role || "USER",
        });
      }
    } catch (error) {
      console.error("Failed to fetch user profile in ProfileProvider:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfileState = useCallback((updated: Partial<UserProfile>) => {
    setProfile((prev) => {
      if (!prev) {
        return {
          name: updated.name || "User",
          email: updated.email || "user@example.com",
          ...updated,
        };
      }
      return {
        ...prev,
        ...updated,
      };
    });
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        isLoading,
        setProfile,
        refreshProfile: fetchProfile,
        updateProfileState,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
