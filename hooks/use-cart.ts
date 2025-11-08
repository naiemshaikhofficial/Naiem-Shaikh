"use client"

import { useState, useEffect } from "react"
import { supabase, type Product } from "@/lib/supabase"

export interface CartItem extends Product {
  quantity: number
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])

  // Load cart from localStorage & Supabase on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data, error } = await supabase.from("cart").select("*")
        if (error) throw error
        if (data) {
          setCart(data)
          localStorage.setItem("cart", JSON.stringify(data))
        }
      } catch (err) {
        console.error("Error fetching cart from DB:", err)
        const savedCart = localStorage.getItem("cart")
        if (savedCart) setCart(JSON.parse(savedCart))
      }
    }
    fetchCart()
  }, [])

  // Save to localStorage and dispatch event
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
    window.dispatchEvent(new Event("cartUpdated"))
  }, [cart])

  const addToCart = async (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      const newCart = existing
        ? prev.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
          )
        : [...prev, { ...product, quantity }]

      // Update DB
      (async () => {
        try {
          if (existing) {
            await supabase
              .from("cart")
              .update({ quantity: existing.quantity + quantity })
              .eq("id", product.id)
          } else {
            await supabase.from("cart").insert([{ ...product, quantity }])
          }
        } catch (err) {
          console.error("Error updating cart in DB:", err)
        }
      })()

      return newCart
    })
  }

  const removeFromCart = async (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId))
    try {
      await supabase.from("cart").delete().eq("id", productId)
    } catch (err) {
      console.error("Error removing from cart in DB:", err)
    }
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    )
    try {
      await supabase.from("cart").update({ quantity }).eq("id", productId)
    } catch (err) {
      console.error("Error updating cart quantity in DB:", err)
    }
  }

  const clearCart = async () => {
    setCart([])
    try {
      await supabase.from("cart").delete()
    } catch (err) {
      console.error("Error clearing cart in DB:", err)
    }
  }

  const getTotalPrice = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return { cart, addToCart, removeFromCart, updateQuantity, clearCart, getTotalPrice }
}
