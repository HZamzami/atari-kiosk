"use client";

import { useEffect, useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  Users,
  Activity,
  Clock,
  Clipboard,
} from "lucide-react";

import PatientOverview from "./patient-overview";
import ClinicStatus from "./clinic-status";
import TriageDistribution from "./triage-distribution";
import RecentSessions from "./recent-sessions";
import apiService, {
  Patient,
  Clinic,
  Session,
  Triaged,
} from "@/app/api/dashboard/apiService";

export default function Dashboard() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [triaged, setTriaged] = useState<Triaged[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch data in parallel
        const [patientsRes, clinicsRes, sessionsRes, ctasRes] =
          await Promise.all([
            apiService.patients.getAll(1000, 0),
            apiService.clinic.getAll(),
            apiService.session.getRecent(10, 0),
            apiService.ctas.getAll(),
          ]);

        setPatients(patientsRes.data || []);
        setClinics(clinicsRes.data || []);
        setSessions(sessionsRes.data || []);

        // For demo purposes, create some mock triaged data
        const mockTriaged: Triaged[] = [
          {
            patient_id: "P001",
            session_id: 1,
            assigned_lvl: 1,
            algo_lvl: 1,
            ml_lvl: 1,
            justification: "Critical condition",
          },
          {
            patient_id: "P002",
            session_id: 2,
            assigned_lvl: 2,
            algo_lvl: 2,
            ml_lvl: 2,
            justification: "Urgent care needed",
          },
          {
            patient_id: "P003",
            session_id: 3,
            assigned_lvl: 3,
            algo_lvl: 3,
            ml_lvl: 3,
            justification: "Semi-urgent",
          },
          {
            patient_id: "P004",
            session_id: 4,
            assigned_lvl: 4,
            algo_lvl: 4,
            ml_lvl: 4,
            justification: "Standard care",
          },
          {
            patient_id: "P005",
            session_id: 5,
            assigned_lvl: 5,
            algo_lvl: 5,
            ml_lvl: 5,
            justification: "Non-urgent",
          },
        ];
        setTriaged(mockTriaged);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(
          "Failed to load dashboard data. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Healthcare Dashboard
        </h1>
        <p className="text-muted-foreground">
          Monitor patient flow, clinic status, and triage distribution
          in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashboardCard
          title="Total Patients"
          value={loading ? "—" : patients.length.toString()}
          description="Registered in system"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          loading={loading}
        />
        <DashboardCard
          title="Active Clinics"
          value={loading ? "—" : clinics.length.toString()}
          description="Currently operating"
          icon={
            <Activity className="h-4 w-4 text-muted-foreground" />
          }
          loading={loading}
        />
        <DashboardCard
          title="Recent Sessions"
          value={loading ? "—" : sessions.length.toString()}
          description="In the last 24 hours"
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
          loading={loading}
        />
        {/* <DashboardCard
          title="Critical Cases"
          value={
            loading
              ? "—"
              : triaged
                  .filter((t) => t.assigned_lvl === 1)
                  .length.toString()
          }
          description="CTAS Level 1"
          icon={
            <Clipboard className="h-4 w-4 text-muted-foreground" />
          }
          loading={loading}
          highlight
        /> */}
      </div>

      <Tabs defaultValue="overview" className="space-y-4 w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="clinics">Clinics</TabsTrigger>
          <TabsTrigger value="triage">Triage</TabsTrigger>
          {/* <TabsTrigger value="sessions">Sessions</TabsTrigger> */}
        </TabsList>

        <TabsContent value="overview" className="space-y-4 w-full">
          <PatientOverview patients={patients} loading={loading} />
        </TabsContent>

        <TabsContent value="clinics" className="space-y-4 w-full">
          <ClinicStatus clinics={clinics} loading={loading} />
        </TabsContent>

        <TabsContent value="triage" className="space-y-4 w-full">
          <TriageDistribution triaged={triaged} loading={loading} />
        </TabsContent>

        {/* <TabsContent value="sessions" className="space-y-4 w-full">
          <RecentSessions
            sessions={sessions}
            patients={patients}
            loading={loading}
          />
        </TabsContent> */}
      </Tabs>
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  loading: boolean;
  highlight?: boolean;
}

function DashboardCard({
  title,
  value,
  description,
  icon,
  loading,
  highlight,
}: DashboardCardProps) {
  return (
    <Card className={highlight ? "border-red-500" : ""}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
            {highlight && value !== "0" && (
              <Badge className="mt-2 bg-red-500">
                Attention Required
              </Badge>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
