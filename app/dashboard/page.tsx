"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Building2, 
  Heart, 
  MessageSquare, 
  Eye,
  TrendingUp,
  ArrowRight,
  MapPin,
  Box,
  Clock,
  Sparkles,
  Zap,
  Bell,
  Plus,
  Maximize2,
  Cpu,
  Loader2
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useProperties } from "@/hooks/api/use-properties"
import { Progress } from "@/components/ui/progress"

const stats = [
  { label: "Active Listings", value: "3", icon: Building2, change: "+1 this month", color: "text-primary", bg: "bg-primary/10" },
  { label: "Saved Properties", value: "12", icon: Heart, change: "+5 this week", color: "text-accent", bg: "bg-accent/10" },
  { label: "Messages", value: "8", icon: MessageSquare, change: "3 unread", color: "text-primary", bg: "bg-primary/10" },
  { label: "Profile Views", value: "156", icon: Eye, change: "+23% vs last month", color: "text-accent", bg: "bg-accent/10" },
]

const recentActivity = [
  { type: "view", message: "Someone viewed your Hillside Estate listing", time: "2 hours ago", icon: Eye, color: "text-primary" },
  { type: "message", message: "New message from Sarah Chen (Architect)", time: "5 hours ago", icon: MessageSquare, color: "text-accent" },
  { type: "favorite", message: "Your listing was saved by 3 buyers", time: "1 day ago", icon: Heart, color: "text-primary" },
  { type: "offer", message: "New offer received for Lakefront Paradise", time: "2 days ago", icon: Zap, color: "text-accent" },
]

