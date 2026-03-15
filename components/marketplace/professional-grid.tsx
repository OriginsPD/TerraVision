"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, MapPin, CheckCircle2, Briefcase, Grid3X3, List } from "lucide-react"
import type { Professional } from "@/lib/data"

interface ProfessionalGridProps {
  professionals: Professional[]
}

const professionLabels: Record<Professional["profession"], string> = {
  architect: "Architect",
  contractor: "General Contractor",
  mason: "Mason",
  carpenter: "Carpenter",
  electrician: "Electrician",
  plumber: "Plumber",
  interior_designer: "Interior Designer",
  designer: "Interior Designer",
}

const professionColors: Record<Professional["profession"], string> = {
  architect: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  contractor: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  mason: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  carpenter: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  electrician: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  plumber: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  interior_designer: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  designer: "bg-pink-500/10 text-pink-400 border-pink-500/20",
}

function ProfessionalCard({ professional }: { professional: Professional }) {
  return (
    <Link href={`/marketplace/professionals/${professional.id}`} className="group block">
      <div className="rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <span className="font-serif text-xl text-primary">
              {professional.name.split(" ").map(n => n[0]).join("")}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-medium text-foreground">{professional.name}</h3>
              {professional.verified && (
                <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-primary" />
              )}
            </div>
            <Badge variant="outline" className={`mt-1 ${professionColors[professional.profession]}`}>
              {professionLabels[professional.profession]}
            </Badge>
          </div>
        </div>

        {/* Specialty */}
        <p className="mt-3 text-sm text-muted-foreground">{professional.specialty}</p>

        {/* Stats */}
        <div className="mt-4 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="font-medium text-foreground">{professional.rating}</span>
            <span className="text-muted-foreground">({professional.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Briefcase className="h-3.5 w-3.5" />
            {professional.completedProjects} projects
          </div>
        </div>

        {/* Location */}
        <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {professional.location}
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <div>
            <p className="text-xs text-muted-foreground">Starting at</p>
            <p className="font-serif text-lg text-foreground">${professional.hourlyRate}/hr</p>
          </div>
          <Button variant="outline" size="sm">
            View Profile
          </Button>
        </div>
      </div>
    </Link>
  )
}

export function ProfessionalGrid({ professionals }: ProfessionalGridProps) {
  const [view, setView] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("rating")

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={view === "grid" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setView("grid")}
            className="h-9 w-9"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "list" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setView("list")}
            className="h-9 w-9"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="reviews">Most Reviews</SelectItem>
            <SelectItem value="projects">Most Projects</SelectItem>
            <SelectItem value="rate-asc">Rate: Low to High</SelectItem>
            <SelectItem value="rate-desc">Rate: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      <div className={view === "grid" ? "grid gap-6 sm:grid-cols-2 xl:grid-cols-3" : "space-y-4"}>
        {professionals.map((professional) => (
          <ProfessionalCard key={professional.id} professional={professional} />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-12 flex items-center justify-center gap-2">
        <Button variant="outline" disabled>
          Previous
        </Button>
        <div className="flex items-center gap-1">
          <Button variant="secondary" size="sm" className="h-9 w-9">
            1
          </Button>
          <Button variant="ghost" size="sm" className="h-9 w-9">
            2
          </Button>
        </div>
        <Button variant="outline">
          Next
        </Button>
      </div>
    </div>
  )
}
