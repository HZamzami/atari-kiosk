import { useLanguage } from "@/context/LanguageContext";
import React from "react";
import { VitalSignsType } from "@/app/page";
interface ThankYouProps {
  vitalSigns: VitalSignsType;
  reason: string;
}
export default function ThankYou({
  reason,
  vitalSigns,
}: ThankYouProps) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6">
      <div className="bg-[#fafbfd] rounded-lg shadow-lg p-6 w-full max-w-lg text-center">
        <h2 className="text-2xl font-bold ">CTAS 4</h2>
        <h3 className="mt-4 text-lg font-semibold">
          {t("thank_you")} Hamza!
          {/* Replace 'Name' with actual patient name */}
        </h3>
        <p className="mt-4">{t("ctas_4_instruction")}</p>

        {/* <p>Please wait for your ticket number to be called.</p> */}
        <div className="mt-8 text-2xl font-bold animate-pulse">
          {t("generating_ticket")}
        </div>
      </div>
    </div>
  );
}
