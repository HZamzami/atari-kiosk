"use client";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Introduction from "@/components/steps/Introduction";
import ReasonForVisit from "@/components/steps/ReasonForVisit";
import VitalSigns from "@/components/steps/VitalSigns";
import ThankYou from "@/components/steps/ThankYou";
import Stepper from "@/components/Stepper";
import Fingerprint from "@/components/steps/Fingerprint";
import { ChevronLeft, ChevronRight } from "lucide-react";
export type VitalSignsType = {
  heartRate: number;
  bloodPressure: string;
  temperature: number;
  respiratoryRate: number;
  oxygenSaturation: number;
};
export default function Home() {
  const { t, locale } = useLanguage();
  const [step, setStep] = useState(0);
  const [reason, setReason] = useState("");
  const handleReasonChange = (
    value: string | React.ChangeEvent<HTMLInputElement>
  ) => {
    if (typeof value === "string") {
      setReason(value);
    } else {
      setReason(value.target.value);
    }
  };

  const [vitalSigns, setVitalSigns] = useState<VitalSignsType>({
    heartRate: 72,
    bloodPressure: "120/80",
    temperature: 36.8,
    respiratoryRate: 16,
    oxygenSaturation: 98,
  });

  const updateVitalSigns = (
    key: keyof VitalSignsType,
    value: number | string
  ) => {
    setVitalSigns((prev) => ({ ...prev, [key]: value }));
  };
  const steps = ["Intro", "Fingerprint", "Vital", "Reason", "Thank"];
  const nextStep = () =>
    setStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  const prevStep = () =>
    setStep((prevStep) => Math.max(prevStep - 1, 0));
  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className=" container flex flex-col mx-auto flex-grow pb-[100px]">
        <div className="ms-auto">
          {/* {step !== 0 && <LanguageSwitcher />} */}
        </div>
        <div className="flex-grow flex justify-between items-center">
          <div>
            {locale === "en" ? (
              <ChevronLeft onClick={prevStep} />
            ) : (
              <ChevronRight onClick={prevStep} />
            )}
          </div>
          <div className="flex-grow">
            {step === 0 && <Introduction onNext={nextStep} />}
            {step === 1 && <Fingerprint />}
            {step === 2 && <VitalSigns />}
            {step === 3 && (
              <ReasonForVisit
                reason={reason}
                handleReasonChange={handleReasonChange}
              />
            )}
            {step === 4 && (
              <ThankYou vitalSigns={vitalSigns} reason={reason} />
            )}
          </div>
          <div>
            {locale === "en" ? (
              <ChevronRight onClick={nextStep} />
            ) : (
              <ChevronLeft onClick={nextStep} />
            )}
          </div>
        </div>
        <div className="flex justify-between"></div>
      </div>
      {step !== 0 && (
        <div className="fixed bottom-0 left-0 w-full h-[100px] bg-[#F1F3F5] mt-6">
          <div className="container mx-auto h-full flex flex-col items-stretch justify-center">
            <Stepper currentStep={step} steps={steps} />
          </div>
        </div>
      )}
    </div>
  );
}
