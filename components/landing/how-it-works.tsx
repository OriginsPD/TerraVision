import { Search, Box, ShoppingCart, Hammer } from "lucide-react"

const steps = [
  {
    step: "01",
    icon: Search,
    title: "Browse Properties",
    description: "Search through thousands of land and property listings. Filter by location, size, price, and more.",
  },
  {
    step: "02",
    icon: Box,
    title: "Explore in 3D",
    description: "View immersive 3D models of properties. Walk through, rotate, and examine every angle before visiting.",
  },
  {
    step: "03",
    icon: ShoppingCart,
    title: "Purchase Securely",
    description: "Complete your purchase through our secure escrow system. Digital contracts and verified transactions.",
  },
  {
    step: "04",
    icon: Hammer,
    title: "Build Your Dream",
    description: "Access our marketplace of architects and builders. Hire professionals and track construction progress.",
  },
]

export function HowItWorks() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">How It Works</p>
          <h2 className="mt-4 font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
            <span className="text-balance">From Discovery to Dream Home in Four Steps</span>
          </h2>
        </div>

        {/* Steps */}
        <div className="mt-16 grid gap-8 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.step} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-12 hidden h-px w-full bg-border lg:block" />
              )}
              
              <div className="relative flex flex-col items-center text-center">
                {/* Step Number */}
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border border-border bg-card">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                    {step.step}
                  </span>
                </div>

                <h3 className="mt-6 text-lg font-medium text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
