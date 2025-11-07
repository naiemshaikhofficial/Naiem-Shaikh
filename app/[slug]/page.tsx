// app/shop/[slug]/page.tsx
import { supabase } from "@/lib/supabase"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { notFound } from "next/navigation"

export const revalidate = 0

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  if (!params?.slug) return notFound() // extra safety

  const slug = params.slug.toLowerCase().trim()

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle()

  if (error || !product) return notFound()

  return (
    <main className="min-h-screen bg-black text-white">
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-24">
        <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
        <p className="text-[#10a37f] text-2xl font-semibold mb-6">₹{product.price}</p>
        <p className="text-[#cccccc] leading-relaxed mb-8">
          {product.description}
        </p>
        {product.image_url && (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-auto rounded-2xl object-cover border border-[#222]"
          />
        )}
      </div>
      <Footer />
    </main>
  )
}
