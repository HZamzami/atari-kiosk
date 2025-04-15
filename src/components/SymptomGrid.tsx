"use client";
import { symptoms } from "@/lib/symptoms";
import SymptomCard from "./SymptomCard";
import { usePatientData } from "@/context/PatientDataContext";

export default function SymptomsGrid() {
  const { reasons, toggleReason } = usePatientData();

  return (
    <div className="p-4">
      <div className="grid grid-cols-3 gap-4 justify-items-center">
        {symptoms.map((symptom) => (
          <SymptomCard
            key={symptom.key}
            symptom={symptom}
            selected={reasons.includes(symptom.key)}
            onToggle={toggleReason}
          />
        ))}
      </div>
    </div>
  );
}
