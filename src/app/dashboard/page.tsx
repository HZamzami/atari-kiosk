import React from "react";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardSidebar } from "./components/dashboard-sidebar";

export default function page() {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <div>
        <SidebarTrigger />
        hello
      </div>
    </SidebarProvider>
  );
}
