import { useLanguage } from "@/context/LanguageContext";
import { usePatientData } from "@/context/PatientDataContext";
import { bodyZoneSymptoms } from "@/lib/symptoms";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import SymptomCard from "@/components/SymptomCard";
import React, { useEffect } from "react";
import { BodyZone } from "@/app/kiosk/steps/BodyMap";
interface BodySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedZone: BodyZone | null;
  toggleViewBodyMap: () => void;
}
export default function BodySheet({
  open,
  onOpenChange,
  selectedZone,
  toggleViewBodyMap,
}: BodySheetProps) {
  const { t } = useLanguage();
  const { reasons, toggleReason } = usePatientData();
  const zoneSymptoms = React.useMemo(() => {
    if (!selectedZone || !bodyZoneSymptoms[selectedZone]) return [];
    return bodyZoneSymptoms[selectedZone];
  }, [selectedZone]);
  const getZoneName = (zone: BodyZone | null) => {
    switch (zone) {
      case "head&neck":
        return "Head & Neck";
      case "chest":
        return "Chest";
      case "abdomen":
        return "Abdomen";
      case "arms":
        return "Arms";
      case "legs":
        return "Legs";
      case "back&buttocks":
        return "Back & Buttocks";
      default:
        return "";
    }
  };
  useEffect(() => {
    if (!open || zoneSymptoms.length === 0) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === ".") {
        onOpenChange(false);
      }

      const keyNum = parseInt(event.key);
      if (
        !isNaN(keyNum) &&
        keyNum > 0 &&
        keyNum <= zoneSymptoms.length
      ) {
        const symptom = zoneSymptoms[keyNum - 1];
        if (symptom) toggleReason(symptom.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, zoneSymptoms.length, toggleReason, onOpenChange]);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-fit [&>button:nth-of-type(1)]:hidden"
      >
        <SheetHeader className="space-y-0">
          <SheetTitle>{t(getZoneName(selectedZone))}</SheetTitle>
          <div className="ms-auto">
            <SheetClose className="border bg-green-400 text-white  px-4 py-1 rounded-md">
              {t("done")}
            </SheetClose>
          </div>
        </SheetHeader>
        <div className="mt-6 overflow-x-auto ">
          <div className="flex gap-4 px-1 justify-center flex-wrap-reverse">
            {zoneSymptoms.map((symptom, index) => (
              <SymptomCard
                index={index + 1}
                key={symptom.key}
                symptom={symptom}
                selected={reasons.includes(symptom.key)}
                onToggle={(key) => toggleReason(key)}
              />
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
