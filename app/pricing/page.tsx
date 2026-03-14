import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Pricing | TerraVision",
  description: "Choose the right plan for your property discovery and development needs.",
}

const plans = [
  {
    name: "Explorer",
    price: "Free",
    description: "Perfect for browsing and initial research.",
    features: [
      "Browse all property listings",
      "Limited 3D property views",
      "Basic search filters",
      "Save up to 5 properties"
    ]
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    description: "Enhanced features for serious buyers.",
    features: [
      "Unlimited 3D property views",
      "Advanced AI search filters",
      "Direct messaging with owners",
      "Unlimited saved properties",
      "Priority customer support"
    ],
    popular: true
  },
  {
    name: "Developer",
    price: "$99",
    period: "/mo",
    description: "Complete tools for construction projects.",
    features: [
      "All Pro features",
      "3D model export (OBJ/GLB)",
      "Direct professional hiring",
      "Floor plan discounts",
      "Project management tools"
    ]
  }
]

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="font-serif text-4xl sm:text-5xl text-foreground mb-6">Simple, Transparent Pricing</h1>
            <p className="text-lg text-muted-foreground">
              Choose the plan that fits your current property journey.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {plans.map((plan, i) => (
              <div 
                key={i} 
                className={`flex flex-col p-8 rounded-3xl border ${
                  plan.popular ? "border-primary bg-primary/5 shadow-2xl shadow-primary/10" : "border-border bg-card"
                }`}
              >
                <div className="mb-8">
                  <h3 className="font-serif text-2xl text-foreground mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <div className="flex-1 space-y-4 mb-8">
                  {plan.features.map((feature, j) => (
                    <div key={j} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>

                <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                  Get Started
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
