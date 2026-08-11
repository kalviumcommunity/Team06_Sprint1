"use client";

import React, { createContext, useContext } from "react";

const translations = {
  subscriptions: {
    title: "Subscriptions",
    filterAll: "All Statuses",
    filterActive: "Active",
    filterPaused: "Paused",
    filterCancelled: "Cancelled",
    sortNewest: "Newest First",
    sortMedicineName: "Medicine Name",
    sortNextRefill: "Next Refill Date",
    createSubscription: "New Subscription",
    loading: "Loading your subscriptions...",
    noSubscriptionsTitle: "No Subscriptions Yet",
    noSubscriptionsDesc: "Subscribe to medicines from the Medicines page to see them here."
  }
};

const LanguageContext = createContext({
  t: translations,
  locale: "en",
  setLanguage: (lang: string) => {}
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  return (
    <LanguageContext.Provider value={{ t: translations, locale: "en", setLanguage: () => {} }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
