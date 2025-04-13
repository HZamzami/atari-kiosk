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
  Toilet,
} from "lucide-react";
import { Symptom } from "@/types/symptom";
import { BodyZone } from "@/app/kiosk/steps/BodyMap";

export const symptoms: Symptom[] = [
  { key: "fever", icon: Thermometer },
  { key: "breathing_difficulties", icon: AirVent },
  { key: "headache", icon: Brain },
  { key: "chest_pain", icon: Heart },
  { key: "nausea_vomiting", icon: Frown },
  { key: "dizziness_weakness", icon: AlertTriangle },
  { key: "wound_cut", icon: Droplet },
  { key: "fracture", icon: Bone },
  { key: "abdominal_pain", icon: Frown },

  { key: "body_map", icon: PersonStanding },
];
const getSymptom = (key: string) =>
  symptoms.find((s) => s.key === key)!;

export const bodyZoneSymptoms: Record<BodyZone, Symptom[]> = {
  "head&neck": [
    getSymptom("headache"),
    getSymptom("fever"),
    { key: "eye_pain", icon: Eye },
    { key: "ear_pain", icon: Ear },
    { key: "tooth_pain", icon: Frown },
    { key: "sore_throat", icon: Frown },
    { key: "neck_pain", icon: Frown },
  ],
  chest: [
    getSymptom("chest_pain"),
    getSymptom("breathing_difficulties"),
    { key: "cough", icon: Heart },
    { key: "palpitations", icon: Heart },
  ],
  abdomen: [
    getSymptom("nausea_vomiting"),
    getSymptom("abdominal_pain"),
    { key: "diarrhea", icon: Toilet },
    { key: "constipation", icon: Toilet },
  ],
  arms: [
    { key: "arm_pain", icon: Hand },
    getSymptom("fracture"),
    { key: "shoulder_pain", icon: Frown },
    { key: "hand_pain", icon: Hand },
  ],
  legs: [
    { key: "leg_pain", icon: Footprints },
    { key: "knee_pain", icon: Footprints },
    { key: "ankle_pain", icon: Footprints },
    { key: "swelling", icon: Footprints },
    getSymptom("fracture"),
  ],
  "back&buttocks": [
    { key: "back_pain", icon: Backpack },
    { key: "lower_back_pain", icon: Backpack },
    { key: "buttock_pain", icon: Bone },
  ],
};
