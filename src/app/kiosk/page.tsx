"use client";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useState } from "react";
import Introduction from "@/app/kiosk/steps/Introduction";
import ReasonForVisit from "@/app/kiosk/steps/ReasonForVisit";
import Pressure from "@/app/kiosk/steps/Pressure";
import ThankYou from "@/app/kiosk/steps/ThankYou";
import Stepper from "@/components/Stepper";
import Fingerprint from "@/app/kiosk/steps/Fingerprint";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  PatientDataProvider,
  usePatientData,
} from "@/context/PatientDataContext";
import { PersonalPatientDataType } from "@/types/patientData";
import { Button } from "@/components/ui/button";
import Temperature from "./steps/Temperature";
import Oximeter from "./steps/Oximeter";
import { Check } from "lucide-react";

export default function Page() {
  const { t, locale } = useLanguage();
  const [step, setStep] = useState(0);
  const [viewBodyMap, setViewBodyMap] = useState<boolean>(false);
  const toggleViewBodyMap = () => {
    setViewBodyMap(!viewBodyMap);
  };

  const [isVerifyingFingerprint, setIsVerifyingFingerprint] =
    useState(true);
  const [isPatientVerified, setIsPatientVerified] = useState(false);

  // Wrap usePatientData hook inside the PatientDataProvider
  return (
    <PatientDataProvider>
      <PatientDataContextPage
        isVerifyingFingerprint={isVerifyingFingerprint}
        isPatientVerified={isPatientVerified}
        setIsVerifyingFingerprint={setIsVerifyingFingerprint}
        setIsPatientVerified={setIsPatientVerified}
      />
    </PatientDataProvider>
  );
}

function PatientDataContextPage({
  isVerifyingFingerprint,
  isPatientVerified,
  setIsVerifyingFingerprint,
  setIsPatientVerified,
}: any) {
  const { t, locale } = useLanguage();
  const [step, setStep] = useState(0);
  const [viewBodyMap, setViewBodyMap] = useState<boolean>(false);
  const toggleViewBodyMap = () => {
    setViewBodyMap(!viewBodyMap);
  };

  const { personalInfo, setPersonalInfo, resetAll } =
    usePatientData();

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

  const handleVerificationComplete = (
    isVerified: boolean,
    personalInfo?: PersonalPatientDataType
  ) => {
    setIsVerifyingFingerprint(false);
    setIsPatientVerified(isVerified);

    if (isVerified && personalInfo) {
      setPersonalInfo(personalInfo);
    }
  };

  const showStepper = step !== 0;
  const showLeftArrow = viewBodyMap;
  const showRightArrow =
    step !== 0 && step !== steps.length - 1 && !viewBodyMap;

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div
        className={`container flex flex-col mx-auto flex-grow pt-4  px-4 sm:px-6 md:px-8 ${
          showStepper && "pb-[80px]"
        }`}
      >
        {personalInfo && (
          <div className="bg-blue-50 p-3 rounded-md mb-4 flex justify-between items-center">
            <div>
              <span className="font-medium">{t("patient")}</span>
              <span>
                {personalInfo.first_name} {personalInfo.middle_name}{" "}
                {personalInfo.last_name}
              </span>
              <span className="mx-2">|</span>
              <span className="font-medium">{t("date of birth")}</span>
              <span>{personalInfo.birth_date}</span>
              <span className="mx-2">|</span>
              <span className="font-medium">{t("national id")}</span>
              <span>{personalInfo.national_id}</span>
            </div>
            <div className="w-6 h-6 rounded-full border border-green-600 flex items-center justify-center bg-green-100">
              <Check className="w-4 h-4 text-green-600" />
            </div>
          </div>
        )}
        <div className="ms-auto">
          {step !== 0 && (
            <button
              onClick={() => {
                setStep(0);
                resetAll();
                setIsPatientVerified(false);
                setIsVerifyingFingerprint(false);
              }}
              className="px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 border border-red-300 rounded-xl shadow-sm transition-all duration-200 ease-in-out  font-medium"
            >
              {t("exit")}
            </button>
          )}
        </div>
        <div className="flex-grow flex justify-between items-center">
          <div className={showLeftArrow ? "" : "invisible"}>
            {locale === "en" ? (
              <ChevronLeft className="w-12 h-12" onClick={prevStep} />
            ) : (
              <ChevronRight
                className="w-12 h-12"
                onClick={prevStep}
              />
            )}
          </div>

          <div className="flex-grow px-2">
            {step === 0 && (
              <Introduction onNext={() => handleStepChange(1)} />
            )}
            {step === 1 && (
              <Fingerprint
                onVerificationComplete={handleVerificationComplete}
              />
            )}
            {step === 2 && <Temperature />}
            {step === 3 && <Pressure />}
            {step === 4 && <Oximeter />}
            {step === 5 && (
              <ReasonForVisit
                viewBodyMap={viewBodyMap}
                toggleViewBodyMap={toggleViewBodyMap}
              />
            )}
            {step === 6 && <ThankYou />}
          </div>
          <div className={showRightArrow ? "" : "invisible"}>
            {locale === "en" ? (
              <ChevronRight
                className="w-12 h-12"
                onClick={nextStep}
              />
            ) : (
              <ChevronLeft className="w-12 h-12" onClick={nextStep} />
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
