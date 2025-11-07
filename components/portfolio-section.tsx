"use client"

import { useState, useEffect } from "react"
import { supabase, type PortfolioItem } from "@/lib/supabase"
import { Play } from "lucide-react"

export function PortfolioSection() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeVideo, setActiveVideo] = useState<string | null>(null) // currently playing video ID

  useEffect(() => {
    let channel: any

    const loadPortfolio = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from("portfolio")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) throw error
        setPortfolio(data || [])

        // Realtime subscription
        channel = supabase
          .channel("public:portfolio")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "portfolio" },
            (payload) => {
              setPortfolio((prev) => {
                switch (payload.eventType) {
                  case "INSERT":
                    return [payload.new, ...prev]
                  case "UPDATE":
                    return prev.map((p) => (p.id === payload.new.id ? payload.new : p))
                  case "DELETE":
                    return prev.filter((p) => p.id !== payload.old.id)
                  default:
                    return prev
                }
              })
            }
          )
          .subscribe()
      } catch (error) {
        console.error("Error loading portfolio:", error)
      } finally {
        setLoading(false)
      }
    }

    loadPortfolio()

    return () => {
      if (channel) supabase.removeChannel(channel)
    }
  }, [])

  // Helper: get YouTube thumbnail from URL
  const getYouTubeThumbnail = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|watch\?v=))([\w-]{11})/)
    if (!match) return "/placeholder.svg"
    return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
  }

  // Helper: get YouTube embed URL
  const getYouTubeEmbedUrl = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|watch\?v=))([\w-]{11})/)
    if (!match) return null
    return `https://www.youtube.com/embed/${match[1]}?autoplay=1`
  }

  return (
    <section id="portfolio" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Portfolio</h2>
          <p className="text-[#999999] text-lg">Featured works and creative projects</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolio.map((item) => {
            const videoEmbed = getYouTubeEmbedUrl(item.youtube_url || "")
            const thumbnail = item.youtube_url ? getYouTubeThumbnail(item.youtube_url) : item.image_url

            return (
              <div key={item.id} className="group">
                {/* Image / Video Card */}
                <div className="glass-card hover-lift overflow-hidden mb-4 cursor-pointer relative h-56 bg-[#1a1a1a]">
                  {activeVideo === item.id && videoEmbed ? (
                    <iframe
                      src={videoEmbed}
                      className="w-full h-full object-cover"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={item.title}
                    />
                  ) : (
                    <>
                      <img
                        src={thumbnail || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 smooth-transition"
                      />
                      {videoEmbed && (
                        <div
                          className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 smooth-transition cursor-pointer"
                          onClick={() => setActiveVideo(item.id)}
                        >
                          <Play className="w-12 h-12 text-[#10a37f]" fill="currentColor" />
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Text Content */}
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-[#999999] text-sm line-clamp-2">{item.description}</p>
              </div>
            )
          })}
        </div>

        {/* YouTube Channel CTA */}
        <div className="mt-16 text-center">
          <a
            href="https://youtube.com/@naiemshaikh"
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
