import { Box, Building2, Users, FileText, ShieldCheck, Sparkles } from "lucide-react"

const features = [
  {
    icon: Box,
    title: "Immersive 3D Models",
    description: "Experience properties in stunning 3D. Walk through, rotate, and explore every detail before visiting in person.",
  },
  {
    icon: Building2,
    title: "Architect Marketplace",
    description: "Browse and purchase floor plans from verified architects. Find the perfect design for your dream home.",
  },
  {
    icon: Users,
    title: "Professional Network",
    description: "Connect with carpenters, masons, electricians, and contractors. Build your property with trusted experts.",
  },
  {
    icon: FileText,
    title: "Smart Contracts",
    description: "Secure escrow payments and digital contracts. Complete property transactions safely on the platform.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Listings",
    description: "All properties and professionals are verified by our team. Buy and hire with confidence.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Generation",
    description: "Transform property photos into interactive 3D models using our advanced AI technology.",
  },
]

export function Features() {
  return (
    <section className="border-t border-border bg-card py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">Platform Features</p>
          <h2 className="mt-4 font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
            <span className="text-balance">Everything You Need to Find, Buy, and Build</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A complete ecosystem for property development, from discovery to construction.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border bg-background p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
