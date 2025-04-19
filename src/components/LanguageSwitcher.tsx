"use client";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "./ui/button";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <Button
      className="w-[80px] h-[50px]"
      onClick={() => setLocale(locale === "en" ? "ar" : "en")}
    >
      {locale === "en" ? "ع" : "EN"}
    </Button>
  );
}
