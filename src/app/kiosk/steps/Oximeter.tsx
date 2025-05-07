import { useLanguage } from "@/context/LanguageContext";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

type OximeterProps = {
  onOximeterComplete: (
    isVerified: boolean,
    measurements?: {
      spo2: number,
      heartRate: number,
      respiratoryRate: number
    }
  ) => void;
};

type OximeterStatus =
  | "initializing"
  | "waiting"
  | "measuring"
  | "complete"
  | "failed";

export default function Oximeter({ onOximeterComplete }: OximeterProps) {
  const { t } = useLanguage();
  const [status, setStatus] = useState<OximeterStatus>("initializing");
  const [error, setError] = useState<string | null>(null);
  const [spo2, setSpo2] = useState<number | null>(null);
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [respiratoryRate, setRespiratoryRate] = useState<number | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // useEffect(() => {
  //   // Force success with static oximeter data after 5 seconds
  //   const staticDataTimer = setTimeout(() => {
  //     if (status === "initializing" || status === "waiting" || status === "measuring") {
  //       console.log("Setting static oximeter data");
  //       const staticSpo2 = 99.5;
  //       const staticHeartRate = 70;
  //       const staticRespiratoryRate = 12;
        
  //       setSpo2(staticSpo2);
  //       setHeartRate(staticHeartRate);
  //       setRespiratoryRate(staticRespiratoryRate);
  //       setStatus("complete");
        
  //       onOximeterComplete(true, {
  //         spo2: staticSpo2,
  //         heartRate: staticHeartRate,
  //         respiratoryRate: staticRespiratoryRate
  //       });
        
  //       if (wsRef.current) {
  //         wsRef.current.close();
  //       }
  //     }
  //   }, 10000);
    
  //   return () => clearTimeout(staticDataTimer);
  // }, [status, onOximeterComplete]);
  
  useEffect(() => {
    connectWebSocket();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  const connectWebSocket = () => {
    try {
      const socket = new WebSocket(process.env.NEXT_PUBLIC_WSS_BRIDGE_URL || "wss://localhost:8779");
      wsRef.current = socket;

      timeoutRef.current = setTimeout(() => {
        if (status === "initializing") {
          setStatus("failed");
          setError(t("could_not_connect_to_oximeter"));
          onOximeterComplete(false);
        }
      }, 10000);

      socket.onopen = () => {
        console.log("Connected to pulse oximeter WebSocket service");
        setStatus("waiting");
        clearTimeout(timeoutRef.current!);

        startOximeterMeasurement();
      };

      socket.onmessage = async (event) => {
        try {
          let data;
          try {
            data = JSON.parse(event.data);
            if (data === null || data === undefined) {
              console.log("Data is null or undefined after parsing");
              return;
            }
          } catch (parseError) {
            console.log("Failed to parse WebSocket message:", parseError);
            return;
          }

          console.log("Received message:", data);

          if (data.status === "error") {
            console.log("Error from oximeter service:", data.message);
            setStatus("failed");
            setError(data.message || "Measurement failed");
            onOximeterComplete(false);
          } else if (data.status === "data") {
            const spo2Value = parseFloat(data.data.spo2);
            const hrValue = parseInt(data.data.hr);
            const rrValue = parseInt(data.data.rr);
            setSpo2(spo2Value);
            setHeartRate(hrValue);
            setRespiratoryRate(rrValue);
            setStatus("complete");
            onOximeterComplete(true, {
              spo2: spo2Value,
              heartRate: hrValue,
              respiratoryRate: rrValue
            });
          }
        } catch (error) {
          console.error("Error processing oximeter data:", error);
          //setStatus("failed");
          //setError("Failed to process oximeter data");
          //onOximeterComplete(false);
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        //setStatus("failed");
        //setError("Connection error to pulse oximeter");
      };

      socket.onclose = () => {
        console.log("Disconnected from pulse oximeter service");
        wsRef.current = null;
        if (status === "initializing") {
          //setStatus("failed");
          //setError("Connection to pulse oximeter closed unexpectedly");
          //onOximeterComplete(false);
        }
      };
    } catch (error) {
      console.log("Error creating WebSocket:", error);
      //setStatus("failed");
      //setError("Could not connect to pulse oximeter");
      //onOximeterComplete(false);
    }
  };

  const startOximeterMeasurement = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      setStatus("measuring");
      wsRef.current.send(JSON.stringify({
        action: "start",
        measurement: "pulse_oximeter"
      }));
    } else {
      //setStatus("failed");
      //setError("Not connected to pulse oximeter");
    }
  };

  const handleRetry = () => {
    setStatus("initializing");
    setError(null);

    if (wsRef.current) {
      wsRef.current.close();
    }

    connectWebSocket();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6">
      <h1 className="text-4xl font-bold">
        {t("put_oximeter_scanner")}
      </h1>
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
          <p className="text-lg text-blue-600 animate-pulse">
            {t("connecting_to_oximeter")}
          </p>
        )}
        {status === "waiting" && (
          <p className="text-lg text-gray-600">
            {t("place_finger_in_oximeter")}
          </p>
        )}
        {status === "measuring" && (
          <p className="text-lg text-blue-600 animate-pulse">
            {t("measuring_oxygen_levels")}
          </p>
        )}
        {status === "complete" && (
          <p className="text-lg text-green-600">
            {t("measurement_complete")}
          </p>
        )}
      </div>
{/*}
      {/* Measurement results display }
      {status === "complete" && spo2 !== null && heartRate !== null && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md w-[524px]">
          <h2 className="font-semibold text-lg text-green-700 mb-4 text-center">
            {t("oximeter_results")}
          </h2>

          <div className="grid grid-cols-3 gap-4">
            {/* SpO2 }
            <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
              <div className="text-sm text-gray-500">{t("oxygen_saturation")}</div>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-blue-600">{spo2}</span>
                <span className="text-lg text-gray-600 ml-1">%</span>
              </div>
            </div>

            {/* Heart Rate }
            <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
              <div className="text-sm text-gray-500">{t("heart_rate")}</div>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-red-600">{heartRate}</span>
                <span className="text-lg text-gray-600 ml-1">BPM</span>
              </div>
            </div>

            {/* Respiratory Rate }
            <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
              <div className="text-sm text-gray-500">{t("respiratory_rate")}</div>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-green-600">{respiratoryRate}</span>
                <span className="text-lg text-gray-600 ml-1">BPM</span>
              </div>
            </div>
          </div>
        </div>
      )} */}
{/*}
      {/* Error display with retry button }
      {status === "failed" && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md flex flex-col items-center">
          <h2 className="font-semibold text-lg text-red-600 mb-2">
            {error || t("measurement_failed")}
          </h2>
          <button
            onClick={handleRetry}
            className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
          >
            {t("try_again")}
          </button>
        </div>
      )}
*/}
    </div>
  );
}
