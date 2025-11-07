"use client"

import { useEffect, useState } from "react"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]")
    setCart(Array.isArray(savedCart) ? savedCart : [])
  }, [])

  // Update localStorage and notify header
  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart)
    localStorage.setItem("cart", JSON.stringify(newCart))
    window.dispatchEvent(new Event("cartUpdated")) // notify header
  }

  const removeItem = (id: string) => {
    const newCart = cart.filter(item => item.id !== id)
    updateCart(newCart)
  }

  const updateQuantity = (id: string, qty: number) => {
    if (qty < 1) return
    const newCart = cart.map(item => item.id === id ? { ...item, quantity: qty } : item)
    updateCart(newCart)
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        <p className="text-gray-400">Your cart is empty.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      <div className="space-y-4">
        {cart.map(item => (
          <div key={item.id} className="flex items-center justify-between bg-[#111] p-4 rounded-lg">
            <div className="flex items-center gap-4">
              {item.image && <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />}
              <div>
                <h2 className="text-lg font-medium">{item.name}</h2>
                <p className="text-gray-400">${item.price.toFixed(2)}</p>
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

      <div className="mt-6 flex justify-end items-center gap-4">
        <span className="text-xl font-bold">Total: ${totalPrice.toFixed(2)}</span>
        <button className="px-4 py-2 bg-[#ff006e] text-white rounded-md hover:bg-[#ff3385]">
          Checkout
        </button>
      </div>
    </div>
  )
}
