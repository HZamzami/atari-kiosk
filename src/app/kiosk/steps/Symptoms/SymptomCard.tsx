"use client";
import { useLanguage } from "@/context/LanguageContext";
import { Symptom } from "@/types/symptom";
import { ArrowLeft, ArrowRight, MoreHorizontal } from "lucide-react";

type SymptomCardProps = {
  symptom: Symptom;
  selected: boolean;
  onToggle: (key: string) => void;
};

export default function SymptomCard({
  symptom,
  selected,
  onToggle,
}: SymptomCardProps) {
  const Icon = symptom.icon;
  const isBodyMap = symptom.key === "body_map";
  const { t, locale } = useLanguage();
  const isRTL = locale === "ar";
  return (
    <button
      onClick={() => onToggle(symptom.key)}
      className={`
        relative flex flex-col items-center justify-center p-4 rounded-lg border
        ${isBodyMap ? "border-dashed" : "border-solid"}
        ${
          selected
            ? "border-blue-600 bg-blue-50"
            : "border-gray-300 bg-white"
        }
        hover:shadow-md transition
        w-80 h-40
      `}
    >
      {isBodyMap && (
        <div
          className={`absolute bottom-2 flex items-center text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded-full ${
            isRTL ? "left-2" : "right-2"
          }`}
        >
          <span>{t("more")}</span>
          {isRTL ? (
            <ArrowLeft className="w-4 h-4 ms-1" />
          ) : (
            <ArrowRight className="w-4 h-4 ms-1" />
          )}
        </div>
      )}

      <Icon
        className={`w-8 h-8 ${
          selected ? "text-blue-600" : "text-gray-600"
        }`}
      />
      <span className="mt-2 text-lg font-medium text-center">
        {t(symptom.key)}
      </span>
    </button>
  );
}
