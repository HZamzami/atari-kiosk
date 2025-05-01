"use client";
import Image from "next/image";

import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useEffect, useState } from "react";
import Introduction from "@/app/kiosk/steps/Introduction";
import ReasonForVisit from "@/app/kiosk/steps/ReasonForVisit";
import Pressure from "@/app/kiosk/steps/Pressure";
import ThankYou from "@/app/kiosk/steps/ThankYou";
import Stepper from "@/components/Stepper";
import Fingerprint from "@/app/kiosk/steps/Fingerprint";
import {
  ChevronLeft,
  ChevronRight,
  PersonStanding,
} from "lucide-react";
import {
  PatientDataProvider,
  usePatientData,
} from "@/context/PatientDataContext";
import { PersonalPatientDataType } from "@/types/patientData";
import Temperature from "./steps/Temperature";
import Oximeter from "./steps/Oximeter";
import { Check } from "lucide-react";
import { MedicalHistoryType } from "@/types/medicalHistory";
import PillBar from "@/components/PillBar";

export default function Page() {
  const [isVerifyingFingerprint, setIsVerifyingFingerprint] =
    useState(true);
  const [isPatientVerified, setIsPatientVerified] = useState(false);
  const [isTempretaureVerified, setIsTemperatureVerified] =
    useState(false);

  // Wrap usePatientData hook inside the PatientDataProvider
  return (
    <PatientDataProvider>
      <PatientDataContextPage
        isVerifyingFingerprint={isVerifyingFingerprint}
        isPatientVerified={isPatientVerified}
        setIsVerifyingFingerprint={setIsVerifyingFingerprint}
        setIsPatientVerified={setIsPatientVerified}
        setIsTemperatureVerified={setIsTemperatureVerified}
      />
    </PatientDataProvider>
  );
}

