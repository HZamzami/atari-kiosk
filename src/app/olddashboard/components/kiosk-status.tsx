"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Settings,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export function KioskStatus() {
  const { toast } = useToast();
  const [status, setStatus] = useState<
    "online" | "offline" | "checking"
  >("checking");

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch("/api/ping", { method: "POST" });
        if (res.ok) {
          setStatus("online");
        } else {
          setStatus("offline");
        }
      } catch (error) {
        setStatus("offline");
      }
    };

    checkStatus();
  }, []);

  const handleKioskAction = (action: string) => {
    toast({
      title: `Kiosk - ${action}`,
      description: `The action has been initiated successfully.`,
    });
  };

  const statusIcon = {
    online: <CheckCircle className="h-5 w-5 text-green-600" />,
    offline: <XCircle className="h-5 w-5 text-red-600" />,
    checking: (
      <AlertCircle className="h-5 w-5 text-yellow-600 animate-pulse" />
    ),
  };

  const statusBg = {
    online: "bg-green-100",
    offline: "bg-red-100",
    checking: "bg-yellow-100",
  };

  return (
    <div className="grid grid-cols-1 gap-3">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="flex items-center p-4">
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center ${statusBg[status]}`}
            >
              {statusIcon[status]}
            </div>
            <div className="ml-4">
              <div className="font-medium">K-01</div>
              <div className="text-sm text-slate-500">
                Main Entrance
              </div>
              <div className="text-xs text-slate-400">
                Status: {status}
              </div>
            </div>
            <div className="ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <Settings className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => handleKioskAction("Refresh")}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleKioskAction("Restart")}
                  >
                    Restart
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleKioskAction("Maintenance")}
                  >
                    Schedule Maintenance
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
