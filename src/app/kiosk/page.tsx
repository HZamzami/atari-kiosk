"use client";

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
  PatientDataProvider,
  usePatientData,
} from "@/context/PatientDataContext";
import { PersonalPatientDataType } from "@/types/patientData";
import Temperature from "./steps/Temperature";
import Oximeter from "./steps/Oximeter";
import { MedicalHistoryType } from "@/types/medicalHistory";
import PillBar from "@/components/PillBar";
import NavigationButton from "@/components/icons/NavigationButton";

export default function Page() {
  const [isVerifyingFingerprint, setIsVerifyingFingerprint] =
    useState(true);
  const [isPatientVerified, setIsPatientVerified] = useState(false);
  const [isTempretaureVerified, setIsTemperatureVerified] =
    useState(false);
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
  const { t, locale, setLocale } = useLanguage();
  const [step, setStep] = useState(0);
  const [viewBodyMap, setViewBodyMap] = useState<boolean>(false);
  const toggleViewBodyMap = () => {
    setViewBodyMap(!viewBodyMap);
  };
  const isRTL = locale === "ar";

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
      // Existing keyboard handlers
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        if (step < steps.length - 1) {
          nextStep();
        }
      }

      if (step === 5) {
        if (
          (e.key === "ArrowRight" &&
            ((!isRTL && !viewBodyMap) || (isRTL && viewBodyMap))) ||
          (e.key === "ArrowLeft" &&
            ((!isRTL && viewBodyMap) || (isRTL && !viewBodyMap)))
        ) {
          e.preventDefault();
          toggleViewBodyMap();
        }

        if (e.key === "Enter") {
          e.preventDefault();
          if (viewBodyMap) {
            toggleViewBodyMap();
          }
          nextStep();
        }
      }

      // New escape key handler for exit functionality
      if (e.key === "Escape") {
        e.preventDefault();
        setStep(0);
        resetAll();
        setViewBodyMap(false);
        setIsPatientVerified(false);
        setIsVerifyingFingerprint(false);
      }

      // New handler for language switching (using '=' key)
      if (e.key === "Backspace") {
        e.preventDefault();
        setLocale(locale === "en" ? "ar" : "en");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    step,
    isPatientVerified,
    viewBodyMap,
    toggleViewBodyMap,
    nextStep,
    locale, // Added locale to dependencies
  ]);
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
          <div
            className={`flex flex-col items-end absolute gap-24
              ${locale === "en" ? "left-0" : "right-0"}
              ${!showLeftArrow && "invisible"}
              `}
          >
            <NavigationButton
              symbolFirst={true}
              text={t("back").toLocaleUpperCase()}
              symbol={isRTL ? "→" : "←"}
              onClick={toggleViewBodyMap}
              className="cursor-pointer"
            />
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
            <NavigationButton
              text={t("submit").toLocaleUpperCase()}
              symbol="↵"
              onClick={() => {
                if (viewBodyMap) {
                  toggleViewBodyMap();
                }
                nextStep();
              }}
              className="cursor-pointer"
            />

            {!showLeftArrow && (
              <NavigationButton
                text={t("other").toLocaleUpperCase()}
                symbol={isRTL ? "←" : "→"}
                onClick={toggleViewBodyMap}
                className="cursor-pointer"
              />
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
