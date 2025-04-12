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
import BodyMap from "@/app/kiosk/steps/BodyMap";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PatientDataProvider } from "@/context/PatientDataContext";
import { PersonalPatientDataType } from "@/types/patientData";
import { Button } from "@/components/ui/button";
import Temperature from "./steps/Temperature";
import Oximeter from "./steps/Oximeter";

export default function page() {
  const { t, locale } = useLanguage();
  const [step, setStep] = useState(0);
  const [viewBodyMap, setViewBodyMap] = useState<boolean>(false);
  const toggleViewBodyMap = () => {
    setViewBodyMap(!viewBodyMap);
  };

  const [reason, setReason] = useState("");
  const [isVerifyingFingerprint, setIsVerifyingFingerprint] =
    useState(true);
  const [isPatientVerified, setIsPatientVerified] = useState(false);
  const [patientData, setPatientData] =
    useState<PersonalPatientDataType | null>(null);

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
  // Reset fingerprint verification state when moving away from that step
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
    patientData?: PersonalPatientDataType
  ) => {
    setIsVerifyingFingerprint(false);
    setIsPatientVerified(isVerified);

    if (isVerified && patientData) {
      setPatientData(patientData);
    }
  };

  const showStepper = step !== 0;
  const showLeftArrow = viewBodyMap;
  const showRightArrow =
    step !== 0 && step !== steps.length - 1 && !viewBodyMap;
  return (
    <PatientDataProvider>
      <div className="flex flex-col min-h-screen w-full">
        <div
          className={`container flex flex-col mx-auto flex-grow  px-4 sm:px-6 md:px-8 ${
            showStepper && "pb-[80px]"
          }`}
        >
          {patientData && (
            <div className="bg-blue-50 p-3 rounded-md mb-4 flex justify-between items-center">
              <div>
                <span className="font-medium">{t("patient")}: </span>
                <span>
                  {patientData.first_name} {patientData.middle_name}{" "}
                  {patientData.last_name}
                </span>
                <span className="mx-2">|</span>
                <span className="font-medium">{t("dob")}: </span>
                <span>{patientData.birth_date}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsPatientVerified(false);
                  setPatientData(null);
                  setStep(1); // Go back to fingerprint step
                }}
              >
                {t("change_patient")}
              </Button>
            </div>
          )}
          <div className="ms-auto">
            {/* {step !== 0 && <LanguageSwitcher />} */}
          </div>
          <div className="flex-grow flex justify-between items-center">
            <div className={showLeftArrow ? "" : "invisible"}>
              {locale === "en" ? (
                <ChevronLeft
                  className="w-12 h-12"
                  onClick={prevStep}
                />
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
                <ChevronLeft
                  className="w-12 h-12"
                  onClick={nextStep}
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
    </PatientDataProvider>
  );
}
