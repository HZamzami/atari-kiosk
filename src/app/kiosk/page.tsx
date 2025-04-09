"use client";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Introduction from "@/app/kiosk/steps/Introduction";
import ReasonForVisit from "@/app/kiosk/steps/ReasonForVisit";
import VitalSigns from "@/app/kiosk/steps/VitalSigns";
import ThankYou from "@/app/kiosk/steps/ThankYou";
import Stepper from "@/components/Stepper";
import Fingerprint from "@/app/kiosk/steps/Fingerprint";
import BodyMap from "@/app/kiosk/steps/BodyMap";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { VitalSignsType } from "@/types/vital-signs";
import { PatientDataType } from "@/types/patientData";

export default function page() {
  const { t, locale } = useLanguage();
  const [step, setStep] = useState(0);
  const [reason, setReason] = useState("");
  const [isVerifyingFingerprint, setIsVerifyingFingerprint] = useState(true);
  const [isPatientVerified, setIsPatientVerified] = useState(false);
  const [patientData, setPatientData] = useState<PatientDataType | null>(null);

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
  const steps = [
    "Intro",
    "Fingerprint",
    "Vital",
    "Reason",
    "BodyMap",
    "Thank",
  ];
  const nextStep = () =>
    setStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  const prevStep = () =>
    setStep((prevStep) => Math.max(prevStep - 1, 0));

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
  
  const handleVerificationComplete = (isVerified: boolean, patientData?: PatientDataType) => {
    setIsVerifyingFingerprint(false);
    setIsPatientVerified(isVerified);
    
    if (isVerified && patientData) {
      setPatientData(patientData);
    }
  };
  
  // Determine if navigation should be disabled
  const isNavigationDisabled = step === 1 && isVerifyingFingerprint;
  
  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="container flex flex-col mx-auto flex-grow pb-[100px]">
        {patientData && (
          <div className="bg-blue-50 p-3 rounded-md mb-4 flex justify-between items-center">
            <div>
              <span className="font-medium">{t("patient")}: </span>
              <span>{patientData.first_name} {patientData.middle_name} {patientData.last_name}</span>
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
          <div>
            {locale === "en" ? (
              <ChevronLeft 
                className={`w-12 h-12 ${isNavigationDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`} 
                onClick={() => !isNavigationDisabled && handleStepChange(step - 1)} 
              />
            ) : (
              <ChevronRight
                className={`w-12 h-12 ${isNavigationDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                onClick={() => !isNavigationDisabled && handleStepChange(step - 1)}
              />
            )}
          </div>
          <div className="flex-grow">
            {step === 0 && <Introduction onNext={() => handleStepChange(1)} />}
            {step === 1 && <Fingerprint onVerificationComplete={handleVerificationComplete} />}
            {step === 2 && <VitalSigns />}
            {step === 3 && (
              <ReasonForVisit
                reason={reason}
                handleReasonChange={handleReasonChange}
              />
            )}
            {step === 4 && <BodyMap />}
            {step === 5 && (
              <ThankYou 
                vitalSigns={vitalSigns} 
                reason={reason}
                patientData={patientData || undefined}
              />
            )}
          </div>
          <div>
            {locale === "en" ? (
              <ChevronRight
                className={`w-12 h-12 ${isNavigationDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                onClick={() => !isNavigationDisabled && handleStepChange(step + 1)}
              />
            ) : (
              <ChevronLeft 
                className={`w-12 h-12 ${isNavigationDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`} 
                onClick={() => !isNavigationDisabled && handleStepChange(step + 1)} 
              />
            )}
          </div>
        </div>
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
