import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

function normalizeIP(ip: string): string {
    if (ip.startsWith("::ffff:")) {
        return ip.substring(7);
    }
    return ip;
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  if (path.startsWith("/kiosk")) {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = normalizeIP(forwardedFor ? forwardedFor.split(",")[0].trim() : request.headers.get("x-real-ip") || "unknown");
    console.log(ip);
    
    const allowedIPs = (process.env.ALLOWED_KIOSK_IPS || "::1,127.0.0.1").split(",");
    
    if (!allowedIPs.includes(ip)) {
      return NextResponse.json(
        { error: "Access restricted to authorized devices" },
        { status: 403 }
      );
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/kiosk/:path*"],
};
