import { useLanguage } from "@/context/LanguageContext";
import React from "react";
export default function Temperature() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6">
      <h1 className="text-4xl font-bold">{t("keep_head_stable")}</h1>
      <div className="w-[524px] h-[354px] bg-gray-900 rounded-xl border-4 border-gray-600 flex items-center justify-center text-white text-xl">
        Camera Preview
      </div>
    </div>
  );
}
