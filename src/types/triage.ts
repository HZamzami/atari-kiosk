export type TriageType = {
  patient_id: string,
  session_id: number,
  assigned_lvl: number,
  algo_lvl: number,
  ml_lvl: number,
  justification: string
}