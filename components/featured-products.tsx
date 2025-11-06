"use client"

import { useState, useEffect } from "react"
import { supabase, type Product } from "@/lib/supabase"
import { cache } from "@/lib/cache"
import { ProductCard } from "./product-card"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart"

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const cached = cache.get<Product[]>("products")
        if (cached) {
          setProducts(cached.slice(0, 6))
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("is_new", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(6)

        if (error) throw error

        setProducts(data || [])
        cache.set("products", data || [])
      } catch (error) {
        console.error("Error loading products:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  // Sample products if table is empty
  const displayProducts =
    products.length > 0
      ? products
      : [
          {
            id: "1",
            name: "Complete Design System Course",
            description: "Master design systems from basics to advanced",
            category: "course",
            price: 99,
            image_url: "/design-course-concept.png",
            is_new: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "2",
            name: "Figma Plugin Bundle",
            description: "Productivity plugins for Figma designers",
            category: "plugin",
            price: 49,
            image_url: "/figma-plugin-interface.png",
            is_new: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "3",
            name: "UI/UX Masterclass",
            description: "Advanced UI/UX design techniques",
            category: "course",
            price: 79,
            image_url: "/ui-ux.jpg",
            is_new: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "4",
            name: "Design Presets Pack",
            description: "Ready-to-use design presets and components",
            category: "preset",
            price: 29,
            image_url: "/design-preset.jpg",
            is_new: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "5",
            name: "Brand Identity Course",
            description: "Create stunning brand identities",
            category: "course",
            price: 89,
            image_url: "/brand-identity-concept.png",
            is_new: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "6",
            name: "Color Theory Guide",
            description: "Deep dive into color psychology",
            category: "guide",
            price: 19,
            image_url: "/color-theory-wheel.png",
            is_new: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]

  return (
    <section className="py-20 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Shop</h2>
          <p className="text-[#999999] text-lg mb-8">Digital products to accelerate your creative journey</p>
          <span className="inline-block text-sm text-[#10a37f] font-semibold">🆕 New products highlighted below</span>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="w-8 h-8 border-2 border-[#333333] border-t-[#10a37f] rounded-full animate-spin" />
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/shop"
                className="inline-block bg-[#10a37f] text-black px-8 py-3 rounded-lg font-semibold hover:bg-[#1a7f6b] smooth-transition"
              >
                View All Products
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
