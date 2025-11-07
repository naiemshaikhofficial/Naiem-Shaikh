import { NextResponse } from "next/server";
import * as jose from "jose";

const COOKIE_SECRET = process.env.COOKIE_SECRET!;

async function verifyToken(token: string) {
  try {
    const { payload } = await jose.jwtVerify(token, new TextEncoder().encode(COOKIE_SECRET));
    return payload;
  } catch (err) {
    console.error("JWT verification failed:", err);
    return null;
  }
}

export async function GET(req: Request) {
  try {
    // Read cookies properly using Next.js API
    const cookieHeader = req.headers.get("cookie") ?? "";
    const match = cookieHeader.match(/session_token=([^;]+)/);
    const token = match?.[1];

    if (!token) {
      console.log("⚠️ No session_token cookie found");
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const user = await verifyToken(token);
    if (!user) {
      console.log("⚠️ Invalid or expired session token");
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // ✅ Success
    console.log("✅ Session restored for:", user.email);
    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    console.error("🔥 /api/auth/session error:", err);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
