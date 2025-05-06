// apiService.ts

import axios from "axios";
import https from "https";
// Base URL from environment
const API_BASE_URL =
  process.env.NEXT_PUBLIC_DB_API_URL || "https://192.168.8.122:5050";

// const agent = new https.Agent({
//   rejectUnauthorized: false, // Disable SSL verification
// });

// Create axios instance with the https agent
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  //   httpsAgent: agent, // Add the agent to the axios configuration
});

// Type definitions based on backend models
export interface Patient {
  national_id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  phone: string;
  patient_id: string;
  birth_date: string;
  gender: string;
  address: string;
}

export interface Questionnaire {
  question_id: number;
  question: string;
  choices: string;
  active: boolean;
}

export interface Ctas {
  lvl: number;
  name: string;
  duration: number;
  zone_color: string;
}

export interface Clinic {
  room: string;
  queue: number;
  ctas_zone?: string;
}

export interface Session {
  session_id: number;
  start_time: string;
  end_time: string;
}

export interface VitalSigns {
  patient_id: string;
  session_id: number;
  respiratory_rate: number;
  oxygen_saturation: number;
  blood_pressure: string;
  heart_rate: number;
  body_temp: number;
}

export interface Triaged {
  patient_id: string;
  session_id: number;
  assigned_lvl: number;
  algo_lvl: number;
  ml_lvl: number;
  justification: string;
}

export interface Assigned {
  patient_id: string;
  session_id: number;
  room: string;
  waiting: number;
}

export interface Record {
  patient_id: string;
  session_id: number;
  question_id: number;
  answer: string;
}

export interface ErrorLog {
  error_id?: number;
  session_id: number;
  description: string;
  file_path: string;
}

export interface Employee {
  national_id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  office?: string;
}

export interface MedicalH {
  mhid: number;
  patient_id: string;
  condition: string;
  major_disease: boolean;
  treatment?: string;
}

export interface Absher {
  national_id: string;
  fingerprint: string;
}

// API service with all routes
const apiService = {
  // Patient routes
  patients: {
    create: (patient: Patient) => api.post("/patient", patient),
    getById: (patientId: string) =>
      api.get(`/patient?patient_id=${patientId}`),
    update: (patient: Patient) => api.put("/patient", patient),
    delete: (patientId: string) =>
      api.delete(`/patient?patient_id=${patientId}`),
    getAll: (limit: number = 20, offset: number = 0) =>
      api.get(`/patients?limit=${limit}&offset=${offset}`),
    search: (term: string) => api.get(`/patient/search?${term}`),
  },

  // Patient EHR routes
  patientEHR: {
    getByNationalId: (nationalId: string) =>
      api.get(`/patient_ehr?national_id=${nationalId}`),
  },

  // Questionnaire routes
  questionnaire: {
    create: (question: Questionnaire) =>
      api.post("/questionnaire", question),
    update: (question: Questionnaire) =>
      api.put("/questionnaire", question),
    delete: (questionId: number) =>
      api.delete(`/questionnaire?question_id=${questionId}`),
    getAll: () => api.get("/questionnaire"),
    toggleActive: (questionId: number, active: boolean) =>
      api.put(
        `/questionnaire/toggle?question_id=${questionId}&active=${active}`
      ),
  },

  // Absher routes
  absher: {
    getNationalId: (fingerprint: string) =>
      api.post("/absher", { fingerprint }),
  },

  // CTAS routes
  ctas: {
    getByLevel: (level: number) => api.get(`/ctas?lvl=${level}`),
    update: (ctas: Ctas) => api.put("/ctas", ctas),
    getAll: () => api.get("/ctas"),
  },

  // Clinic routes
  clinic: {
    create: (clinic: Clinic) => api.post("/clinic", clinic),
    getByRoom: (room: string) => api.get(`/clinic?room=${room}`),
    update: (clinic: Clinic) => api.put("/clinic", clinic),
    delete: (room: string) => api.delete(`/clinic?room=${room}`),
    getAll: () => api.get("/clinics"),
  },

  // Session routes
  session: {
    create: (session: Session) => api.post("/session", session),
    getByPatientId: (patientId: string) =>
      api.get(`/sessions/patient?patient_id=${patientId}`),
    getRecent: (limit: number = 20, offset: number = 0) =>
      api.get(`/sessions?limit=${limit}&offset=${offset}`),
  },

  // Vital Signs routes
  vitalSigns: {
    create: (vitalSigns: VitalSigns) =>
      api.post("/vital_signs", vitalSigns),
    getBySession: (patientId: string, sessionId: number) =>
      api.get(
        `/vital_signs?patient_id=${patientId}&session_id=${sessionId}`
      ),
  },

  // Triaged routes
  triaged: {
    create: (triaged: Triaged) => api.post("/triaged", triaged),
    getBySession: (patientId: string, sessionId: number) =>
      api.get(
        `/triaged?patient_id=${patientId}&session_id=${sessionId}`
      ),
  },

  // Assigned routes
  assigned: {
    create: (assigned: Assigned) => api.post("/assigned", assigned),
    getByRoom: (room: string) =>
      api.get(`/assigned/room?room=${room}`),
    getBySession: (patientId: string, sessionId: number) =>
      api.get(
        `/assigned?patient_id=${patientId}&session_id=${sessionId}`
      ),
  },

  // Record routes
  record: {
    create: (record: Record) => api.post("/record", record),
    createBatch: (records: Record[]) => api.post("/records", records),
    getBySession: (patientId: string, sessionId: number) =>
      api.get(
        `/record?patient_id=${patientId}&session_id=${sessionId}`
      ),
  },

  // Error Log routes
  errorLog: {
    create: (errorLog: ErrorLog) => api.post("/error_log", errorLog),
    getBySessionId: (sessionId: number) =>
      api.get(`/error_log/session?session_id=${sessionId}`),
    getRecent: (limit: number = 20, offset: number = 0) =>
      api.get(`/error_log?limit=${limit}&offset=${offset}`),
  },

  // Employee routes
  employee: {
    create: (employee: Employee) => api.post("/employee", employee),
    getByUsername: (username: string) =>
      api.get(`/employee?username=${username}`),
    update: (employee: Employee) => api.put("/employee", employee),
    delete: (username: string) =>
      api.delete(`/employee?username=${username}`),
  },

  // Medical History routes
  medicalHistory: {
    create: (medicalHistory: MedicalH) =>
      api.post("/medical_history", medicalHistory),
    getByPatient: (patientId: string) =>
      api.get(`/medical_history?patient_id=${patientId}`),
    update: (medicalHistory: MedicalH) =>
      api.put("/medical_history", medicalHistory),
    delete: (medicalHistoryId: number, patientId: string) =>
      api.delete(
        `/medical_history?mhid=${medicalHistoryId}&patient_id=${patientId}`
      ),
  },
};

export default apiService;
