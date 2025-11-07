"use client"
import Link from "next/link"
import React from "react"

// SVG Icon components
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

export function HeroSection() {
  const navLinks = [
    { label: "HOME", href: "/" },
    { label: "SHOP", href: "/shop" },
    { label: "CONTACT", href: "/#contact" },
  ]

  const socialLinks = [
    { icon: <SpotifyIcon />, url: "https://open.spotify.com/artist/08cXWillp8iGPYijt84FpO" },
    { icon: <InstagramIcon />, url: "https://www.instagram.com/naiemShaikhofficial/" },
    { icon: <YoutubeIcon />, url: "https://www.youtube.com/@naiemshaikh" },
  ]

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Roboto:wght@300;700&display=swap');
        .font-anton { font-family: 'Anton', sans-serif; }
        body { font-family: 'Roboto', sans-serif; }
      `}</style>

      <section className="relative min-h-screen bg-black flex flex-col items-center justify-center text-white overflow-hidden">
        {/* Background GIF with blur */}
        <div
          className="absolute inset-0 w-full h-full z-0"
          style={{
            backgroundImage: "url('/Happy Music Festival GIF by Insomniac Events - Find & Share on GIPHY.gif')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(4px)",
          }}
        />

        {/* Black overlay */}
        <div className="absolute inset-0 w-full h-full bg-black/40 z-1" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 w-full h-1/3 z-2 bg-gradient-to-t from-black/100 to-black/0" />

        <main className="relative z-10 flex flex-col items-center justify-center flex-grow text-center px-4 pt-20 pb-40">
          {/* PNG Text */}
          <div className="w-full max-w-lg">
            <img
  src="https://imagizer.imageshack.com/img923/2457/VbSgG9.png"
  alt="Naiem Shaikh"
  className="w-full h-auto object-contain drop-shadow-[0_0_15px_rgba(249,0,180,0.9)] select-none"
  draggable={false}
/>
          </div>

          <p className="mt-8 text-lg tracking-[0.2em] font-light text-white">
            FOLLOW <span className="mx-2 text-gray-500">|</span> ON SPOTIFY
          </p>
          <a
            href="https://open.spotify.com/artist/08cXWillp8iGPYijt84FpO"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 bg-[#F900B4] text-black font-bold py-3 px-8 tracking-widest hover:bg-white hover:text-[#F900B4] transition-colors duration-300 ease-in-out"
          >
            CLICK OR BE DESTROYED
          </a>
        </main>

        {/* Footer navigation */}
        <footer className="absolute bottom-0 left-0 right-0 z-20 w-full p-4 md:p-6">
          <nav className="flex flex-wrap justify-center items-center gap-x-6 gap-y-4 md:gap-x-8 text-sm uppercase tracking-wider">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`font-semibold transition-colors duration-300 text-cyan-400 hover:text-white ${
                  link.label === "HOME" ? "border-b-2 border-cyan-400 pb-1" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-4 md:gap-6 text-cyan-400">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </nav>
        </footer>
      </section>
    </>
  )
}