function PatientDataContextPage({
  isVerifyingFingerprint,
  isPatientVerified,
  setIsVerifyingFingerprint,
  setIsPatientVerified,
  setIsTemperatureVerified,
}: any) {
  const { t, locale } = useLanguage();
  const [step, setStep] = useState(0);
  const [viewBodyMap, setViewBodyMap] = useState<boolean>(false);
  const toggleViewBodyMap = () => {
    setViewBodyMap(!viewBodyMap);
  };

  const {
    personalInfo,
    setPersonalInfo,
    resetAll,
    medicalHistoryList,
    setMedicalHistoryList,
    updateVitalSign,
  } = usePatientData();

  const steps = [
    "Intro",
    "Fingerprint",
    "Temperature",
    "Pressure",
    "Oximeter",
    "Reason",
    "Thank",
  ];

  const nextStep = () =>
    setStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));

  const prevStep = () => {
    if (viewBodyMap) {
      toggleViewBodyMap();
    } else {
      setStep((prevStep) => Math.max(prevStep - 1, 0));
    }
  };

  const handleStepChange = (newStep: number) => {
    if (step === 1 && newStep !== 1) {
      // Only allow proceeding from fingerprint step if verified or if going back
      if (!isPatientVerified && newStep > step) {
        return;
      }
    }

    // Reset verification state when moving to fingerprint step
    if (newStep === 1) {
      setIsVerifyingFingerprint(true);
    }

    setStep(newStep);
  };

  const handleFingerprintComplete = (
    isVerified: boolean,
    personalInfo?: PersonalPatientDataType,
    medicalHistory?: MedicalHistoryType[]
  ) => {
    setIsVerifyingFingerprint(false);
    setIsPatientVerified(isVerified);

    if (isVerified && personalInfo) {
      setPersonalInfo(personalInfo);
      setMedicalHistoryList(medicalHistory || null);
    }
  };

  const handleTemperatureComplete = (
    isVerified: boolean,
    temperature?: number
  ) => {
    setIsTemperatureVerified(isVerified);

    if (isVerified && temperature) {
      updateVitalSign("temperature", temperature);
    }
  };

  const handlePressureComplete = (
    isVerified: boolean,
    bloodPressure?: string
  ) => {
    if (isVerified && bloodPressure) {
      updateVitalSign("bloodPressure", bloodPressure);
    }
  };

  const handleOximeterComplete = (
    isVerified: boolean,
    measurements?: {
      spo2: number;
      heartRate: number;
      respiratoryRate: number;
    }
  ) => {
    if (isVerified && measurements) {
      updateVitalSign("oxygenSaturation", measurements.spo2);
      updateVitalSign("heartRate", measurements.heartRate);
      updateVitalSign(
        "respiratoryRate",
        measurements.respiratoryRate
      );
    }
  };

  const showStepper = step !== 0;
  const showLeftArrow = step == 5 && viewBodyMap;
  const showRightArrow = step == 5;
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        // if (step === 1 && !isPatientVerified) return;
        if (step < steps.length - 1) {
          nextStep();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step, isPatientVerified]);
  return (
    <div className="flex flex-col min-h-screen w-full">
      <div
        className={`container flex flex-col mx-auto flex-grow pt-4  px-4 sm:px-6 md:px-8 ${
          showStepper && "pb-[80px]"
        }`}
      >
        <div className="w-full">
          {step !== 0 && (
            <div className="flex w-full gap-4 h-[50px] justify-between">
              <LanguageSwitcher />
              {personalInfo && <PillBar />}
              <button
                onClick={() => {
                  setStep(0);
                  resetAll();
                  setViewBodyMap(false);
                  setIsPatientVerified(false);
                  setIsVerifyingFingerprint(false);
                }}
                className="w-[80px] px-4 py-2 bg-red-50 text-red-600 hover:bg-red-200 border border-red-300 rounded-md shadow-sm transition-all duration-200 ease-in-out  font-medium"
              >
                {t("exit")}
              </button>
            </div>
          )}
        </div>
        <div className="flex-grow flex justify-between items-center relative">
          {/* <div className={showLeftArrow ? "" : "invisible"}>
            {locale === "en" ? (
              <ChevronLeft className="w-10 h-10" onClick={prevStep} />
            ) : (
              <ChevronRight
                className="w-10 h-10"
                onClick={prevStep}
              />
            )}
          </div> */}
          <div
            className={`flex flex-col items-end absolute gap-24
              ${locale === "en" ? "left-0" : "right-0"}
              ${!showLeftArrow && "invisible"}
              `}
          >
            <div
              onClick={toggleViewBodyMap}
              className={"flex items-center gap-2 cursor-pointer"}
            >
              {locale === "en" ? (
                <ChevronLeft className="w-10 h-10" />
              ) : (
                <ChevronRight className="w-10 h-10" />
              )}
              <span className=" font-medium">{t("back")}</span>
            </div>
          </div>

          <div className="flex-grow px-2">
            {step === 0 && (
              <Introduction onNext={() => handleStepChange(1)} />
            )}
            {step === 1 && (
              <Fingerprint
                onFingerprintComplete={handleFingerprintComplete}
              />
            )}
            {step === 2 && (
              <Temperature
                onTemperatureComplete={handleTemperatureComplete}
              />
            )}
            {step === 3 && (
              <Pressure onPressureComplete={handlePressureComplete} />
            )}
            {step === 4 && (
              <Oximeter onOximeterComplete={handleOximeterComplete} />
            )}
            {step === 5 && (
              <ReasonForVisit
                viewBodyMap={viewBodyMap}
                toggleViewBodyMap={toggleViewBodyMap}
              />
            )}
            {step === 6 && <ThankYou />}
          </div>
          <div
            className={`flex flex-col items-end absolute gap-24
              ${locale === "en" ? "right-0" : "left-0"}
              ${!showRightArrow && "invisible"}
              `}
          >
            <div
              onClick={() => {
                if (viewBodyMap) {
                  toggleViewBodyMap();
                }
                nextStep();
              }}
              className={"flex items-center gap-2 cursor-pointer"}
            >
              <span className=" font-medium">{t("submit")}</span>
              {locale === "en" ? (
                <ChevronRight className="w-10 h-10" />
              ) : (
                <ChevronLeft className="w-10 h-10" />
              )}
            </div>
            {!showLeftArrow && (
              <div
                className={"flex items-center gap-1 cursor-pointer"}
                onClick={toggleViewBodyMap}
              >
                <PersonStanding className="w-8 h-8" />
                {/* <Image
                  src="/front-m.webp"
                  alt="Person standing"
                  width={32}
                  height={32}
                  className="w-10 h-10"
                /> */}
                <span className=" font-medium">{t("body_map")}</span>
                {locale === "en" ? (
                  <>
                    <ChevronRight className="w-10 h-10" />
                  </>
                ) : (
                  <>
                    <ChevronLeft className="w-10 h-10" />
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-between"></div>
      </div>
      {showStepper && (
        <div className="fixed bottom-0 left-0 w-full h-[80px] bg-[#F1F3F5] mt-6">
          <div className="container mx-auto h-full flex flex-col items-stretch justify-center px-4 sm:px-6 md:px-8">
            <Stepper currentStep={step} steps={steps} />
          </div>
        </div>
      )}
    </div>
  );
}
