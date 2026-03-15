"use client"

import { useMemo, useState } from "react"
import { notFound, useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Star, MapPin, Calendar, CheckCircle, MessageSquare, Phone, Mail, Clock, Award, Briefcase, Users, Sparkles, Share2, Heart, ShieldCheck, Info, Image as ImageIcon, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useProfessional } from "@/hooks/api/use-professionals"
import { Spinner } from "@/components/ui/spinner"
import { CheckoutModal } from "@/components/marketplace/checkout-modal"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export default function ProfessionalDetailPage() {
  const { id } = useParams()
  const profId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : ''
  const { data: professional, isLoading, error } = useProfessional(profId)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <Spinner className="h-12 w-12 text-primary" />
        <p className="mt-4 text-sm font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Loading Expert Profile</p>
      </div>
    )
  }

  if (error || !professional) {
    notFound()
  }

  // Formatting name for Fallback and URL-like replacement for email
  const name = professional.name || "Professional"
  const initials = name.split(' ').map((n: string) => n[0]).join('')

  const portfolio = [
    { id: 1, title: "Modern Villa Design", type: "Residential", image: "/portfolio-1.jpg" },
    { id: 2, title: "Office Complex", type: "Commercial", image: "/portfolio-2.jpg" },
    { id: 3, title: "Eco-Friendly Home", type: "Residential", image: "/portfolio-3.jpg" },
    { id: 4, title: "Urban Apartment", type: "Residential", image: "/portfolio-4.jpg" },
  ]

  const reviews = [
    { id: 1, author: "Michael Chen", rating: 5, date: "2 weeks ago", comment: "Exceptional work on our home renovation. The attention to detail was remarkable." },
    { id: 2, author: "Sarah Williams", rating: 5, date: "1 month ago", comment: "Very professional and delivered exactly what we envisioned. Highly recommend!" },
    { id: 3, author: "David Martinez", rating: 4, date: "2 months ago", comment: "Great communication throughout the project. Would work with them again." },
  ]

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      <Navbar />
      
      <main className="pt-24 pb-20">
        {/* Glossy Profile Header */}
        <div className="relative overflow-hidden border-b border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-accent/10 rounded-full blur-[100px]" />

          <div className="relative mx-auto max-w-7xl px-4 py-12 lg:px-8">
            <Link href="/marketplace/professionals" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-accent transition-colors mb-8 group">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Marketplace
            </Link>

            <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative group"
                >
                  <div className="absolute -inset-1 bg-gradient-to-br from-primary to-accent rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                  <Avatar className="h-40 w-40 rounded-[2.5rem] border-4 border-white/10 shadow-2xl relative z-10">
                    <AvatarImage src={professional.avatar} alt={name} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-4xl font-serif font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 z-20 h-10 w-10 rounded-2xl bg-background border-2 border-white/10 flex items-center justify-center shadow-xl">
                    <ShieldCheck className="h-6 w-6 text-emerald-500" />
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-center md:text-left space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-4 py-1 rounded-full font-bold uppercase tracking-widest text-[10px]">
                      {professional.profession}
                    </Badge>
                    {professional.verified !== false && (
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-4 py-1 rounded-full font-bold uppercase tracking-widest text-[10px]">
                        Verified Platinum
                      </Badge>
                    )}
                  </div>
                  <h1 className="font-serif text-5xl font-bold text-foreground md:text-6xl tracking-tight leading-tight">
                    {name}
                  </h1>
                  <p className="text-xl font-medium text-muted-foreground max-w-lg">
                    {professional.specialty || "Expert Design & Construction"}
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 pt-2">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Rating</span>
                      <div className="flex items-center gap-1.5 font-bold text-foreground">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        {professional.rating || "4.9"} ({professional.reviewCount || "24"} reviews)
                      </div>
                    </div>
                    <div className="h-10 w-px bg-white/10 hidden sm:block" />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Location</span>
                      <div className="flex items-center gap-1.5 font-bold text-foreground">
                        <MapPin className="h-4 w-4 text-primary" />
                        {professional.location || "Remote / Local"}
                      </div>
                    </div>
                    <div className="h-10 w-px bg-white/10 hidden sm:block" />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Projects</span>
                      <div className="flex items-center gap-1.5 font-bold text-foreground">
                        <Briefcase className="h-4 w-4 text-accent" />
                        {professional.completedProjects || "12"} Completed
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-8 rounded-[2.5rem] border border-white/20 shadow-2xl min-w-[320px] relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Sparkles className="h-20 w-20 text-accent" />
                </div>
                <div className="relative z-10 space-y-6">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Rate starting at</span>
                    <p className="font-serif text-5xl font-bold text-primary">${professional.hourlyRate || professional.hourly_rate}/hr</p>
                  </div>
                  <Button onClick={() => setIsCheckoutOpen(true)} size="lg" variant="glossy" className="w-full py-8 text-xl font-bold rounded-2xl shadow-xl shadow-primary/30 group">
                    <Calendar className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform" />
                    Book Consultation
                  </Button>
                  <Button variant="outline" className="w-full h-14 rounded-2xl font-bold border-white/10 bg-white/5 hover:bg-white/10 gap-3">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Contact Expert
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid gap-16 lg:grid-cols-3">
              {/* Left Column - Tabs Content */}
              <div className="lg:col-span-2">
                <Tabs defaultValue="portfolio" className="w-full">
                  <TabsList className="glass border-white/10 p-1 rounded-2xl mb-8 inline-flex">
                    <TabsTrigger value="portfolio" className="rounded-xl px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white">Portfolio</TabsTrigger>
                    <TabsTrigger value="about" className="rounded-xl px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white">Expertise</TabsTrigger>
                    <TabsTrigger value="reviews" className="rounded-xl px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white">Feedback</TabsTrigger>
                  </TabsList>

                  <TabsContent value="portfolio">
                    <div className="grid gap-6 sm:grid-cols-2">
                      {portfolio.map((item, index) => (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          viewport={{ once: true }}
                          key={item.id}
                        >
                          <Card className="overflow-hidden border-white/10 bg-white/5 backdrop-blur-md rounded-[2rem] group cursor-pointer hover:border-primary/50 transition-all shadow-xl">
                            <div className="aspect-video bg-muted relative overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <ImageIcon className="h-12 w-12 text-white/20 group-hover:scale-110 transition-transform duration-500" />
                              </div>
                              <div className="absolute bottom-6 left-6 right-6 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                                <Badge className="bg-primary text-white border-none mb-2">Project Asset</Badge>
                                <p className="text-xl font-bold text-white">{item.title}</p>
                                <p className="text-sm font-medium text-white/70">{item.type}</p>
                              </div>
                            </div>
                            <CardContent className="p-6">
                              <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{item.title}</h3>
                              <p className="text-sm font-medium text-muted-foreground mt-1">{item.type}</p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="about">
                    <div className="glass rounded-[2.5rem] border border-white/10 p-10 shadow-xl space-y-10">
                      <div>
                        <h3 className="text-3xl font-serif font-bold text-foreground mb-6 flex items-center gap-3">
                          <div className="h-10 w-10 rounded-2xl bg-primary/20 flex items-center justify-center">
                            <Info className="h-5 w-5 text-primary" />
                          </div>
                          About {name.split(' ')[0]}
                        </h3>
                        <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                          {professional.bio || "A dedicated professional with a track record of delivering exceptional results in the field of real estate development and design."}
                        </p>
                      </div>

                      <div className="grid gap-6 sm:grid-cols-3">
                        <div className="flex flex-col items-center gap-3 p-8 rounded-[2rem] bg-white/5 border border-white/5 text-center">
                          <Award className="h-10 w-10 text-primary" />
                          <div>
                            <p className="text-3xl font-bold text-foreground">{professional.completedProjects || "12"}</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Milestones</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-center gap-3 p-8 rounded-[2rem] bg-white/5 border border-white/5 text-center">
                          <Briefcase className="h-10 w-10 text-accent" />
                          <div>
                            <p className="text-3xl font-bold text-foreground">15+</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Years Pro</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-center gap-3 p-8 rounded-[2rem] bg-white/5 border border-white/5 text-center">
                          <Users className="h-10 w-10 text-primary" />
                          <div>
                            <p className="text-3xl font-bold text-foreground">100+</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Partnerships</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="reviews">
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <Card key={review.id} className="glass border-white/10 rounded-[2.5rem] shadow-lg overflow-hidden">
                          <CardContent className="p-8">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                              <div className="flex items-center gap-4">
                                <Avatar className="h-14 w-14 rounded-2xl border-2 border-white/10 shadow-lg">
                                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-bold">
                                    {review.author.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-bold text-lg text-foreground">{review.author}</p>
                                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
                                    <Clock className="h-3 w-3" />
                                    {review.date}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={cn("h-4 w-4", i < review.rating ? 'fill-primary text-primary' : 'text-white/10')}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="mt-6 text-lg text-muted-foreground leading-relaxed font-medium italic">
                              "{review.comment}"
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Right Column - Contact & Status */}
              <div className="space-y-8">
                <Card className="glass border-white/10 rounded-[2.5rem] shadow-xl overflow-hidden">
                  <CardHeader className="p-8 pb-4">
                    <CardTitle className="text-xl font-bold">Official Channels</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-4 space-y-5">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
                      <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-bold text-foreground">+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
                      <div className="h-10 w-10 rounded-xl bg-accent/20 flex items-center justify-center border border-accent/30">
                        <Mail className="h-5 w-5 text-accent" />
                      </div>
                      <span className="font-bold text-foreground truncate">{name.toLowerCase().replace(' ', '.')}@vision.com</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                      <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                        <Clock className="h-5 w-5 text-emerald-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Active Now</span>
                        <span className="text-[10px] font-bold text-emerald-500/70 uppercase">Typical response: 2h</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass border-white/10 rounded-[2.5rem] shadow-xl overflow-hidden">
                  <CardHeader className="p-8 pb-4">
                    <CardTitle className="text-xl font-bold">Standard Availability</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-4">
                    <div className="space-y-4">
                      {[
                        { day: "Mon - Fri", time: "9:00 AM - 6:00 PM" },
                        { day: "Saturday", time: "10:00 AM - 2:00 PM" },
                        { day: "Sunday", time: "Offline" }
                      ].map(s => (
                        <div key={s.day} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{s.day}</span>
                          <span className="text-sm font-bold text-foreground">{s.time}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="rounded-[2.5rem] bg-gradient-to-br from-primary/20 to-accent/20 border border-white/20 p-8 relative overflow-hidden group shadow-xl"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-700">
                    <Zap className="h-24 w-24 text-primary" />
                  </div>
                  <div className="relative z-10">
                    <h4 className="text-2xl font-bold text-foreground mb-2">Priority Matching</h4>
                    <p className="text-sm font-medium text-muted-foreground leading-relaxed mb-6">
                      Get fast-tracked into {name.split(' ')[0]}'s schedule by starting a project inquiry today.
                    </p>
                    <Button variant="glossy" className="w-full h-14 rounded-2xl font-bold gap-2">
                      <Sparkles className="h-5 w-5" />
                      Boost My Request
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
        type="professional"
        data={{
          id: professional.id.toString(),
          title: name,
          price: professional.hourlyRate || professional.hourly_rate,
          subtitle: professional.profession
        }}
      />
    </div>
  )
}
