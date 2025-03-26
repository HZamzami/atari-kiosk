"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Patient } from "../type";

export const columns: ColumnDef<Patient>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "chiefComplaint",
    header: "Chief Complaint",
  },

  {
    accessorKey: "vitals.heartRate",
    header: "HR (bpm)",
  },
  {
    accessorKey: "vitals.bloodPressure",
    header: "BP (mmHg)",
  },
  {
    accessorKey: "vitals.temperature",
    header: "T (°C)",
  },
  {
    accessorKey: "vitals.oxygenSaturation",
    header: "SpO₂ (%)",
  },
  {
    accessorKey: "vitals.respiratoryRate",
    header: "RR (br/min)",
  },
  {
    accessorKey: "ctasLevel",
    header: "CTAS",
  },
];
