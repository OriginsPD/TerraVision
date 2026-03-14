"use client"

import { useMemo, useState } from "react"
import { notFound, useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Star, FileText, Download, Share2, Heart, CheckCircle, Info, Maximize2, Ruler, Layout, Building2, MessageSquare, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useFloorPlan } from "@/hooks/api/use-floor-plans"
import { Spinner } from "@/components/ui/spinner"
import { CheckoutModal } from "@/components/marketplace/checkout-modal"
import { motion } from "framer-motion"

export default function FloorPlanPage() {
  const { id } = useParams()
  const planId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : ''
  const { data: plan, isLoading, error } = useFloorPlan(planId)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <Spinner className="h-12 w-12 text-primary" />
        <p className="mt-4 text-sm font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Loading Blueprints</p>
      </div>
    )
  }

  if (error || !plan) {
    notFound()
  }

  const features = [
    "Open concept living area",
    "Energy efficient windows",
    "Smart home ready",
    "Modern kitchen appliances",
    "Walk-in master closet",
    "Double vanity bathrooms",
    "High ceilings (10ft)",
    "Hardwood flooring"
  ]

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      <Navbar />
      
      <main className="pt-24 pb-20">
        {/* Glossy Header */}
        <div className="relative overflow-hidden border-b border-white/10 bg-white/5 backdrop-blur-xl">
          {/* Background Decorative */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />

          <div className="relative mx-auto max-w-7xl px-4 py-12 lg:px-8">
            <Link href="/marketplace/floor-plans" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-8 group">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Floor Plans
            </Link>

            <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-4 py-1 rounded-full font-bold uppercase tracking-widest text-[10px]">
                    {plan.style}
                  </Badge>
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 px-4 py-1 rounded-full font-bold uppercase tracking-widest text-[10px]">
                    Verified Plan
                  </Badge>
                </div>
                <h1 className="font-serif text-5xl font-bold text-foreground md:text-6xl leading-tight">
                  {plan.title}
                </h1>
                <p className="text-xl font-medium text-muted-foreground flex items-center gap-2">
                  Designed by <span className="text-foreground font-bold">{plan.architectName}</span>
                  <CheckCircle className="h-4 w-4 text-primary" />
                </p>
                <div className="flex flex-wrap items-center gap-8 pt-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Rating</span>
                    <div className="flex items-center gap-1.5 font-bold text-foreground">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      {plan.rating} ({plan.downloads} downloads)
                    </div>
                  </div>
                  <div className="h-10 w-px bg-white/10 hidden sm:block" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Floor Area</span>
                    <div className="flex items-center gap-1.5 font-bold text-foreground">
                      <Building2 className="h-4 w-4 text-primary" />
                      {plan.sqft.toLocaleString()} sqft
                    </div>
                  </div>
                  <div className="h-10 w-px bg-white/10 hidden sm:block" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Configuration</span>
                    <div className="flex items-center gap-1.5 font-bold text-foreground">
                      <Layout className="h-4 w-4 text-accent" />
                      {plan.bedrooms} Beds / {plan.bathrooms} Baths
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-8 rounded-[2.5rem] border border-white/20 shadow-2xl min-w-[320px] relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Sparkles className="h-20 w-20 text-primary" />
                </div>
                <div className="relative z-10 space-y-6">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Plan License</span>
                    <p className="font-serif text-5xl font-bold text-primary">${plan.price.toLocaleString()}</p>
                  </div>
                  <Button onClick={() => setIsCheckoutOpen(true)} size="lg" variant="glossy" className="w-full py-8 text-xl font-bold rounded-2xl shadow-xl shadow-primary/30 group">
                    <Download className="mr-3 h-6 w-6 group-hover:animate-bounce" />
                    Purchase & Download
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="rounded-xl h-12 font-bold border-white/10 bg-white/5 hover:bg-white/10 gap-2">
                      <Heart className="h-4 w-4" /> Save
                    </Button>
                    <Button variant="outline" className="rounded-xl h-12 font-bold border-white/10 bg-white/5 hover:bg-white/10 gap-2">
                      <Share2 className="h-4 w-4" /> Share
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid gap-16 lg:grid-cols-3">
              {/* Left Column - Preview & Details */}
              <div className="lg:col-span-2 space-y-12">
                {/* Image Gallery - Glossy Preview */}
                <div className="relative aspect-video rounded-[3rem] border-4 border-white/10 bg-muted overflow-hidden group shadow-2xl">
                   <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 opacity-40" />
                   <div className="flex h-full items-center justify-center relative z-10">
                      <div className="text-center p-10 glass rounded-[2.5rem] border border-white/20 shadow-2xl max-w-sm">
                        <FileText className="h-20 w-20 text-primary/40 mx-auto mb-6" />
                        <h3 className="text-xl font-bold text-white mb-2">Main Floor Plan Preview</h3>
                        <p className="text-sm font-medium text-muted-foreground mb-6">High-resolution schematic visualization</p>
                        <Button variant="outline" className="rounded-xl border-white/20 bg-white/5 font-bold gap-2">
                          <Maximize2 className="h-4 w-4 text-primary" />
                          View Full Screen
                        </Button>
                      </div>
                   </div>
                </div>

                {/* Tabs Information */}
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="glass border-white/10 p-1 rounded-2xl mb-8 inline-flex">
                    <TabsTrigger value="overview" className="rounded-xl px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white">Overview</TabsTrigger>
                    <TabsTrigger value="specs" className="rounded-xl px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white">Specs</TabsTrigger>
                    <TabsTrigger value="features" className="rounded-xl px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white">Features</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview">
                    <div className="glass rounded-[2.5rem] border border-white/10 p-10 shadow-xl">
                      <h3 className="text-3xl font-serif font-bold text-foreground mb-6 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-primary/20 flex items-center justify-center">
                          <Info className="h-5 w-5 text-primary" />
                        </div>
                        Concept & Design
                      </h3>
                      <p className="text-xl text-muted-foreground leading-relaxed font-medium mb-6">
                        {plan.description}
                      </p>
                      <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                        This meticulously designed {plan.style} plan offers a perfect balance of open-concept 
                        living spaces and private retreats. The flow between the kitchen, dining, and living areas 
                        is seamless, making it ideal for both entertaining and everyday family life.
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="specs">
                    <div className="glass rounded-[2.5rem] border border-white/10 p-10 shadow-xl grid gap-10 sm:grid-cols-2">
                        <div className="space-y-6">
                          <h4 className="text-xl font-bold text-foreground flex items-center gap-3">
                            <Ruler className="h-6 w-6 text-primary" />
                            Dimensions
                          </h4>
                          <div className="space-y-4">
                            {[
                              { label: "Total Heated Area", val: `${plan.sqft.toLocaleString()} sq ft` },
                              { label: "Bedrooms", val: plan.bedrooms },
                              { label: "Bathrooms", val: plan.bathrooms },
                              { label: "Stories", val: "1" }
                            ].map(s => (
                              <div key={s.label} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                                <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{s.label}</span>
                                <span className="text-lg font-bold text-foreground">{s.val}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-6">
                          <h4 className="text-xl font-bold text-foreground flex items-center gap-3">
                            <Building2 className="h-6 w-6 text-accent" />
                            Construction
                          </h4>
                          <div className="space-y-4">
                            {[
                              { label: "Foundation", val: "Slab / Crawlspace" },
                              { label: "Exterior Walls", val: "2x6 Frame" },
                              { label: "Roof Type", val: "Gable / Hip" }
                            ].map(s => (
                              <div key={s.label} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                                <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{s.label}</span>
                                <span className="text-lg font-bold text-foreground">{s.val}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="features">
                    <div className="glass rounded-[2.5rem] border border-white/10 p-10 shadow-xl">
                      <div className="grid gap-6 sm:grid-cols-2">
                        {features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-4 bg-white/5 border border-white/5 p-5 rounded-2xl group hover:bg-white/10 transition-colors">
                            <div className="h-8 w-8 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                              <CheckCircle className="h-4 w-4 text-emerald-500" />
                            </div>
                            <span className="text-lg font-bold text-foreground/80">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Right Column - Architect & Support */}
              <div className="space-y-8">
                <Card className="glass border-white/10 rounded-[2.5rem] shadow-xl overflow-hidden">
                  <CardHeader className="p-8 pb-4">
                    <CardTitle className="text-xl font-bold">Meet the Architect</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-4">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center border-2 border-white/20 shadow-lg">
                        <span className="text-2xl font-bold text-white">
                          {plan.architectName.split(' ').map((n: string) => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-xl text-foreground leading-tight">{plan.architectName}</p>
                        <div className="flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-widest mt-1">
                          <CheckCircle className="h-3 w-3" />
                          Elite Designer
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full h-14 rounded-2xl border-white/10 bg-white/5 font-bold hover:bg-primary hover:text-white transition-all" asChild>
                      <Link href={`/marketplace/professionals/${plan.architectId}`}>View Profile</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="glass border-white/10 rounded-[2.5rem] shadow-xl overflow-hidden">
                  <CardHeader className="p-8 pb-4">
                    <CardTitle className="text-xl font-bold">What's Included?</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-4 space-y-4">
                    {[
                      "Full Architectural Set (PDF)",
                      "Detailed Floor Plans",
                      "Exterior Elevations",
                      "Roof Plan & Detail"
                    ].map(item => (
                      <div key={item} className="flex items-center gap-3 text-sm font-bold text-foreground/70">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span>{item}</span>
                      </div>
                    ))}
                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 mt-4">
                      <Info className="h-5 w-5 text-amber-500 shrink-0" />
                      <span className="text-xs font-medium text-muted-foreground leading-relaxed">Modified sets available upon specialized request</span>
                    </div>
                  </CardContent>
                </Card>

                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="rounded-[2.5rem] bg-gradient-to-br from-primary/20 to-accent/20 border border-white/20 p-8 relative overflow-hidden group shadow-xl"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-700">
                    <MessageSquare className="h-24 w-24 text-primary" />
                  </div>
                  <div className="relative z-10">
                    <h4 className="text-2xl font-bold text-foreground mb-2">Need design help?</h4>
                    <p className="text-sm font-medium text-muted-foreground leading-relaxed mb-6">
                      Our experts can help you select or modify the best plan for your land and budget.
                    </p>
                    <Button className="w-full h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 font-bold gap-2 hover:bg-white/20">
                      <MessageSquare className="h-5 w-5" />
                      Talk to an Expert
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        type="floor-plan"
        data={{
          id: plan.id,
          title: plan.title,
          price: plan.price
        }}
      />
    </div>
  )
}
