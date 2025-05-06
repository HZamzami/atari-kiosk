"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface Patient {
  id: string
  name: string
  age: number
  gender: string
  chiefComplaint: string
  roomAssignment: string
  arrivalTime: string
  medicalHistory: string[]
  vitalSigns: {
    bloodPressure: string
    heartRate: string
    respiratoryRate: string
    temperature: string
    oxygenSaturation: string
  }
}

interface PatientDetailsProps {
  patient: Patient
}

export function PatientDetails({ patient }: PatientDetailsProps) {
  return (
    <Tabs defaultValue="overview">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="vitals">Vitals</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-slate-500">Patient Name</h3>
            <p className="font-medium">{patient.name}</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-slate-500">Patient ID</h3>
            <p className="font-medium">{patient.id}</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-slate-500">Age</h3>
            <p className="font-medium">{patient.age} years</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-slate-500">Gender</h3>
            <p className="font-medium">{patient.gender}</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-slate-500">Chief Complaint</h3>
          <p className="text-sm">{patient.chiefComplaint}</p>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Room Assignment</CardTitle>
            <CardDescription>Current location in ED</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-lg">
                  {patient.roomAssignment === "Waiting" ? "Waiting Area" : patient.roomAssignment}
                </p>
                <p className="text-sm text-slate-500">Arrived at {patient.arrivalTime}</p>
              </div>
              <Button variant="outline" size="sm">
                Reassign
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-slate-500">Medical History</h3>
          <ul className="space-y-1">
            {patient.medicalHistory.map((item, index) => (
              <li key={index} className="text-sm flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline">Update Status</Button>
          <Button>Assign Treatment</Button>
        </div>
      </TabsContent>

      <TabsContent value="vitals" className="mt-4 space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Vital Signs</CardTitle>
            <CardDescription>Last updated 10 minutes ago</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-slate-500">Blood Pressure</h3>
                <p className="font-medium">{patient.vitalSigns.bloodPressure} mmHg</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-slate-500">Heart Rate</h3>
                <p className="font-medium">{patient.vitalSigns.heartRate} bpm</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-slate-500">Respiratory Rate</h3>
                <p className="font-medium">{patient.vitalSigns.respiratoryRate} breaths/min</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-slate-500">Temperature</h3>
                <p className="font-medium">{patient.vitalSigns.temperature}°C</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-slate-500">Oxygen Saturation</h3>
                <p className="font-medium">{patient.vitalSigns.oxygenSaturation}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button variant="outline">View Trends</Button>
          <Button>Update Vitals</Button>
        </div>
      </TabsContent>

      <TabsContent value="history" className="mt-4 space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Previous Visits</CardTitle>
            <CardDescription>Last 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-2 border-blue-500 pl-4 py-1">
                <p className="font-medium">March 15, 2023</p>
                <p className="text-sm text-slate-500">Pneumonia - Admitted for 3 days</p>
              </div>
              <div className="border-l-2 border-blue-500 pl-4 py-1">
                <p className="font-medium">January 2, 2023</p>
                <p className="text-sm text-slate-500">Influenza - Outpatient treatment</p>
              </div>
              <div className="border-l-2 border-blue-500 pl-4 py-1">
                <p className="font-medium">October 10, 2022</p>
                <p className="text-sm text-slate-500">Routine checkup - No issues found</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Medications</CardTitle>
            <CardDescription>Current prescriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <div>
                  <p className="font-medium">Lisinopril 10mg</p>
                  <p className="text-sm text-slate-500">Once daily</p>
                </div>
                <p className="text-sm text-slate-500">For hypertension</p>
              </li>
              <li className="flex justify-between">
                <div>
                  <p className="font-medium">Metformin 500mg</p>
                  <p className="text-sm text-slate-500">Twice daily</p>
                </div>
                <p className="text-sm text-slate-500">For diabetes</p>
              </li>
              <li className="flex justify-between">
                <div>
                  <p className="font-medium">Aspirin 81mg</p>
                  <p className="text-sm text-slate-500">Once daily</p>
                </div>
                <p className="text-sm text-slate-500">Preventative</p>
              </li>
            </ul>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notes" className="mt-4 space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Clinical Notes</CardTitle>
            <CardDescription>Provider observations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <p className="font-medium">Dr. Haithm Al-Ghanem</p>
                  <p className="text-sm text-slate-500">10:55 AM</p>
                </div>
                <p className="text-sm mt-1">
                  Patient presents with chest pain and shortness of breath. History of hypertension and previous MI. ECG
                  shows ST elevation in leads II, III, aVF. Cardiac enzymes pending. Starting protocol for possible
                  STEMI.
                </p>
              </div>
              <Separator />
              <div>
                <div className="flex items-center justify-between">
                  <p className="font-medium">Nurse Latifa Al-Zahrani</p>
                  <p className="text-sm text-slate-500">10:48 AM</p>
                </div>
                <p className="text-sm mt-1">
                  Initial assessment completed. Patient reports pain level of 8/10, radiating to left arm. Administered
                  aspirin 325mg PO. IV access established, drawing labs.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button>Add Note</Button>
        </div>
      </TabsContent>
    </Tabs>
  )
}
