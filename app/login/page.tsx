"use client"

import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"
import { Compass, Sparkles, Box, Users, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"

export default function LoginPage() {
  return (
    <main className="flex min-h-screen bg-background relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] -z-10" />

      {/* Left Side - Form Area */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-[45%] lg:px-16 relative z-10">
        <div className="mx-auto w-full max-w-md">
          {/* Back to Home */}
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-12 group">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to home
          </Link>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group mb-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg transition-transform group-hover:scale-110">
              <Compass className="h-7 w-7 text-white" />
            </div>
            <span className="font-serif text-3xl tracking-tight text-foreground font-bold">
              Terra<span className="text-primary">Vision</span>
            </span>
          </Link>

          {/* Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary border border-primary/20">
              <Sparkles className="h-3 w-3" />
              Secure Access
            </div>
            <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground">Welcome <span className="text-gradient">Back</span></h1>
            <p className="text-lg font-medium text-muted-foreground/80">
              Continue your immersive real estate journey.
            </p>
          </div>

          {/* Form */}
          <LoginForm />

          {/* Register Link */}
          <div className="mt-10 text-center">
            <p className="text-base font-medium text-muted-foreground">
              New to TerraVision?{" "}
              <Link href="/register" className="font-bold text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Visual Immersive Experience */}
      <div className="hidden lg:flex lg:w-[55%] relative items-center justify-center p-16">
        <div className="relative w-full h-full max-w-2xl aspect-square flex items-center justify-center">
          {/* Floating Immersive Card */}
          <div className="relative z-10 glass border-white/20 rounded-[4rem] p-12 shadow-2xl overflow-hidden group">
            {/* Animated Glow */}
            <div className="absolute -inset-2 bg-gradient-to-br from-primary/30 via-transparent to-accent/30 opacity-50 blur-2xl group-hover:opacity-70 transition-opacity" />
            
            <div className="relative z-10 space-y-10">
              <div className="space-y-4 text-center">
                <h2 className="font-serif text-5xl font-bold tracking-tight text-foreground leading-tight">
                  Experience <span className="text-gradient">Properties</span> in High-Fidelity 3D
                </h2>
                <p className="text-xl font-medium text-muted-foreground/80 leading-relaxed">
                  Join the platform where real estate meets the future. Browse land, view immersive models, and connect with experts.
                </p>
              </div>

              {/* Visual Stats/Features */}
              <div className="grid grid-cols-2 gap-6">
                <div className="glass bg-white/5 p-6 rounded-[2.5rem] border-white/10 shadow-xl flex flex-col items-center text-center">
                  <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-4 border border-primary/30">
                    <Box className="h-7 w-7 text-primary" />
                  </div>
                  <p className="font-bold text-lg mb-1">AI Visualization</p>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">3D models generated in seconds</p>
                </div>
                <div className="glass bg-white/5 p-6 rounded-[2.5rem] border-white/10 shadow-xl flex flex-col items-center text-center">
                  <div className="h-14 w-14 rounded-2xl bg-accent/20 flex items-center justify-center mb-4 border border-accent/30">
                    <Users className="h-7 w-7 text-accent" />
                  </div>
                  <p className="font-bold text-lg mb-1">Expert Network</p>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Connect with top architects</p>
                </div>
              </div>

              {/* Mock 3D Preview element */}
              <div className="relative aspect-video rounded-[2rem] border border-white/20 bg-black/20 overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                   <div className="flex flex-col items-center gap-2">
                      <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center animate-pulse">
                        <Box className="h-6 w-6 text-white/50" />
                      </div>
                      <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Immersive Preview</span>
                   </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                   <div className="glass px-3 py-1 rounded-full text-[10px] font-bold text-white/70 border-white/10">ESTATE_MODEL_01</div>
                   <div className="flex gap-1">
                      <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                      <div className="h-2 w-2 rounded-full bg-accent animate-pulse delay-150" />
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating background orbs */}
          <motion.div 
            animate={{ 
              y: [0, -30, 0],
              rotate: [0, 10, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-[2rem] border border-white/10 backdrop-blur-3xl -mr-16 -mt-16" 
          />
          <motion.div 
            animate={{ 
              y: [0, 30, 0],
              rotate: [0, -10, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-0 left-0 w-24 h-24 bg-accent/20 rounded-full border border-white/10 backdrop-blur-3xl -ml-12 -mb-12" 
          />
        </div>
      </div>
    </main>
  )
}
