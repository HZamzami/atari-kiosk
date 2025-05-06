// types.ts

// Basic query types
export interface PatientQuery {
  patient_id: string;
}

export interface RoomQuery {
  room: string;
}

export interface NationalQuery {
  national_id: string;
}

export interface LimitOffsetQuery {
  limit: number;
  offset: number;
}

export interface SessionQuery {
  session_id: number;
}

export interface PatientSessionQuery {
  patient_id: string;
  session_id: number;
}

export interface LevelQuery {
  lvl: number;
}

export interface MedicalHQuery {
  mhid: number;
  patient_id: string;
}

// Model interfaces
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

export interface Clinic {
  room: string;
  queue: number;
}

export interface Assigned {
  patient_id: string;
  session_id: number;
  room: string;
  waiting: number;
}

export interface Ctas {
  lvl: number;
  name: string;
  duration: number;
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

export interface Absher {
  national_id: string;
  fingerprint: string;
}

export interface Fingerprint {
  fingerprint: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
