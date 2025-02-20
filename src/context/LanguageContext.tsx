"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import { messages } from "@/i18n";

type Language = "en" | "ar";

interface LanguageContextType {
  locale: Language;
  t: (key: string) => string;
  setLocale: (lang: Language) => void;
}

const LanguageContext = createContext<
  LanguageContextType | undefined
>(undefined);

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [locale, setLocale] = useState<Language>("en");

  const t = (key: string) => {
    // Type assertion to inform TypeScript that `key` will be valid for `messages[locale]`
    return messages[locale][key as keyof (typeof messages)[Language]];
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error(
      "useLanguage must be used within a LanguageProvider"
    );
  }
  return context;
}
