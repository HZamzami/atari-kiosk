import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const headersList = request.headers;
  const referer = headersList.get("referer") || "";
  const isValidOrigin = referer.includes("localhost");

  if (!isValidOrigin) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 403 }
    );
  }
  try {
    const { template, isGuest, guest } = await request.json();
    const absher = {
      national_id: "**********",  // KEEP IT
      fingerprint: template
    };
    const server = process.env.DB_API_URL || "https://localhost:5050";
    console.log(isGuest)
    if (!isGuest) {
      if (!template) {
        return NextResponse.json(
          {
            verified: false,
            message: "No fingerprint template provided"
          },
          { status: 400 }
        );
      }

      const nationalIDResponse = await fetch(server + "/absher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify( absher )
      });

      if (!nationalIDResponse.ok) {
        const errorData = await nationalIDResponse.text();
        return NextResponse.json(
          {
            verified: false,
            message:
              JSON.stringify(errorData) || "Verification service error"
          },
          { status: nationalIDResponse.status }
        );
      }

      const nationalID = await nationalIDResponse.json();

      const patientDataEHRResponse = await fetch(
        server + "/patients_ehr?national_id=" + nationalID.national_id,
        {
          method: "GET"
        }
      );

      if (!patientDataEHRResponse.ok) {
        const errorData = await patientDataEHRResponse.text();
        return NextResponse.json(
          {
            verified: false,
            message: JSON.stringify(errorData) || "EHR service error"
          },
          { status: patientDataEHRResponse.status }
        );
      }

      const patientData = await patientDataEHRResponse.json();

      const patientDataResponse = await fetch(
        server +
          "/patients/patient?patient_id=" +
          patientData.patient_id,
        {
          method: "GET"
        }
      );
  
      if (!patientDataResponse.ok) {
        const createLocalPatientResponse = await fetch(
          server + "/patients",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify( patientData )
          }
        );
  
        if (!createLocalPatientResponse.ok) {
          const errorData = await createLocalPatientResponse.text();
          return NextResponse.json(
            {
              verified: false,
              message:
                JSON.stringify(errorData) || "Local service error"
            },
            { status: createLocalPatientResponse.status }
          );
        }
      }
  
      const patient = await patientDataResponse.json();
  
      const medicalHistoryResponse = await fetch(
        server +
          "/medical_history?patient_id=" +
          patientData.patient_id,
        {
          method: "GET"
        }
      );
  
      const medical_history = (!medicalHistoryResponse.ok) ? [] : await medicalHistoryResponse.json();
  
      return NextResponse.json({
        verified: true,
        patientData: patient,
        medicalHistory: medical_history,
        message: "Fingerprint verified successfully"
      });

    } else {
      const UpdateGuestPatientResponse = await fetch(
        server + "patients/patient",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify( guest )
        }
      );

      if (!UpdateGuestPatientResponse.ok) {
        const errorData = await UpdateGuestPatientResponse.text();
        return NextResponse.json(
          {
            verified: false,
            message:
              JSON.stringify(errorData) || "Local service error"
          },
          { status: UpdateGuestPatientResponse.status }
        );
      }

      const patientDataResponse = await fetch(
        server +
          "/patients/patient?patient_id=" +
          guest.patient_id,
        {
          method: "GET"
        }
      );
      if (!patientDataResponse.ok) {
        const errorData = await patientDataResponse.text();
        return NextResponse.json(
          {
            verified: false,
            message:
              JSON.stringify(errorData) || "Local service error"
          },
          { status: patientDataResponse.status }
        );
      }

      const patient = await patientDataResponse.json();

      const medicalHistoryResponse = await fetch(
        server +
          "/medical_history?patient_id=" +
          patient.patient_id,
        {
          method: "GET"
        }
      );

      const medical_history = (!medicalHistoryResponse.ok) ? [] : await medicalHistoryResponse.json();

      return NextResponse.json({
        verified: true,
        patientData: patient,
        medicalHistory: medical_history,
        message: "Fingerprint verified successfully"
      });
  }
  } catch (error) {
    console.error("Fingerprint verification error:", error);
    return NextResponse.json(
      { verified: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
