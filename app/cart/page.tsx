"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [couponCode, setCouponCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const { toast } = useToast()
  const router = useRouter()

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]")
    setCart(Array.isArray(savedCart) ? savedCart : [])
  }, [])

  // Save cart to localStorage whenever it changes
  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart)
    localStorage.setItem("cart", JSON.stringify(newCart))
    window.dispatchEvent(new Event("cartUpdated")) // notify header
  }

  const removeItem = (id: string) => {
    updateCart(cart.filter(item => item.id !== id))
  }

  const updateQuantity = (id: string, qty: number) => {
    if (qty < 1) return
    updateCart(cart.map(item => item.id === id ? { ...item, quantity: qty } : item))
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal - discount

  // Apply coupon (10% off)
  const applyCoupon = () => {
    try {
      const saved = localStorage.getItem("sampleswala-newsletter")
      if (!saved) {
        return toast({ title: "Invalid coupon", description: "Please check your coupon code.", variant: "destructive" })
      }

      const data = JSON.parse(saved) as { code: string; expiresAt: number; used: boolean }
      if (data.code !== couponCode) {
        return toast({ title: "Invalid coupon", description: "Please check your coupon code.", variant: "destructive" })
      }

      const now = Date.now()
      if (data.used) return toast({ title: "Coupon used", description: "This coupon has already been used." })
      if (now > data.expiresAt) return toast({ title: "Coupon expired", description: "This coupon is no longer valid." })

      const discountAmount = subtotal * 0.1
      setDiscount(discountAmount)
      localStorage.setItem("sampleswala-newsletter", JSON.stringify({ ...data, used: true }))
      toast({ title: "Coupon applied!", description: `You saved ₹${discountAmount.toFixed(2)}` })
    } catch {
      toast({ title: "Error", description: "Failed to apply coupon.", variant: "destructive" })
    }
  }

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({ title: "Cart is empty", description: "Add items before checkout.", variant: "destructive" })
      return
    }
    router.push("/checkout")
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-400 mb-6">Add some products to get started</p>
        <Button onClick={() => router.push("/shop")} className="bg-[#ff006e] hover:bg-[#ff3385] text-white px-6 py-2 rounded-md">
          Browse Shop
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold">Your Cart</h1>

      <div className="space-y-4">
        {cart.map(item => (
          <div key={item.id} className="flex items-center justify-between bg-[#111] p-4 rounded-lg">
            <div className="flex items-center gap-4">
              {item.image && <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />}
              <div>
                <h2 className="text-lg font-medium text-white">{item.name}</h2>
                <p className="text-gray-400">₹{item.price.toFixed(2)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={e => updateQuantity(item.id, parseInt(e.target.value))}
                className="w-16 text-center rounded border border-gray-600 bg-black/50 text-white"
              />
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-400"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Coupon */}
      <div className="flex gap-2">
        <Input
          placeholder="Enter coupon code"
          value={couponCode}
          onChange={e => setCouponCode(e.target.value)}
          className="bg-gray-900 border-gray-700 text-white"
        />
        <Button onClick={applyCoupon} className="bg-[#ff006e] hover:bg-[#ff3385] text-white">
          Apply
        </Button>
      </div>

      {/* Total & Checkout */}
      <div className="flex flex-col md:flex-row justify-end items-center gap-4 mt-4">
        {discount > 0 && <span className="text-green-400">Discount: -₹{discount.toFixed(2)}</span>}
        <span className="text-xl font-bold text-white">Total: ₹{total.toFixed(2)}</span>
        <Button onClick={handleCheckout} className="bg-[#ff006e] hover:bg-[#ff3385] text-white px-6 py-2 rounded-md">
          Checkout
        </Button>
      </div>
    </div>
  )
}
