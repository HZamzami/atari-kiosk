"use client";

import { useEffect, useState } from "react";
import apiService, { Clinic } from "@/app/api/dashboard/apiService";

export function RoomAssignment() {
  const [clinics, setClinics] = useState<Clinic[]>([]);

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const response = await apiService.clinic.getAll();
        setClinics(response.data);
      } catch (error) {
        console.error("Failed to fetch clinics", error);
      }
    };

    fetchClinics();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-2">
      {clinics.map((clinic) => (
        <div
          key={clinic.room}
          className="aspect-square rounded-md border bg-gray-50 flex items-center justify-center p-2 text-sm font-medium"
        >
          {clinic.room}
        </div>
      ))}
    </div>
  );
}
