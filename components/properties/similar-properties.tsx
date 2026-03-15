"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, MapPin, Maximize2, Box, Sparkles } from "lucide-react"
import type { Property } from "@/lib/data"
import { motion } from "framer-motion"
import { FavoriteButton } from "@/components/ui/favorite-button"

interface SimilarPropertiesProps {
  properties: Property[]
}

export function SimilarProperties({ properties }: SimilarPropertiesProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary border border-primary/20 mb-4">
            <Sparkles className="h-3 w-3" />
            Handpicked for you
          </div>
          <h2 className="font-serif text-4xl font-bold tracking-tight text-foreground">
            Similar <span className="text-gradient">Properties</span>
          </h2>
        </div>
        <Button variant="outline" asChild className="rounded-full border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 px-8 py-6 font-bold">
          <Link href="/properties" className="gap-2">
            Explore All Listings
            <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property, index) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="group relative">
              <Link href={`/properties/${property.id}`} className="block">
                <div className="overflow-hidden rounded-[2.5rem] border border-white/20 bg-white/5 backdrop-blur-md transition-all hover:border-primary/50 hover:shadow-2xl hover:-translate-y-2">
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {property.images[0] ? (
                      <img 
                        src={property.images[0].startsWith('http') || property.images[0].startsWith('/') ? property.images[0] : property.images[0]}
                        alt={property.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <Box className="h-12 w-12 text-primary/30" />
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />

                    {property.has3D && (
                      <Badge variant="secondary" className="absolute left-4 top-4 gap-1.5 bg-white/20 backdrop-blur-md border-white/20 text-foreground px-3 py-1 font-bold">
                        <Box className="h-3.5 w-3.5 text-primary" />
                        3D READY
                      </Badge>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors tracking-tight truncate">{property.title}</h3>
                    <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      {property.location}
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                      <p className="font-serif text-2xl font-bold text-foreground">${property.price.toLocaleString()}</p>
                      <div className="flex items-center gap-1.5 text-sm font-bold text-foreground bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                        <Maximize2 className="h-4 w-4 text-accent" />
                        {property.size} {property.sizeUnit}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
              {/* Favorite Button absolute positioned outside Link to avoid navigation */}
              <FavoriteButton propertyId={property.id} className="absolute right-4 top-4" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
