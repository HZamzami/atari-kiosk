"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Update the mock historical data with Arabic names
const historicalRecords = [
  {
    id: "P-1001",
    date: "2023-04-22",
    time: "14:30",
    ctasScore: 2,
    chiefComplaint: "Chest pain",
    outcome: "Admitted",
    details:
      "54-year-old male with acute chest pain. ECG showed ST elevation. Admitted to cardiology.",
    name: "Mohammed Al-Otaibi",
  },
  {
    id: "P-1002",
    date: "2023-04-22",
    time: "15:45",
    ctasScore: 3,
    chiefComplaint: "Laceration",
    outcome: "Discharged",
    details:
      "23-year-old female with 4cm laceration on right forearm. Wound cleaned and sutured. Discharged with follow-up instructions.",
    name: "Yasmin Zamzami",
  },
  {
    id: "P-1003",
    date: "2023-04-22",
    time: "16:20",
    ctasScore: 4,
    chiefComplaint: "Sprained ankle",
    outcome: "Discharged",
    details:
      "35-year-old male with ankle sprain. X-ray negative for fracture. RICE instructions provided.",
    name: "Rayan Al-Suhaili",
  },
  {
    id: "P-1004",
    date: "2023-04-22",
    time: "17:10",
    ctasScore: 1,
    chiefComplaint: "Respiratory distress",
    outcome: "ICU",
    details:
      "78-year-old female with severe respiratory distress. History of COPD. Intubated and admitted to ICU.",
    name: "Aisha Al-Huthali",
  },
  {
    id: "P-1005",
    date: "2023-04-22",
    time: "18:05",
    ctasScore: 3,
    chiefComplaint: "Abdominal pain",
    outcome: "Admitted",
    details:
      "42-year-old female with acute abdominal pain. CT scan showed appendicitis. Admitted for appendectomy.",
    name: "Mariam Al-Amri",
  },
];

export function HistoricalRecords() {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  } | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const sortedRecords = [...historicalRecords].sort((a, b) => {
    if (!sortConfig) return 0;

    if (
      a[sortConfig.key as keyof typeof a] <
      b[sortConfig.key as keyof typeof b]
    ) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (
      a[sortConfig.key as keyof typeof a] >
      b[sortConfig.key as keyof typeof b]
    ) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (name: string) => {
    if (!sortConfig || sortConfig.key !== name) {
      return <ChevronDown className="ml-1 h-4 w-4 opacity-50" />;
    }
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="ml-1 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4" />
    );
  };

  const handleViewDetails = (record: any) => {
    setSelectedRecord(record);
    setDetailsOpen(true);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">
                <Button
                  variant="ghost"
                  className="p-0 font-medium flex items-center"
                  onClick={() => requestSort("id")}
                >
                  Patient ID
                  {getSortIcon("id")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="p-0 font-medium flex items-center"
                  onClick={() => requestSort("date")}
                >
                  Date
                  {getSortIcon("date")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="p-0 font-medium flex items-center"
                  onClick={() => requestSort("ctasScore")}
                >
                  CTAS
                  {getSortIcon("ctasScore")}
                </Button>
              </TableHead>
              <TableHead className="hidden md:table-cell">
                Chief Complaint
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="p-0 font-medium flex items-center"
                  onClick={() => requestSort("outcome")}
                >
                  Outcome
                  {getSortIcon("outcome")}
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">
                  {record.id}
                </TableCell>
                <TableCell>
                  {record.date} {record.time}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      record.ctasScore === 1
                        ? "destructive"
                        : record.ctasScore === 2
                        ? "destructive"
                        : record.ctasScore === 3
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {record.ctasScore}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {record.chiefComplaint}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      record.outcome === "Discharged"
                        ? "outline"
                        : record.outcome === "Admitted"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {record.outcome}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleViewDetails(record)}
                  >
                    <FileText className="h-4 w-4" />
                    <span className="sr-only">View details</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent>
          <DialogTitle>Patient Record Details</DialogTitle>
          <DialogDescription>
            {selectedRecord && (
              <div className="flex items-center gap-2 mt-1">
                <span>ID: {selectedRecord.id}</span>
                <span>Name: {selectedRecord.name}</span>
                <span>•</span>
                <span>{selectedRecord.date}</span>
              </div>
            )}
          </DialogDescription>
          {selectedRecord && (
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-500">
                    CTAS Score
                  </h3>
                  <Badge
                    variant={
                      selectedRecord.ctasScore <= 2
                        ? "destructive"
                        : selectedRecord.ctasScore === 3
                        ? "secondary"
                        : "outline"
                    }
                  >
                    Level {selectedRecord.ctasScore}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500">
                    Outcome
                  </h3>
                  <Badge
                    variant={
                      selectedRecord.outcome === "Discharged"
                        ? "outline"
                        : selectedRecord.outcome === "Admitted"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {selectedRecord.outcome}
                  </Badge>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-500">
                  Chief Complaint
                </h3>
                <p>{selectedRecord.chiefComplaint}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-500">
                  Clinical Notes
                </h3>
                <p className="text-sm">{selectedRecord.details}</p>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline">Print Record</Button>
                <Button>Export PDF</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
