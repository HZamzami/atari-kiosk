import { ClinicType } from "@/types/clinic";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const headersList = req.headers;
  const referer = headersList.get("referer") || "";
  const isValidOrigin = referer.includes("localhost");

  if (!isValidOrigin) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 403 }
    );
  }

  try {
    const { action, session, patient_id, reasons, vitalSigns, triage, ctaslvl } = await req.json();
    let session_id: number;
    const server = process.env.DB_API_URL || "https://localhost:5050";
    if (action === "post_session") {
      if (!session) {
        return NextResponse.json(
        { error: "Missing session obj" },
        { status: 400 }
        );
      }
      const sessionIdResponse = fetch(`${server}/sessions?limit=1&offset=0`, {
        method: "GET",
      });
      session_id = (await (await sessionIdResponse).json())[0].session_id;
      session_id += 1;

      session.session_id = session_id;
      const response = await fetch(`${server}/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(session)
      });
      if (!response.ok) {
        const errorData = await response.text();
        return NextResponse.json(
          { error: errorData || "Failed to create" },
          { status: response.status }
        );
      }
      
      if (!session_id || !patient_id || !vitalSigns) {
        return NextResponse.json(
          { error: "Missing session_id, patient_id or vitalSigns" },
          { status: 400 }
        );
      }
      const vitalSignsData = {
          patient_id,
          session_id,
          ...vitalSigns,
      };
      const vitalSignsResponse = await fetch(`${server}/vital_signs`, {
          method: "POST",
          headers: {
          "Content-Type": "application/json"
          },
          body: JSON.stringify(vitalSignsData)
      });
      if (!vitalSignsResponse.ok) {
        const errorData = await vitalSignsResponse.text();
        return NextResponse.json(
          { error: errorData || "Failed to create" },
          { status: vitalSignsResponse.status }
        );
      }

      if (!patient_id || !session_id || !reasons || reasons.length === 0) {
        return NextResponse.json(
          { error: "Missing session_id, patient_id or reasons" },
          { status: 400 }
        );
      }
      const formattedReasons = reasons.map((reason: string) => {
        return {
          patient_id,
          session_id,
          question_id: 1, // no strict rule for now
          answer_id: reason
        };
      });
      const reasonsResponse = await fetch(`${server}/records`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formattedReasons)
      })
      if (!reasonsResponse.ok) {
        const errorData = await reasonsResponse.text();
        return NextResponse.json(
          { error: errorData || "Failed to create" },
          { status: reasonsResponse.status }
        );
      }
      
      if (!session_id || !patient_id || !triage) {
        return NextResponse.json(
          { error: "Missing session_id, patient_id or triage" },
          { status: 400 }
        );
      }
      triage.session_id = session_id;
      const triageResponse = await fetch(`${server}/triaged`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify(triage)
      });
      if (!triageResponse.ok) {
        const errorData = await triageResponse.text();
        return NextResponse.json(
          { error: errorData || "Failed to create" },
          { status: triageResponse.status }
        );
      }

      if (!session_id || !patient_id || !ctaslvl) {
        return NextResponse.json(
          { error: "Missing session_id, patient_id or CTAS level" },
          { status: 400 }
        );
      }
      const clinicsResponse = await fetch(`${server}/clinics`, {
        method: "GET"
      });
      if (!clinicsResponse.ok) {
        const errorData = await clinicsResponse.text();
        return NextResponse.json(
          { error: errorData || "Failed to fetch" },
          { status: clinicsResponse.status }
        );
      }
      const clinics = await clinicsResponse.json();
      
      let selectedClinic: ClinicType[] = [];
      if (clinics && clinics.length > 0) {
        selectedClinic = clinics.filter(
          (clinic: ClinicType) => clinic.ctas_zone === ctaslvl
        );
      }
      const clinic = selectedClinic.sort(
        (a: ClinicType, b: ClinicType) => a.queue - b.queue
      )[0];

      if (clinic != null) {
        const assigned = {
          session_id,
          patient_id,
          room: clinic.room
        };
        const assignmentResponse = await fetch(`${server}/assigned`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(assigned)
        });
        if (!assignmentResponse.ok) {
          const errorData = await assignmentResponse.text();
          return NextResponse.json(
            { error: errorData || "Failed to create" },
            { status: assignmentResponse.status }
          );
        }
        return NextResponse.json({
          clinic: clinic,
          assigned: assigned
        });
      }
  }

    else {
    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  }
  } catch (error) {
    console.error("Session processing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}