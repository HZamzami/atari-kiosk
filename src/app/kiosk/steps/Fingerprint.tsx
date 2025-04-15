import { useLanguage } from "@/context/LanguageContext";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { PersonalPatientDataType } from "@/types/patientData";
import { MedicalHistoryType } from "@/types/medicalHistory";

type FingerprintProps = {
  onVerificationComplete: (
    isVerified: boolean,
    patientData?: PersonalPatientDataType,
    medicalHistory?: MedicalHistoryType[]
  ) => void;
};

type FingerprintStatus =
  | "initializing"
  | "waiting"
  | "scanning"
  | "verifying"
  | "verified"
  | "failed";

export default function Fingerprint({
  onVerificationComplete,
}: FingerprintProps) {
  const { t } = useLanguage();
  const [status, setStatus] = useState<FingerprintStatus>("initializing");
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const webSocket = () => {
    try {
      const socket = new WebSocket(
        process.env.NEXT_PUBLIC_FP_SERVICE_URL || "ws://localhost:8778"
      );
      wsRef.current = socket;

      setTimeout(() => {
        if (status === "initializing") {
          setStatus("failed");
          setError(t("could not connect to scanner"));
          onVerificationComplete(false);
          socket.close();
        }
      }, 10000);

      socket.onopen = () => {
        console.log("Connected to fingerprint service");
        setStatus("waiting");
        socket.send(JSON.stringify({ action: "capture" }));
      };

      socket.onmessage = async (event) => {
        if (status === "verified") {
          socket.close();
        }
        try {
          let data;
          try {
            data = JSON.parse(event.data);
            if (data === null || data === undefined) {
              console.log("Data is null or undefined after parsing");
              return;
            }
          } catch (parseError) {
            console.log("Failed to parse WebSocket message [data]:", parseError);
            return;
          }

          if (data.status === "error") {
            console.log(data.message);
            socket.send(JSON.stringify({ action: "capture" }));
          }
          if (data.status === "failed") {
            console.log(data.message);
            setStatus("failed");
            setError(
              data.message || "Verification failed"
            );
            onVerificationComplete(false);
            socket.close();
          }
          if (data.status === "scanning") {
            setStatus("scanning");
          }
          if (data.status === "captured") {
            if (data.template && data.template.length === 1024) {
              setStatus("verifying");
              const verificationResult = await verifyFingerprint(
                data.template
              );
              if (verificationResult.verified) {
                setStatus("verified");
                onVerificationComplete(
                  true,
                  verificationResult.patientData
                );
                socket.close();
              } else {
                console.log(verificationResult.message);
                setStatus("failed");
                setError(
                  verificationResult.message || "Verification failed"
                );
                onVerificationComplete(false);
                socket.close();
              }
            } else {
              console.log("Invalid template length, requesting new capture");
              setStatus("scanning");
              socket.send(JSON.stringify({ action: "capture" }));
            }
          }
        } catch (error) {
          console.error("Error processing fingerprint data:", error);
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      socket.onclose = () => {
        console.log("Disconnected from fingerprint service");
        wsRef.current = null;
      };
    } catch (error) {
      console.log("Error creating WebSocket", error);
      setStatus("failed");
      setError("Could not connect to fingerprint scanner");
      onVerificationComplete(false);
    }
  };

  useEffect(() => {
    if (status !== "verified" && status !== "failed") {
      webSocket();
    }

    return () => {
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [onVerificationComplete]);

  const verifyFingerprint = async (template: string) => {
    try {
      const response = await fetch("/api/fingerprint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ template }),
      });

      const result = await response.json();

      return {
        verified: response.ok && result.verified,
        patientData: result.patientData,
        medicalHistory: result.medicalHistory,
        message: result.message,
      };
    } catch (error) {
      console.error("Error verifying fingerprint:", error);
      return {
        verified: false,
        message: "Failed to connect to verification service",
      };
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6">
      <h1 className="text-4xl font-bold">
        {t("put_finger_scanner")}
      </h1>

      <div className="relative">
        <Image
          src={"/fingerScanner.gif"}
          alt="finger scanner"
          width={524}
          height={354}
          unoptimized
        />

        {/* Status overlay */}
        <div className="absolute top-full left-0 right-0 text-center mt-4">
          {status === "initializing" && (
            <p className="text-lg text-gray-600 animate-pulse">
              {t("put_finger_scanner")}
            </p>
          )}
          {status === "waiting" && (
            <p className="text-lg text-gray-600">
              {t("put_finger_scanner")}
            </p>
          )}
          {status === "scanning" && (
            <p className="text-lg text-blue-600 animate-pulse">
              {t("scanning_finger")}
            </p>
          )}
          {status === "verifying" && (
            <p className="text-lg text-blue-600 animate-pulse">
              {t("verifying_identity")}
            </p>
          )}
        </div>
      </div>

      {status === "verified" && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <h2 className="font-semibold text-lg text-green-600 animate-pulse">
            {t("patient_found")}
          </h2>
        </div>
      )}

      {status === "failed" && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md flex flex-row items-center gap-6">
          <h2 className="font-semibold text-lg text-red-600 animate-pulse">
            {error}
          </h2>
          <button
            onClick={() => {
                setStatus("initializing");
                webSocket();
              }
            }
            className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
          >
            {t("try_again")}
          </button>
        </div>
      )}
    </div>
  );
}
