"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase, type Product } from "@/lib/supabase"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useCart } from "@/hooks/use-cart"

export default function ProductPage() {
  const params = useParams()
  const slug = params.slug
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    if (!slug) return

    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .single()

      if (error) {
        console.error(error)
      } else {
        setProduct(data)
      }
      setLoading(false)
    }

    fetchProduct()
  }, [slug])

  if (loading) return <p className="text-white text-center py-12">Loading...</p>
  if (!product) return <p className="text-white text-center py-12">Product not found</p>

  return (
    <main className="min-h-screen bg-black">
      <Header />
      <div className="max-w-5xl mx-auto py-20 px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image */}
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full rounded-lg object-cover"
        />

        {/* Product Info */}
        <div className="text-white">
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-[#999999] mb-6">{product.description}</p>
          <p className="text-[#10a37f] text-2xl font-bold mb-4">₹{product.price}</p>

          {/* Trustpilot Rating */}
          <div className="flex items-center mb-6 text-yellow-400">
            {"★".repeat(2)}{"☆".repeat(3)} <span className="text-[#999999] ml-2">2.9</span>
          </div>

          {/* Add to Cart */}
          <button
            onClick={() => addToCart(product)}
            className="w-full bg-[#10a37f] text-black py-3 rounded-lg font-semibold hover:bg-[#1a7f6b] transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
      <Footer />
    </main>
  )
}
