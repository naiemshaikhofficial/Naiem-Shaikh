"use client"

import { useState, useEffect } from "react"
import type { Product } from "@/lib/supabase"
import { cache } from "@/lib/cache"

interface CartItem extends Product {
  quantity: number
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [loaded, setLoaded] = useState(false)

  // Load cart from cache on mount
  useEffect(() => {
    const cached = cache.get<CartItem[]>("cart")
    if (cached) {
      setCart(cached)
    }
    setLoaded(true)
  }, [])

  // Save cart to cache whenever it changes
  useEffect(() => {
    if (loaded) {
      cache.set("cart", cart)
    }
  }, [cart, loaded])

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId))
  }

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
  }

  return { cart, addToCart, removeFromCart, getTotalPrice }
}
