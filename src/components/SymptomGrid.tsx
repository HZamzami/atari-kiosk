"use client";
import { symptoms } from "@/lib/symptoms";
import SymptomCard from "./SymptomCard";
import { usePatientData } from "@/context/PatientDataContext";
import { useEffect } from "react";

export default function SymptomsGrid() {
  const { reasons, toggleReason } = usePatientData();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const keyNum = parseInt(event.key);
      if (!isNaN(keyNum) && keyNum > 0 && keyNum <= symptoms.length) {
        const symptom = symptoms[keyNum - 1];
        if (symptom) {
          toggleReason(symptom.key);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [toggleReason]);

  return (
    <div className="p-4">
      <div className="grid grid-cols-3 gap-4 justify-items-center">
        {symptoms.map((symptom, index) => (
          <SymptomCard
            key={symptom.key}
            symptom={symptom}
            selected={reasons.includes(symptom.key)}
            onToggle={toggleReason}
            index={index + 1}
          />
        ))}
      </div>
    </div>
  );
}
