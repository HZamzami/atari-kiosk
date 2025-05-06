"use client";

import { useEffect, useState } from "react";
import apiService, {
  Patient,
  Session,
  Triaged,
  MedicalH,
  VitalSigns,
} from "@/app/api/dashboard/apiService";

const PatientsPage = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] =
    useState<Patient | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [triages, setTriages] = useState<Triaged[]>([]);
  const [medicalHistory, setMedicalHistory] = useState<MedicalH[]>(
    []
  );
  const [vitalSigns, setVitalSigns] = useState<VitalSigns[]>([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await apiService.patients.getAll(20, 0);
        setPatients(response.data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };
    fetchPatients();
  }, []);

  const fetchPatientDetails = async (patient: Patient) => {
    setSelectedPatient(patient);
    try {
      const [sessionsRes, historyRes] = await Promise.all([
        apiService.session.getByPatientId(patient.patient_id),
        apiService.medicalHistory.getByPatient(patient.patient_id),
      ]);

      setSessions(sessionsRes.data);
      setMedicalHistory(historyRes.data);

      if (sessionsRes.data.length > 0) {
        const triagePromises = sessionsRes.data.map(
          (session: Session) =>
            apiService.triaged.getBySession(
              patient.patient_id,
              session.session_id
            )
        );
        const vitalsPromises = sessionsRes.data.map(
          (session: Session) =>
            apiService.vitalSigns.getBySession(
              patient.patient_id,
              session.session_id
            )
        );

        const [triageResponses, vitalsResponses] = await Promise.all([
          Promise.all(triagePromises),
          Promise.all(vitalsPromises),
        ]);

        setTriages(triageResponses.flatMap((res) => res.data));
        setVitalSigns(vitalsResponses.flatMap((res) => res.data));
      } else {
        setTriages([]);
        setVitalSigns([]);
      }
    } catch (error) {
      console.error("Error fetching patient details:", error);
    }
  };

  return (
    <div className="flex h-screen p-6 space-x-6">
      {/* Sidebar: Patients List */}
      <div className="w-1/3 bg-gray-100 rounded-lg shadow p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Patients</h2>
        <ul className="space-y-2">
          {patients.map((patient) => (
            <li
              key={patient.patient_id}
              className="p-2 bg-white rounded shadow cursor-pointer hover:bg-blue-100"
              onClick={() => fetchPatientDetails(patient)}
            >
              <div className="font-medium">
                {patient.first_name} {patient.last_name}
              </div>
              <div className="text-sm text-gray-600">
                {patient.email}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Details: Selected Patient Info */}
      <div className="w-2/3 bg-white rounded-lg shadow p-6 overflow-y-auto">
        {selectedPatient ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Patient Details
            </h2>

            {/* Basic Info */}
            <section className="mb-6">
              <h3 className="text-lg font-semibold mb-2">
                Personal Information
              </h3>
              <div className="space-y-1 text-gray-700">
                <div>
                  <strong>ID:</strong> {selectedPatient.patient_id}
                </div>
                <div>
                  <strong>Name:</strong> {selectedPatient.first_name}{" "}
                  {selectedPatient.middle_name}{" "}
                  {selectedPatient.last_name}
                </div>
                <div>
                  <strong>Gender:</strong> {selectedPatient.gender}
                </div>
                <div>
                  <strong>Birth Date:</strong>{" "}
                  {selectedPatient.birth_date}
                </div>
                <div>
                  <strong>Email:</strong> {selectedPatient.email}
                </div>
                <div>
                  <strong>Phone:</strong> {selectedPatient.phone}
                </div>
                <div>
                  <strong>Address:</strong> {selectedPatient.address}
                </div>
              </div>
            </section>

            {/* Sessions */}
            <section className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Sessions</h3>
              {sessions.length > 0 ? (
                <ul className="list-disc pl-5">
                  {sessions.map((s) => (
                    <li key={s.session_id}>
                      Session #{s.session_id} | Start: {s.start_time}{" "}
                      | End: {s.end_time}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No sessions found.</p>
              )}
            </section>

            {/* Triage */}
            <section className="mb-6">
              <h3 className="text-lg font-semibold mb-2">
                Triage Records
              </h3>
              {triages.length > 0 ? (
                <ul className="list-disc pl-5">
                  {triages.map((t, index) => (
                    <li key={index}>
                      Session #{t.session_id} | Assigned:{" "}
                      {t.assigned_lvl} | ML: {t.ml_lvl} |
                      Justification: {t.justification}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No triage records found.</p>
              )}
            </section>

            {/* Vital Signs */}
            <section className="mb-6">
              <h3 className="text-lg font-semibold mb-2">
                Vital Signs
              </h3>
              {vitalSigns.length > 0 ? (
                <ul className="list-disc pl-5">
                  {vitalSigns.map((v, index) => (
                    <li key={index}>
                      Session #{v.session_id} | HR: {v.heart_rate} bpm
                      | BP: {v.blood_pressure} | Temp: {v.body_temp}°C
                      | RR: {v.respiratory_rate} | O₂:{" "}
                      {v.oxygen_saturation}%
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No vital signs found.</p>
              )}
            </section>

            {/* Medical History */}
            <section>
              <h3 className="text-lg font-semibold mb-2">
                Medical History
              </h3>
              {medicalHistory.length > 0 ? (
                <ul className="list-disc pl-5">
                  {medicalHistory.map((mh) => (
                    <li key={mh.mhid}>
                      Condition: {mh.condition} | Major:{" "}
                      {mh.major_disease ? "Yes" : "No"} | Treatment:{" "}
                      {mh.treatment || "N/A"}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No medical history found.</p>
              )}
            </section>
          </div>
        ) : (
          <p>Select a patient to view details.</p>
        )}
      </div>
    </div>
  );
};

export default PatientsPage;
