import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json()

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const supabase = createClient(supabaseUrl, supabaseServiceRole)

    // 🔍 Fetch latest OTP record for the user (most recent)
    const { data: otpRecord, error: fetchError } = await supabase
      .from("otp_verifications")
      .select("*")
      .eq("email", normalizedEmail)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    // 🚫 Handle no OTP found
    if (fetchError || !otpRecord) {
      console.error("❌ OTP not found:", fetchError)
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 })
    }

    // 🧠 Check OTP match
    if (otpRecord.otp_code !== otp) {
      return NextResponse.json({ error: "Incorrect OTP" }, { status: 400 })
    }

    // ⏰ Check expiration safely
    const now = new Date()
    const expiry = new Date(otpRecord.expires_at)
    if (isNaN(expiry.getTime())) {
      console.warn("⚠️ Invalid expires_at format in DB:", otpRecord.expires_at)
      return NextResponse.json({ error: "Invalid OTP record" }, { status: 400 })
    }

    if (now.getTime() > expiry.getTime()) {
      return NextResponse.json({ error: "OTP has expired" }, { status: 400 })
    }

    // 🚫 Already used
    if (otpRecord.verified) {
      return NextResponse.json({ error: "OTP already used" }, { status: 400 })
    }

    // ✅ Mark OTP as verified
    const { error: updateError } = await supabase
      .from("otp_verifications")
      .update({ verified: true })
      .eq("id", otpRecord.id)

    if (updateError) {
      console.error("❌ Error updating OTP:", updateError)
      return NextResponse.json({ error: "Failed to mark OTP as verified" }, { status: 500 })
    }

    console.log(`✅ OTP verified successfully for ${normalizedEmail}`)

    return NextResponse.json({ verified: true, email: normalizedEmail })
  } catch (error) {
    console.error("🔥 Verify OTP error:", error)
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 })
  }
}
