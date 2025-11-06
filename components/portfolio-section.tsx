"use client"

import { useState, useEffect } from "react"
import { supabase, type PortfolioItem } from "@/lib/supabase"
import { cache } from "@/lib/cache"
import { Play } from "lucide-react"

export function PortfolioSection() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        // Try to get from cache first
        const cached = cache.get<PortfolioItem[]>("portfolio")
        if (cached) {
          setPortfolio(cached)
          setLoading(false)
          return
        }

        // Fetch from Supabase
        const { data, error } = await supabase.from("portfolio").select("*").order("created_at", { ascending: false })

        if (error) throw error

        setPortfolio(data || [])
        cache.set("portfolio", data || [])
      } catch (error) {
        console.error("Error loading portfolio:", error)
      } finally {
        setLoading(false)
      }
    }

    loadPortfolio()
  }, [])

  // Sample data if table is empty
  const displayPortfolio =
    portfolio.length > 0
      ? portfolio
      : [
          {
            id: "1",
            title: "Brand Identity Design",
            description: "Complete brand identity including logo, colors, and guidelines",
            image_url: "/brand-identity-design.png",
            youtube_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "2",
            title: "UI/UX Design System",
            description: "Comprehensive design system for web applications",
            image_url: "/ui-ux-design-concept.png",
            youtube_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "3",
            title: "Digital Illustration",
            description: "Collection of digital illustrations and character designs",
            image_url: "/abstract-digital-art.png",
            youtube_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]

  return (
    <section id="portfolio" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Portfolio</h2>
          <p className="text-[#999999] text-lg">Featured works and creative projects</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayPortfolio.map((item) => (
            <div key={item.id} className="group">
              {/* Image Card */}
              <div className="glass-card hover-lift overflow-hidden mb-4 cursor-pointer">
                <div className="relative h-56 bg-[#1a1a1a]">
                  <img
                    src={item.image_url || "/placeholder.svg?height=300&width=400&query=portfolio work"}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 smooth-transition"
                  />
                  {item.youtube_url && (
                    <a
                      href={item.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 smooth-transition"
                    >
                      <Play className="w-12 h-12 text-[#10a37f]" fill="currentColor" />
                    </a>
                  )}
                </div>
              </div>

              {/* Text Content */}
              <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-[#999999] text-sm line-clamp-2">{item.description}</p>
            </div>
          ))}
        </div>

        {/* YouTube Channel CTA */}
        <div className="mt-16 text-center">
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-[#10a37f] text-[#10a37f] px-8 py-3 rounded-lg font-semibold hover:bg-[#10a37f]/10 smooth-transition"
          >
            Watch on YouTube
          </a>
        </div>
      </div>
    </section>
  )
}
