"use client"

import { useState, useEffect } from "react"
import { supabase, type Product } from "@/lib/supabase"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useCart } from "@/hooks/use-cart" // ✅ Use global cart hook

interface CartItem extends Product {
  quantity: number
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart() // ✅ Get addToCart from global cart

  const slug = decodeURIComponent(params.slug).toLowerCase().trim()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("slug", slug)
          .single()
        if (error || !data) throw error
        setProduct(data)
      } catch (err) {
        console.error("Error fetching product:", err)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [slug])

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <Header />
        <div className="text-white">Loading...</div>
        <Footer />
      </main>
    )
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <Header />
        <div className="text-center mt-20">
          <h1 className="text-3xl font-bold mb-4">Product not found</h1>
          <p className="text-[#999999]">
            We couldn’t find that product. It might have been removed or the URL is incorrect.
          </p>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black">
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-auto rounded-2xl object-cover border border-[#222]"
            />
          ) : (
            <div className="w-full h-80 bg-[#111] border border-[#222] rounded-2xl flex items-center justify-center text-[#666]">
              No image available
            </div>
          )}

          <div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-[#ff006e] text-2xl font-semibold mb-6">₹{product.price}</p>

            {product.category && (
              <p className="uppercase text-sm text-[#888] mb-4">
                Category: <span className="text-white">{product.category}</span>
              </p>
            )}

            <p className="text-[#cccccc] leading-relaxed mb-8">
              {product.description || "No description available for this product."}
            </p>

            {product.features && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">Features:</h3>
                <ul className="list-disc list-inside text-[#aaaaaa] space-y-1">
                  {product.features.split(",").map((f: string, i: number) => (
                    <li key={i}>{f.trim()}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* ✅ Global Add to Cart */}
            <button
              onClick={() => addToCart(product)}
              className="bg-[#ff006e] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#ff3385] smooth-transition"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
