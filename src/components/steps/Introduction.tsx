import { useLanguage } from "@/context/LanguageContext";
import React from "react";
import { Button } from "../ui/button";

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
    <div className="flex flex-col items-center justify-center h-full space-y-6">
      <h1 className="text-4xl font-bold text-center">
        مرحبا بك في جهاز الطوارئ
        <br />
        Welcome to the Emergency Kiosk
      </h1>
      <div className="flex gap-4">
        <Button
          onClick={() => {
            setLocale("en");
            onNext();
          }}
          className="w-[120px] h-[72px] px-8 py-4 text-2xl font-semibold   rounded-lg  transition-colors"
        >
          EN
        </Button>
        <Button
          onClick={() => {
            setLocale("ar");
            onNext();
          }}
          className="w-[120px] h-[72px] px-8 py-4 text-2xl font-semibold   rounded-lg  transition-colors"
        >
          ع
        </Button>
      </div>
    </div>
  );
}
