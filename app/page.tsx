import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { HowItWorks } from "@/components/landing/how-it-works"
import { FeaturedProperties } from "@/components/landing/featured-properties"
import { Professionals } from "@/components/landing/professionals"
import { CTA } from "@/components/landing/cta"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Features />
      <FeaturedProperties />
      <HowItWorks />
      <Professionals />
      <CTA />
      <Footer />
    </main>
  )
}
