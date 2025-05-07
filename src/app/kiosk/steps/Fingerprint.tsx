import { useLanguage } from "@/context/LanguageContext";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { PersonalPatientDataType } from "@/types/patientData";
import { MedicalHistoryType } from "@/types/medicalHistory";

type FingerprintProps = {
  onFingerprintComplete: (
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
  onFingerprintComplete,
}: FingerprintProps) {
  const { t } = useLanguage();
  const [status, setStatus] =
    useState<FingerprintStatus>("initializing");
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const retryCountRef = useRef(0);
  const max = 10;
  const shouldRestartRef = useRef(true); 
  const guestP = {
    national_id: "0000000000",
    first_name: "Guest",
    middle_name: "bin",
    last_name: "Al-Guest",
    email: "guest@patient.com",
    phone: "00966500000000",
    patient_id: "000000000000000",
    birth_date: new Date().toISOString().split("T")[0],
    gender: "unknown",
    address: "unknown",
  };
  // const STATIC_PATIENT_DATA: PersonalPatientDataType = {
  //   national_id: "1010101010",
  //   first_name: "Hamza",
  //   middle_name: "Mohammed",
  //   last_name: "Zamzami",
  //   email: "zamzami@patient.com",
  //   phone: "00966534140111",
  //   patient_id: "10101010101010101",
  //   birth_date: "2002-03-06",
  //   gender: "male",
  //   address: "addr",
  // };

  const restartConnection = () => {
    if (!shouldRestartRef.current) return;
    retryCountRef.current += 1;
    console.log(`Retrying connection (attempt ${retryCountRef.current}...)`);
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setStatus("initializing");
    setError(null);
    // Delay slightly before attempting reconnection
    setTimeout(() => {
      webSocket();
    }, 5000);
  };
  const webSocket = () => {
    if (wsRef.current) {
      console.log("WebSocket already exists, not creating a new one");
      return;
    }
    try {
      let wsUrl = process.env.NEXT_PUBLIC_FP_SERVICE_URL || "wss://localhost:8778";
      if (wsUrl.startsWith('ws://') && window.location.protocol === 'https:') {
        wsUrl = wsUrl.replace('ws://', 'wss://');
        console.log("Converting to secure WebSocket:", wsUrl);
      }
      const socket = new WebSocket(wsUrl);
      wsRef.current = socket;

      setTimeout(() => {
        if (status === "initializing") {
          console.log("Connection timed out during initialization");
          restartConnection();
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
          return;
        }
        try {
          let data;
          try {
            data = JSON.parse(event.data);
            if (data === null || data === undefined) {
              console.log("Data is null or undefined after parsing");
              restartConnection();
              return;
            }
          } catch (parseError) {
            console.log(
              "Failed to parse WebSocket message [data]:",
              parseError
            );
            restartConnection(); 
            return;
          }

          if (data.status === "error") {
            console.log("error", data.message);
            socket.send(JSON.stringify({ action: "capture" }));//
          }
          if (data.status === "failed") {
            shouldRestartRef.current = false;
            console.log("failed", data.message);
            setStatus("failed");
            setError(data.message || "Verification failed");
            socket.close();
            onFingerprintComplete(false);
          }
          if (data.status === "scanning") {
            setStatus("scanning");
          }
          if (data.status === "captured") {
            if (data.match) {
              console.log(data.template);
              setStatus("verifying");
              const verificationResult = await verifyFingerprint(
                data.template,
                false,
                null,
              );
              if (verificationResult.verified) {
                shouldRestartRef.current = false;
                setStatus("verified");
                socket.close();
                onFingerprintComplete(
                  true,
                  verificationResult.patientData,
                  verificationResult.medicalHistory
                );
              } else {
                console.log(verificationResult.message);
                shouldRestartRef.current = false;
                setStatus("failed");
                setError(
                  verificationResult.message || "Verification failed"
                );
                socket.close();
                onFingerprintComplete(false);
              }
            } else {
              console.log(
                "Invalid template length, or unregistred patient"
              );
              console.log(data.template);
              setStatus("verifying");
              const verificationResult = await verifyFingerprint(
                data.template,
                true,
                guestP,
              );
              if (verificationResult.verified) {
                shouldRestartRef.current = false;
                setStatus("verified");
                socket.close();
                onFingerprintComplete(
                  true,
                  verificationResult.patientData,
                  verificationResult.medicalHistory
                );
              }
              console.log(verificationResult.message);
            }
          }
        } catch (error) {
          console.error("Error processing fingerprint data:", error);
          if (shouldRestartRef.current) {
            restartConnection();
          }        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        if (shouldRestartRef.current) {
          restartConnection();
        }
      };

      socket.onclose = () => {
        console.log("Disconnected from fingerprint service");
        wsRef.current = null;
      };
    } catch (error) {
      console.log("Error creating WebSocket", error);
      setStatus("failed");
      setError("Could not connect to fingerprint scanner");
      onFingerprintComplete(false);
    }
  };

  useEffect(() => {
    if (status !== "verified" && status !== "failed" && status !== "verifying") {
      webSocket();
    }

    return () => {
      shouldRestartRef.current = false;
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, []);

  // useEffect(() => {
  //   if (
  //     status === "initializing" ||
  //     status === "waiting" ||
  //     status === "scanning"
  //   ) {
  //     const timer = setTimeout(async () => {
  //       // Force success with static data after 5 seconds
  //       setStatus("verifying");
  //       const verificationResult = await verifyFingerprint(
  //         "",
  //         true,
  //         guestP,
  //       );
  //       if (verificationResult.verified) {
  //         shouldRestartRef.current = false;
  //         setStatus("verified");
  //         onFingerprintComplete(
  //           true,
  //           verificationResult.patientData,
  //           verificationResult.medicalHistory
  //         );
  //       }
  //       if (wsRef.current) {
  //         wsRef.current.close();
  //       }
  //     }, 1000);

  //     return () => clearTimeout(timer);
  //   }
  // }, [status, onFingerprintComplete]);

  const verifyFingerprint = async (template: string, isGuest: boolean, guest: PersonalPatientDataType | null) => {
    try {
      const response = await fetch("/api/fingerprint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          template,
          isGuest,
          guest,
        }),
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
          width={640}
          height={360}
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

      {/* {status === "verified" && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <h2 className="font-semibold text-lg text-green-600 animate-pulse">
            {t("patient_found")}
          </h2>
        </div>
      )} */}

      {/* {status === "failed" && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md flex flex-row items-center gap-4">
          {true && (
            <h2 className="font-semibold text-lg text-red-600 animate-pulse">
              {t("patient_not_found")}
            </h2>
          )}

          <button
            onClick={() => {
              setStatus("initializing");
              webSocket();
            }}
            className=" px-4 py-2 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
          >
            {t("try_again")}
          </button>
        </div>
      )} */}
    </div>
  );
}
