"use client"

import { User } from "@/hooks/api/use-user"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Sparkles, Star, Users, MessageSquare, TrendingUp, ArrowRight, Clock, Award, Zap, LayoutGrid, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export function ExpertOverview({ user }: { user: User }) {
  const recentLeads = [
    { name: "John Smith", project: "Eco-Home Design", budget: "$5k - $10k", time: "2h ago", status: "New" },
    { name: "Alice Brown", project: "Terrain Analysis", budget: "$2k - $4k", time: "5h ago", status: "Pending" },
  ]

  return (
    <div className="p-6 lg:p-10 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-accent border border-accent/20 mb-4">
            <Award className="h-3 w-3" />
            Professional Expert
          </div>
          <h1 className="font-serif text-5xl font-bold tracking-tight text-foreground">Welcome, <span className="text-gradient">{user.full_name.split(' ')[0]}</span></h1>
          <p className="text-lg font-medium text-muted-foreground/80">Manage your portfolio and track your client pipeline.</p>
        </div>
        <Button variant="glossy" asChild className="rounded-2xl px-8 py-7 font-bold text-lg shadow-xl shadow-primary/20 border-accent/30">
          <Link href="/dashboard/portfolio">
            <LayoutGrid className="h-5 w-5 mr-2" />
            Update Portfolio
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Profile Reach", value: "856", icon: Users, color: "text-primary", bg: "bg-primary/10" },
          { label: "New Bookings", value: "5", icon: Sparkles, color: "text-accent", bg: "bg-accent/10" },
          { label: "Avg. Rating", value: "4.9", icon: Star, color: "text-primary", bg: "bg-primary/10" },
          { label: "Total Earned", value: "$12.5k", icon: Zap, color: "text-accent", bg: "bg-accent/10" },
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
              <div className="h-10 w-10 rounded-2xl bg-accent/20 flex items-center justify-center border border-accent/30">
                <Sparkles className="h-5 w-5 text-accent" />
              </div>
              Project Pipeline
            </CardTitle>
            <Button variant="ghost" size="sm" asChild className="rounded-full hover:bg-white/5 font-bold">
              <Link href="/dashboard/bookings" className="gap-2">Manage Leads <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="p-8 pt-4 space-y-4">
            {recentLeads.map((lead, i) => (
              <div key={i} className="flex items-center gap-6 p-5 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {lead.name[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-lg text-foreground">{lead.name}</h4>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold">{lead.status}</Badge>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">{lead.project} • {lead.budget}</p>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {lead.time}
                  </span>
                  <Button size="sm" variant="outline" className="rounded-xl font-bold h-9 px-4 hover:bg-primary hover:text-white transition-all">Accept</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="glass border-white/10 rounded-[3rem] overflow-hidden shadow-2xl">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-bold">Profile Performance</CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-6">
               <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-widest">
                     <span>Profile Strength</span>
                     <span className="text-primary">85%</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                     <motion.div initial={{ width: 0 }} animate={{ width: "85%" }} className="h-full bg-gradient-to-r from-primary to-accent" />
                  </div>
               </div>
               
               <div className="space-y-3">
                  {[
                    { label: "Verified Badge", status: true },
                    { label: "Stripe Connected", status: true },
                    { label: "Portfolio (10+)", status: false },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                       <span className="text-xs font-bold text-white/70">{item.label}</span>
                       {item.status ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <div className="h-2 w-2 rounded-full bg-white/20" />}
                    </div>
                  ))}
               </div>
            </CardContent>
          </Card>

          <motion.div whileHover={{ scale: 1.02 }} className="rounded-[3rem] bg-gradient-to-br from-accent/20 to-primary/20 border border-white/20 p-8 relative overflow-hidden group shadow-xl">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-700">
              <TrendingUp className="h-24 w-24 text-accent" />
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl font-serif font-bold text-white mb-2">Boost Profile</h2>
              <p className="text-white/70 font-medium text-xs mb-6 leading-relaxed">Appear at the top of searches for your specialty and get 3x more bookings.</p>
              <Button className="bg-accent text-white hover:bg-accent/90 rounded-xl font-bold w-full py-6">
                Upgrade to Expert Pro
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
