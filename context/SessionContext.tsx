"use client"

import { createContext, useContext, useEffect, useState } from "react"

type SessionContextType = {
  user: any
  loading: boolean
  refreshSession: () => Promise<void>
  setUser: (user: any) => void // 👈 ADD THIS
}

const SessionContext = createContext<SessionContextType>({
  user: null,
  loading: true,
  refreshSession: async () => {},
  setUser: () => {}, // 👈 ADD THIS
})

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const refreshSession = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/auth/session", { cache: "no-store" })
      const data = await res.json()
      setUser(data?.user || null)
    } catch (err) {
      console.error("Session fetch failed:", err)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshSession()
  }, [])

  return (
    <SessionContext.Provider value={{ user, loading, refreshSession, setUser }}>
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => useContext(SessionContext)
