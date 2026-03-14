"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, MapPin, Maximize2, Box, Heart, Sparkles } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"

const properties = [
  {
    id: 1,
    title: "Hillside Estate",
    location: "Countryside, CA",
    price: 450000,
    size: "2.5 acres",
    type: "Land",
    has3D: true,
    featured: true,
    image: "/properties/hillside.jpg",
  },
  {
    id: 2,
    title: "Lakefront Plot",
    location: "Lake Tahoe, NV",
    price: 680000,
    size: "1.8 acres",
    type: "Waterfront",
    has3D: true,
    featured: false,
    image: "/properties/lakefront.jpg",
  },
  {
    id: 3,
    title: "Mountain View Lot",
    location: "Aspen, CO",
    price: 520000,
    size: "3.2 acres",
    type: "Mountain",
    has3D: true,
    featured: false,
    image: "/properties/mountain.jpg",
  },
  {
    id: 4,
    title: "Desert Oasis",
    location: "Scottsdale, AZ",
    price: 320000,
    size: "4.0 acres",
    type: "Desert",
    has3D: false,
    featured: false,
    image: "/properties/desert.jpg",
  },
]

function PropertyCard({ property, index }: { property: typeof properties[0], index: number }) {
  const [liked, setLiked] = useState(false)

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/5 backdrop-blur-md transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* Colorful Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-accent/30 z-10 opacity-60 transition-opacity group-hover:opacity-40" />
        
        {/* Placeholder content */}
        <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
          <div className="text-center">
            <Box className="mx-auto h-16 w-16 text-primary/40" />
            <p className="mt-2 text-sm font-bold text-foreground/40">{property.title}</p>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute left-4 top-4 flex gap-2 z-20">
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
        <button
          onClick={() => setLiked(!liked)}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 border border-white/30 backdrop-blur-md transition-all hover:bg-white/40 active:scale-90"
        >
          <Heart className={`h-5 w-5 transition-all ${liked ? "fill-primary text-primary" : "text-white"}`} />
        </button>

        {/* View Details Hover Overlay */}
        <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 bg-black/20 backdrop-blur-[2px]">
          <Button variant="glossy" size="sm" className="rounded-full px-6 py-5 font-bold shadow-xl">
            View Details
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-xl text-foreground tracking-tight group-hover:text-primary transition-colors">{property.title}</h3>
            <div className="mt-1 flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              {property.location}
            </div>
          </div>
          <Badge variant="outline" className="border-primary/30 text-primary font-bold bg-primary/5">{property.type}</Badge>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Price</span>
            <p className="font-serif text-2xl font-bold text-foreground">${property.price.toLocaleString()}</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Size</span>
            <div className="flex items-center gap-1.5 text-sm font-bold text-foreground">
              <Maximize2 className="h-4 w-4 text-accent" />
              {property.size}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function FeaturedProperties() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute left-[20%] top-[40%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute right-[20%] bottom-[10%] h-[500px] w-[500px] rounded-full bg-accent/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary border border-primary/20 mb-4">
              <Sparkles className="h-3 w-3" />
              Exclusive Selection
            </div>
            <h2 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Featured <span className="text-gradient">Properties</span>
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Button variant="outline" asChild className="rounded-full border-primary/30 bg-white/5 backdrop-blur-sm hover:bg-primary/10 px-8 py-6 text-base font-bold">
              <Link href="/properties" className="gap-2">
                View All Listings
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Properties Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {properties.map((property, index) => (
            <PropertyCard key={property.id} property={property} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
