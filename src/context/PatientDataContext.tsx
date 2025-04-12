"use client";

import React, { createContext, useContext, useState } from "react";
import { VitalSignsType } from "@/types/vital-signs";
import { PersonalPatientDataType } from "@/types/patientData";

type PatientDataContextType = {
  personalInfo?: PersonalPatientDataType;
  reasons: string[];
  addReason: (reason: string) => void;
  removeReason: (reason: string) => void;
  vitalSigns: VitalSignsType;
  updateVitalSign: (
    key: keyof VitalSignsType,
    value: number | string
  ) => void;
};

const PatientDataContext = createContext<
  PatientDataContextType | undefined
>(undefined);

export const PatientDataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [reasons, setReasons] = useState<string[]>([]);
  const [vitalSigns, setVitalSigns] = useState<VitalSignsType>({
    heartRate: 72,
    bloodPressure: "120/80",
    temperature: 36.8,
    respiratoryRate: 16,
    oxygenSaturation: 98,
  });

  const addReason = (reason: string) => {
    if (reason && !reasons.includes(reason)) {
      setReasons([...reasons, reason]);
    }
  };

  const removeReason = (reason: string) => {
    setReasons(reasons.filter((r) => r !== reason));
  };

  const updateVitalSign = (
    key: keyof VitalSignsType,
    value: number | string
  ) => {
    setVitalSigns((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <PatientDataContext.Provider
      value={{
        reasons,
        addReason,
        removeReason,
        vitalSigns,
        updateVitalSign,
      }}
    >
      {children}
    </PatientDataContext.Provider>
  );
};

export const usePatientData = () => {
  const context = useContext(PatientDataContext);
  if (context === undefined) {
    throw new Error(
      "usePatientData must be used within a PatientDataProvider"
    );
  }
  return context;
};
