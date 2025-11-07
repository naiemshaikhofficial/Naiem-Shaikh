import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import * as jose from "jose";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const COOKIE_SECRET = process.env.COOKIE_SECRET!;

if (!COOKIE_SECRET) throw new Error("Missing COOKIE_SECRET");

const supabase = createClient(supabaseUrl, supabaseServiceRole);

// Helper: create JWT
async function createToken(payload: object) {
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(new TextEncoder().encode(COOKIE_SECRET));
}

export async function POST(req: Request) {
  try {
    const { email, password, username, phone } = await req.json();

    if (!email || !password || !username) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase();

    // ✅ Check OTP verification
    const { data: otpVerified } = await supabase
      .from("otp_verifications")
      .select("verified")
      .eq("email", normalizedEmail)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!otpVerified || !otpVerified.verified) {
      return NextResponse.json({ error: "Please verify your email first" }, { status: 400 });
    }

    // 🔍 Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // 🔑 Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // 👤 Insert new user
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([{ email: normalizedEmail, username, phone, password_hash }])
      .select()
      .single();

    if (insertError || !newUser) {
      return NextResponse.json({ error: "Signup failed" }, { status: 500 });
    }

    // ✅ Create JWT
    const token = await createToken({ id: newUser.id, email: newUser.email });

    const response = NextResponse.json({ user: newUser, message: "Signup successful" });
    response.cookies.set({
      name: "session_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("🔥 Signup error:", err);
    return NextResponse.json({ error: err.message || "Signup failed" }, { status: 500 });
  }
}
