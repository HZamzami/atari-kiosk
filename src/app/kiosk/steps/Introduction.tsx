import { useLanguage } from "@/context/LanguageContext";
import React from "react";
import { Button } from "../../../components/ui/button";

// export default function Introduction() {
//   const { t } = useLanguage();
//   return <h1 className="text-2xl font-bold">{t("welcome")}</h1>;
// }
interface IntroductionProps {
  onNext: () => void;
}

export default function Introduction({ onNext }: IntroductionProps) {
  const { setLocale } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8">
      <h1 className="text-4xl font-bold text-center">
        مرحبا بك في جهاز الطوارئ
        <br />
        Welcome to the Emergency Kiosk
      </h1>
      <div className="flex gap-6">
        <Button
          onClick={() => {
            setLocale("en");
            onNext();
          }}
          className="w-[150px] h-[90px] px-8 py-4 text-2xl font-semibold   rounded-lg  transition-colors"
        >
          EN
        </Button>
        <Button
          onClick={() => {
            setLocale("ar");
            onNext();
          }}
          className="w-[150px] h-[90px] px-8 py-4 text-2xl font-semibold   rounded-lg  transition-colors"
        >
          ع
        </Button>
      </div>
    </div>
  );
}
