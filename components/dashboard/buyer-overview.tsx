"use client"

import { User } from "@/hooks/api/use-user"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingBag, MessageSquare, Compass, Sparkles, ArrowRight, Star, MapPin, Box } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { properties } from "@/lib/data"

export function BuyerOverview({ user }: { user: User }) {
  const savedProperties = properties.slice(0, 2)
  
  return (
    <div className="p-6 lg:p-10 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary border border-primary/20 mb-4">
            <Sparkles className="h-3 w-3" />
            Buyer Experience
          </div>
          <h1 className="font-serif text-5xl font-bold tracking-tight text-foreground">Hello, <span className="text-gradient">{user.full_name.split(' ')[0]}</span></h1>
          <p className="text-lg font-medium text-muted-foreground/80">Manage your collection and find your next project.</p>
        </div>
        <Button variant="glossy" asChild className="rounded-2xl px-8 py-7 font-bold text-lg shadow-xl shadow-primary/20">
          <Link href="/properties">
            <Compass className="h-5 w-5 mr-2" />
            Discover Land
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Properties Saved", value: "12", icon: Heart, color: "text-primary", bg: "bg-primary/10" },
          { label: "My Library", value: "3", icon: ShoppingBag, color: "text-accent", bg: "bg-accent/10" },
          { label: "Active Chats", value: "5", icon: MessageSquare, color: "text-primary", bg: "bg-primary/10" },
          { label: "Architects Hired", value: "1", icon: Star, color: "text-accent", bg: "bg-accent/10" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="glass border-white/10 hover:border-white/30 transition-all hover:shadow-2xl group overflow-hidden rounded-[2rem]">
              <CardContent className="p-8">
                <div className={cn("flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg mb-6 group-hover:scale-110 transition-transform", stat.bg)}>
                  <stat.icon className={cn("h-7 w-7", stat.color)} />
                </div>
                <p className="font-serif text-4xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        <Card className="lg:col-span-2 glass border-white/10 rounded-[3rem] overflow-hidden shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between p-8 pb-4">
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-primary/20 flex items-center justify-center">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              Recently Saved
            </CardTitle>
            <Button variant="ghost" size="sm" asChild className="rounded-full hover:bg-white/5 font-bold">
              <Link href="/dashboard/favorites" className="gap-2">View All <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="p-8 pt-4 space-y-4">
            {savedProperties.map((p, i) => (
              <div key={i} className="flex items-center gap-6 p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all">
                <div className="h-20 w-20 rounded-xl overflow-hidden relative">
                   <img src={p.images[0]} className="h-full w-full object-cover" />
                   <div className="absolute inset-0 bg-primary/20" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{p.title}</h4>
                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
                    <MapPin className="h-3 w-3" /> {p.location}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-serif font-bold text-xl text-foreground">${p.price.toLocaleString()}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{p.size} {p.sizeUnit}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <motion.div whileHover={{ scale: 1.02 }} className="rounded-[3rem] bg-gradient-to-br from-primary/20 to-accent/20 border border-white/20 p-10 relative overflow-hidden group shadow-xl h-full">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <Sparkles className="h-32 w-32 text-white" />
          </div>
          <div className="relative z-10">
            <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-md mb-6">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-white mb-4">Recommended</h2>
            <p className="text-lg font-medium text-white/70 leading-relaxed mb-8">
              Our AI found 3 new properties matching your interest in mountain estates.
            </p>
            <Button className="bg-white text-primary hover:bg-white/90 rounded-2xl font-bold w-full py-7 shadow-2xl">
              View Matches
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}
