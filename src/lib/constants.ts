import {
  LucideIcon,
  HeartPulse,
  Brain,
  UtensilsCrossed,
  Stethoscope,
  Thermometer,
  AlertCircle,
} from "lucide-react";

export const chiefComplaints: {
  title: string;
  icon: LucideIcon;
  complaints: string[];
}[] = [
  {
    title: "pain_injuries",
    icon: HeartPulse,
    complaints: [
      "headache",
      "chest_pain",
      "abdominal_pain",
      "back_pain",
      "joint_pain",
      "injury",
    ],
  },
  {
    title: "respiratory_issues",
    icon: Stethoscope,
    complaints: [
      "shortness_breath",
      "cough",
      "wheezing",
      "sore_throat",
    ],
  },
  {
    title: "gastrointestinal_issues",
    icon: UtensilsCrossed,
    complaints: ["nausea", "diarrhea", "constipation", "blood_stool"],
  },
  {
    title: "neurological_issues",
    icon: Brain,
    complaints: ["dizziness", "seizures", "numbness"],
  },
  {
    title: "fever_infections",
    icon: Thermometer,
    complaints: ["flu", "skin_infection", "urinary"],
  },
  {
    title: "other",
    icon: AlertCircle,
    complaints: ["other_placeholder"],
  },
];
