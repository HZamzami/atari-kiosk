import { useLanguage } from "@/context/LanguageContext";
import React, { useState } from "react";
import Image from "next/image";

type BodyZone = "head" | "chest" | "abdomen" | "arms" | "legs";

type BodyPartInfo = {
  name: string;
  symptoms: string[];
  coords: {
    shape: "rect" | "poly";
    areas: string[];
  };
};

export default function BodyMap() {
  const { t } = useLanguage();
  const [selectedZone, setSelectedZone] = useState<BodyZone | null>(
    null
  );

  const bodyParts: Record<BodyZone, BodyPartInfo> = {
    head: {
      name: "Head & Neck",
      symptoms: ["Headache", "Dizziness", "Sore throat"],
      coords: {
        shape: "rect",
        areas: ["100,0,175,83"],
      },
    },
    chest: {
      name: "Chest",
      symptoms: ["Chest pain", "Shortness of breath", "Cough"],
      coords: {
        shape: "rect",
        areas: ["95,83,175,135"],
      },
    },
    abdomen: {
      name: "Abdomen",
      symptoms: ["Stomach pain", "Nausea", "Bloating"],
      coords: {
        shape: "rect",
        areas: ["100,135,175,220"],
      },
    },
    arms: {
      name: "Arms",
      symptoms: ["Arm pain", "Weakness", "Numbness"],
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
      symptoms: ["Leg pain", "Joint pain", "Swelling"],
      coords: {
        shape: "poly",
        areas: ["95,220,55,500,220,500,180,220"],
      },
    },
  };

  const renderOverlay = () => {
    if (!selectedZone) return null;

    const part = bodyParts[selectedZone];

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
    <div className="flex flex-col items-center justify-center h-full space-y-6">
      <h1 className="text-4xl font-bold">TODO</h1>
      <div className="relative">
        <img
          src="/front-m.webp"
          alt="Human body"
          useMap="#bodymap"
          className="max-h-[500px] w-auto"
        />

        {/* Render selected zone overlay */}
        {renderOverlay()}

        <map name="bodymap">
          {Object.entries(bodyParts).map(([zone, part]) =>
            part.coords.areas.map((coords, index) => (
              <area
                key={`${zone}-${index}`}
                shape={part.coords.shape}
                coords={coords}
                alt={part.name}
                onClick={() => setSelectedZone(zone as BodyZone)}
                className="cursor-pointer"
              />
            ))
          )}
        </map>
      </div>
      {/* {selectedZone && <div>{bodyParts[selectedZone].name}</div>} */}
    </div>
  );
}
