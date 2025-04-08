// components/SymptomsGrid.tsx
"use client";
import { useState } from "react";
import { symptoms } from "@/lib/symptoms";
import SymptomCard from "./SymptomCard";

export default function SymptomsGrid() {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const toggle = (key: string) => {
    setSelectedKeys((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key]
    );
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-3 gap-4 justify-items-center">
        {symptoms.map((symptom) => (
          <SymptomCard
            key={symptom.key}
            symptom={symptom}
            selected={selectedKeys.includes(symptom.key)}
            onToggle={toggle}
          />
        ))}
      </div>
      {/* {selectedKeys.length > 0 && (
        <div className="mt-4">
          <span className="font-medium">Selected:</span>{" "}
          {selectedKeys.join(", ")}
        </div>
      )} */}
    </div>
  );
}
