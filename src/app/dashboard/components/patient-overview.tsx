"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import type { Patient } from "@/app/api/dashboard/apiService";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface PatientOverviewProps {
  patients: Patient[];
  loading: boolean;
}

export default function PatientOverview({
  patients,
  loading,
}: PatientOverviewProps) {
  // Calculate age distribution for the chart
  const calculateAgeDistribution = () => {
    const ageGroups = {
      "0-18": 0,
      "19-35": 0,
      "36-50": 0,
      "51-65": 0,
      "65+": 0,
    };

    patients.forEach((patient) => {
      if (!patient.birth_date) return;

      const birthDate = new Date(patient.birth_date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();

      if (age <= 18) ageGroups["0-18"]++;
      else if (age <= 35) ageGroups["19-35"]++;
      else if (age <= 50) ageGroups["36-50"]++;
      else if (age <= 65) ageGroups["51-65"]++;
      else ageGroups["65+"]++;
    });

    return Object.entries(ageGroups).map(([range, count]) => ({
      range,
      count,
    }));
  };

  // Calculate patient visit frequency
  const calculateVisitFrequency = () => {
    const visitCounts = {
      "First Visit": 0,
      "2-3 Visits": 0,
      "4-5 Visits": 0,
      "6+ Visits": 0,
    };

    // Create a map to track the number of visits per national_id
    const visitFrequency = new Map();

    // Count the visits for each national_id
    patients.forEach((patient) => {
      const nationalId = patient.national_id;

      // Increment the visit count for this patient
      visitFrequency.set(
        nationalId,
        (visitFrequency.get(nationalId) || 0) + 1
      );
    });

    // Categorize patients by their visit frequency
    visitFrequency.forEach((count) => {
      if (count === 1) visitCounts["First Visit"]++;
      else if (count >= 2 && count <= 3) visitCounts["2-3 Visits"]++;
      else if (count >= 4 && count <= 5) visitCounts["4-5 Visits"]++;
      else if (count >= 6) visitCounts["6+ Visits"]++;
    });

    return Object.entries(visitCounts).map(([frequency, count]) => ({
      frequency,
      count,
    }));
  };

  const ageData = calculateAgeDistribution();
  const visitData = calculateVisitFrequency();

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Patient Age Distribution</CardTitle>
          <CardDescription>
            Breakdown of patients by age group
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-[200px] w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ageData}>
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* <Card>
        <CardHeader>
          <CardTitle>Patient Visit Frequency</CardTitle>
          <CardDescription>
            Number of visits per patient
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-[200px] w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={visitData}>
                <XAxis dataKey="frequency" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card> */}

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Recent Patients</CardTitle>
          <CardDescription>
            List of recently registered patients
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Contact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No patients found
                    </TableCell>
                  </TableRow>
                ) : (
                  patients.slice(0, 5).map((patient) => (
                    <TableRow key={patient.patient_id}>
                      <TableCell className="font-medium">
                        {patient.patient_id}
                      </TableCell>
                      <TableCell>{`${patient.first_name} ${patient.last_name}`}</TableCell>
                      <TableCell>
                        {patient.gender === "Male"
                          ? "Male"
                          : "Female"}
                      </TableCell>
                      <TableCell>
                        {patient.phone || patient.email}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
