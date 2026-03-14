"use client"

import { useMemo } from "react"
import { notFound, useParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PropertyViewer } from "@/components/properties/property-viewer"
import { PropertyDetails } from "@/components/properties/property-details"
import { PropertyContact } from "@/components/properties/property-contact"
import { SimilarProperties } from "@/components/properties/similar-properties"
import { Spinner } from "@/components/ui/spinner"
import { useProperty, useProperties } from "@/hooks/api/use-properties"
import { motion } from "framer-motion"
import { Sparkles, MapPin, Box, ArrowLeft, Share2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FavoriteButton } from "@/components/ui/favorite-button"

export default function PropertyPage() {
  const { id } = useParams()
  const propertyId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : ''
  
  const { data: property, isLoading, error } = useProperty(propertyId)
  const { data: allProperties } = useProperties()

  const similarProperties = useMemo(() => {
    if (!allProperties || !property) return []
    return allProperties
      .filter(p => p.id !== propertyId)
      .slice(0, 3)
  }, [allProperties, property, propertyId])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
          <Spinner className="h-16 w-16 text-primary relative z-10" />
        </div>
        <p className="mt-6 text-xl font-bold text-muted-foreground animate-pulse">Loading Immersive Experience...</p>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center text-center p-8 bg-background">
         <div className="h-20 w-20 rounded-[2rem] bg-white/10 flex items-center justify-center mb-6 border border-white/20 shadow-xl">
            <Box className="h-10 w-10 text-muted-foreground/50" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Property Not Found</h1>
          <p className="text-xl text-muted-foreground max-w-md mb-8">We couldn't find the property you're looking for. It might have been sold or removed.</p>
          <Button variant="glossy" asChild className="rounded-full px-10 py-7 text-lg">
            <Link href="/properties">Return to Marketplace</Link>
          </Button>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background selection:bg-primary/30">
      <Navbar />

      <div className="pt-20">
        {/* Navigation & Actions Bar */}
        <div className="glass sticky top-20 z-40 border-b border-white/10 px-4 py-3 shadow-lg">
          <div className="mx-auto max-w-7xl flex items-center justify-between">
            <Link href="/properties" className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Listings
            </Link>
            <div className="flex items-center gap-3">
              <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <Share2 className="h-5 w-5 text-foreground" />
              </button>
              <FavoriteButton propertyId={property.id} />
              <Button variant="glossy" className="rounded-xl px-6 h-10 font-bold shadow-lg shadow-primary/20">
                Contact Agent
              </Button>
            </div>
          </div>
        </div>

        {/* 3D Viewer / Gallery Section */}
        <section className="relative w-full overflow-hidden">
          <PropertyViewer property={property} />
        </section>

        {/* Content Section */}
        <section className="relative py-16">
          {/* Background Decorative Element */}
          <div className="absolute top-[10%] right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] -z-10" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px] -z-10" />

          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
              {/* Main Content */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <PropertyDetails property={property} />
              </motion.div>

              {/* Sidebar */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:sticky lg:top-40 lg:self-start"
              >
                <PropertyContact property={property} />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Similar Properties */}
        {similarProperties.length > 0 && (
          <section className="py-24 border-t border-white/10 bg-white/5">
            <SimilarProperties properties={similarProperties} />
          </section>
        )}
      </div>

      <Footer />
    </main>
  )
}
