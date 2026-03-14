"use client"

import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Users, FileText, ArrowRight, Star, MapPin, Sparkles, DraftingCompass } from "lucide-react"
import { motion } from "framer-motion"
import { useProfessionals } from "@/hooks/api/use-professionals"
import { useFloorPlans } from "@/hooks/api/use-floor-plans"
import { Spinner } from "@/components/ui/spinner"

export default function MarketplacePage() {
  const { data: professionals, isLoading: loadingPro } = useProfessionals()
  const { data: floorPlans, isLoading: loadingPlans } = useFloorPlans()

  const featuredProfessionals = (professionals || []).slice(0, 4)
  const featuredPlans = (floorPlans || []).slice(0, 3)

  return (
    <main className="min-h-screen bg-background selection:bg-primary/30">
      <Navbar />

      {/* Hero Section - More Vibrant */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-accent/10 via-background to-transparent" />
        <div className="absolute top-[15%] left-[10%] w-[400px] h-[400px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[5%] w-[300px] h-[300px] bg-accent/20 rounded-full blur-[100px] animate-pulse delay-1000" />

        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-accent border border-accent/20 mb-6 shadow-lg backdrop-blur-md">
              <Sparkles className="h-4 w-4" />
              Build Your Dream
            </div>
            <h1 className="font-serif text-5xl font-bold tracking-tight text-foreground sm:text-7xl leading-[1.1]">
              Development <span className="text-gradient">Marketplace</span>
            </h1>
            <p className="mt-8 text-xl font-medium text-muted-foreground/80 leading-relaxed">
              From blueprints to final brick. Connect with elite architects and builders 
              to transform your land into a masterpiece.
            </p>
          </motion.div>

          {/* Category Cards - Glossy */}
          <div className="mt-20 grid gap-8 sm:grid-cols-3">
            <motion.div whileHover={{ y: -10 }} transition={{ type: "spring", stiffness: 300 }}>
              <Link href="/marketplace/professionals" className="group block h-full">
                <div className="flex flex-col items-center h-full rounded-[2.5rem] border border-white/20 bg-white/5 p-10 text-center backdrop-blur-md shadow-2xl transition-all hover:border-primary/50 group-hover:bg-white/10">
                  <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-primary/20 border border-primary/30 shadow-lg mb-6 group-hover:scale-110 transition-transform">
                    <Users className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">General Experts</h3>
                  <p className="mt-4 text-base font-medium text-muted-foreground/70">
                    Verified contractors, masons, and project managers
                  </p>
                  <div className="mt-auto pt-8 flex items-center gap-2 text-sm font-bold text-primary">
                    Find Professionals
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                  </div>
                </div>
              </Link>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} transition={{ type: "spring", stiffness: 300, delay: 0.1 }}>
              <Link href="/marketplace/professionals?category=architect" className="group block h-full">
                <div className="flex flex-col items-center h-full rounded-[2.5rem] border border-white/20 bg-white/5 p-10 text-center backdrop-blur-md shadow-2xl transition-all hover:border-accent/50 group-hover:bg-white/10">
                  <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-accent/20 border border-accent/30 shadow-lg mb-6 group-hover:scale-110 transition-transform">
                    <DraftingCompass className="h-10 w-10 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Elite Architects</h3>
                  <p className="mt-4 text-base font-medium text-muted-foreground/70">
                    Custom architectural designs and immersive planning
                  </p>
                  <div className="mt-auto pt-8 flex items-center gap-2 text-sm font-bold text-accent">
                    Hire Architects
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                  </div>
                </div>
              </Link>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} transition={{ type: "spring", stiffness: 300, delay: 0.2 }}>
              <Link href="/marketplace/floor-plans" className="group block h-full">
                <div className="flex flex-col items-center h-full rounded-[2.5rem] border border-white/20 bg-white/5 p-10 text-center backdrop-blur-md shadow-2xl transition-all hover:border-primary/50 group-hover:bg-white/10">
                  <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-primary/20 border border-primary/30 shadow-lg mb-6 group-hover:scale-110 transition-transform">
                    <FileText className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Floor Plans</h3>
                  <p className="mt-4 text-base font-medium text-muted-foreground/70">
                    Downloadable, ready-to-build architectural blueprints
                  </p>
                  <div className="mt-auto pt-8 flex items-center gap-2 text-sm font-bold text-primary">
                    Browse Plans
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Professionals - Colorful Grid */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary border border-primary/20 mb-4">
                <Star className="h-3 w-3 fill-primary" />
                Top Rated
              </div>
              <h2 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Featured <span className="text-gradient">Experts</span>
              </h2>
            </div>
            <Button variant="outline" asChild className="rounded-full border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 px-8 py-6 font-bold">
              <Link href="/marketplace/professionals" className="gap-2">
                View All Experts
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>

          {loadingPro ? (
            <div className="flex h-64 items-center justify-center">
              <Spinner className="h-10 w-10 text-primary" />
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProfessionals.map((pro, index) => {
                const name = pro.user?.full_name || "Professional";
                return (
                  <motion.div
                    key={pro.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Link 
                      href={`/marketplace/professionals/${pro.id}`}
                      className="group block h-full"
                    >
                      <div className="h-full rounded-[2.5rem] border border-white/20 bg-white/5 p-8 backdrop-blur-md shadow-xl transition-all hover:border-primary/50 group-hover:bg-white/10 group-hover:-translate-y-2">
                        <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-primary to-accent shadow-lg mb-6">
                          <span className="font-serif text-2xl font-bold text-white">
                            {name.split(" ").map((n: string) => n[0]).join("")}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{name}</h3>
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-1">{pro.profession}</p>
                        
                        <div className="mt-6 flex items-center gap-2">
                          <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                            <Star className="h-4 w-4 fill-primary text-primary" />
                            <span className="font-bold text-primary">4.9</span>
                          </div>
                          <span className="text-xs font-bold text-muted-foreground">(24 reviews)</span>
                        </div>

                        <div className="mt-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <MapPin className="h-4 w-4 text-accent" />
                          Remote / Local
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/10">
                          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                            Rate: <span className="text-lg text-foreground ml-1">${pro.hourly_rate}/hr</span>
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Floor Plans - Immersive Grid */}
      <section className="relative py-24 bg-white/5 border-t border-white/10">
        <div className="absolute left-0 bottom-0 w-full h-full bg-[linear-gradient(to_right,oklch(var(--primary)_/_0.03)_1px,transparent_1px),linear-gradient(to_bottom,oklch(var(--primary)_/_0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-accent border border-accent/20 mb-4">
                <FileText className="h-3 w-3" />
                New Designs
              </div>
              <h2 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Ready <span className="text-gradient">Floor Plans</span>
              </h2>
            </div>
            <Button variant="outline" asChild className="rounded-full border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 px-8 py-6 font-bold">
              <Link href="/marketplace/floor-plans" className="gap-2">
                Browse All Plans
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>

          {loadingPlans ? (
            <div className="flex h-64 items-center justify-center">
              <Spinner className="h-10 w-10 text-accent" />
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featuredPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link 
                    href={`/marketplace/floor-plans/${plan.id}`}
                    className="group block h-full"
                  >
                    <div className="overflow-hidden h-full rounded-[2.5rem] border border-white/20 bg-background/50 backdrop-blur-md shadow-xl transition-all hover:border-accent/50 group-hover:bg-background/80 group-hover:-translate-y-2">
                      <div className="relative aspect-[16/10] bg-muted/20 overflow-hidden">
                        {/* Pattern Background for plan placeholder */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,oklch(var(--accent)_/_0.1)_0%,transparent_70%)]" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-20 w-20 rounded-[1.5rem] bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner">
                            <FileText className="h-10 w-10 text-accent/40" />
                          </div>
                        </div>
                        <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest border border-white/20">
                          {plan.rating} Rating
                        </div>
                      </div>
                      <div className="p-8">
                        <h3 className="text-2xl font-bold text-foreground group-hover:text-accent transition-colors">{plan.title}</h3>
                        <p className="mt-1 text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                          by <span className="text-foreground">{plan.architectName}</span>
                        </p>
                        
                        <div className="mt-8 flex items-center gap-4">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Area</span>
                            <span className="text-sm font-bold text-foreground">{plan.sqft.toLocaleString()} sqft</span>
                          </div>
                          <div className="h-8 w-px bg-white/10" />
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Beds</span>
                            <span className="text-sm font-bold text-foreground">{plan.bedrooms}</span>
                          </div>
                          <div className="h-8 w-px bg-white/10" />
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Baths</span>
                            <span className="text-sm font-bold text-foreground">{plan.bathrooms}</span>
                          </div>
                        </div>

                        <div className="mt-8 flex items-center justify-between pt-6 border-t border-white/10">
                          <p className="font-serif text-3xl font-bold text-accent">${plan.price.toLocaleString()}</p>
                          <div className="h-12 w-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
                            <ArrowRight className="h-6 w-6" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
