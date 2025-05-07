"use client";

import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Patient, Session } from "@/app/api/dashboard/apiService";

interface RecentSessionsProps {
  sessions: Session[];
  patients: Patient[];
  loading: boolean;
}

export default function RecentSessions({
  sessions,
  patients,
  loading,
}: RecentSessionsProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Calculate session duration in minutes
  const calculateDuration = (
    startTime: string,
    endTime: string | null
  ) => {
    if (!endTime) return "In progress";

    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end.getTime() - start.getTime();
    const durationMinutes = Math.floor(durationMs / (1000 * 60));

    if (durationMinutes < 60) {
      return `${durationMinutes} min`;
    } else {
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;
      return `${hours}h ${minutes}m`;
    }
  };

  // Find patient name by patient_id
  const getPatientName = (patientId: string) => {
    const patient = patients.find((p) => p.patient_id === patientId);
    return patient
      ? `${patient.first_name} ${patient.last_name}`
      : "Unknown";
  };

  // Filter sessions based on search term
  const filteredSessions = sessions.filter((session) => {
    // For demo purposes, we'll just search by session_id
    return session.session_id.toString().includes(searchTerm);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Sessions</CardTitle>
        <CardDescription>
          Latest patient sessions in the system
        </CardDescription>
        <div className="flex w-full max-w-sm items-center space-x-2 mt-2">
          <Input
            placeholder="Search by session ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button type="submit" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
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
                <TableHead>Session ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSessions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No sessions found
                  </TableCell>
                </TableRow>
              ) : (
                filteredSessions.map((session) => (
                  <TableRow key={session.session_id}>
                    <TableCell className="font-medium">
                      {session.session_id}
                    </TableCell>
                    <TableCell>
                      {getPatientName("P00" + session.session_id)}
                    </TableCell>
                    <TableCell>
                      {formatDate(session.start_time)}
                    </TableCell>
                    <TableCell>
                      {calculateDuration(
                        session.start_time,
                        session.end_time
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          session.end_time ? "outline" : "default"
                        }
                      >
                        {session.end_time ? "Completed" : "Active"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
