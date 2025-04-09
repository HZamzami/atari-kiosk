"use client";

import { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function LanguageDirSetter() {
  const { locale } = useLanguage();

  useEffect(() => {
    document.documentElement.setAttribute("lang", locale);
    document.documentElement.setAttribute(
      "dir",
      locale === "ar" ? "rtl" : "ltr"
    );
  }, [locale]);

  return null;
}
