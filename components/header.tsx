"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "#portfolio", label: "Portfolio" },
    { href: "/shop", label: "Shop" },
    { href: "#contact", label: "Contact" },
    { href: "/about-us", label: "About Us" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-[#333333]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="smooth-transition hover:opacity-80">
            <img
              src="https://imagizer.imageshack.com/img923/8531/VbSgG9.png"
              alt="NS Logo"
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} className="text-[#999999] hover:text-white smooth-transition">
                {label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="block px-2 py-2 text-[#999999] hover:text-white hover:bg-[#0a0a0a] rounded smooth-transition"
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
