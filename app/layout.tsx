import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Naiem Shaikh",
  description:
    "Explore Naiem Shaikh's digital art, design plugins, courses, and creative products. Modern portfolio and digital store for artists and designers.",
  openGraph: {
    title: "Naiem Shaikh - Artist Portfolio & Store",
    description: "Digital art, courses, plugins, and creative tools",
    url: "https://naiemshaikh.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Naiem Shaikh - Artist & Creator",
    description: "Explore my digital art, courses, and plugins",
  },
  keywords: "artist, designer, courses, plugins, digital products, creative design",
    generator: 'Naiem Shaikh'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-sans antialiased bg-black text-white">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
