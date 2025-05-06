import { useLanguage } from "@/context/LanguageContext";
import React, { useEffect, useState } from "react";
import { usePatientData } from "@/context/PatientDataContext";
import { TriageType } from "@/types/triage";

interface CtasResponse {
  ctasLevel: number;
  clinicalReasoning: string;
  keyFactors: string[];
  recommendedActions: string[];
}

interface ClinicAssignment {
  clinic: {
    room_number: string;
    name: string;
    department: string;
  };
  assignment: {
    id: number;
    session_id: number;
    patient_id: number;
    clinic_room: string;
    created_at: string;
  };
}

export default function ThankYou() {
  const { reasons, vitalSigns, personalInfo, medicalHistoryList, session, setClinicAssignment, clinicAssignment } =
    usePatientData();
  const { t } = useLanguage();
  const [ctasData, setCtasData] = useState<CtasResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [processingSession, setProcessingSession] = useState(false);

  useEffect(() => {
    const fetchCtasLevel = async () => {
      try {
        const response = await fetch("/api/ctas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vitalSigns,
            reasons,
            personalInfo,
            medicalHistoryList,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch CTAS level");
        }

        const data = await response.json();
        setCtasData(data);
        processPatientSession(data.ctasLevel);
      } catch (err) {
        console.error("Error fetching CTAS level:", err);
        setError(true);
        processPatientSession(4);
      } finally {
        setLoading(false);
      }
    };

    fetchCtasLevel();
  }, [vitalSigns, reasons]);

  const processPatientSession = async (ctaslvl: number) => {
    if (!session || !personalInfo || processingSession || (vitalSigns === null)) return;
    
    setProcessingSession(true);
    //action, session, session_id, patient_id, reasons, vitalSigns, triage, ctaslvl
    const triage: TriageType = {
      patient_id: personalInfo.patient_id,
      session_id,
      assigned_lvl: ctaslvl,
      algo_lvl: ctaslvl,
      ml_lvl: ctaslvl,
      justification: reasons.join(","),
    }
    
    try {
      const response = await fetch("/api/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "create_session",
          session: session,
          patient_id: personalInfo.patient_id,
          triage,
          vitalSigns,
          reasons,
          ctaslvl
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to process session");
      }
      
      const data = await response.json();
      if (data.success) {
        setClinicAssignment(data);
      }
    } catch (error) {
      console.error("Error processing session:", error);
    }
  };

  const getCtasInstructions = (level: number) => {
    return t(`ctas_${level}_instruction`) || t("ctas_4_instruction");
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
        {/* CTAS Level */}
        <div className="text-center">
          {loading ? (
            <h2 className="text-2xl font-bold text-gray-600">
              {t("evaluating_condition")}
            </h2>
          ) : error ? (
            <h2 className="text-2xl font-bold text-red-500">
              CTAS 4
            </h2>
          ) : (
            <h2 className="text-3xl font-bold text-blue-600">
              CTAS {ctasData?.ctasLevel}
            </h2>
          )}
        </div>

        {/* Patient Info Section */}
        {!loading && (
          <>
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                {t("reported_reasons")}
              </h3>
              <ul className="list-disc list-inside text-gray-700 mt-1">
                {reasons.map((reason, idx) => (
                  <li key={idx}>{t(reason)}</li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                {t("vital_signs")}
              </h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-gray-700 text-sm mt-1">
                {Object.entries(vitalSigns || {}).map(
                  ([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="font-semibold capitalize">
                        {t(key)}
                      </span>
                      <span>{value}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* CTAS Instructions */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4 text-gray-800">
              <p>{getCtasInstructions(ctasData?.ctasLevel || 4)}</p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mt-4">
                {t("thank_you")} {personalInfo?.first_name}!
              </h3>
              <div className="mt-6 text-2xl font-bold text-blue-500">
                {t("take_your_ticket")}
              </div>
            </div>
          </>
        )}

        <div className="text-center">
          {loading && !error && (
            <div className="text-2xl font-bold text-blue-500">
              {t("generating_ticket")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
