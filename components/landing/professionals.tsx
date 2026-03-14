"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Star, MapPin, Building2, Hammer, Wrench, Paintbrush } from "lucide-react"

const professionals = [
  {
    id: 1,
    name: "Sarah Chen",
    profession: "Architect",
    specialty: "Modern Residential",
    location: "San Francisco, CA",
    rating: 4.9,
    reviews: 127,
    hourlyRate: 150,
    icon: Building2,
    projects: 89,
  },
  {
    id: 2,
    name: "Michael Torres",
    profession: "General Contractor",
    specialty: "Custom Homes",
    location: "Los Angeles, CA",
    rating: 4.8,
    reviews: 94,
    hourlyRate: 125,
    icon: Hammer,
    projects: 156,
  },
  {
    id: 3,
    name: "Emily Watson",
    profession: "Interior Designer",
    specialty: "Contemporary",
    location: "Seattle, WA",
    rating: 5.0,
    reviews: 73,
    hourlyRate: 100,
    icon: Paintbrush,
    projects: 62,
  },
  {
    id: 4,
    name: "David Kim",
    profession: "Electrical Engineer",
    specialty: "Smart Homes",
    location: "Austin, TX",
    rating: 4.7,
    reviews: 58,
    hourlyRate: 90,
    icon: Wrench,
    projects: 104,
  },
]

function ProfessionalCard({ professional }: { professional: typeof professionals[0] }) {
  return (
    <div className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <professional.icon className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-foreground">{professional.name}</h3>
          <p className="text-sm text-muted-foreground">{professional.profession}</p>
        </div>
        <Badge variant="secondary">{professional.specialty}</Badge>
      </div>

      {/* Stats */}
      <div className="mt-4 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-primary text-primary" />
          <span className="font-medium text-foreground">{professional.rating}</span>
          <span className="text-muted-foreground">({professional.reviews})</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {professional.location}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <div>
          <p className="text-xs text-muted-foreground">Completed Projects</p>
          <p className="font-serif text-lg text-foreground">{professional.projects}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Starting at</p>
          <p className="font-serif text-lg text-foreground">${professional.hourlyRate}/hr</p>
        </div>
      </div>

      {/* CTA */}
      <Button variant="outline" className="mt-4 w-full" asChild>
        <Link href={`/marketplace/professionals/${professional.id}`}>
          View Profile
        </Link>
      </Button>
    </div>
  )
}

export function Professionals() {
  return (
    <section className="border-t border-border bg-card py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-primary">Professional Marketplace</p>
            <h2 className="mt-2 font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
              <span className="text-balance">Work with Trusted Experts</span>
            </h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Connect with verified architects, builders, and design professionals to bring your vision to life.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/marketplace/professionals" className="gap-2">
              Browse All Professionals
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Professionals Grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {professionals.map((professional) => (
            <ProfessionalCard key={professional.id} professional={professional} />
          ))}
        </div>
      </div>
    </section>
  )
}
