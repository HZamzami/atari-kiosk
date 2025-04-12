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
import React from "react";
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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-fit [&>button:nth-of-type(1)]:hidden"
      >
        <SheetHeader className="space-y-0">
          <SheetTitle>{t(getZoneName(selectedZone))}</SheetTitle>

          <div className="ms-auto">
            <SheetClose className="border border-green-400 text-green-400  px-4 py-1 rounded-md">
              {t("done")}
            </SheetClose>
          </div>
        </SheetHeader>

        <div className="mt-6 overflow-x-auto ">
          <div className="flex gap-4 px-1 justify-center">
            {zoneSymptoms.map((symptom) => (
              <SymptomCard
                key={symptom.key}
                symptom={symptom}
                selected={reasons.includes(symptom.key)}
                onToggle={(key) => toggleReason(key)}
                toggleViewBodyMap={toggleViewBodyMap}
              />
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
