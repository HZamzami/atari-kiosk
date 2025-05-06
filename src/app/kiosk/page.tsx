"use client";

import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useEffect, useRef, useState } from "react";
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
  const [isFingerprintVerified, setIsFingerprintVerified] =
    useState(false);
  const [isPatientVerified, setIsPatientVerified] = useState(false);
  const [isTemperatureVerified, setIsTemperatureVerified] =
    useState(false);
  const [isBloodPressureVerified, setIsBloodPressureVerified] =
    useState(false);
  const [isPulseOximeterVerified, setIsPulseOximeterVerified] =
    useState(false);
  return (
    <PatientDataProvider>
      <PatientDataContextPage
        isFingerprintVerified={isFingerprintVerified}
        isPatientVerified={isPatientVerified}
        isTemperatureVerified={isTemperatureVerified}
        isBloodPressureVerified={isBloodPressureVerified}
        isPulseOximeterVerified={isPulseOximeterVerified}
        setIsFingerprintVerified={setIsFingerprintVerified}
        setIsPatientVerified={setIsPatientVerified}
        setIsTemperatureVerified={setIsTemperatureVerified}
        setIsBloodPressureVerified={setIsBloodPressureVerified}
        setIsPulseOximeterVerified={setIsPulseOximeterVerified}
      />
    </PatientDataProvider>
  );
}

interface PatientDataContextPageProps {
  isFingerprintVerified: boolean;
  isPatientVerified: boolean;
  isTemperatureVerified: boolean;
  isBloodPressureVerified: boolean;
  isPulseOximeterVerified: boolean;
  setIsFingerprintVerified: (verified: boolean) => void;
  setIsPatientVerified: (verified: boolean) => void;
  setIsTemperatureVerified: (verified: boolean) => void;
  setIsBloodPressureVerified: (verified: boolean) => void;
  setIsPulseOximeterVerified: (verified: boolean) => void;
}

function PatientDataContextPage({
  isFingerprintVerified,
  isPatientVerified,
  isTemperatureVerified,
  isBloodPressureVerified,
  isPulseOximeterVerified,
  setIsFingerprintVerified,
  setIsPatientVerified,
  setIsTemperatureVerified,
  setIsBloodPressureVerified,
  setIsPulseOximeterVerified,
}: PatientDataContextPageProps) {
  const { t, locale, setLocale } = useLanguage();
  const [step, setStep] = useState(0);
  const [viewBodyMap, setViewBodyMap] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
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
    vitalSigns,
    updateVitalSign,
    reasons,
    session,
    setSession,
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

  const nextStep = () => {
    //setStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
    if (isTransitioning) return;

    setIsTransitioning(true);
    // Wait 1.5 seconds before actually changing step
    timeoutRef.current = setTimeout(() => {
      setStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
      setIsTransitioning(false);
    }, 1000); // 1 second delay
  };

  const handleStepChange = (newStep: number) => {
    if (isTransitioning) return;
    if (newStep < step) {
      return;
    }
    if (step === 1 && newStep !== 1) {
      if (!isPatientVerified && newStep > step) {
        return;
      }
    }
    if (step === 0 && newStep === 1) {
      const session = {
        start_time: new Date().toISOString().split(".")[0],
      }
      setSession(session);
    }
    if (newStep === 1) {
      setIsFingerprintVerified(true);
    }
    setIsTransitioning(true);
    timeoutRef.current = setTimeout(() => {
      setStep(newStep);
      setIsTransitioning(false);
    }, 500);
  };

  const handleFingerprintComplete = (
    isVerified: boolean,
    personalInfo?: PersonalPatientDataType,
    medicalHistory?: MedicalHistoryType[]
  ) => {
    setIsFingerprintVerified(isVerified);
    setIsPatientVerified(isVerified);

    if (isVerified && personalInfo) {
      setPersonalInfo(personalInfo);
      setMedicalHistoryList(medicalHistory || null);
      nextStep();
    }
  };

  const handleTemperatureComplete = (
    isVerified: boolean,
    temperature?: number
  ) => {
    setIsTemperatureVerified(isVerified);

    if (isVerified && temperature) {
      updateVitalSign("temperature", temperature);
      nextStep();
    }
  };

  const handlePressureComplete = (
    isVerified: boolean,
    bloodPressure?: string
  ) => {
    setIsBloodPressureVerified(isVerified);
    if (isVerified && bloodPressure) {
      updateVitalSign("bloodPressure", bloodPressure);
      nextStep();
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
    setIsPulseOximeterVerified(isVerified);
    if (isVerified && measurements) {
      updateVitalSign("oxygenSaturation", measurements.spo2);
      updateVitalSign("heartRate", measurements.heartRate);
      updateVitalSign(
        "respiratoryRate",
        measurements.respiratoryRate
      );
      nextStep();
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (step === 1 && isPatientVerified) {
      handleStepChange(2);
    }
  }, [isPatientVerified]);

  const showStepper = step !== 0;
  const showLeftArrow = step == 5 && viewBodyMap;
  const showRightArrow = step == 5;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning) return;
      // Existing keyboard handlers
      if (e.code === "Space" || e.key === " " || e.key === "=") {
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
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        e.preventDefault();
        setStep(0);
        resetAll();
        setViewBodyMap(false);
        setIsPatientVerified(false);
        setIsFingerprintVerified(false);
        window.location.reload();
      }

      // New handler for language switching (using 'Backspace' key)
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
    isFingerprintVerified,
    isTemperatureVerified,
    isBloodPressureVerified,
    isPulseOximeterVerified,
    viewBodyMap,
    toggleViewBodyMap,
    nextStep,
    locale, // Added locale to dependencies
    isTransitioning,
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
                  setIsFingerprintVerified(false);
                  setIsTemperatureVerified(false);
                  setIsBloodPressureVerified(false);
                  setIsPulseOximeterVerified(false);
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
            {session && personalInfo && (vitalSigns != null) && (
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
            )}

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
