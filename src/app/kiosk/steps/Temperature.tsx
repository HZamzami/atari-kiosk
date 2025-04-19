import { useLanguage } from "@/context/LanguageContext";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FrameMetadata } from "@/types/streamMetadata";

type TemperatureProps = {
  onTemperatureComplete: (
    isVerified: boolean,
    temperature?: number
  ) => void;
};

export default function Temperature({ onTemperatureComplete }: TemperatureProps) {
  const { t } = useLanguage();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const [metadata, setMetadata] = useState<FrameMetadata | null>(null);
  const [statusMessage, setStatusMessage] = useState("Not connected");
  const [error, setError] = useState<string | null>(null);

  const imgRef = useRef<HTMLImageElement>(null);
  const serverUrl = process.env.NEXT_PUBLIC_CV_SERVICE_URL;
  const width = 640;
  const height = 360;
  const autoStart = true;

  useEffect(() => {
    checkServerStatus();

    if (autoStart) {
      handleStartStream();
    }

    return () => {
      if (isProcessing) {
        handleShutdown();
      }
    };
  }, []);

  useEffect(() => {
    let metadataInterval: NodeJS.Timeout | null = null;

    if (isConnected && !isStopped) {
      metadataInterval = setInterval(fetchMetadata, 1000);
    }

    return () => {
      if (metadataInterval) clearInterval(metadataInterval);
    };
  }, [isConnected, isStopped]);

  const checkServerStatus = async () => {
    try {
      const response = await axios.get(`${serverUrl}/metadata`, { timeout: 3000 });
      setIsConnected(true);
      setIsStopped(false);
      setStatusMessage("Connected to server");
      setMetadata(response.data);
    } catch (err) {
      setIsConnected(false);
      setIsStopped(true);
      setStatusMessage("Server not reachable");
      setError("Could not connect to the face detection server");
    }
  };

  const fetchMetadata = async () => {
    try {
      const response = await axios.get(`${serverUrl}/metadata`);
      setMetadata(response.data);
      if (error) setError(null);
      if (response.data.measurement_complete && 
          response.data.temperature && 
          onTemperatureComplete) {
        const tempValue = parseFloat(response.data.temperature);
        onTemperatureComplete(true, tempValue);
        
        await axios.post(`${serverUrl}/acknowledge`, {
          request_id: response.data.request_id
        });
      }
    } catch (err) {
      console.error("Error fetching metadata:", err);
      setIsStopped(true);
      setStatusMessage("Server not reachable");
      setError("Connection to the face detection server lost");
      if (isProcessing && onTemperatureComplete) {
        onTemperatureComplete(false);
        setIsProcessing(false);
      }
    }
  };

  const handleStartStream = async () => {
    try {
      if (!isInitialized) {
        setStatusMessage(t("loading models"));
        const loaded = await axios.post(`${serverUrl}/control`, {
          command: "init",
          yolo_model: "yolov11n-face_ncnn_model",
          landmarks_model: "face_landmarker.task",
        });
        if (loaded.data.status === "error") {
          setStatusMessage("Forehead detection could not be initialized");
          setError(loaded.data.message);
          setIsInitialized(false);
        }
        setIsInitialized(true);
      }

      setIsStopped(false);

      const response = await axios.post(`${serverUrl}/control`, {
        command: "start",
      });
      if (response.data.status === "success") {
        setIsProcessing(true);
        setStatusMessage("Face detection running");
        setError(null);

        if (imgRef.current) {
          // Add a timestamp to prevent caching
          imgRef.current.src = `${serverUrl}/stream?t=${new Date().getTime()}`;
        }
      } else {
        setStatusMessage("Forehead detection could not be started");
        setError(response.data.message);
      }
    } catch (err) {
      setError("Failed to start the face detection");
      console.error("Error starting stream:", err);
    }
  };

  const handleStopProcessing = async () => {
    try {
      const response = await axios.post(`${serverUrl}/control`, {
        command: "stop",
      });

      if (response.data.status === "success") {
        setIsProcessing(false);
        setIsStopped(true);
        setStatusMessage("Processing stopped");
        /* if (imgRef.current) {
          imgRef.current.src = "";
        } */
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Failed to stop processing");
      console.error("Error stopping processing:", err);
    }
  };

  const handleShutdown = async () => {
    try {
      const response = await axios.post(`${serverUrl}/control`, {
        command: "shutdown",
      });

      if (response.data.status === "success") {
        setIsProcessing(false);
        setIsStopped(true);
        setIsInitialized(false);
        setStatusMessage("System shutdown");
        /* if (imgRef.current) {
          imgRef.current.src = "";
        } */
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Failed to shutdown the system");
      console.error("Error shutting down:", err);
    }
  };

  const handleUnloadModels = async () => {
    try {
      const response = await axios.post(`${serverUrl}/control`, {
        command: "unload_models",
      });

      if (response.data.status === "success") {
        setStatusMessage("Models unloaded");
        setIsInitialized(false);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Failed to unload models");
      console.error("Error unloading models:", err);
    }
  };

  const getBorderStyle = () => {
    if (!isProcessing) return { borderColor: "border-gray-600" };
    if (metadata?.measurement_complete && metadata?.temperature) return "border-blue-500";
    return metadata?.face_detected ? "border-green-500" : "border-red-500";
    //transition: "border-color 0.3s ease",
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6">
      <h1 className="text-4xl font-bold">{t("keep_head_stable")}</h1>
      <div className={`w-[${width || "640"}px] h-[${height || "360"}px] bg-gray-900 rounded-xl border-4 ${getBorderStyle()} transition-colors duration-300 overflow-hidden flex items-center justify-center`}>
        <img
          ref={imgRef}
          width={width}
          height={height}
          alt="Face detection stream"
          className="w-full h-full object-cover"
          style={{ display: isProcessing ? "block" : "none" }}
        />
        {!isConnected && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white text-xl">
            <p>{statusMessage || "Camera Preview"}</p>
            {error && <p className="text-red-400 mt-2">{error}</p>}
          </div>
        )}
      </div>
      <div className="metadata-container">
        {metadata && (
          <div>
            <h3>Stream Information</h3>
            <p>FPS: {metadata.fps}</p>
            <p>Inference Time: {metadata.inference_time} ms</p>
            <p>Postprocessing Time: {metadata.postprocessing_time} ms</p>
            <p>Forehead Detected: {metadata.face_detected ? "Yes" : "No"}</p>
            {metadata.depth && <p>Distance: {metadata.depth} cm</p>}
            {metadata.tilt && <p>Tilt Angle: {metadata.tilt}°</p>}
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={handleStartStream}
          disabled={!isConnected || isProcessing || (!isInitialized && isStopped)}
          className={`px-4 py-2 rounded-md font-medium ${!isConnected || isProcessing 
            ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
            : "bg-green-600 text-white hover:bg-green-700"}`}
        >
          Start Detection
        </button>
        
        <button
          onClick={handleStopProcessing}
          disabled={!isProcessing}
          className={`px-4 py-2 rounded-md font-medium ${!isProcessing 
            ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
            : "bg-amber-600 text-white hover:bg-amber-700"}`}
        >
          Stop Detection
        </button>
        
        <button
          onClick={handleUnloadModels}
          disabled={isProcessing || !isInitialized}
          className={`px-4 py-2 rounded-md font-medium ${isProcessing || !isInitialized 
            ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
            : "bg-blue-600 text-white hover:bg-blue-700"}`}
        >
          Unload Models
        </button>
        
        <button
          onClick={handleShutdown}
          disabled={!isConnected}
          className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700"
        >
          Shutdown
        </button>
      </div>
    </div>
  );
}
