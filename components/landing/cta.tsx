"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Building2, Users, Home, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export function CTA() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background Orbs for the section */}
      <div className="absolute left-1/4 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-primary/10 blur-[150px]" />
      <div className="absolute right-1/4 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-accent/10 blur-[150px]" />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[3rem] border-4 border-white/20 bg-white/5 backdrop-blur-2xl shadow-2xl"
        >
          {/* Internal Background Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(var(--primary)_/_0.05)_1px,transparent_1px),linear-gradient(to_bottom,oklch(var(--primary)_/_0.05)_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30" />
          
          {/* Animated Internal Orbs */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-primary/30 blur-[100px]" 
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            className="absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-accent/30 blur-[100px]" 
          />

          <div className="relative grid gap-12 p-10 lg:grid-cols-2 lg:p-24 items-center">
            {/* Content */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-bold uppercase tracking-widest text-primary border border-white/30 backdrop-blur-md mb-8">
                <Sparkles className="h-4 w-4" />
                Join the Future
              </div>
              <h2 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.1]">
                <span className="text-balance">Ready to Transform Your <span className="text-gradient">Property Journey?</span></span>
              </h2>
              <p className="mt-8 max-w-lg text-xl font-medium text-muted-foreground/80 leading-relaxed">
                Join thousands of buyers, sellers, and professionals who are already using TerraVision to discover, visualize, and build their dream properties.
              </p>

              <div className="mt-12 flex flex-wrap items-center gap-6">
                <Button size="lg" variant="glossy" asChild className="rounded-full px-10 py-8 text-xl font-bold shadow-2xl shadow-primary/30">
                  <Link href="/register" className="gap-3">
                    Get Started Free
                    <ArrowRight className="h-6 w-6" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="rounded-full border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 px-10 py-8 text-xl font-bold">
                  <Link href="/contact">Contact Sales</Link>
                </Button>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="grid gap-6">
              <motion.div 
                whileHover={{ x: 10 }}
                className="flex items-center gap-6 rounded-[2rem] border border-white/20 bg-white/5 p-6 backdrop-blur-md transition-all hover:bg-white/10"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 shadow-lg">
                  <Home className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">Property Owners</p>
                  <p className="text-base font-medium text-muted-foreground">List and showcase in stunning 3D</p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ x: 10 }}
                className="flex items-center gap-6 rounded-[2rem] border border-white/20 bg-white/5 p-6 backdrop-blur-md transition-all hover:bg-white/10"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent/60 shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">Buyers</p>
                  <p className="text-base font-medium text-muted-foreground">Explore and purchase with confidence</p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ x: 10 }}
                className="flex items-center gap-6 rounded-[2rem] border border-white/20 bg-white/5 p-6 backdrop-blur-md transition-all hover:bg-white/10"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">Professionals</p>
                  <p className="text-base font-medium text-muted-foreground">Showcase your expertise and get hired</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
