"use client";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useState } from "react";
import Introduction from "@/app/kiosk/steps/Introduction";
import ReasonForVisit from "@/app/kiosk/steps/ReasonForVisit";
import VitalSigns from "@/app/kiosk/steps/VitalSigns";
import ThankYou from "@/app/kiosk/steps/ThankYou";
import Stepper from "@/components/Stepper";
import Fingerprint from "@/app/kiosk/steps/Fingerprint";
import BodyMap from "@/app/kiosk/steps/BodyMap";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PatientDataProvider } from "@/context/PatientDataContext";

export default function page() {
  const { t, locale } = useLanguage();
  const [step, setStep] = useState(0);
  const [viewBodyMap, setViewBodyMap] = useState<boolean>(false);
  const toggleViewBodyMap = () => {
    setViewBodyMap(!viewBodyMap);
  };
  const steps = ["Intro", "Fingerprint", "Vital", "Reason", "Thank"];
  const nextStep = () =>
    setStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  const prevStep = () => {
    if (viewBodyMap) {
      toggleViewBodyMap();
    } else {
      setStep((prevStep) => Math.max(prevStep - 1, 0));
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
          className={` container flex flex-col mx-auto flex-grow  px-4 sm:px-6 md:px-8 ${
            showStepper && "pb-[80px]"
          }`}
        >
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
              {step === 0 && <Introduction onNext={nextStep} />}
              {step === 1 && <Fingerprint />}
              {step === 2 && <VitalSigns />}
              {step === 3 && (
                <ReasonForVisit
                  viewBodyMap={viewBodyMap}
                  toggleViewBodyMap={toggleViewBodyMap}
                />
              )}
              {step === 4 && <ThankYou />}
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
