"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react"
import { useSession } from "@/context/SessionContext" // make sure path is correct

// SVG Icon components (Spotify, Instagram, etc.)
const SpotifyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M8 11.97s2.5-1.47 5-1.47 5 1.47 5 1.47"></path>
    <path d="M9 15.4s2-1.23 4-1.23 4 1.23 4 1.23"></path>
  </svg>
)
const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
)
const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
)
const YoutubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
)
const BandcampIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M0 18h24v-2H0v2zM12 6l-8 10h16L12 6z"></path>
  </svg>
)
const GlobeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
)

export default function ThemedLoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { setUser, refreshSession } = useSession() // ✅ session context

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Login failed")
        return
      }

      // ✅ Update session context immediately
      setUser(data.user)
      await refreshSession() // optional sync with backend

      router.push("/")
    } catch (err) {
      console.error(err)
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const navLinks = [
    { label: "HOME", href: "/" },
    { label: "STORE", href: "/shop" },
    { label: "CONTACT", href: "/#contact" },
  ]

  const socialIcons = [
    { icon: <SpotifyIcon key="spotify" />, href: "#" },
    { icon: <InstagramIcon key="instagram" />, href: "#" },
    { icon: <FacebookIcon key="facebook" />, href: "#" },
    { icon: <YoutubeIcon key="youtube" />, href: "#" },
    { icon: <BandcampIcon key="bandcamp" />, href: "#" },
    { icon: <GlobeIcon key="globe" />, href: "#" },
  ]

  return (
    <div className="relative min-h-screen bg-black flex flex-col items-center justify-start text-white overflow-hidden p-4">
      {/* Background & overlay */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3N2Z3dvanZkdTB3cHp6a3Z5c3k4b3Fqd3hoN2Q1aXZ1aGk3OGp1ayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o85xwB8sa2e3foKFW/giphy.gif')",
          filter: "blur(4px)",
          transform: "scale(1.1)"
        }}
      />
      <div className="absolute inset-0 w-full h-full bg-black/70 z-1" />

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-md mt-20">
        <div className="text-center mb-8">
          <img
            src="https://imagizer.imageshack.com/img923/2457/VbSgG9.png"
            alt="Logo"
            className="w-full h-auto max-w-sm mx-auto drop-shadow-[0_0_15px_rgba(249,0,180,0.9)] transform rotate-[-5deg] select-none"
            draggable={false}
          />
        </div>

        <div className="bg-black/50 backdrop-blur-sm border border-cyan-400/30 rounded-lg p-8 space-y-9 shadow-lg shadow-cyan-500/10">
          <div>
            <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
            <p className="text-gray-300 text-sm mt-2">Login to your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-cyan-400 text-sm font-semibold mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400/70 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full bg-black/70 border border-cyan-400/50 text-white pl-10 pr-4 py-2 rounded focus:border-cyan-400 focus:ring-cyan-400 focus:ring-1 focus:outline-none transition-all duration-300"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-cyan-400 text-sm font-semibold mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400/70 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-black/70 border border-cyan-400/50 text-white pl-10 pr-12 py-2 rounded focus:border-cyan-400 focus:ring-cyan-400 focus:ring-1 focus:outline-none transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400/70 hover:text-cyan-300"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-3 rounded text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F900B4] text-black font-bold py-3 px-8 tracking-widest hover:bg-white hover:text-[#F900B4] transition-colors duration-300 ease-in-out disabled:opacity-50 flex items-center justify-center gap-2 uppercase rounded"
            >
              {loading ? "Logging in..." : "Login"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="border-t border-cyan-400/30 pt-6 text-center">
            <p className="text-gray-300 text-sm">
              Don't have an account?{" "}
              <Link href="/signup" className="text-cyan-400 hover:text-white font-semibold">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
