import { useLanguage } from "@/context/LanguageContext";
import { usePatientData } from "@/context/PatientDataContext";
import { Trash } from "lucide-react";
import React, { useState } from "react";
import { bodyZoneSymptoms } from "@/lib/symptoms";
import BodySheet from "@/components/BodySheet";
export type BodyZone =
  | "head&neck"
  | "chest"
  | "abdomen"
  | "arms"
  | "legs"
  | "back&buttocks";

type BodyPartInfo = {
  name: string;
  coords: {
    shape: "rect" | "poly";
    areas: string[];
  };
};

interface BodyMapProps {
  toggleViewBodyMap: () => void;
}

export default function BodyMap({ toggleViewBodyMap }: BodyMapProps) {
  const { t } = useLanguage();
  const [selectedZone, setSelectedZone] = useState<BodyZone | null>(
    null
  );
  const [sheetOpen, setSheetOpen] = useState(false);
  const { reasons, removeReason, toggleReason } = usePatientData();

  const frontBodyParts: Partial<Record<BodyZone, BodyPartInfo>> = {
    "head&neck": {
      name: "Head & Neck",
      coords: { shape: "rect", areas: ["100,0,175,83"] },
    },
    chest: {
      name: "Chest",
      coords: { shape: "rect", areas: ["95,83,175,135"] },
    },
    abdomen: {
      name: "Abdomen",
      coords: { shape: "rect", areas: ["100,135,175,220"] },
    },
    arms: {
      name: "Arms",
      coords: {
        shape: "poly",
        areas: [
          "95,84, 95,150, 95,130, 80,165, 45,209, 20,258, -15,258, 0,209, 30,165, 60,120, 75,84",
          "175,84, 175,150, 175,130, 190,165, 225,209, 250,258, 285,258, 270,209, 240,165, 210,120, 195,84",
        ],
      },
    },
    legs: {
      name: "Legs",
      coords: {
        shape: "poly",
        areas: ["95,220,55,500,220,500,180,220"],
      },
    },
  };

  const backBodyParts: Partial<Record<BodyZone, BodyPartInfo>> = {
    "head&neck": {
      name: "Head & Neck",
      coords: { shape: "rect", areas: ["105,-10,180,65"] },
    },
    "back&buttocks": {
      name: "Back & Buttocks",

      coords: {
        shape: "rect",
        areas: ["105,65,180,240"],
      },
    },
    arms: {
      name: "Arms",
      coords: {
        shape: "poly",
        areas: [
          "100,84, 100,150, 100,130, 80,165, 45,209, 20,258, -15,258, 0,209, 30,165, 60,120, 75,80",
          "185,84, 185,150, 185,130, 200,165, 235,209, 260,258, 300,258, 285,209, 255,165, 225,120, 210,80",
        ],
      },
    },
    legs: {
      name: "Legs",
      coords: {
        shape: "poly",
        areas: ["90,240,50,500,235,500,195,240"],
      },
    },
  };
  const getZoneSymptoms = (zone: BodyZone | null) => {
    if (!zone || !bodyZoneSymptoms[zone]) return [];
    return bodyZoneSymptoms[zone].map((symptom) => symptom.key);
  };
  const handleZoneClick = (zone: BodyZone) => {
    setSelectedZone(zone);
    setSheetOpen(true);
  };
  const renderOverlay = (
    bodyParts: Partial<Record<BodyZone, BodyPartInfo>>
  ) => {
    if (!selectedZone) return null;

    const part = bodyParts[selectedZone];
    if (!part) return null;

    if (part.coords.shape === "rect") {
      return part.coords.areas.map((coords, index) => {
        const [x1, y1, x2, y2] = coords.split(",").map(Number);
        return (
          <div
            key={index}
            style={{
              position: "absolute",
              top: y1,
              left: x1,
              width: x2 - x1,
              height: y2 - y1,
              backgroundColor: "rgba(255, 0, 0, 0.3)",
              pointerEvents: "none",
            }}
          ></div>
        );
      });
    } else if (part.coords.shape === "poly") {
      return (
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {part.coords.areas.map((points, index) => (
            <polygon
              key={index}
              points={points.replace(/,\s*/g, ",")}
              fill="rgba(255, 0, 0, 0.3)"
            />
          ))}
        </svg>
      );
    }

    return null;
  };

  return (
    <div className="grid grid-cols-3 gap-1 px-[100px]">
      <div className="flex flex-col justify-center items-center">
        <div className="w-full h-full bg-gray-100">
          <div className="p-4 w-full h-full">
            {reasons.length === 0 ? (
              <div className="w-full h-full flex justify-center items-center flex-col gap-8">
                <img src="/symptoms.svg" alt="symptoms" />
                <span>No Symptoms Added</span>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-6">
                {reasons.map((reason) => (
                  <div
                    key={reason}
                    className="flex items-center justify-between w-full border-b pb-2"
                  >
                    <span className="text-sm">{t(reason)}</span>
                    <button
                      onClick={() => removeReason(reason)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="col-span-2 flex justify-around ">
        <div className="relative">
          <img
            src="/front-m.webp"
            alt="Human body front"
            useMap="#frontmap"
            className="max-h-[500px] w-auto"
          />
          {renderOverlay(frontBodyParts)}
          <map name="frontmap">
            {Object.entries(frontBodyParts).map(([zone, part]) =>
              part.coords.areas.map((coords, index) => (
                <area
                  key={`front-${zone}-${index}`}
                  shape={part.coords.shape}
                  coords={coords}
                  alt={part.name}
                  onClick={() => handleZoneClick(zone as BodyZone)}
                  className="cursor-pointer"
                />
              ))
            )}
          </map>
        </div>

        <div className="relative">
          <img
            src="/back-m.webp"
            alt="Human body back"
            useMap="#backmap"
            className="max-h-[500px] w-auto"
          />
          {renderOverlay(backBodyParts)}
          <map name="backmap">
            {Object.entries(backBodyParts).map(([zone, part]) =>
              part.coords.areas.map((coords, index) => (
                <area
                  key={`back-${zone}-${index}`}
                  shape={part.coords.shape}
                  coords={coords}
                  alt={part.name}
                  onClick={() => handleZoneClick(zone as BodyZone)}
                  className="cursor-pointer"
                />
              ))
            )}
          </map>
        </div>
      </div>

      <BodySheet
        open={sheetOpen}
        onOpenChange={(open) => {
          setSheetOpen(open);
          if (!open) {
            setSelectedZone(null);
          }
        }}
        selectedZone={selectedZone}
        toggleViewBodyMap={toggleViewBodyMap}
      />
    </div>
  );
}
