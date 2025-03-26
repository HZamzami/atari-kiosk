import React from "react";
import { DataTable } from "./components/table/data-table";
import { columns } from "./components/table/columns";
import { Patient } from "./components/type";
export default function page() {
  const patients: Patient[] = [
    {
      id: "1",
      name: "John Doe",
      gender: "m",
      age: 45,
      ctasLevel: 2,
      vitals: {
        heartRate: 78,
        bloodPressure: "120/80",
        temperature: 37.2,
        respiratoryRate: 14,
        oxygenSaturation: 98,
      },
      chiefComplaint: "Chest pain",
      arrivalTime: new Date().toISOString(),
      status: "Waiting",
    },
    {
      id: "2",
      name: "Jane Smith",
      gender: "f",
      age: 30,
      ctasLevel: 3,
      vitals: {
        heartRate: 85,
        bloodPressure: "110/75",
        temperature: 36.8,
        respiratoryRate: 15,
        oxygenSaturation: 97,
      },
      chiefComplaint: "Mild headache",
      arrivalTime: new Date().toISOString(),
      status: "In Progress",
    },
  ];
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={patients} />
    </div>
  );
}
