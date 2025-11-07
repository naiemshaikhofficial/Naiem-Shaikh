import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const supabase = createClient(supabaseUrl, supabaseServiceRole)

    // Fetch OTP record
    const { data: otpRecord, error } = await supabase
      .from("otp_verifications")
      .select("*")
      .eq("email", normalizedEmail)
      .eq("otp_code", otp)
      .eq("verified", false)
      .order("expires_at", { ascending: false })
      .limit(1)
      .single()

    if (error) {
      console.error("Supabase fetch OTP error:", error)
      return NextResponse.json({ error: "OTP verification failed" }, { status: 500 })
    }

    if (!otpRecord) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 })
    }

    // Check expiry
    const now = new Date()
    if (new Date(otpRecord.expires_at) < now) {
      return NextResponse.json({ error: "OTP has expired" }, { status: 400 })
    }

    // Mark OTP as verified
    const { error: updateError } = await supabase
      .from("otp_verifications")
      .update({ verified: true })
      .eq("id", otpRecord.id)

    if (updateError) {
      console.error("Failed to mark OTP verified:", updateError)
      return NextResponse.json({ error: "OTP verification failed" }, { status: 500 })
    }

    // Success: front-end can now redirect to signup
    return NextResponse.json({ message: "OTP verified successfully" })
  } catch (err) {
    console.error("Verify OTP error:", err)
    return NextResponse.json({ error: "OTP verification failed" }, { status: 500 })
  }
}
