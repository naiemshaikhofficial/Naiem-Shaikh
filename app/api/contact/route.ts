import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!
const web3formsKey = process.env.WEB3FORMS_API_KEY! // Add your Web3Forms API key to .env

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()

    // Validate inputs
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // 1️⃣ Insert into Supabase
    const supabase = createClient(supabaseUrl, supabaseServiceRole)
    const { error: supabaseError } = await supabase
      .from("contacts")
      .insert([{ name, email, message }])
    if (supabaseError) throw supabaseError

    // 2️⃣ Send via Web3Forms
    const web3formsResponse = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: web3formsKey,
        name,
        email,
        message,
        subject: "New Contact Form Submission",
      }),
    })

    const web3formsResult = await web3formsResponse.json()

    if (!web3formsResult.success) {
      console.error("Web3Forms error:", web3formsResult)
      // Optional: You can still return success if you want Supabase insert to succeed
      return NextResponse.json({
        message: "Saved to database, but failed to send email",
        web3formsResult,
      })
    }

    return NextResponse.json({ message: "Contact form submitted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Failed to submit contact form" }, { status: 500 })
  }
}
