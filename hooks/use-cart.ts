"use client"

import { useState, useEffect } from "react"
import { supabase, type Product } from "@/lib/supabase"

export interface CartItem extends Product {
  quantity: number
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])
  const userId = "current_user_id" // TODO: replace with auth user id if logged in

  // Load cart from DB / localStorage
  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (userId) {
          const { data, error } = await supabase
            .from("cart")
            .select("*")
            .eq("user_id", userId)
          if (error) throw error
          if (data) setCart(data)
        } else {
          const savedCart = localStorage.getItem("cart")
          if (savedCart) setCart(JSON.parse(savedCart))
        }
      } catch (err) {
        console.error("Error fetching cart:", err)
      }
    }
    fetchCart()
  }, [userId])

  // Sync cart to localStorage on every change
  useEffect(() => {
    if (!userId) localStorage.setItem("cart", JSON.stringify(cart))
    window.dispatchEvent(new Event("cartUpdated"))
  }, [cart, userId])

  // -------------------------
  // Add to cart
  // -------------------------
  const addToCart = async (product: Product, quantity = 1) => {
    // Optimistic UI update
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        )
      } else {
        return [...prev, { ...product, quantity }]
      }
    })

    // DB update (async)
    if (userId) {
      try {
        const existing = cart.find(item => item.id === product.id)
        if (existing) {
          await supabase
            .from("cart")
            .update({ quantity: existing.quantity + quantity })
            .eq("product_id", product.id)
            .eq("user_id", userId)
        } else {
          await supabase
            .from("cart")
            .insert([{ ...product, quantity, user_id: userId }])
        }
      } catch (err) {
        console.error("Error syncing addToCart with DB:", err)
      }
    }
  }

  // -------------------------
  // Remove from cart
  // -------------------------
  const removeFromCart = async (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId))

    if (userId) {
      try {
        await supabase
          .from("cart")
          .delete()
          .eq("product_id", productId)
          .eq("user_id", userId)
      } catch (err) {
        console.error("Error removing from cart DB:", err)
      }
    }
  }

  // -------------------------
  // Update quantity (single call)
  // -------------------------
  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return

    setCart(prev =>
      prev.map(item => (item.id === productId ? { ...item, quantity } : item))
    )

    if (userId) {
      try {
        await supabase
          .from("cart")
          .update({ quantity })
          .eq("product_id", productId)
          .eq("user_id", userId)
      } catch (err) {
        console.error("Error updating quantity in DB:", err)
      }
    }
  }

  // -------------------------
  // Clear cart
  // -------------------------
  const clearCart = async () => {
    setCart([])
    if (userId) {
      try {
        await supabase.from("cart").delete().eq("user_id", userId)
      } catch (err) {
        console.error("Error clearing cart DB:", err)
      }
    } else {
      localStorage.removeItem("cart")
    }
  }

  // -------------------------
  // Total price
  // -------------------------
  const getTotalPrice = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return { cart, addToCart, removeFromCart, updateQuantity, clearCart, getTotalPrice }
}
