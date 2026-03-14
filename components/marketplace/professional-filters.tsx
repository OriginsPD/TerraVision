"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Search, SlidersHorizontal, X } from "lucide-react"

const professionTypes = [
  { id: "architect", label: "Architect" },
  { id: "contractor", label: "General Contractor" },
  { id: "mason", label: "Mason" },
  { id: "carpenter", label: "Carpenter" },
  { id: "electrician", label: "Electrician" },
  { id: "plumber", label: "Plumber" },
  { id: "interior_designer", label: "Interior Designer" },
]

const ratings = [
  { id: "5", label: "5 Stars" },
  { id: "4", label: "4+ Stars" },
  { id: "3", label: "3+ Stars" },
]

export function ProfessionalFilters() {
  const [rateRange, setRateRange] = useState([0, 200])
  const [selectedProfessions, setSelectedProfessions] = useState<string[]>([])
  const [selectedRating, setSelectedRating] = useState<string | null>(null)
  const [verifiedOnly, setVerifiedOnly] = useState(false)

  const toggleProfession = (professionId: string) => {
    setSelectedProfessions(prev =>
      prev.includes(professionId) ? prev.filter(p => p !== professionId) : [...prev, professionId]
    )
  }

  const clearFilters = () => {
    setRateRange([0, 200])
    setSelectedProfessions([])
    setSelectedRating(null)
    setVerifiedOnly(false)
  }

  const hasActiveFilters = selectedProfessions.length > 0 || selectedRating || verifiedOnly || rateRange[0] > 0 || rateRange[1] < 200

  return (
    <div className="sticky top-24 space-y-6 rounded-xl border border-border bg-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-primary" />
          <h3 className="font-medium text-foreground">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 gap-1 text-xs">
            <X className="h-3 w-3" />
            Clear
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search" className="text-sm text-muted-foreground">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input id="search" placeholder="Name or specialty..." className="pl-9" />
        </div>
      </div>

      {/* Profession Type */}
      <div className="space-y-3">
        <Label className="text-sm text-muted-foreground">Profession</Label>
        <div className="space-y-2">
          {professionTypes.map((profession) => (
            <div key={profession.id} className="flex items-center gap-2">
              <Checkbox
                id={profession.id}
                checked={selectedProfessions.includes(profession.id)}
                onCheckedChange={() => toggleProfession(profession.id)}
              />
              <label htmlFor={profession.id} className="cursor-pointer text-sm text-foreground">
                {profession.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Hourly Rate */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm text-muted-foreground">Hourly Rate</Label>
          <span className="text-xs text-muted-foreground">
            ${rateRange[0]} - ${rateRange[1]}+
          </span>
        </div>
        <Slider
          value={rateRange}
          onValueChange={setRateRange}
          min={0}
          max={200}
          step={10}
          className="py-2"
        />
      </div>

      {/* Rating */}
      <div className="space-y-3">
        <Label className="text-sm text-muted-foreground">Minimum Rating</Label>
        <div className="space-y-2">
          {ratings.map((rating) => (
            <div key={rating.id} className="flex items-center gap-2">
              <Checkbox
                id={`rating-${rating.id}`}
                checked={selectedRating === rating.id}
                onCheckedChange={() => setSelectedRating(selectedRating === rating.id ? null : rating.id)}
              />
              <label htmlFor={`rating-${rating.id}`} className="cursor-pointer text-sm text-foreground">
                {rating.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Only */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="verified"
          checked={verifiedOnly}
          onCheckedChange={(checked) => setVerifiedOnly(checked as boolean)}
        />
        <label htmlFor="verified" className="cursor-pointer text-sm text-foreground">
          Verified professionals only
        </label>
      </div>

      {/* Apply Button */}
      <Button className="w-full">Apply Filters</Button>
    </div>
  )
}
