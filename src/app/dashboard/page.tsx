"use client";

import { useState } from "react";
import {
  Activity,
  Bell,
  Calendar,
  ChevronDown,
  Clock,
  Filter,
  History,
  Home,
  Laptop,
  LayoutDashboard,
  MapPin,
  Menu,
  RefreshCw,
  Search,
  Settings,
  Users,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { PatientDetails } from "./components/patient-details";
import { RoomAssignment } from "./components/room-assignment";
import { HistoricalRecords } from "./components/historical-records";
import { KioskStatus } from "./components/kiosk-status";
import { PatientList } from "./components/patient-list";

// Define the Patient type
interface Patient {
  id: string;
  name: string;
  ctasScore: number;
  // Add other patient properties as needed
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] =
    useState<Patient | null>(null);
  const [patientDetailsOpen, setPatientDetailsOpen] = useState(false);
  const { toast } = useToast();

  const handlePatientClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setPatientDetailsOpen(true);
  };

  const handleRefreshDashboard = () => {
    toast({
      title: "Dashboard Refreshed",
      description:
        "All data has been updated to the latest information.",
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:flex",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center h-16 px-4 border-b border-slate-200">
            <div className="flex items-center gap-2 font-semibold text-slate-900">
              <Activity className="h-6 w-6 text-blue-600" />
              <span>ATARI</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close sidebar</span>
            </Button>
          </div>
          <nav className="flex-1 overflow-auto py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-slate-500">
                Overview
              </h2>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 font-normal"
                >
                  <Home className="h-4 w-4" />
                  Home
                </Button>
                <Button
                  variant="secondary"
                  className="w-full justify-start gap-2 font-normal"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 font-normal"
                >
                  <Bell className="h-4 w-4" />
                  Alerts
                </Button>
              </div>
            </div>
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-slate-500">
                Management
              </h2>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 font-normal"
                >
                  <Users className="h-4 w-4" />
                  Patients
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 font-normal"
                >
                  <Laptop className="h-4 w-4" />
                  Kiosks
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 font-normal"
                >
                  <MapPin className="h-4 w-4" />
                  Rooms
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 font-normal"
                >
                  <History className="h-4 w-4" />
                  History
                </Button>
              </div>
            </div>
          </nav>
          <div className="border-t border-slate-200 p-4">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 font-normal"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <h1 className="text-lg font-semibold">
            Emergency Department Triage
          </h1>
          <div className="relative ml-auto flex items-center gap-4">
            <div className="relative hidden md:flex">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="search"
                placeholder="Search patients..."
                className="w-64 pl-8 bg-slate-50 border-slate-200"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={handleRefreshDashboard}
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                >
                  <img
                    src="/placeholder-user.jpg"
                    alt="User"
                    className="rounded-full"
                    width="32"
                    height="32"
                  />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-4 md:p-6 space-y-6">
            {/* Dashboard header with stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Patients
                  </CardTitle>
                  <Users className="h-4 w-4 text-slate-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-slate-500">
                    6 in critical condition
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Average Wait Time
                  </CardTitle>
                  <Clock className="h-4 w-4 text-slate-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">37 min</div>
                  <p className="text-xs text-slate-500">
                    ↑ 12% from last hour
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Available Rooms
                  </CardTitle>
                  <MapPin className="h-4 w-4 text-slate-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8/20</div>
                  <p className="text-xs text-slate-500">
                    3 rooms being cleaned
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Kiosks
                  </CardTitle>
                  <Laptop className="h-4 w-4 text-slate-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5/6</div>
                  <p className="text-xs text-slate-500">
                    1 kiosk in maintenance
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Main dashboard sections */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Patient list */}
              <Card className="md:col-span-1 lg:col-span-1">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Patients</CardTitle>
                    <CardDescription>
                      Current patients in triage
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Filter className="h-4 w-4" />
                        <span className="sr-only">
                          Filter patients
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>CTAS Score</DropdownMenuItem>
                      <DropdownMenuItem>Wait Time</DropdownMenuItem>
                      <DropdownMenuItem>
                        Chief Complaint
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent className="p-0">
                  <PatientList onPatientClick={handlePatientClick} />
                </CardContent>
              </Card>

              {/* Room assignment */}
              <Card className="md:col-span-1 lg:col-span-1">
                <CardHeader>
                  <CardTitle>Room Assignment</CardTitle>
                  <CardDescription>
                    Current room and bed status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RoomAssignment />
                </CardContent>
              </Card>

              {/* Kiosk status */}
              <Card className="md:col-span-2 lg:col-span-1">
                <CardHeader>
                  <CardTitle>Kiosk Status</CardTitle>
                  <CardDescription>
                    Self-registration kiosk status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <KioskStatus />
                </CardContent>
              </Card>
            </div>

            {/* Historical records */}
            <Card>
              <CardHeader>
                <CardTitle>Historical Records</CardTitle>
                <CardDescription>
                  Previous triage cases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                    <Input
                      type="search"
                      placeholder="Search records..."
                      className="pl-8 bg-white"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Date Range</span>
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                  >
                    <Filter className="h-4 w-4" />
                    <span>Filters</span>
                  </Button>
                </div>
                <HistoricalRecords />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Patient details sheet */}
      <Sheet
        open={patientDetailsOpen}
        onOpenChange={setPatientDetailsOpen}
      >
        <SheetContent className="w-full sm:max-w-xl overflow-auto">
          <SheetHeader className="mb-4">
            <SheetTitle>Patient Details</SheetTitle>
            <SheetDescription>
              {selectedPatient && (
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant={
                      selectedPatient.ctasScore <= 2
                        ? "destructive"
                        : selectedPatient.ctasScore === 3
                        ? "secondary"
                        : "outline"
                    }
                  >
                    CTAS {selectedPatient.ctasScore}
                  </Badge>
                  <span className="text-sm text-slate-500">
                    ID: {selectedPatient.id}
                  </span>
                </div>
              )}
            </SheetDescription>
          </SheetHeader>
          {selectedPatient && (
            <PatientDetails patient={selectedPatient} />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
