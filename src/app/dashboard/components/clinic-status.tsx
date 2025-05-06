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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Clinic } from "@/app/api/dashboard/apiService";

interface ClinicStatusProps {
  clinics: Clinic[];
  loading: boolean;
}

export default function ClinicStatus({
  clinics,
  loading,
}: ClinicStatusProps) {
  // Function to get badge color based on CTAS zone
  const getZoneColor = (zone?: string) => {
    const normalizedZone =
      typeof zone === "string" ? zone.toLowerCase() : "";

    switch (normalizedZone) {
      case "red":
        return "bg-red-500";
      case "orange":
        return "bg-orange-500";
      case "yellow":
        return "bg-yellow-500";
      case "green":
        return "bg-green-500";
      case "blue":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  // Calculate clinic occupancy stats
  const calculateStats = () => {
    if (clinics.length === 0)
      return { total: 0, occupied: 0, waiting: 0 };

    const occupied = clinics.filter((c) => c.queue > 0).length;
    const waiting = clinics.reduce(
      (sum, clinic) => sum + clinic.queue,
      0
    );

    return {
      total: clinics.length,
      occupied,
      waiting,
    };
  };

  const stats = calculateStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Clinic Rooms</CardTitle>
          <CardDescription>Total available rooms</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-3xl font-bold">{stats.total}</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Occupied Rooms</CardTitle>
          <CardDescription>Rooms currently in use</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-3xl font-bold">{stats.occupied}</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Waiting Patients</CardTitle>
          <CardDescription>Total patients in queue</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-3xl font-bold">{stats.waiting}</div>
          )}
        </CardContent>
      </Card>

      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle>Clinic Room Status</CardTitle>
          <CardDescription>
            Current status of all clinic rooms
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
                  <TableHead>Room</TableHead>
                  <TableHead>Queue Size</TableHead>
                  <TableHead>CTAS Zone</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clinics.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No clinic rooms found
                    </TableCell>
                  </TableRow>
                ) : (
                  clinics.map((clinic) => (
                    <TableRow key={clinic.room}>
                      <TableCell className="font-medium">
                        {clinic.room}
                      </TableCell>
                      <TableCell>{clinic.queue}</TableCell>
                      <TableCell>
                        {clinic.ctas_zone ? (
                          <Badge
                            className={getZoneColor(clinic.ctas_zone)}
                          >
                            {clinic.ctas_zone}
                          </Badge>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            clinic.queue > 0 ? "default" : "outline"
                          }
                        >
                          {clinic.queue > 0
                            ? "Occupied"
                            : "Available"}
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
    </div>
  );
}
