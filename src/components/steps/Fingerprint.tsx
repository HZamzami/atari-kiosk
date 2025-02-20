import { useLanguage } from "@/context/LanguageContext";
import React from "react";
import Image from "next/image";
export default function Fingerprint() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6">
      <h1 className="text-4xl font-bold">
        {t("put_finger_scanner")}
      </h1>
      <Image
        src={"/fingerScanner.gif"}
        alt="finger scanner"
        width={524}
        height={354}
        unoptimized
      />
    </div>
  );
}
