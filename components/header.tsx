"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { Menu, X, LogOut } from "lucide-react"
import { useSession } from "@/context/SessionContext"

export function Header() {
  const { user, loading, refreshSession } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [itemCount, setItemCount] = useState(0)

  // Sync cart count with localStorage
  useEffect(() => {
    // This function assumes 'cart' in localStorage is an array of items.
    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]")
        setItemCount(Array.isArray(cart) ? cart.length : 0)
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error)
        setItemCount(0)
      }
    }

    updateCartCount() // Initial count

    // Listen for storage changes from other tabs/windows
    window.addEventListener("storage", updateCartCount)
    // Custom event to listen for cart updates within the same tab
    window.addEventListener("cartUpdated", updateCartCount)

    // Cleanup listeners on component unmount
    return () => {
      window.removeEventListener("storage", updateCartCount)
      window.removeEventListener("cartUpdated", updateCartCount)
    }
  }, [])

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    await refreshSession()
    setDropdownOpen(false)
    setMobileOpen(false)
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/#portfolio", label: "Portfolio" },
    { href: "/shop", label: "Shop" },
    { href: "/contact", label: "Contact" },
    { href: "/about-us", label: "About Us" },
  ]

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [dropdownRef])

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-[#333333]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          <Link href="/" className="hover:opacity-70">
            <img src="https://imagizer.imageshack.com/img923/8531/VbSgG9.png" alt="Logo" className="h-35 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} className="text-[#999] hover:text-white transition">
                {label}
              </Link>
            ))}

            {loading ? (
              <div className="h-8 w-8 rounded-full bg-gray-700 animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-6">
                <Link href="/cart" className="relative text-white hover:opacity-70 transition-opacity" aria-label={`Shopping cart with ${itemCount} items`}>
                  <img src="https://img.icons8.com/?size=100&id=j3XI41kBOIXY&format=png&color=FFFFFF" alt="Cart" className="h-7 w-7" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-3 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-[#ff006e] rounded-full border-2 border-black">
                      {itemCount}
                    </span>
                  )}
                </Link>

                <div className="relative" ref={dropdownRef}>
                  <button
                    className="w-8 h-8 rounded-full bg-[#ff006e] text-white font-semibold flex items-center justify-center"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    aria-haspopup="true"
                    aria-expanded={dropdownOpen}
                  >
                    {user.email?.[0]?.toUpperCase()}
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#111] border border-[#333] rounded-lg shadow-lg z-50">
                      <p className="px-4 py-2 text-sm text-gray-400 border-b border-[#222] truncate">{user.email}</p>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-[#1a1a1a]"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link href="/login" className="text-white bg-[#ff006e] hover:bg-[#ff3385] px-4 py-2 rounded-md">
                Login
              </Link>
            )}
          </nav>

          {/* Mobile toggle */}
          <button className="md:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)} aria-controls="mobile-menu" aria-expanded={mobileOpen}>
            <span className="sr-only">Open main menu</span>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`md:hidden transition-all duration-300 ease-in-out ${mobileOpen ? 'max-h-screen' : 'max-h-0'} overflow-hidden`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black border-t border-[#333333]">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={closeMobileMenu}
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              {label}
            </Link>
          ))}
          <div className="border-t border-gray-700 pt-4 mt-4">
             {loading ? (
              <div className="h-10 w-full rounded-md bg-gray-700 animate-pulse" />
            ) : user ? (
                <div className="flex flex-col items-start px-3 space-y-3">
                    <Link href="/cart" onClick={closeMobileMenu} className="w-full flex items-center justify-between p-2 -ml-2 rounded-md hover:bg-gray-800/50">
                        <div className="flex items-center gap-3">
                           <img src="https://img.icons8.com/?size=100&id=j3XI41kBOIXY&format=png&color=FFFFFF" alt="Cart" className="h-6 w-6" />
                           <span className="font-medium text-gray-300">My Cart</span>
                        </div>
                        {itemCount > 0 && (
                          <span className="flex items-center justify-center w-6 h-6 text-sm font-bold text-white bg-[#ff006e] rounded-full">
                            {itemCount}
                          </span>
                        )}
                    </Link>

                    <div className="flex items-center gap-2 pt-3 border-t border-gray-700 w-full">
                        <div className="w-8 h-8 rounded-full bg-[#ff006e] text-white font-semibold flex items-center justify-center">
                            {user.email?.[0]?.toUpperCase()}
                        </div>
                        <p className="text-sm text-gray-400 truncate">{user.email}</p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-[#1a1a1a] rounded-md border border-red-400/50"
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            ) : (
                <div className="px-3">
                    <Link
                        href="/login"
                        onClick={closeMobileMenu}
                        className="text-white bg-[#ff006e] hover:bg-[#ff3385] w-full block text-center px-4 py-2 rounded-md"
                    >
                        Login
                    </Link>
                </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
