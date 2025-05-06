"use client"

import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Update the room data to include Arabic names for the patients
const rooms = [
  { id: "ER-01", status: "occupied", patient: "P-1026", type: "Trauma", patientName: "Abdullah Al-Qahtani" },
  { id: "ER-02", status: "cleaning", patient: null, type: "Standard" },
  { id: "ER-03", status: "available", patient: null, type: "Standard" },
  { id: "ER-04", status: "occupied", patient: "P-1024", type: "Cardiac", patientName: "Khalid Al-Ghanem" },
  { id: "ER-05", status: "available", patient: null, type: "Standard" },
  { id: "ER-06", status: "maintenance", patient: null, type: "Isolation" },
  { id: "ER-07", status: "occupied", patient: "P-1029", type: "Standard", patientName: "Noura Al-Ghamdi" },
  { id: "ER-08", status: "available", patient: null, type: "Standard" },
  { id: "ER-09", status: "occupied", patient: "P-1031", type: "Pediatric", patientName: "Aya Al-Suhaili" },
  { id: "ER-10", status: "available", patient: null, type: "Standard" },
  { id: "ER-11", status: "occupied", patient: "P-1032", type: "Standard", patientName: "Salem Zamzami" },
  { id: "ER-12", status: "available", patient: null, type: "Standard" },
]

export function RoomAssignment() {
  return (
    <div className="grid grid-cols-3 gap-2">
      <TooltipProvider>
        {rooms.map((room) => (
          <Tooltip key={room.id}>
            <TooltipTrigger asChild>
              <div
                className={`aspect-square rounded-md border flex flex-col items-center justify-center p-2 cursor-pointer
                  ${
                    room.status === "occupied"
                      ? "bg-blue-50 border-blue-200"
                      : room.status === "cleaning"
                        ? "bg-yellow-50 border-yellow-200"
                        : room.status === "maintenance"
                          ? "bg-red-50 border-red-200"
                          : "bg-green-50 border-green-200"
                  }`}
              >
                <div className="text-sm font-medium">{room.id}</div>
                <div className="mt-1">
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      room.status === "occupied"
                        ? "bg-blue-100 text-blue-800"
                        : room.status === "cleaning"
                          ? "bg-yellow-100 text-yellow-800"
                          : room.status === "maintenance"
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                    }`}
                  >
                    {room.status === "occupied"
                      ? "Occupied"
                      : room.status === "cleaning"
                        ? "Cleaning"
                        : room.status === "maintenance"
                          ? "Maintenance"
                          : "Available"}
                  </Badge>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-sm">
                <p className="font-medium">
                  {room.id} - {room.type}
                </p>
                {room.patient ? <p>Patient: {room.patientName || room.patient}</p> : <p>No patient assigned</p>}
                <p className="capitalize">{room.status}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>

      <div className="col-span-3 mt-4">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs">Available (5)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs">Occupied (5)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-xs">Cleaning (1)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-xs">Maintenance (1)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
