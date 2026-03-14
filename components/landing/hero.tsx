"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Box, MapPin, Users } from "lucide-react"
import { motion } from "framer-motion"

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(var(--primary)_/_0.05)_1px,transparent_1px),linear-gradient(to_bottom,oklch(var(--primary)_/_0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      {/* Gradient Orbs */}
      <div className="absolute left-[10%] top-[20%] h-[400px] w-[400px] rounded-full bg-primary/20 blur-[100px] animate-pulse" />
      <div className="absolute right-[10%] bottom-[20%] h-[400px] w-[400px] rounded-full bg-accent/20 blur-[100px] animate-pulse delay-1000" />

      <div className="relative mx-auto max-w-7xl px-4 py-24 lg:px-8 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-start"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-md shadow-lg">
              <Box className="h-4 w-4" />
              <span>Immersive 3D Property Visualization</span>
            </div>

            <h1 className="font-serif text-4xl leading-tight tracking-tight text-foreground sm:text-5xl lg:text-7xl">
              <span className="text-balance">Experience Real Estate</span>
              <br />
              <span className="text-gradient font-bold drop-shadow-sm">Like Never Before</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground/80">
              Discover properties in stunning 3D. Browse land, view immersive models, 
              hire architects, and build your dream home — all in one platform.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button size="lg" variant="glossy" asChild className="rounded-full px-8 py-7 text-lg">
                <Link href="/properties" className="gap-2">
                  Explore Properties
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="rounded-full border-primary/30 bg-white/5 backdrop-blur-sm hover:bg-primary/10 px-8 py-7 text-lg">
                <Link href="/how-it-works" className="gap-2">
                  <Play className="h-4 w-4 fill-primary text-primary" />
                  Watch Demo
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8 border-t border-primary/10 pt-8 w-full">
              <div>
                <p className="font-serif text-3xl text-primary font-bold">2,400+</p>
                <p className="mt-1 text-sm font-medium text-muted-foreground">Active Listings</p>
              </div>
              <div>
                <p className="font-serif text-3xl text-accent font-bold">850+</p>
                <p className="mt-1 text-sm font-medium text-muted-foreground">Professionals</p>
              </div>
              <div>
                <p className="font-serif text-3xl text-primary font-bold">98%</p>
                <p className="mt-1 text-sm font-medium text-muted-foreground">Satisfaction</p>
              </div>
            </div>
          </motion.div>

          {/* 3D Viewer Preview */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem] border-4 border-white/20 bg-card shadow-2xl backdrop-blur-xl">
              {/* Simulated 3D Scene */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10">
                {/* Grid Floor */}
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-[linear-gradient(to_right,oklch(var(--primary)_/_0.1)_1px,transparent_1px),linear-gradient(to_top,oklch(var(--primary)_/_0.1)_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:linear-gradient(to_top,#000_40%,transparent_100%)] [transform:perspective(500px)_rotateX(60deg)]" />
                
                {/* House Silhouette - Replaced with more colorful version */}
                <div className="absolute bottom-1/4 left-1/2 flex -translate-x-1/2 flex-col items-center">
                  <div className="h-24 w-32 border-l-[3rem] border-r-[3rem] border-t-[2rem] border-l-transparent border-r-transparent border-t-primary/80 lg:h-32 lg:w-40 lg:border-l-[4rem] lg:border-r-[4rem] lg:border-t-[2.5rem] drop-shadow-[0_0_20px_rgba(var(--primary),0.3)]" />
                  <div className="h-20 w-32 bg-gradient-to-b from-primary/60 to-accent/40 lg:h-24 lg:w-40" />
                </div>

                {/* Floating Elements */}
                <div className="absolute left-8 top-8 flex items-center gap-2 rounded-2xl border border-white/30 bg-white/20 px-4 py-2 backdrop-blur-md shadow-lg">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">Countryside Estate</span>
                </div>

                <div className="absolute bottom-8 right-8 flex items-center gap-2 rounded-2xl border border-white/30 bg-white/20 px-4 py-2 backdrop-blur-md shadow-lg">
                  <Box className="h-4 w-4 text-accent" />
                  <span className="text-sm font-semibold text-foreground">3D Model Ready</span>
                </div>
              </div>

              {/* Controls Overlay */}
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/30 bg-white/20 px-6 py-3 backdrop-blur-md shadow-lg">
                <button className="rounded-full p-1.5 text-primary transition-all hover:bg-white/30 active:scale-90">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </button>
                <button className="rounded-full p-1.5 text-accent transition-all hover:bg-white/30 active:scale-90">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 2v2m0 16v2M2 12h2m16 0h2" />
                  </svg>
                </button>
                <div className="h-5 w-px bg-white/30" />
                <span className="text-sm font-medium text-foreground/80">Interact with Scene</span>
              </div>
            </div>

            {/* Floating Card */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-8 -left-8 rounded-3xl border border-white/40 bg-white/10 p-5 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-base font-bold text-foreground">Connect with Experts</p>
                  <p className="text-sm font-medium text-muted-foreground">850+ Architects & Builders</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
