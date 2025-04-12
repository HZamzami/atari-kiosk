import {
  Thermometer,
  AirVent,
  Brain,
  Heart,
  Frown,
  AlertTriangle,
  Droplet,
  Bone,
  PersonStanding,
  Eye,
  Ear,
  Syringe,
  Hand,
  Footprints,
  Backpack,
} from "lucide-react";
import { Symptom } from "@/types/symptom";
import { BodyZone } from "@/app/kiosk/steps/BodyMap";

export const symptoms: Symptom[] = [
  { key: "fever", icon: Thermometer },
  { key: "breathing", icon: AirVent },
  { key: "headache", icon: Brain },
  { key: "chest_pain", icon: Heart },
  { key: "nausea", icon: Frown },
  { key: "general_pain", icon: AlertTriangle },
  { key: "wound_cut", icon: Droplet },
  { key: "fracture", icon: Bone },
  { key: "body_map", icon: PersonStanding },
];
const getSymptom = (key: string) =>
  symptoms.find((s) => s.key === key)!;

export const bodyZoneSymptoms: Record<BodyZone, Symptom[]> = {
  "head&neck": [
    getSymptom("headache"),
    { key: "eye_pain", icon: Eye },
    { key: "ear_pain", icon: Ear },
    { key: "tooth_pain", icon: Frown },
  ],
  chest: [getSymptom("chest_pain"), getSymptom("breathing")],
  abdomen: [
    getSymptom("nausea"),
    { key: "stomach_pain", icon: Frown },
    { key: "vomiting", icon: Syringe },
  ],
  arms: [{ key: "arm_pain", icon: Hand }, getSymptom("fracture")],
  legs: [
    { key: "leg_pain", icon: Footprints },
    getSymptom("fracture"),
  ],
  "back&buttocks": [
    { key: "back_pain", icon: Backpack },
    { key: "buttock_pain", icon: Bone },
  ],
};
