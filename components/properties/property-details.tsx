"use client"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Maximize2, Calendar, User, CheckCircle2, Info, LayoutGrid, Sparkles } from "lucide-react"
import type { Property } from "@/lib/data"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"

const PropertyMap = dynamic(() => import("./property-map"), { 
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-white/5 animate-pulse rounded-[3rem] min-h-[300px] border border-white/10">
      <MapPin className="h-8 w-8 text-primary/40" />
    </div>
  )
})

interface PropertyDetailsProps {
  property: Property
}

export function PropertyDetails({ property }: PropertyDetailsProps) {
  const typeColors: Record<Property["type"] | string, string> = {
    land: "border-emerald-500/30 text-emerald-500 bg-emerald-500/10",
    waterfront: "border-blue-500/30 text-blue-500 bg-blue-500/10",
    mountain: "border-slate-500/30 text-slate-400 bg-slate-500/10",
    desert: "border-amber-500/30 text-amber-500 bg-amber-500/10",
    urban: "border-pink-500/30 text-pink-400 bg-pink-500/10",
    rural: "border-emerald-500/30 text-emerald-500 bg-emerald-500/10",
  }

  const statusColors: Record<Property["status"] | string, string> = {
    available: "border-emerald-500/30 text-emerald-500 bg-emerald-500/10",
    pending: "border-amber-500/30 text-amber-500 bg-amber-500/10",
    sold: "border-rose-500/30 text-rose-500 bg-rose-500/10",
  }

  return (
    <div className="space-y-12">
      {/* Header Area */}
      <div>
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Badge variant="outline" className={cn("px-4 py-1.5 rounded-full font-bold uppercase tracking-wider text-[10px]", typeColors[property.type] || typeColors.rural)}>
            {property.type}
          </Badge>
          <Badge variant="outline" className={cn("px-4 py-1.5 rounded-full font-bold uppercase tracking-wider text-[10px]", statusColors[property.status] || statusColors.available)}>
            {property.status}
          </Badge>
          {property.featured && (
            <Badge className="bg-gradient-to-r from-primary to-accent text-white border-none shadow-lg px-4 py-1.5 rounded-full font-bold uppercase tracking-wider text-[10px]">
              <Sparkles className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
        </div>

        <h1 className="font-serif text-5xl font-bold tracking-tight text-foreground sm:text-6xl leading-[1.1]">
          {property.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-6 text-muted-foreground">
          <div className="flex items-center gap-2 font-semibold">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <span>{property.address}</span>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-8 bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-md shadow-xl">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Asking Price</span>
            <p className="font-serif text-5xl font-bold text-primary">${property.price.toLocaleString()}</p>
          </div>
          <div className="h-16 w-px bg-white/10 hidden sm:block" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Area</span>
            <div className="flex items-center gap-2 text-2xl font-bold text-foreground">
              <Maximize2 className="h-6 w-6 text-accent" />
              <span>{property.size} {property.sizeUnit}</span>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-white/10" />

      {/* Description Section */}
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
           <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
             <div className="h-10 w-10 rounded-2xl bg-primary/20 flex items-center justify-center">
               <Info className="h-5 w-5 text-primary" />
             </div>
             About
           </h2>
        </div>
        <div className="lg:col-span-8">
          <p className="text-xl leading-relaxed text-muted-foreground font-medium">{property.description}</p>
        </div>
      </div>

      <Separator className="bg-white/10" />

      {/* Amenities Section */}
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
           <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
             <div className="h-10 w-10 rounded-2xl bg-accent/20 flex items-center justify-center">
               <CheckCircle2 className="h-5 w-5 text-accent" />
             </div>
             Amenities
           </h2>
        </div>
        <div className="lg:col-span-8">
          <div className="grid gap-6 sm:grid-cols-2">
            {property.amenities.map((amenity) => (
              <div key={amenity} className="flex items-center gap-4 bg-white/5 border border-white/10 p-5 rounded-3xl hover:bg-white/10 transition-colors group">
                <div className="h-8 w-8 rounded-xl bg-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                </div>
                <span className="text-lg font-bold text-foreground/80">{amenity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Separator className="bg-white/10" />

      {/* Technical Specs Section */}
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
           <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
             <div className="h-10 w-10 rounded-2xl bg-primary/20 flex items-center justify-center">
               <LayoutGrid className="h-5 w-5 text-primary" />
             </div>
             Specifications
           </h2>
        </div>
        <div className="lg:col-span-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 hover:shadow-xl transition-shadow">
              <dt className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Property Type</dt>
              <dd className="text-xl font-bold text-foreground capitalize">{property.type}</dd>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 hover:shadow-xl transition-shadow">
              <dt className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Land Size</dt>
              <dd className="text-xl font-bold text-foreground">{property.size} {property.sizeUnit}</dd>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 hover:shadow-xl transition-shadow">
              <dt className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">3D Immersive Experience</dt>
              <dd className="flex items-center gap-2 text-xl font-bold text-foreground">
                 {property.has3D ? (
                    <>
                      <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                      Available
                    </>
                 ) : "Not Available"}
              </dd>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 hover:shadow-xl transition-shadow">
              <dt className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Listing Reference</dt>
              <dd className="text-xl font-bold text-foreground">TV-{property.id.padStart(6, '0')}</dd>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-white/10" />

      {/* Listing Meta Info */}
      <div className="flex flex-wrap items-center justify-between gap-6 glass p-8 rounded-[2.5rem] border border-white/10">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-lg">
            <User className="h-7 w-7 text-primary" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Listed by</p>
            <p className="text-xl font-bold text-foreground">{property.ownerName}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-accent/20 flex items-center justify-center border border-accent/30 shadow-lg">
            <Calendar className="h-7 w-7 text-accent" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Posted On</p>
            <p className="text-xl font-bold text-foreground">{new Date(property.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
          </div>
        </div>
      </div>

      {/* Location Map */}
      <div className="relative group">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-primary/20 flex items-center justify-center">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          Location Overview
        </h2>
        <div className="relative aspect-[21/9] overflow-hidden rounded-[3rem] shadow-2xl min-h-[300px] border-4 border-white/10 group-hover:border-primary/20 transition-all duration-500">
          <PropertyMap address={property.address} title={property.title} />
        </div>
      </div>
    </div>
  )
}
