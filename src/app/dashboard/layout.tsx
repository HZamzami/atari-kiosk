import React from "react";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardSidebar } from "./components/dashboard-sidebar";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex">
        <DashboardSidebar />
        <div className="flex-1">
          <SidebarTrigger />
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
