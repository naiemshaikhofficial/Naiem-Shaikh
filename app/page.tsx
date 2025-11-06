import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { PortfolioSection } from "@/components/portfolio-section"
import { FeaturedProducts } from "@/components/featured-products"
import { ContactSection } from "@/components/contact-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Header />
      <div className="pt-16">
        <HeroSection />
        <PortfolioSection />
        <FeaturedProducts />
        <ContactSection />
      </div>
      <Footer />
    </main>
  )
}
