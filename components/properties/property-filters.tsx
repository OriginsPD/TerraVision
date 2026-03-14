"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Search, SlidersHorizontal, X } from "lucide-react"

const propertyTypes = [
  { id: "land", label: "Land" },
  { id: "waterfront", label: "Waterfront" },
  { id: "mountain", label: "Mountain" },
  { id: "desert", label: "Desert" },
  { id: "urban", label: "Urban" },
  { id: "rural", label: "Rural" },
]

export interface FilterState {
  search: string
  priceRange: number[]
  sizeRange: number[]
  selectedTypes: string[]
}

interface PropertyFiltersProps {
  onFilterChange: (filters: FilterState) => void
}

export function PropertyFilters({ onFilterChange }: PropertyFiltersProps) {
  const [search, setSearch] = useState("")
  const [priceRange, setPriceRange] = useState([0, 3000000])
  const [sizeRange, setSizeRange] = useState([0, 20])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])

  const toggleType = (typeId: string) => {
    const next = selectedTypes.includes(typeId) 
      ? selectedTypes.filter(t => t !== typeId) 
      : [...selectedTypes, typeId]
    setSelectedTypes(next)
    onFilterChange({ search, priceRange, sizeRange, selectedTypes: next })
  }

  const handleApply = () => {
    onFilterChange({ search, priceRange, sizeRange, selectedTypes })
  }

  const clearFilters = () => {
    setSearch("")
    setPriceRange([0, 3000000])
    setSizeRange([0, 20])
    setSelectedTypes([])
    onFilterChange({ search: "", priceRange: [0, 3000000], sizeRange: [0, 20], selectedTypes: [] })
  }

  const hasActiveFilters = selectedTypes.length > 0 || priceRange[0] > 0 || priceRange[1] < 3000000 || sizeRange[0] > 0 || sizeRange[1] < 20 || search !== ""

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
          <Input 
            id="search" 
            placeholder="Location or title..." 
            className="pl-9" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Property Type */}
      <div className="space-y-3">
        <Label className="text-sm text-muted-foreground">Property Type</Label>
        <div className="space-y-2">
          {propertyTypes.map((type) => (
            <div key={type.id} className="flex items-center gap-2">
              <Checkbox
                id={type.id}
                checked={selectedTypes.includes(type.id)}
                onCheckedChange={() => toggleType(type.id)}
              />
              <label htmlFor={type.id} className="cursor-pointer text-sm text-foreground">
                {type.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm text-muted-foreground">Price Range</Label>
          <span className="text-xs text-muted-foreground">
            ${(priceRange[0] / 1000).toFixed(0)}k - ${(priceRange[1] / 1000000).toFixed(1)}M
          </span>
        </div>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          min={0}
          max={3000000}
          step={50000}
          className="py-2"
        />
      </div>

      {/* Size Range */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm text-muted-foreground">Land Size (acres)</Label>
          <span className="text-xs text-muted-foreground">
            {sizeRange[0]} - {sizeRange[1]} acres
          </span>
        </div>
        <Slider
          value={sizeRange}
          onValueChange={setSizeRange}
          min={0}
          max={20}
          step={0.5}
          className="py-2"
        />
      </div>

      {/* Apply Button */}
      <Button className="w-full" onClick={handleApply}>Apply Filters</Button>
    </div>
  )
}
