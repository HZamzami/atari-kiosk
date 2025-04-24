import { useLanguage } from "@/context/LanguageContext";
import { usePatientData } from "@/context/PatientDataContext";
import { calculateAge } from "@/utils/dateUtils";
import React from "react";
import Pill from "./Pill";
export default function PillBar() {
  const { personalInfo, vitalSigns } = usePatientData();
  if (!personalInfo) return null;

  const { t } = useLanguage();
  return (
    <div className="bg-blue-50 p-3 rounded-md border flex justify-between items-center grow h-[50px]">
      <div className="flex items-center flex-wrap gap-2">
        {/* Name pill */}
        {/* <div className="flex items-center bg-white rounded-full border border-blue-100 overflow-hidden">
          <div className="bg-white px-3 py-1 border-r border-blue-100">
            <span className="text-gray-500">{t("name")}</span>
          </div>
          <div className="px-3 py-1">
            <span className="text- font-medium">
              {personalInfo.first_name} {personalInfo.middle_name}{" "}
              {personalInfo.last_name}
            </span>
          </div>
        </div> */}
        <Pill
          labelKey={t("name")}
          labelValue={`${personalInfo.first_name} ${personalInfo.middle_name} ${personalInfo.last_name}`}
        />
        <Pill
          labelKey={t("age")}
          labelValue={calculateAge(
            personalInfo.birth_date
          ).toString()}
        />
        <Pill
          labelKey={"T"}
          labelValue={vitalSigns.temperature.toString()}
        />
        <Pill labelKey={"BP"} labelValue={vitalSigns.bloodPressure} />
        <Pill
          labelKey={"RR"}
          labelValue={vitalSigns.respiratoryRate.toString()}
        />
        <Pill
          labelKey={"SpO₂"}
          labelValue={vitalSigns.oxygenSaturation.toString()}
        />
        <Pill
          labelKey={"HR"}
          labelValue={vitalSigns.heartRate.toString()}
        />

        {/* Birth date pill */}
        {/* <div className="bg-white px-3 py-1 rounded-full border border-green-100">
          <span className="text-green-700 font-medium">
            {calculateAge(personalInfo.birth_date)}
          </span>
        </div> */}
      </div>
    </div>
  );
}
