"use client"

import { useState, useEffect } from "react"
import { supabase, type Product } from "@/lib/supabase"
import { cache } from "@/lib/cache"
import { ProductCard } from "@/components/product-card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useCart } from "@/hooks/use-cart"
import { ShoppingCart, X } from "lucide-react"

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [cartOpen, setCartOpen] = useState(false)
  const { cart, addToCart, removeFromCart, getTotalPrice } = useCart()

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const cached = cache.get<Product[]>("products")
        if (cached) {
          setProducts(cached)
          setLoading(false)
          return
        }

        const { data, error } = await supabase.from("products").select("*").order("is_new", { ascending: false })

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

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredProducts(products)
    } else {
      setFilteredProducts(products.filter((p) => p.category === selectedCategory))
    }
  }, [products, selectedCategory])

  const categories = ["all", ...new Set(products.map((p) => p.category))]

  return (
    <main className="min-h-screen bg-black">
      <Header />
      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Shop</h1>
              <p className="text-[#999999]">Browse all digital products and courses</p>
            </div>
            <button onClick={() => setCartOpen(!cartOpen)} className="relative glass-card hover-lift p-3">
              <ShoppingCart className="w-6 h-6 text-[#10a37f]" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#10a37f] text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 mb-12 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap smooth-transition ${
                  selectedCategory === cat ? "bg-[#10a37f] text-black" : "glass-card text-[#999999] hover:text-white"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block">
                <div className="w-8 h-8 border-2 border-[#333333] border-t-[#10a37f] rounded-full animate-spin" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
              ))}
            </div>
          )}

          {/* Cart Sidebar */}
          {cartOpen && (
            <div className="fixed right-0 top-0 h-full w-96 max-w-full bg-[#0a0a0a] border-l border-[#333333] overflow-y-auto z-40">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Cart</h2>
                  <button onClick={() => setCartOpen(false)} className="text-[#999999] hover:text-white">
                    <X size={24} />
                  </button>
                </div>

                {cart.length === 0 ? (
                  <p className="text-[#999999]">Your cart is empty</p>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between glass-card p-4">
                          <div className="flex-1">
                            <h3 className="text-white font-semibold text-sm">{item.name}</h3>
                            <p className="text-[#10a37f] text-sm">${item.price}</p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-[#999999] hover:text-[#10a37f]"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-[#333333] pt-4 mb-4">
                      <div className="flex justify-between text-white font-bold text-lg">
                        <span>Total:</span>
                        <span className="text-[#10a37f]">${getTotalPrice()}</span>
                      </div>
                    </div>

                    <button className="w-full bg-[#10a37f] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#1a7f6b] smooth-transition">
                      Checkout
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}
