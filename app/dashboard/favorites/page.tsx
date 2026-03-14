"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { MapPin, Box, Heart, Trash2, Sparkles, ArrowRight, Maximize2, Share2 } from "lucide-react"
import { useFavorites, useRemoveFavorite } from "@/hooks/api/use-favorites"
import { Spinner } from "@/components/ui/spinner"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export default function FavoritesPage() {
  const { data: savedProperties, isLoading } = useFavorites()
  const { mutate: remove, isPending: isRemoving } = useRemoveFavorite()

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-20">
        <Spinner className="h-12 w-12 text-primary" />
        <p className="mt-4 text-sm font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Accessing Vault</p>
      </div>
    )
  }

  return (
    <main className="flex-1 p-6 lg:p-10 bg-background/50 relative overflow-hidden">
      {/* Background Decorative */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] -z-10" />

      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-12 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary border border-primary/20 mb-4">
              <Heart className="h-3 w-3 fill-primary" />
              Your Collection
            </div>
            <h1 className="font-serif text-5xl font-bold tracking-tight text-foreground">Saved <span className="text-gradient">Properties</span></h1>
            <p className="mt-2 text-lg font-medium text-muted-foreground/80">
              {savedProperties?.length || 0} properties waiting for your vision.
            </p>
          </motion.div>
          
          <Button variant="outline" asChild className="rounded-2xl border-white/10 bg-white/5 font-bold px-8 py-6">
            <Link href="/properties">Continue Exploring</Link>
          </Button>
        </div>

        {(!savedProperties || savedProperties.length === 0) ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Empty className="glass rounded-[3rem] border-white/10 p-20 shadow-2xl">
              <EmptyMedia className="h-20 w-20 rounded-3xl bg-primary/20 flex items-center justify-center border border-primary/30 mb-6 shadow-lg">
                <Heart className="size-10 text-primary" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle className="text-3xl font-serif font-bold">Your vault is empty</EmptyTitle>
                <EmptyDescription className="text-lg font-medium text-muted-foreground max-w-sm mx-auto">Start exploring immersive 3D properties and save the ones that inspire you.</EmptyDescription>
              </EmptyHeader>
              <EmptyContent className="mt-10">
                <Button asChild variant="glossy" className="rounded-2xl px-10 py-7 text-lg font-bold shadow-xl shadow-primary/20">
                  <Link href="/properties">Browse Marketplace</Link>
                </Button>
              </EmptyContent>
            </Empty>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            <AnimatePresence mode="popLayout">
              {savedProperties.map((property: any, index: number) => {
                const imageUrl = property.image_url?.startsWith('http') || property.image_url?.startsWith('/')
                  ? property.image_url 
                  : `http://localhost:8000${property.image_url}`;

                return (
                  <motion.div
                    key={property.property_id || property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="glass border-white/10 hover:border-primary/30 transition-all hover:shadow-2xl group overflow-hidden rounded-[2.5rem]">
                      <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row">
                          {/* Image */}
                          <div className="relative aspect-[16/9] w-full overflow-hidden sm:aspect-square sm:w-64">
                            <img 
                              src={imageUrl || "/placeholder.jpg"} 
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                              alt={property.title} 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40" />
                            <Badge className="absolute left-4 top-4 bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold uppercase tracking-widest text-[10px] px-3 py-1">
                              LAND
                            </Badge>
                          </div>

                          {/* Content */}
                          <div className="flex flex-1 flex-col justify-between p-8">
                            <div>
                              <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                  <Link href={`/properties/${property.property_id || property.id}`} className="group/title">
                                    <h3 className="text-2xl font-bold text-foreground group-hover/title:text-primary transition-colors">
                                      {property.title}
                                    </h3>
                                  </Link>
                                  <div className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    {property.location}
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl bg-white/5 border-white/10 hover:bg-white/10">
                                    <Share2 className="h-5 w-5" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-11 w-11 rounded-xl bg-white/5 border-white/10 hover:bg-rose-500/20 hover:text-rose-500 hover:border-rose-500/30 transition-all"
                                    onClick={() => remove(property.property_id || property.id.toString())}
                                    disabled={isRemoving}
                                  >
                                    <Trash2 className="h-5 w-5" />
                                  </Button>
                                </div>
                              </div>
                              <p className="mt-4 line-clamp-2 text-base font-medium text-muted-foreground/80 leading-relaxed">
                                Beautiful property located in {property.location} with massive development potential. Experience it in full 3D.
                              </p>
                            </div>

                            <div className="mt-8 flex flex-wrap items-center justify-between gap-6 border-t border-white/10 pt-6">
                              <div className="flex items-center gap-8">
                                <div className="flex flex-col">
                                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Price</span>
                                  <p className="font-serif text-3xl font-bold text-primary">${property.price.toLocaleString()}</p>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Area</span>
                                  <div className="flex items-center gap-1.5 text-lg font-bold text-foreground">
                                    <Maximize2 className="h-4 w-4 text-accent" />
                                    <span>2.5 Acres</span>
                                  </div>
                                </div>
                              </div>
                              <Button variant="glossy" asChild className="rounded-2xl px-8 py-6 font-bold shadow-lg shadow-primary/20">
                                <Link href={`/properties/${property.property_id || property.id}`} className="gap-2">
                                  Enter 3D Experience
                                  <ArrowRight className="h-5 w-5" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </AnimatePresence>

            {/* Smart Matching Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="rounded-[3rem] bg-gradient-to-br from-primary/20 to-accent/20 border border-white/20 p-10 relative overflow-hidden group shadow-xl mt-8"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <Sparkles className="h-32 w-32 text-white" />
              </div>
              <div className="relative z-10 max-w-2xl">
                <div className="flex items-center gap-3 mb-6">
                   <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-md">
                      <Sparkles className="h-5 w-5 text-white" />
                   </div>
                   <span className="text-xs font-bold text-white uppercase tracking-widest">AI Discovery</span>
                </div>
                <h2 className="text-3xl font-serif font-bold text-white mb-4">Want more like these?</h2>
                <p className="text-xl font-medium text-white/70 leading-relaxed mb-8">
                  Our algorithm analyzes your collection to find similar premium land and expert architects matched to your taste.
                </p>
                <Button className="bg-white text-primary hover:bg-white/90 rounded-2xl font-bold px-10 py-7 text-lg shadow-2xl">
                  Enable Smart Matching
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </main>
  )
}
