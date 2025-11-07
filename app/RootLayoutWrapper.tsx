"use client"

import { SessionProvider } from "@/context/SessionContext"
import { Analytics } from "@vercel/analytics/next"

export default function RootLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased bg-black text-white">
        <SessionProvider>
          {children}
          <Analytics />
        </SessionProvider>
      </body>
    </html>
  )
}
