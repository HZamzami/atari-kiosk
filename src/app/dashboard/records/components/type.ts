export type Patient = {
  id: string;
  name: string;
  age: number;
  gender: "m" | "f";
  ctasLevel: 1 | 2 | 3 | 4 | 5;
  vitals: {
    heartRate: number;
    bloodPressure: string;
    temperature: number;
    oxygenSaturation: number;
    respiratoryRate: number;
  };
  chiefComplaint: string;
  arrivalTime: string;
  status: "Waiting" | "In Progress" | "Completed";
};
