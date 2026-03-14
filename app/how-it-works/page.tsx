import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Play, Search, Building2, MapPin, Box, CheckCircle } from "lucide-react"

export const metadata = {
  title: "How It Works | TerraVision",
  description: "Learn how TerraVision helps you find, visualize, and build your dream property.",
}

const steps = [
  {
    icon: Search,
    title: "Discover Properties",
    description: "Browse thousands of land and property listings with detailed descriptions and immersive photos."
  },
  {
    icon: Box,
    title: "Immersive 3D Viewing",
    description: "Experience properties in stunning 3D. Explore the terrain and visualize potential developments before visiting."
  },
  {
    icon: Building2,
    title: "Hire Professionals",
    description: "Connect with verified architects, contractors, and builders to bring your vision to life."
  },
  {
    icon: CheckCircle,
    title: "Start Building",
    description: "Purchase floor plans or commission custom designs to begin your construction journey."
  }
]

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="font-serif text-4xl sm:text-5xl text-foreground mb-6">How TerraVision Works</h1>
            <p className="text-lg text-muted-foreground">
              We provide the tools and connections you need to go from a vision to a completed home.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl border border-border bg-card">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-serif text-xl text-foreground mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
