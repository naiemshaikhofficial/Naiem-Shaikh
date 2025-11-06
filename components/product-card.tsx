"use client"

import type { Product } from "@/lib/supabase"
import Image from "next/image"
import Link from "next/link"

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  // Generate fallback slug if not present (for older rows)
  const slug =
    product.slug ||
    product.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-")

  return (
    <div className="glass-card hover-lift p-4 group">
      <Link href={`/${slug}`}>
        <div className="relative h-48 mb-4 overflow-hidden rounded-lg bg-[#1a1a1a]">
          <Image
            src={
              product.image_url ||
              "/placeholder.svg?height=200&width=300&query=digital product"
            }
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 smooth-transition"
          />
          {product.is_new && (
            <div className="absolute top-2 right-2 bg-[#10a37f] text-black px-3 py-1 rounded-full text-xs font-bold">
              NEW
            </div>
          )}
        </div>
      </Link>

      <h3 className="text-white font-semibold mb-2 line-clamp-2">{product.name}</h3>
      <p className="text-[#999999] text-sm mb-4 line-clamp-2">{product.description}</p>

      <div className="flex items-center justify-between">
        {/* Price now shows INR */}
        <span className="text-[#10a37f] font-bold text-lg">₹{product.price}</span>
        <button
          onClick={() => onAddToCart(product)}
          className="bg-[#10a37f] text-black px-4 py-2 rounded font-semibold hover:bg-[#1a7f6b] smooth-transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}
