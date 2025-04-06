import {
  Thermometer,
  AirVent,
  Brain,
  Heart,
  Droplet,
  AlertTriangle,
  Frown,
  Bone,
  PersonStanding,
} from "lucide-react";
import { Symptom } from "@/types/symptom";

export const symptoms: Symptom[] = [
  { key: "fever", label: "Fever", icon: Thermometer },
  { key: "breathing", label: "Breathing", icon: AirVent },
  { key: "headache", label: "Headache", icon: Brain },
  { key: "chest_pain", label: "Chest Pain", icon: Heart },
  { key: "nausea", label: "Nausea", icon: Frown },
  { key: "general_pain", label: "General Pain", icon: AlertTriangle },
  { key: "wound_cut", label: "Wound / Cut", icon: Droplet },
  { key: "fracture", label: "Fracture / Sprain", icon: Bone },
  { key: "body_map", label: "Body Map", icon: PersonStanding },
];
