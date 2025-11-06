"use client"

import { useState } from "react"
import { Mail, MapPin, MessageSquare } from "lucide-react"

export function ContactSection() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSuccess(true)
        setFormData({ name: "", email: "", message: "" })
        setTimeout(() => setSuccess(false), 5000)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="py-20 bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Get In Touch</h2>
          <p className="text-[#999999] text-lg">Have questions? Let's connect</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: Mail,
              label: "Email",
              value: "naiem@example.com",
              href: "mailto:naiem@example.com",
            },
            {
              icon: MessageSquare,
              label: "Discord",
              value: "Join Community",
              href: "https://discord.com",
            },
            {
              icon: MapPin,
              label: "Location",
              value: "Worldwide",
              href: "#",
            },
          ].map(({ icon: Icon, label, value, href }) => (
            <a key={label} href={href} className="glass-card hover-lift p-6 text-center group">
              <Icon className="w-8 h-8 text-[#10a37f] mx-auto mb-4 group-hover:scale-110 smooth-transition" />
              <h3 className="text-white font-semibold mb-2">{label}</h3>
              <p className="text-[#999999] group-hover:text-[#10a37f] smooth-transition">{value}</p>
            </a>
          ))}
        </div>

        {/* Contact Form */}
        <div className="glass-card p-8">
          {success && (
            <div className="mb-4 p-4 bg-[#10a37f]/20 border border-[#10a37f] rounded-lg text-[#10a37f]">
              Thank you! Your message has been sent successfully.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white font-semibold mb-2">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-[#333333] rounded-lg px-4 py-3 text-white placeholder-[#666666] focus:border-[#10a37f] focus:outline-none smooth-transition"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-[#333333] rounded-lg px-4 py-3 text-white placeholder-[#666666] focus:border-[#10a37f] focus:outline-none smooth-transition"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Message</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-[#333333] rounded-lg px-4 py-3 text-white placeholder-[#666666] focus:border-[#10a37f] focus:outline-none smooth-transition resize-none"
                placeholder="Your message..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#10a37f] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#1a7f6b] disabled:opacity-50 smooth-transition"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
