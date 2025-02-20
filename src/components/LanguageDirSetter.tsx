"use client";

import { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function LanguageDirSetter() {
  const { locale } = useLanguage();

  useEffect(() => {
    // Set the document's language and direction
    document.documentElement.setAttribute("lang", locale);
    document.documentElement.setAttribute(
      "dir",
      locale === "ar" ? "rtl" : "ltr"
    );
  }, [locale]);

  return null; // This component doesn't render anything visible
}
