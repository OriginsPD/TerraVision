"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Maximize2, Box, Grid3X3, List, Sparkles, ArrowUpRight } from "lucide-react"
import type { Property } from "@/lib/data"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { FavoriteButton } from "@/components/ui/favorite-button"

interface PropertyGridProps {
  properties: Property[]
}

function PropertyCard({ property, index, view }: { property: Property, index: number, view: "grid" | "list" }) {
  const typeColors: Record<Property["type"] | string, string> = {
    land: "border-emerald-500/30 text-emerald-500 bg-emerald-500/10",
    waterfront: "border-blue-500/30 text-blue-500 bg-blue-500/10",
    mountain: "border-slate-500/30 text-slate-400 bg-slate-500/10",
    desert: "border-amber-500/30 text-amber-500 bg-amber-500/10",
    urban: "border-pink-500/30 text-pink-400 bg-pink-500/10",
    rural: "border-emerald-500/30 text-emerald-500 bg-emerald-500/10",
  }

  const imageUrl = property.images[0]?.startsWith('http') || property.images[0]?.startsWith('/')
    ? property.images[0] 
    : `http://localhost:8000${property.images[0]}`;

  if (view === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="group relative flex flex-col md:flex-row gap-6 p-4 rounded-[2rem] border border-white/20 bg-white/5 backdrop-blur-md hover:border-primary/50 hover:shadow-2xl transition-all"
      >
        <div className="relative w-full md:w-72 aspect-[4/3] md:aspect-square shrink-0 overflow-hidden rounded-2xl">
          <img 
            src={imageUrl || "/placeholder.jpg"} 
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
          
          <FavoriteButton propertyId={property.id} className="absolute right-4 top-4" />
        </div>
        
        <div className="flex-1 flex flex-col justify-between py-2">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className={typeColors[property.type] || typeColors.rural}>
                {property.type}
              </Badge>
              <div className="flex gap-2">
                {property.has3D && <Badge className="bg-primary/20 text-primary border-primary/30">3D Ready</Badge>}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{property.title}</h3>
            <div className="flex items-center gap-2 text-muted-foreground font-medium mb-4">
              <MapPin className="h-4 w-4 text-primary" />
              {property.location}
            </div>
            <p className="text-muted-foreground line-clamp-2">{property.description}</p>
          </div>
          
          <div className="flex items-center justify-between mt-6 border-t border-white/10 pt-4">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Price</p>
                <p className="text-2xl font-serif font-bold text-foreground">${property.price.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Size</p>
                <p className="text-lg font-bold text-foreground flex items-center gap-1.5">
                  <Maximize2 className="h-4 w-4 text-accent" />
                  {property.size} {property.sizeUnit}
                </p>
              </div>
            </div>
            <Button variant="glossy" asChild className="rounded-full px-8 py-6">
              <Link href={`/properties/${property.id}`}>View Details</Link>
            </Button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-[2.5rem] border border-white/20 bg-white/5 backdrop-blur-md transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2"
    >
      <Link href={`/properties/${property.id}`} className="block">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {property.images[0] ? (
            <img 
              src={imageUrl} 
              alt={property.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Box className="h-16 w-16 text-primary/30" />
            </div>
          )}
          
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 opacity-40 z-10" />

          {/* Badges */}
          <div className="absolute left-4 top-4 flex flex-wrap gap-2 z-20">
            {property.featured && (
              <Badge className="bg-gradient-to-r from-primary to-accent text-white border-none shadow-lg px-3 py-1">
                <Sparkles className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
            {property.has3D && (
              <Badge variant="secondary" className="gap-1 bg-white/20 backdrop-blur-md border-white/20 text-foreground px-3 py-1">
                <Box className="h-3 w-3 text-primary" />
                3D Ready
              </Badge>
            )}
          </div>

          {/* Like Button */}
          <FavoriteButton propertyId={property.id} className="absolute right-4 top-4" />

          {/* View Details Hover Overlay */}
          <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 bg-black/20 backdrop-blur-[2px]">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/30 border border-white/50 text-white backdrop-blur-md shadow-2xl">
              <ArrowUpRight className="h-8 w-8" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-xl font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">{property.title}</h3>
              <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span className="truncate">{property.location}</span>
              </div>
            </div>
            <Badge variant="outline" className={cn("shrink-0", typeColors[property.type] || typeColors.rural)}>
              {property.type}
            </Badge>
          </div>

          <p className="mt-3 line-clamp-2 text-sm font-medium text-muted-foreground leading-relaxed">
            {property.description}
          </p>

          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Starting at</p>
              <p className="font-serif text-2xl font-bold text-foreground">${property.price.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-bold text-foreground bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
              <Maximize2 className="h-4 w-4 text-accent" />
              {property.size} {property.sizeUnit}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function PropertyGrid({ properties }: PropertyGridProps) {
  const [view, setView] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("newest")

  return (
    <div className="space-y-8">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass p-2 rounded-3xl border border-white/10 shadow-lg">
        <div className="flex items-center gap-2 p-1 bg-white/5 rounded-2xl w-full sm:w-auto">
          <Button
            variant={view === "grid" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setView("grid")}
            className={cn("h-10 w-10 rounded-xl", view === "grid" && "bg-primary text-primary-foreground shadow-lg shadow-primary/20")}
          >
            <Grid3X3 className="h-5 w-5" />
          </Button>
          <Button
            variant={view === "list" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setView("list")}
            className={cn("h-10 w-10 rounded-xl", view === "list" && "bg-primary text-primary-foreground shadow-lg shadow-primary/20")}
          >
            <List className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-sm font-bold text-muted-foreground whitespace-nowrap hidden sm:inline">Sort By</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48 rounded-2xl border-white/20 bg-white/5 backdrop-blur-md font-bold h-12">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="glass border-white/20 rounded-2xl p-1">
              <SelectItem value="newest" className="rounded-xl font-medium">Newest First</SelectItem>
              <SelectItem value="price-asc" className="rounded-xl font-medium">Price: Low to High</SelectItem>
              <SelectItem value="price-desc" className="rounded-xl font-medium">Price: High to Low</SelectItem>
              <SelectItem value="size-asc" className="rounded-xl font-medium">Size: Small to Large</SelectItem>
              <SelectItem value="size-desc" className="rounded-xl font-medium">Size: Large to Small</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid / List */}
      <AnimatePresence mode="popLayout">
        <div className={cn(
          "grid gap-8",
          view === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
        )}>
          {properties.map((property, index) => (
            <PropertyCard key={property.id} property={property} index={index} view={view} />
          ))}
        </div>
      </AnimatePresence>

      {/* Pagination */}
      <div className="mt-16 flex items-center justify-center gap-4">
        <Button variant="outline" disabled className="rounded-2xl px-6 py-6 border-white/20 bg-white/5 backdrop-blur-md opacity-50">
          Previous
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="glossy" size="sm" className="h-12 w-12 rounded-2xl text-lg font-bold">
            1
          </Button>
          <Button variant="outline" size="sm" className="h-12 w-12 rounded-2xl text-lg font-bold border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10">
            2
          </Button>
          <Button variant="outline" size="sm" className="h-12 w-12 rounded-2xl text-lg font-bold border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10">
            3
          </Button>
        </div>
        <Button variant="outline" className="rounded-2xl px-8 py-6 border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 font-bold">
          Next
        </Button>
      </div>
    </div>
  )
}
