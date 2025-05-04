"use client"

import { AlertCircle, CheckCircle, RefreshCw, Settings, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

// Mock kiosk data
const kiosks = [
  { id: "K-01", status: "active", lastActive: "2 min ago", location: "Main Entrance" },
  { id: "K-02", status: "active", lastActive: "Just now", location: "Main Entrance" },
  { id: "K-03", status: "idle", lastActive: "15 min ago", location: "Emergency Entrance" },
  { id: "K-04", status: "active", lastActive: "5 min ago", location: "Emergency Entrance" },
  { id: "K-05", status: "active", lastActive: "1 min ago", location: "Pediatric Wing" },
  { id: "K-06", status: "offline", lastActive: "2 hours ago", location: "Main Entrance" },
]

export function KioskStatus() {
  const { toast } = useToast()

  const handleKioskAction = (kioskId: string, action: string) => {
    toast({
      title: `Kiosk ${kioskId} - ${action}`,
      description: `The action has been initiated successfully.`,
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {kiosks.map((kiosk) => (
        <Card key={kiosk.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center p-4">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  kiosk.status === "active" ? "bg-green-100" : kiosk.status === "idle" ? "bg-yellow-100" : "bg-red-100"
                }`}
              >
                {kiosk.status === "active" ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : kiosk.status === "idle" ? (
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
              </div>
              <div className="ml-4">
                <div className="font-medium">{kiosk.id}</div>
                <div className="text-sm text-slate-500">{kiosk.location}</div>
                <div className="text-xs text-slate-400">Last active: {kiosk.lastActive}</div>
              </div>
              <div className="ml-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Settings className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleKioskAction(kiosk.id, "Refresh")}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Refresh
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleKioskAction(kiosk.id, "Restart")}>Restart</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleKioskAction(kiosk.id, "Maintenance")}>
                      Schedule Maintenance
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
