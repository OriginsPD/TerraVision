"use client"

import { User } from "@/hooks/api/use-user"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Eye, TrendingUp, ArrowRight, MapPin, Box, Clock, Sparkles, Zap, Bell, Plus, Maximize2, MessageSquare, TrendingDown, Minus } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { properties } from "@/lib/data"
import { useAnalytics } from "@/hooks/api/use-analytics"
import { cn } from "@/lib/utils"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

export function OwnerOverview({ user }: { user: User }) {
  const { data: analytics, isLoading } = useAnalytics()

  const stats = [
    { label: "Total Views", value: analytics?.overview.totalProperties ? (analytics.overview.totalProperties * 12).toLocaleString() : "0", change: "+12%", trend: "up", icon: Eye },
    { label: "My Listings", value: analytics?.ownerStats?.myProperties?.toString() || "0", change: "Stable", trend: "neutral", icon: Building2 },
    { label: "Active Inquiries", value: analytics?.ownerStats?.myMessages?.toString() || "0", change: "+5", trend: "up", icon: MessageSquare },
    { label: "Portfolio Value", value: analytics?.overview.totalValuation ? `$${(analytics.overview.totalValuation / 1000000).toFixed(1)}M` : "$0", change: "+8%", trend: "up", icon: Zap },
  ]

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
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-40 rounded-[2rem] bg-white/5 animate-pulse" />
          ))
        ) : (
          stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="glass border-white/10 hover:border-white/30 transition-all hover:shadow-2xl group overflow-hidden rounded-[2rem]">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className={cn("flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg group-hover:scale-110 transition-transform", i % 2 === 0 ? "bg-primary/10" : "bg-accent/10")}>
                        <Icon className={cn("h-7 w-7", i % 2 === 0 ? "text-primary" : "text-accent")} />
                      </div>
                      <div className="flex flex-col items-end">
                        <div className={cn("flex items-center gap-1 font-bold text-xs", stat.trend === 'up' ? "text-emerald-500" : "text-muted-foreground")}>
                          {stat.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : stat.trend === 'down' ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                          <span>{stat.change}</span>
                        </div>
                      </div>
                    </div>
                    <p className="font-serif text-4xl font-bold text-foreground mb-1">{stat.value}</p>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })
        )}
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        <Card className="lg:col-span-2 glass border-white/10 rounded-[3rem] overflow-hidden shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between p-8 pb-4">
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-primary/20 flex items-center justify-center">
                <Box className="h-5 w-5 text-primary" />
              </div>
              Property Distribution
            </CardTitle>
            <div className="flex items-center gap-2">
               <Badge className="bg-primary/20 text-primary border-primary/20">Market Share</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-4">
            <div className="h-[300px] w-full">
              {analytics?.typeDistribution ? (
                <ChartContainer config={{ count: { label: "Count", color: "var(--primary)" } }}>
                  <LineChart data={analytics.typeDistribution.map((t: { type: string, count: number }) => ({ name: t.type, value: t.count }))}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis 
                      dataKey="name" 
                      stroke="rgba(255,255,255,0.3)" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.3)" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="var(--primary)" 
                      strokeWidth={4} 
                      dot={{ r: 6, fill: "var(--primary)", strokeWidth: 2, stroke: "#fff" }}
                      activeDot={{ r: 8, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ChartContainer>
              ) : (
                <div className="flex h-full items-center justify-center bg-white/5 rounded-3xl border border-white/5">
                   <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Generating Data Visualization</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="glass border-white/10 rounded-[3rem] overflow-hidden shadow-2xl">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-bold">Smart Tools</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <Button asChild className="w-full justify-between h-14 rounded-2xl bg-white/5 border-white/10 hover:bg-primary transition-all group font-bold px-6" variant="outline">
                <Link href="/dashboard/my-properties/new">New Listing <Plus className="h-4 w-4" /></Link>
              </Button>
              <Button className="w-full justify-between h-14 rounded-2xl bg-white/5 border-white/10 hover:bg-accent transition-all group font-bold px-6" variant="outline">
                Generate 3D <Box className="h-4 w-4" />
              </Button>
              <Button asChild className="w-full justify-between h-14 rounded-2xl bg-white/5 border-white/10 hover:bg-primary transition-all group font-bold px-6" variant="outline">
                <Link href="/dashboard/messages">View Inquiries <Bell className="h-4 w-4" /></Link>
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
