"use client"

import { useState } from "react"
import { Clock, MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Define the Patient type
interface Patient {
  id: string
  name: string
  age: number
  gender: string
  waitTime: number
  ctasScore: number
  chiefComplaint: string
  vitalSigns: {
    bloodPressure: string
    heartRate: number
    respiratoryRate: number
    temperature: number
    oxygenSaturation: number
  }
  medicalHistory: string[]
  roomAssignment: string
  arrivalTime: string
}

// Replace the mock patient data with Arabic names
const patients: Patient[] = [
  {
    id: "P-1024",
    name: "Khalid Al-Ghanem",
    age: 45,
    gender: "Male",
    waitTime: 12,
    ctasScore: 2,
    chiefComplaint: "Chest pain, shortness of breath",
    vitalSigns: {
      bloodPressure: "145/95",
      heartRate: 110,
      respiratoryRate: 22,
      temperature: 37.2,
      oxygenSaturation: 94,
    },
    medicalHistory: ["Hypertension", "Type 2 Diabetes", "Previous MI (2019)"],
    roomAssignment: "ER-04",
    arrivalTime: "10:45 AM",
  },
  {
    id: "P-1025",
    name: "Fatimah Al-Harbi",
    age: 32,
    gender: "Female",
    waitTime: 45,
    ctasScore: 3,
    chiefComplaint: "Severe abdominal pain",
    vitalSigns: {
      bloodPressure: "125/85",
      heartRate: 95,
      respiratoryRate: 18,
      temperature: 37.8,
      oxygenSaturation: 98,
    },
    medicalHistory: ["Appendectomy (2015)", "No known chronic conditions"],
    roomAssignment: "Waiting",
    arrivalTime: "10:12 AM",
  },
  {
    id: "P-1026",
    name: "Abdullah Al-Qahtani",
    age: 78,
    gender: "Male",
    waitTime: 5,
    ctasScore: 1,
    chiefComplaint: "Unresponsive, possible stroke",
    vitalSigns: {
      bloodPressure: "180/100",
      heartRate: 88,
      respiratoryRate: 16,
      temperature: 36.9,
      oxygenSaturation: 92,
    },
    medicalHistory: ["Atrial Fibrillation", "Hypertension", "Previous Stroke (2020)"],
    roomAssignment: "ER-01",
    arrivalTime: "10:52 AM",
  },
  {
    id: "P-1027",
    name: "Leen Al-Zahrani",
    age: 8,
    gender: "Female",
    waitTime: 30,
    ctasScore: 3,
    chiefComplaint: "High fever, ear pain",
    vitalSigns: {
      bloodPressure: "100/70",
      heartRate: 110,
      respiratoryRate: 22,
      temperature: 39.2,
      oxygenSaturation: 97,
    },
    medicalHistory: ["Recurrent ear infections", "No known allergies"],
    roomAssignment: "Waiting",
    arrivalTime: "10:27 AM",
  },
  {
    id: "P-1028",
    name: "Hamza Banafeeh",
    age: 52,
    gender: "Male",
    waitTime: 60,
    ctasScore: 4,
    chiefComplaint: "Sprained ankle, mild swelling",
    vitalSigns: {
      bloodPressure: "130/85",
      heartRate: 75,
      respiratoryRate: 16,
      temperature: 36.8,
      oxygenSaturation: 99,
    },
    medicalHistory: ["Seasonal allergies", "No significant medical history"],
    roomAssignment: "Waiting",
    arrivalTime: "09:57 AM",
  },
  {
    id: "P-1029",
    name: "Noura Al-Ghamdi",
    age: 29,
    gender: "Female",
    waitTime: 15,
    ctasScore: 2,
    chiefComplaint: "Severe migraine, vomiting",
    vitalSigns: {
      bloodPressure: "135/85",
      heartRate: 88,
      respiratoryRate: 18,
      temperature: 37.0,
      oxygenSaturation: 98,
    },
    medicalHistory: ["Chronic migraines", "Anxiety disorder"],
    roomAssignment: "ER-07",
    arrivalTime: "10:42 AM",
  },
  {
    id: "P-1030",
    name: "Waleed Hazazi",
    age: 41,
    gender: "Male",
    waitTime: 75,
    ctasScore: 4,
    chiefComplaint: "Lower back pain",
    vitalSigns: {
      bloodPressure: "120/80",
      heartRate: 72,
      respiratoryRate: 14,
      temperature: 36.7,
      oxygenSaturation: 99,
    },
    medicalHistory: ["Herniated disc (2018)", "No known allergies"],
    roomAssignment: "Waiting",
    arrivalTime: "09:42 AM",
  },
]

interface PatientListProps {
  onPatientClick: (patient: Patient) => void
}

export function PatientList({ onPatientClick }: PatientListProps) {
  const [sortedPatients, setSortedPatients] = useState<Patient[]>(
    [...patients].sort((a, b) => a.ctasScore - b.ctasScore),
  )

  return (
    <div className="divide-y divide-slate-100">
      {sortedPatients.map((patient) => (
        <div
          key={patient.id}
          className="flex items-center justify-between p-4 hover:bg-slate-50 cursor-pointer"
          onClick={() => onPatientClick(patient)}
        >
          <div className="flex items-start gap-3">
            <div
              className={`mt-0.5 h-2.5 w-2.5 rounded-full ${
                patient.ctasScore === 1
                  ? "bg-red-500"
                  : patient.ctasScore === 2
                    ? "bg-orange-500"
                    : patient.ctasScore === 3
                      ? "bg-yellow-500"
                      : patient.ctasScore === 4
                        ? "bg-blue-500"
                        : "bg-green-500"
              }`}
            />
            <div>
              <div className="font-medium">{patient.name}</div>
              <div className="text-sm text-slate-500">
                {patient.age}, {patient.gender} • {patient.chiefComplaint.split(",")[0]}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={patient.ctasScore <= 2 ? "destructive" : patient.ctasScore === 3 ? "warning" : "outline"}
                >
                  CTAS {patient.ctasScore}
                </Badge>
                {patient.roomAssignment !== "Waiting" ? (
                  <Badge variant="outline" className="bg-blue-50">
                    {patient.roomAssignment}
                  </Badge>
                ) : (
                  <div className="flex items-center text-xs text-slate-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {patient.waitTime} min
                  </div>
                )}
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Assign Room</DropdownMenuItem>
              <DropdownMenuItem>Update CTAS</DropdownMenuItem>
              <DropdownMenuItem>View History</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  )
}
