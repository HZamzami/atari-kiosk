"use client";

import React, { createContext, useContext, useState } from "react";
import { VitalSignsType } from "@/types/vital-signs";
import { PersonalPatientDataType } from "@/types/patientData";
import { MedicalHistoryType } from "@/types/medicalHistory";
import { SessionType } from "@/types/session";

type PatientDataContextType = {
  personalInfo: PersonalPatientDataType | null;
  setPersonalInfo: (info: PersonalPatientDataType | null) => void;
  medicalHistoryList: MedicalHistoryType[] | null;
  setMedicalHistoryList: (info: MedicalHistoryType[] | null) => void;
  reasons: string[];
  addReason: (reason: string) => void;
  removeReason: (reason: string) => void;
  toggleReason: (reason: string) => void;
  vitalSigns: VitalSignsType | null;
  updateVitalSign: (
    key: keyof VitalSignsType,
    value: number | string
  ) => void;
  resetAll: () => void;
  // Add session management
  session: SessionType | null;
  setSession: (session: SessionType | null) => void;
  clinicAssignment: any | null;
  setClinicAssignment: (assignment: any | null) => void;
};

const PatientDataContext = createContext<
  PatientDataContextType | undefined
>(undefined);

export const PatientDataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [reasons, setReasons] = useState<string[]>([]);
  const [personalInfo, setPersonalInfo] =
    useState<PersonalPatientDataType | null>(null);
  const [medicalHistoryList, setMedicalHistoryList] = useState<
    MedicalHistoryType[] | null
  >(null);
  const [session, setSession] = useState<SessionType | null>(null);
  const [clinicAssignment, setClinicAssignment] = useState<any | null>(null);
  const [vitalSigns, setVitalSigns] = useState<VitalSignsType | null>(null);
  // {
  //   heartRate: 72,
  //   bloodPressure: "120/80",
  //   temperature: 36.8,
  //   respiratoryRate: 16,
  //   oxygenSaturation: 98,
  // });

  const addReason = (reason: string) => {
    if (reason && !reasons.includes(reason)) {
      setReasons([...reasons, reason]);
    }
  };

  const removeReason = (reason: string) => {
    setReasons(reasons.filter((r) => r !== reason));
  };
  const toggleReason = (reason: string) => {
    if (reasons.includes(reason)) {
      removeReason(reason);
    } else {
      addReason(reason);
    }
  };

  const updateVitalSign = (
    key: keyof VitalSignsType,
    value: number | string
  ) => {
    setVitalSigns((prev) => ({ ...prev, [key]: value }));
  };
  const resetAll = () => {
    setPersonalInfo(null);
    setMedicalHistoryList(null);
    setReasons([]);
    setVitalSigns(null);
    setSession(null);
    setClinicAssignment(null);
  };
  
  return (
    <PatientDataContext.Provider
      value={{
        personalInfo,
        setPersonalInfo,
        medicalHistoryList,
        setMedicalHistoryList,
        reasons,
        addReason,
        removeReason,
        toggleReason,
        vitalSigns,
        updateVitalSign,
        resetAll,
        session,
        setSession,
        clinicAssignment,
        setClinicAssignment,
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
