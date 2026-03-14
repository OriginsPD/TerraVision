"use client"

import { User } from "@/hooks/api/use-user"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Eye, TrendingUp, ArrowRight, MapPin, Box, Clock, Sparkles, Zap, Bell, Plus, Maximize2 } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { properties } from "@/lib/data"

export function OwnerOverview({ user }: { user: User }) {
  const userProperties = properties.slice(0, 3)
  
  return (
    <div className="p-6 lg:p-10 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary border border-primary/20 mb-4">
            <Sparkles className="h-3 w-3" />
            Owner Console
          </div>
          <h1 className="font-serif text-5xl font-bold tracking-tight text-foreground">Welcome back, <span className="text-gradient">{user.full_name.split(' ')[0]}</span></h1>
          <p className="text-lg font-medium text-muted-foreground/80">Monitor your assets and manage AI visualizations.</p>
        </div>
        <Button variant="glossy" asChild className="rounded-2xl px-8 py-7 font-bold text-lg shadow-xl shadow-primary/20">
          <Link href="/dashboard/my-properties/new">
            <Plus className="h-5 w-5 mr-2" />
            Post New Property
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Views", value: "1,284", icon: Eye, change: "+12%", color: "text-primary", bg: "bg-primary/10" },
          { label: "Active Listings", value: "3", icon: Building2, change: "+1", color: "text-accent", bg: "bg-accent/10" },
          { label: "Inquiries", value: "14", icon: Bell, change: "+3", color: "text-primary", bg: "bg-primary/10" },
          { label: "Revenue", value: "$450k", icon: Zap, change: "+$120k", color: "text-accent", bg: "bg-accent/10" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="glass border-white/10 hover:border-white/30 transition-all hover:shadow-2xl group overflow-hidden rounded-[2rem]">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className={cn("flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg group-hover:scale-110 transition-transform", stat.bg)}>
                    <stat.icon className={cn("h-7 w-7", stat.color)} />
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-500">{stat.change}</span>
                  </div>
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
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              My Active Listings
            </CardTitle>
            <Button variant="ghost" size="sm" asChild className="rounded-full hover:bg-white/5 font-bold">
              <Link href="/dashboard/my-properties" className="gap-2">Manage All <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="p-8 pt-4">
            <div className="grid gap-6 sm:grid-cols-2">
              {userProperties.map((p, i) => (
                <div key={i} className="rounded-[2rem] border border-white/5 bg-white/5 overflow-hidden group hover:border-primary/30 transition-all">
                   <div className="aspect-video relative overflow-hidden">
                      <img src={p.images[0]} className="h-full w-full object-cover group-hover:scale-110 transition-all duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <Badge className="absolute top-4 left-4 bg-emerald-500 border-none">Active</Badge>
                   </div>
                   <div className="p-6">
                      <h4 className="font-bold text-lg text-foreground truncate">{p.title}</h4>
                      <div className="flex items-center justify-between mt-4">
                         <span className="font-serif font-bold text-primary">${p.price.toLocaleString()}</span>
                         <span className="text-[10px] font-bold text-muted-foreground uppercase">{p.size} {p.sizeUnit}</span>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="glass border-white/10 rounded-[3rem] overflow-hidden shadow-2xl">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-bold">Smart Tools</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <Button asChild className="w-full justify-between h-14 rounded-2xl bg-white/5 border-white/10 hover:bg-primary transition-all font-bold px-6" variant="outline">
                <Link href="/dashboard/my-properties/new">New Listing <Plus className="h-4 w-4" /></Link>
              </Button>
              <Button className="w-full justify-between h-14 rounded-2xl bg-white/5 border-white/10 hover:bg-accent transition-all font-bold px-6" variant="outline">
                Generate 3D <Box className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <motion.div whileHover={{ scale: 1.02 }} className="rounded-[3rem] bg-gradient-to-br from-primary to-accent border border-white/20 p-10 relative overflow-hidden group shadow-xl">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <Zap className="h-32 w-32 text-white" />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-serif font-bold text-white mb-2">Sell Faster</h2>
              <p className="text-white/70 font-medium text-sm mb-8 leading-relaxed">Featured listings get 4x more views and inquiries on average.</p>
              <Button className="bg-white text-primary hover:bg-white/90 rounded-2xl font-bold w-full py-7 shadow-2xl">
                Boost Listing
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}
