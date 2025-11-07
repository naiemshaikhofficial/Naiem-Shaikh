import { NextResponse } from "next/server"

export async function POST() {
  try {
    // 🧹 Clear the session cookie
    const response = NextResponse.json({ message: "Logged out successfully" })

    response.cookies.set({
      name: "session_token",
      value: "",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      expires: new Date(0), // Immediately expire cookie
    })

    console.log("✅ User logged out successfully")

    return response
  } catch (err) {
    console.error("❌ Logout error:", err)
    return NextResponse.json({ error: "Logout failed" }, { status: 500 })
  }
}
