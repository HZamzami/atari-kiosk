import { useLanguage } from "@/context/LanguageContext";
import React, { useEffect } from "react";

import SymptomsGrid from "@/components/SymptomGrid";
import { usePatientData } from "@/context/PatientDataContext";

export default function ReasonForVisit() {
  const { reasons, addReason, removeReason } = usePatientData();
  const { t, locale } = useLanguage();
  const isRTL = locale === "ar";
  useEffect(() => {
    console.log(reasons);
  }, [reasons]);
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6 overflow-hidden">
      <h1 className="text-4xl font-bold">
        {t("chief_complaint_title")}
      </h1>
      <div className="w-[80%]">
        <SymptomsGrid />
      </div>
    </div>
  );
}
