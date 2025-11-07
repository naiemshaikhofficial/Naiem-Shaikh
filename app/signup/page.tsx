"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Mail, Shield } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()

  // Step management
  const [step, setStep] = useState<"email" | "otp" | "details">("email")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  // Email & OTP
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [cooldown, setCooldown] = useState(0)
  const [resendCount, setResendCount] = useState(0)

  // User details
  const [username, setUsername] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")

  // Password checks
  const passwordStrength = useMemo(() => {
    const checks = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /[0-9]/.test(password),
      /[^A-Za-z0-9]/.test(password),
    ]
    return checks.filter(Boolean).length
  }, [password])

  // Cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => setCooldown((c) => c - 1), 1000)
      return () => clearInterval(timer)
    }
  }, [cooldown])

  // Step 1: send OTP
  const sendOtp = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to send OTP")
      setMessage("OTP sent to your email!")
      setStep("otp")
      setOtp("")
      setResendCount((c) => c + 1)
      if (resendCount > 2) setCooldown(30)
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  // Step 2: verify OTP
  const verifyOtp = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Invalid OTP")
      setMessage("Email verified! Now complete your signup.")
      setStep("details")
    } catch (err: any) {
      setError(err.message || "OTP verification failed")
    } finally {
      setLoading(false)
    }
  }

  // Step 3: complete signup
  const handleSignup = async () => {
    setLoading(true)
    setError("")
    if (password !== confirm) return setError("Passwords do not match")
    if (passwordStrength < 3) return setError("Password is too weak")
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, phone, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Signup failed")
      router.push("/login")
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-md space-y-4 text-white">
        <h1 className="text-2xl font-bold text-center mb-2">Create Account</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {message && <p className="text-green-400 text-center">{message}</p>}

        {step === "email" && (
          <>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-cyan-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-gray-800 border border-gray-700 rounded py-2 px-10 text-white focus:outline-none focus:border-cyan-400"
                required
              />
            </div>
            <button
              onClick={sendOtp}
              disabled={loading || !email.includes("@")}
              className="w-full bg-cyan-500 hover:bg-cyan-600 py-2 rounded font-bold flex items-center justify-center gap-2"
            >
              {loading ? "Sending..." : "Send OTP"} <ArrowRight size={18} />
            </button>
          </>
        )}

        {step === "otp" && (
          <>
            <div className="relative">
              <Shield className="absolute left-3 top-3 text-cyan-400 w-5 h-5" />
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Enter OTP"
                maxLength={6}
                className="w-full bg-gray-800 border border-gray-700 rounded py-2 px-10 text-white text-center tracking-widest focus:outline-none focus:border-cyan-400"
                required
              />
            </div>
            <button
              onClick={verifyOtp}
              disabled={loading || otp.length !== 6}
              className="w-full bg-cyan-500 hover:bg-cyan-600 py-2 rounded font-bold flex items-center justify-center gap-2"
            >
              {loading ? "Verifying..." : "Verify OTP"} <ArrowRight size={18} />
            </button>
            <button
              onClick={sendOtp}
              disabled={cooldown > 0}
              className="w-full mt-2 bg-gray-700 hover:bg-gray-600 py-2 rounded font-bold"
            >
              {cooldown > 0 ? `Resend OTP (${cooldown}s)` : "Resend OTP"}
            </button>
          </>
        )}

        {step === "details" && (
          <div className="space-y-3">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full bg-gray-800 border border-gray-700 rounded py-2 px-3 text-white focus:outline-none focus:border-cyan-400"
              required
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              placeholder="Phone (optional)"
              className="w-full bg-gray-800 border border-gray-700 rounded py-2 px-3 text-white focus:outline-none focus:border-cyan-400"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-gray-800 border border-gray-700 rounded py-2 px-3 text-white focus:outline-none focus:border-cyan-400"
              required
            />
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm Password"
              className="w-full bg-gray-800 border border-gray-700 rounded py-2 px-3 text-white focus:outline-none focus:border-cyan-400"
              required
            />
            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-600 py-2 rounded font-bold flex items-center justify-center gap-2"
            >
              {loading ? "Signing up..." : "Complete Signup"} <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
