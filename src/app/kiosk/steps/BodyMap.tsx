import { useLanguage } from "@/context/LanguageContext";
import React, { useState } from "react";
import Image from "next/image";
export default function BodyMap() {
  const { t } = useLanguage();
  const [selectedPart, setSelectedPart] = useState(null);

  const bodyParts = {
    head: {
      name: "Head & Neck",
      symptoms: ["Headache", "Dizziness", "Sore throat"],
    },
    chest: {
      name: "Chest",
      symptoms: ["Chest pain", "Shortness of breath", "Cough"],
    },
    abdomen: {
      name: "Abdomen",
      symptoms: ["Stomach pain", "Nausea", "Bloating"],
    },
    arms: {
      name: "Arms",
      symptoms: ["Arm pain", "Weakness", "Numbness"],
    },
    legs: {
      name: "Legs",
      symptoms: ["Leg pain", "Joint pain", "Swelling"],
    },
  };
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6">
      <h1 className="text-4xl font-bold">
        {t("put_finger_scanner")}
      </h1>
      <div className="relative">
        <img
          src="/front-m.webp"
          alt="Human body"
          useMap="#bodymap"
          className="max-h-[500px] w-auto"
        />

        <map name="bodymap">
          <area
            shape="rect"
            coords="120,0,180,60"
            alt="Head"
            onClick={() => setSelectedPart("head")}
            className="cursor-pointer"
          />
          <area
            shape="rect"
            coords="120,60,180,150"
            alt="Chest"
            onClick={() => setSelectedPart("chest")}
            className="cursor-pointer"
          />
          <area
            shape="rect"
            coords="120,150,180,230"
            alt="Abdomen"
            onClick={() => setSelectedPart("abdomen")}
            className="cursor-pointer"
          />
          <area
            shape="poly"
            coords="80,80,120,80,120,200,80,200"
            alt="Left Arm"
            onClick={() => setSelectedPart("arms")}
            className="cursor-pointer"
          />
          <area
            shape="poly"
            coords="180,80,220,80,220,200,180,200"
            alt="Right Arm"
            onClick={() => setSelectedPart("arms")}
            className="cursor-pointer"
          />
          <area
            shape="poly"
            coords="110,230,170,230,200,400,80,400"
            alt="Legs"
            onClick={() => setSelectedPart("legs")}
            className="cursor-pointer"
          />
        </map>
      </div>

      {selectedPart && <div>{selectedPart}</div>}
    </div>
  );
}
