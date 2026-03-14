"use client"

import Link from "next/link"
import { RegisterForm } from "@/components/auth/register-form"
import { Compass, Sparkles, ShieldCheck, Zap, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen bg-background relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10" />

      {/* Left Side - Visual Content (Flipped from Login for variety) */}
      <div className="hidden lg:flex lg:w-[50%] relative items-center justify-center p-16 border-r border-white/5 bg-white/5 backdrop-blur-3xl">
        <div className="max-w-xl space-y-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-bold uppercase tracking-widest text-accent border border-accent/20 shadow-lg">
              <Zap className="h-4 w-4" />
              The Future of Real Estate
            </div>
            <h2 className="font-serif text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
              Build Your Vision in <span className="text-gradient">Immersive 3D</span>
            </h2>
            <p className="text-xl font-medium text-muted-foreground/80 leading-relaxed">
              TerraVision connects you with premium properties and the world's best architects through cutting-edge AI visualization.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-6 glass p-6 rounded-[2.5rem] border-white/10 shadow-xl transition-all hover:bg-white/10 group">
              <div className="h-16 w-16 rounded-[1.5rem] bg-primary/20 flex items-center justify-center border border-primary/30 group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">Verified Professionals</p>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mt-1">Access to top-tier verified talent</p>
              </div>
            </div>

            <div className="flex items-center gap-6 glass p-6 rounded-[2.5rem] border-white/10 shadow-xl transition-all hover:bg-white/10 group">
              <div className="h-16 w-16 rounded-[1.5rem] bg-accent/20 flex items-center justify-center border border-accent/30 group-hover:scale-110 transition-transform">
                <Sparkles className="h-8 w-8 text-accent" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">AI Generative Models</p>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mt-1">Transform concepts to 3D in seconds</p>
              </div>
            </div>
          </div>

          {/* Animated Element */}
          <div className="relative h-32 w-full">
             <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl opacity-50" />
             <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
             <motion.div 
               animate={{ x: ["0%", "100%", "0%"] }}
               transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
               className="absolute top-1/2 left-0 h-1 w-20 bg-primary shadow-[0_0_20px_var(--primary)] -translate-y-1/2 rounded-full"
             />
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-[50%] lg:px-16 relative z-10">
        <div className="mx-auto w-full max-w-md">
          {/* Back to Home */}
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-8 group">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to landing
          </Link>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg transition-transform group-hover:scale-110">
              <Compass className="h-6 w-6 text-white" />
            </div>
            <span className="font-serif text-2xl tracking-tight text-foreground font-bold">
              Terra<span className="text-primary">Vision</span>
            </span>
          </Link>

          {/* Header */}
          <div className="space-y-2 mb-8">
            <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground">Create <span className="text-gradient">Account</span></h1>
            <p className="text-lg font-medium text-muted-foreground/80 leading-tight">
              Start your journey today and discover endless possibilities.
            </p>
          </div>

          {/* Form */}
          <RegisterForm />

          {/* Login Link */}
          <div className="mt-10 text-center">
            <p className="text-base font-medium text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
