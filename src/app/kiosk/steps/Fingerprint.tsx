import { useLanguage } from "@/context/LanguageContext";
import React, { useState, useEffect } from "react";
import Image from "next/image";

type FingerprintProps = {
  onVerificationComplete: (isVerified: boolean, patientData?: any) => void;
};

export default function Fingerprint({ onVerificationComplete }: FingerprintProps) {
  const { t } = useLanguage();
  const [status, setStatus] = useState<"waiting" | "scanning" | "verifying" | "verified" | "failed">("waiting");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    setStatus("waiting");

    const socket = new WebSocket("ws://localhost:8778");  // Fingerprint service
    
    socket.onopen = () => {
      console.log("Connected to fingerprint service");
      socket.send(JSON.stringify({ action: "capture" }));
      setStatus("scanning");
    };
    
    socket.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.status === "error") {
          setError(data.message || "Unknown error");
          setStatus("failed");
          onVerificationComplete(false);
          return;
        }
        
        if (data.status === "captured") {
          setStatus("verifying");
          const verificationResult = await verifyFingerprint(data.template);
          
          if (verificationResult.verified) {
            setStatus("verified");
            onVerificationComplete(true, verificationResult.patientData);
          } else {
            setStatus("failed");
            setError(verificationResult.message || "Verification failed");
            onVerificationComplete(false);
          }
        }
      } catch (error) {
        console.error("Error processing fingerprint data:", error);
        setStatus("failed");
        setError("Failed to process fingerprint data");
        onVerificationComplete(false);
      }
    };
    
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setStatus("failed");
      setError("Could not connect to fingerprint sensor");
      onVerificationComplete(false);
    };
    
    socket.onclose = () => {
      console.log("Disconnected from fingerprint service");
    };
    
    return () => {
      socket.close();
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
        message: result.message
      };
    } catch (error) {
      console.error("Error verifying fingerprint:", error);
      return {
        verified: false,
        message: "Failed to connect to verification service"
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
          {status === "waiting" && (
            <p className="text-lg text-gray-600">{t("place_finger")}</p>
          )}
          {status === "scanning" && (
            <p className="text-lg text-blue-600 animate-pulse">{t("scanning_finger")}</p>
          )}
          {status === "verifying" && (
            <p className="text-lg text-blue-600 animate-pulse">{t("verifying_identity")}</p>
          )}
          {status === "verified" && (
            <p className="text-lg text-green-600">{t("verification_successful")}</p>
          )}
          {status === "failed" && (
            <p className="text-lg text-red-600">
              {error || t("verification_failed")}
            </p>
          )}
        </div>
      </div>
      
      {status === "verified" && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <h2 className="font-semibold text-lg">{t("patient_found")}</h2>
          <p>{t("continue_to_proceed")}</p>
        </div>
      )}
      
      {status === "failed" && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <h2 className="font-semibold text-lg">{t("patient_not_found")}</h2>
          <p>{t("try_again_or_continue")}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
          >
            {t("try_again")}
          </button>
        </div>
      )}
    </div>
  );
}
