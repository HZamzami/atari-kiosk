"use client";
import { symptoms } from "@/lib/symptoms";
import SymptomCard from "./SymptomCard";
import { usePatientData } from "@/context/PatientDataContext";
interface SymptomsGridProps {
  toggleViewBodyMap: () => void;
}
export default function SymptomsGrid({
  toggleViewBodyMap,
}: SymptomsGridProps) {
  const { reasons, addReason, removeReason } = usePatientData();

  const toggle = (key: string) => {
    if (reasons.includes(key)) {
      removeReason(key);
    } else {
      addReason(key);
    }
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-3 gap-4 justify-items-center">
        {symptoms.map((symptom) => (
          <SymptomCard
          toggleViewBodyMap={toggleViewBodyMap}
            key={symptom.key}
            symptom={symptom}
            selected={reasons.includes(symptom.key)}
            onToggle={toggle}
          />
        ))}
      </div>
    </div>
  );
}
