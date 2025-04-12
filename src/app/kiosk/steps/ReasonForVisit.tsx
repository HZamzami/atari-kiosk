import { useLanguage } from "@/context/LanguageContext";
import React, { useState } from "react";

import SymptomsGrid from "@/components/SymptomGrid";
import BodyMap from "./BodyMap";
interface ReasonForVisitProps {
  viewBodyMap: boolean;
  toggleViewBodyMap: () => void;
}

export default function ReasonForVisit({
  viewBodyMap,
  toggleViewBodyMap,
}: ReasonForVisitProps) {
  const { t, locale } = useLanguage();
  const isRTL = locale === "ar";

  return (
    <>
      {viewBodyMap ? (
        <div className="z-10">
          <BodyMap toggleViewBodyMap={toggleViewBodyMap} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full space-y-6 overflow-hidden">
          <h1 className="text-4xl font-bold">
            {t("chief_complaint_title")}
          </h1>
          <div className="w-[80%]">
            <SymptomsGrid toggleViewBodyMap={toggleViewBodyMap} />
          </div>
        </div>
      )}
    </>
  );
}
