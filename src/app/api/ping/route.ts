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
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("Internal server error:", error);
    return NextResponse.json(
      { verified: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
