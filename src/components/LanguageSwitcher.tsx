"use client";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "./ui/button";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <Button onClick={() => setLocale(locale === "en" ? "ar" : "en")}>
      {locale === "en" ? "ع" : "EN"}
    </Button>
  );
}
