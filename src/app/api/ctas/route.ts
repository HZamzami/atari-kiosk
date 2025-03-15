import { NextRequest, NextResponse } from "next/server";
import { Groq } from "groq-sdk";
export async function POST(req: NextRequest) {
  try {
    const { vitalSigns, reason } = await req.json();

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const prompt = `
    You are a medical triage expert specializing in the Canadian Triage and Acuity Scale (CTAS). Your task is to evaluate patient data and assign the appropriate CTAS level with supporting reasoning. Assume patient is an adult. Follow these steps carefully:

    1. Analyze the vital signs in comparison to standard clinical thresholds:
       * Heart Rate: ${vitalSigns.heartRate} bpm
       * Blood Pressure: ${vitalSigns.bloodPressure} mmHg
       * Temperature: ${vitalSigns.temperature} °C
       * Respiratory Rate: ${vitalSigns.respiratoryRate} breaths/min
       * Oxygen Saturation: ${vitalSigns.oxygenSaturation}%

    2. Review the patient's chief complaint: "${reason}"

    3. Consider each factor in the context of the patient's overall health, working through your clinical reasoning step by step:
       * Identify any abnormal vital signs that indicate an immediate risk
       * Consider the urgency of the chief complaint, especially if it suggests life-threatening conditions
       * Evaluate the relationship between vital signs and the complaint
       * Assess potential for rapid deterioration, and whether immediate intervention is warranted

    4. Based on the data, assign the appropriate CTAS level:
       * CTAS 1: Resuscitation - Requires immediate life-saving intervention
       * CTAS 2: Emergent - High risk of deterioration, requires rapid medical intervention
       * CTAS 3: Urgent - Serious but stable, treatment within 30 minutes
       * CTAS 4: Less Urgent - Requires intervention but can wait 1-2 hours
       * CTAS 5: Non-Urgent - Minimal risk, can wait 2+ hours

    Provide your assessment in this structured JSON format:
    {
      "ctasLevel": number,
      "clinicalReasoning": "Detailed explanation of your decision-making process",
      "keyFactors": ["list of critical factors influencing the CTAS level"],
      "recommendedActions": ["next steps or immediate interventions based on CTAS level"]
    }
    `;

    const response = await groq.chat.completions.create({
      model: "deepseek-r1-distill-llama-70b",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
      max_tokens: 4096,
      top_p: 1.0,
    });

    const contentStr =
      response.choices[0]?.message?.content?.trim() || "";

    try {
      const jsonMatch = contentStr.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        const resultJson = JSON.parse(jsonMatch[0]);
        return NextResponse.json(resultJson);
      } else {
        return NextResponse.json({
          ctasLevel: 4,
          clinicalReasoning: "Failed to parse LLM response",
          keyFactors: ["Response parsing error"],
          recommendedActions: ["Manually review patient data"],
        });
      }
    } catch (parseError) {
      console.error("Error parsing LLM response:", parseError);
      return NextResponse.json({
        ctasLevel: 4,
        clinicalReasoning: "Error in AI processing",
        keyFactors: ["AI response processing error"],
        recommendedActions: ["Manually review patient data"],
      });
    }
  } catch (error) {
    console.error("CTAS classification error:", error);
    return NextResponse.json(
      {
        ctasLevel: 4,
        clinicalReasoning: "System error occurred",
        keyFactors: ["API processing error"],
        recommendedActions: ["Manually review patient data"],
      },
      { status: 500 }
    );
  }
}
