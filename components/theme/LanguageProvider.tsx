"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "english" | "hindi" | "tamil" | "telugu" | "kannada" | "malayalam" | "marathi" | "gujarati" | "punjabi" | "bengali";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const languages = [
  { value: "english", label: "English" },
  { value: "hindi", label: "हिन्दी (Hindi)" },
  { value: "tamil", label: "தமிழ் (Tamil)" },
  { value: "telugu", label: "తెలుగు (Telugu)" },
  { value: "kannada", label: "ಕನ್ನಡ (Kannada)" },
  { value: "malayalam", label: "മലയാളം (Malayalam)" },
  { value: "marathi", label: "मराठी (Marathi)" },
  { value: "gujarati", label: "ગુજરાતી (Gujarati)" },
  { value: "punjabi", label: "ਪੰਜਾਬੀ (Punjabi)" },
  { value: "bengali", label: "বাংলা (Bengali)" },
];

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("english");

  useEffect(() => {
    const savedLang = localStorage.getItem("app-language") as Language;
    if (savedLang) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("app-language", lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
