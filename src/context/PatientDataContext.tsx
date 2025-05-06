"use client";

import React, { createContext, useContext, useState } from "react";
import { VitalSignsType } from "@/types/vital-signs";
import { PersonalPatientDataType } from "@/types/patientData";
import { MedicalHistoryType } from "@/types/medicalHistory";
import { SessionType } from "@/types/session";
import { AssignedType } from "@/types/assigned";
import { ClinicType } from "@/types/clinic";

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
  clinic: ClinicType | null;
  setClinic: (clinic: ClinicType | null) => void;
  assigned: AssignedType | null;
  setAssigned: (assigned: AssignedType | null) => void;
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
  const [clinic, setClinic] = useState<any | null>(null);
  const [assigned, setAssigned] = useState<any | null>(null);
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
    setClinic(null);
    setAssigned(null);
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
        clinic,
        setClinic,
        assigned,
        setAssigned
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