export default function DashboardPage() {
  const { data: allProperties, isLoading } = useProperties()
  
  // Filter for user's properties (in a real app, we'd filter by ownerId)
  const userProperties = (allProperties || []).slice(0, 3)
  const pendingGenerations = (allProperties || []).filter(p => p.generationStatus === "pending")

  return (
    <main className="flex-1 p-6 lg:p-10 bg-background/50 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] -z-10" />

      <div className="mx-auto max-w-7xl">
        {/* Header - Modern & Glossy */}
        <div className="mb-12 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary border border-primary/20 mb-4">
              <Sparkles className="h-3 w-3" />
              User Dashboard
            </div>
            <h1 className="font-serif text-5xl font-bold tracking-tight text-foreground">Welcome back, <span className="text-gradient">John</span></h1>
            <p className="mt-2 text-lg font-medium text-muted-foreground/80">Here's a snapshot of your property empire today.</p>
          </motion.div>

          <Button variant="glossy" asChild className="rounded-2xl px-8 py-7 font-bold text-lg shadow-xl shadow-primary/20">
            <Link href="/dashboard/my-properties/new">
              <Plus className="h-5 w-5 mr-2" />
              Create New Listing
            </Link>
          </Button>
        </div>

        {/* AI Status Banner - If there are pending models */}
        <AnimatePresence>
          {pendingGenerations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 48 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="glass rounded-[2.5rem] border border-primary/30 p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Cpu className="h-32 w-32 text-primary animate-pulse" />
                </div>
                
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
                  <div className="flex items-center gap-6">
                    <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-lg">
                      <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">AI Generation in Progress</h2>
                      <p className="text-muted-foreground font-medium">We're currently building {pendingGenerations.length} immersive 3D models for you.</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 max-w-md space-y-3">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-primary">
                      <span>Overall Progress</span>
                      <span>65%</span>
                    </div>
                    <Progress value={65} className="h-3 bg-white/5 border border-white/10" />
                  </div>

                  <Button variant="outline" size="sm" className="rounded-xl font-bold border-primary/30 text-primary hover:bg-primary/10 px-6">
                    View Queue
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Grid - Glossy Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass border-white/10 hover:border-white/30 transition-all hover:shadow-2xl group overflow-hidden rounded-[2rem]">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className={cn("flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg group-hover:scale-110 transition-transform", stat.bg)}>
                      <stat.icon className={cn("h-7 w-7", stat.color)} />
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1 text-emerald-500 font-bold text-sm">
                        <TrendingUp className="h-4 w-4" />
                        <span>Up</span>
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.change}</span>
                    </div>
                  </div>
                  <p className="font-serif text-4xl font-bold text-foreground mb-1">{stat.value}</p>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-3">
          {/* Recent Activity - Glassmorphism */}
          <Card className="lg:col-span-2 glass border-white/10 rounded-[3rem] overflow-hidden shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between p-8 pb-4">
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                Live Feed
              </CardTitle>
              <Button variant="ghost" size="sm" asChild className="rounded-full hover:bg-white/5 font-bold">
                <Link href="/dashboard/activity" className="gap-2">
                  View Full History
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-8 pt-4">
              <div className="space-y-4">
                {recentActivity.map((activity, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ x: 10 }}
                    className="flex items-start gap-5 rounded-[2rem] border border-white/5 bg-white/5 p-5 transition-all hover:bg-white/10"
                  >
                    <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 shadow-inner", activity.color)}>
                      <activity.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-bold text-foreground leading-tight">{activity.message}</p>
                      <p className="mt-2 flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        <Clock className="h-3 w-3" />
                        {activity.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions - Glossy Vertical Pill */}
          <div className="space-y-6">
             <Card className="glass border-white/10 rounded-[3rem] overflow-hidden shadow-2xl">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl font-bold">Smart Tools</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                <Button asChild className="w-full justify-between h-14 rounded-2xl bg-white/5 border-white/10 hover:bg-primary hover:text-white transition-all group font-bold px-6" variant="outline">
                  <Link href="/dashboard/my-properties/new">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5" />
                      New Listing
                    </div>
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </Button>
                <Button className="w-full justify-between h-14 rounded-2xl bg-white/5 border-white/10 hover:bg-accent hover:text-white transition-all group font-bold px-6" variant="outline">
                  <div className="flex items-center gap-3">
                    <Box className="h-5 w-5" />
                    Generate 3D
                  </div>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
                <Button className="w-full justify-between h-14 rounded-2xl bg-white/5 border-white/10 hover:bg-primary hover:text-white transition-all group font-bold px-6" variant="outline">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5" />
                    Inbox
                  </div>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </CardContent>
            </Card>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="rounded-[3rem] bg-gradient-to-br from-primary to-accent p-8 text-white shadow-2xl shadow-primary/20 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">Upgrade to Pro</h3>
                <p className="text-white/80 font-medium text-sm mb-6 leading-relaxed">Unlimited 3D generations and priority professional matching.</p>
                <Button className="bg-white text-primary hover:bg-white/90 rounded-xl font-bold w-full">Learn More</Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Your Properties - Glossy Grid */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-3xl font-bold text-foreground">Your <span className="text-gradient">Portfolio</span></h2>
            <Button variant="outline" size="sm" asChild className="rounded-full border-white/20 bg-white/5 font-bold px-6">
              <Link href="/dashboard/my-properties" className="gap-2">
                Manage All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Spinner className="h-10 w-10 text-primary" />
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {userProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                >
                  <Link href={`/properties/${property.id}`} className="group block">
                    <Card className="glass border-white/10 hover:border-primary/50 transition-all hover:shadow-2xl group overflow-hidden rounded-[2.5rem]">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 z-10 opacity-40 transition-opacity group-hover:opacity-20" />
                        <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
                          {property.images[0] ? (
                            <img src={property.images[0]?.startsWith('http') || property.images[0]?.startsWith('/') ? property.images[0] : `http://localhost:8000${property.images[0]}`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" alt={property.title} />
                          ) : (
                            <Box className="h-12 w-12 text-primary/30 group-hover:scale-110 transition-transform duration-500" />
                          )}
                        </div>
                        <div className="absolute left-4 top-4 flex gap-2 z-20">
                          <Badge className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border-none shadow-lg",
                            property.status === "available" ? "bg-emerald-500 text-white" :
                            property.status === "pending" ? "bg-amber-500 text-white" :
                            "bg-rose-500 text-white"
                          )}>
                            {property.status}
                          </Badge>
                          {property.has3D ? (
                            <Badge className="bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                              3D Ready
                            </Badge>
                          ) : property.generationStatus === "pending" ? (
                            <Badge className="bg-primary/20 backdrop-blur-md border border-primary/30 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest animate-pulse">
                              Generating 3D...
                            </Badge>
                          ) : null}
                        </div>
                      </div>
                      <CardContent className="p-8">
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2 tracking-tight">{property.title}</h3>
                        <div className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground mb-6">
                          <MapPin className="h-4 w-4 text-primary" />
                          {property.location}
                        </div>
                        <div className="flex items-center justify-between border-t border-white/10 pt-6">
                          <p className="font-serif text-2xl font-bold text-foreground">${property.price.toLocaleString()}</p>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                            <Maximize2 className="h-3.5 w-3.5 text-accent" />
                            {property.size} {property.sizeUnit}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn("animate-spin", className)} />
}
