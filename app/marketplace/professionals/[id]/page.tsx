import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Star, MapPin, Calendar, CheckCircle, MessageSquare, Phone, Mail, Clock, Award, Briefcase, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { professionals } from "@/lib/data"

interface ProfessionalDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ProfessionalDetailPageProps) {
  const { id } = await params
  const professional = professionals.find(p => p.id === id)
  
  if (!professional) {
    return { title: "Professional Not Found | TerraVision" }
  }

  return {
    title: `${professional.name} - ${professional.specialty} | TerraVision`,
    description: professional.bio,
  }
}

export default async function ProfessionalDetailPage({ params }: ProfessionalDetailPageProps) {
  const { id } = await params
  const professional = professionals.find(p => p.id === id)

  if (!professional) {
    notFound()
  }

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
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        {/* Back Navigation */}
        <div className="border-b border-border">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <Link href="/marketplace/professionals" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Professionals
            </Link>
          </div>
        </div>

        {/* Professional Header */}
        <section className="border-b border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 py-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex gap-6">
                <Avatar className="h-24 w-24 border-2 border-primary">
                  <AvatarImage src={professional.avatar} alt={professional.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {professional.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-serif text-2xl font-medium text-foreground md:text-3xl">{professional.name}</h1>
                    {professional.verified && (
                      <CheckCircle className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <p className="mt-1 text-lg text-muted-foreground">{professional.specialty}</p>
                  <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {professional.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      {professional.rating} ({professional.reviewCount} reviews)
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                      {professional.profession}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-right text-sm text-muted-foreground">Starting at</p>
                <p className="text-right text-2xl font-bold text-foreground">${professional.hourlyRate}/hr</p>
                <Button className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contact Professional
                </Button>
                <Button variant="outline" className="border-border text-foreground hover:bg-secondary">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Consultation
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Left Column - Tabs Content */}
              <div className="lg:col-span-2">
                <Tabs defaultValue="portfolio">
                  <TabsList className="w-full justify-start bg-card border border-border">
                    <TabsTrigger value="portfolio" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      Portfolio
                    </TabsTrigger>
                    <TabsTrigger value="about" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      About
                    </TabsTrigger>
                    <TabsTrigger value="reviews" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      Reviews
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="portfolio" className="mt-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      {portfolio.map((item) => (
                        <Card key={item.id} className="overflow-hidden border-border bg-card group cursor-pointer">
                          <div className="aspect-video bg-muted relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <p className="text-sm font-medium text-foreground">{item.title}</p>
                              <p className="text-xs text-muted-foreground">{item.type}</p>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-medium text-foreground">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">{item.type}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="about" className="mt-6">
                    <Card className="border-border bg-card">
                      <CardContent className="p-6">
                        <h3 className="font-serif text-lg font-medium text-foreground mb-4">About</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {professional.bio}
                        </p>

                        <div className="mt-6 grid gap-4 sm:grid-cols-3">
                          <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary">
                            <Award className="h-8 w-8 text-primary" />
                            <div>
                              <p className="text-2xl font-bold text-foreground">{professional.completedProjects}</p>
                              <p className="text-xs text-muted-foreground">Projects Completed</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary">
                            <Briefcase className="h-8 w-8 text-primary" />
                            <div>
                              <p className="text-2xl font-bold text-foreground">15+</p>
                              <p className="text-xs text-muted-foreground">Years Experience</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary">
                            <Users className="h-8 w-8 text-primary" />
                            <div>
                              <p className="text-2xl font-bold text-foreground">100+</p>
                              <p className="text-xs text-muted-foreground">Happy Clients</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="reviews" className="mt-6">
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <Card key={review.id} className="border-border bg-card">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback className="bg-secondary text-secondary-foreground">
                                    {review.author.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-foreground">{review.author}</p>
                                  <p className="text-xs text-muted-foreground">{review.date}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < review.rating ? 'fill-primary text-primary' : 'text-muted'}`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="mt-4 text-muted-foreground">{review.comment}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Right Column - Contact Info */}
              <div className="space-y-6">
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="font-serif text-lg text-foreground">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{professional.name.toLowerCase().replace(' ', '.')}@example.com</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Response within 24 hours</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="font-serif text-lg text-foreground">Availability</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Monday - Friday</span>
                        <span className="text-foreground">9:00 AM - 6:00 PM</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Saturday</span>
                        <span className="text-foreground">10:00 AM - 2:00 PM</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Sunday</span>
                        <span className="text-foreground">Closed</span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-sm text-green-500">Currently Available</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
