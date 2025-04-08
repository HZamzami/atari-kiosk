import { useLanguage } from "@/context/LanguageContext";
import React, { useEffect, useState } from "react";
import { VitalSignsType } from "@/types/vital-signs";
import { usePatientData } from "@/context/PatientDataContext";

interface CtasResponse {
  ctasLevel: number;
  clinicalReasoning: string;
  keyFactors: string[];
  recommendedActions: string[];
}

export default function ThankYou() {
  const { reasons, vitalSigns } = usePatientData();
  const { t } = useLanguage();
  const [ctasData, setCtasData] = useState<CtasResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Function to fetch CTAS level
    const fetchCtasLevel = async () => {
      try {
        const response = await fetch("/api/ctas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ vitalSigns, reasons }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch CTAS level");
        }

        const data = await response.json();
        setCtasData(data);
      } catch (err) {
        console.error("Error fetching CTAS level:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCtasLevel();
  }, [vitalSigns, reasons]);

  const getCtasInstructions = (level: number) => {
    return t(`ctas_${level}_instruction`) || t("ctas_4_instruction");
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6">
      <div className="bg-[#fafbfd] rounded-lg shadow-lg p-6 w-full max-w-lg text-center">
        {loading ? (
          <h2 className="text-2xl font-bold">
            Evaluating triage level... (TODO)
          </h2>
        ) : error ? (
          <h2 className="text-2xl font-bold">CTAS 4</h2>
        ) : (
          <>
            <h2 className="text-2xl font-bold">
              CTAS {ctasData?.ctasLevel}
            </h2>
            {ctasData?.keyFactors &&
              ctasData.keyFactors.length > 0 && (
                <div className="mt-4 text-sm text-gray-600">
                  <p className="font-medium">Key factors:</p>
                  <ul className="list-disc list-inside">
                    {ctasData.keyFactors
                      .slice(0, 2)
                      .map((factor, idx) => (
                        <li key={idx} className="text-left">
                          {factor}
                        </li>
                      ))}
                  </ul>
                </div>
              )}
          </>
        )}

        <h3 className="mt-4 text-lg font-semibold">
          {t("thank_you")} Hamza!
        </h3>

        <p className="mt-4">
          {loading
            ? t("evaluating_condition")
            : getCtasInstructions(ctasData?.ctasLevel || 4)}
        </p>

        <div className="mt-8 text-2xl font-bold animate-pulse">
          {t("generating_ticket")}
        </div>
      </div>
    </div>
  );
}
