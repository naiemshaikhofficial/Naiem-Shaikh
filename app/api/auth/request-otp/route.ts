import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { sendOTPEmail } from "@/lib/utils/email"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceRole)

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    // Basic validation
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase()

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes

    console.log("📩 Generating OTP for:", normalizedEmail, "OTP:", otp)

    // Optional: clean up old OTPs for this email
    await supabase.from("otp_verifications").delete().eq("email", normalizedEmail)

    // Insert new OTP record
    const { error: dbError } = await supabase.from("otp_verifications").insert([
      {
        email: normalizedEmail,
        otp_code: otp,
        expires_at: expiresAt,
        verified: false,
      },
    ])

    if (dbError) {
      console.error("❌ Supabase insert error:", dbError)
      return NextResponse.json({ error: "Database error while saving OTP" }, { status: 500 })
    }

    // Send OTP via email
    await sendOTPEmail(normalizedEmail, otp)
    console.log("✅ OTP email sent successfully to:", normalizedEmail)

    return NextResponse.json({ message: "OTP sent successfully!" })
  } catch (error: any) {
    console.error("🔥 Request OTP error:", error)
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 })
  }
}
