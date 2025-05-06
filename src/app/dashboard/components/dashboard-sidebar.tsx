import React, { useState } from "react";
import {
  Activity,
  Bell,
  History,
  Home,
  Laptop,
  LayoutDashboard,
  MapPin,
  Settings,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

interface DashboardSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: SetState<boolean>;
}

export default function DashboardSidebar({
  sidebarOpen,
  setSidebarOpen,
}: DashboardSidebarProps) {
  return (
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
  );
}
