"use client";
import { useLanguage } from "@/context/LanguageContext";
import { Symptom } from "@/types/symptom";
import { X } from "lucide-react";

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
  const { t, locale } = useLanguage();
  const isRTL = locale === "ar";

  const handleClick = () => {
    onToggle(symptom.key);
  };

  return (
    <button
      onClick={handleClick}
      className={`
        relative flex flex-col items-center justify-center p-4 rounded-lg border
        ${
          selected
            ? "border-blue-600 bg-blue-50"
            : "border-gray-300 bg-white"
        }
        hover:shadow-md transition
        w-60 h-36
      `}
    >
      {selected && (
        <div
          className={`absolute top-2 ${isRTL ? "left-2" : "right-2"}`}
        >
          <div className="w-4 h-4 rounded-full border border-red-600 flex items-center justify-center bg-red-100">
            <X className="w-3 h-3 text-red-600" />
          </div>
        </div>
      )}
      {!selected && (
        <div
          className={`absolute top-2 ${isRTL ? "left-2" : "right-2"}`}
        >
          <div className="w-4 h-4 border border-gray-400 rounded-full" />
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
