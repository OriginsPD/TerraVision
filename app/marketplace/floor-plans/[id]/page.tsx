import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Star, FileText, Download, Share2, Heart, CheckCircle, Info, Maximize2, Ruler, Layout, Building2, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { floorPlans, getFloorPlanById } from "@/lib/data"

interface FloorPlanPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: FloorPlanPageProps) {
  const { id } = await params
  const plan = getFloorPlanById(id)
  
  if (!plan) {
    return { title: "Floor Plan Not Found | TerraVision" }
  }

  return {
    title: `${plan.title} - Floor Plan | TerraVision`,
    description: plan.description,
  }
}

export default async function FloorPlanPage({ params }: FloorPlanPageProps) {
  const { id } = await params
  const plan = getFloorPlanById(id)

  if (!plan) {
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
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        {/* Back Navigation */}
        <div className="border-b border-border">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <Link href="/marketplace/floor-plans" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Floor Plans
            </Link>
          </div>
        </div>

        {/* Plan Header */}
        <section className="border-b border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 py-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif text-3xl font-medium text-foreground md:text-4xl">{plan.title}</h1>
                  <Badge variant="outline" className="border-primary text-primary">{plan.style}</Badge>
                </div>
                <p className="mt-2 text-lg text-muted-foreground">Designed by {plan.architectName}</p>
                <div className="mt-4 flex items-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    {plan.rating} ({plan.downloads} downloads)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Building2 className="h-4 w-4" />
                    {plan.sqft.toLocaleString()} sqft
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Layout className="h-4 w-4" />
                    {plan.bedrooms} Beds / {plan.bathrooms} Baths
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-3 min-w-[200px]">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Plan License</span>
                  <span className="text-3xl font-bold text-foreground">${plan.price.toLocaleString()}</span>
                </div>
                <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  <Download className="mr-2 h-4 w-4" />
                  Purchase & Download
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="flex-1">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="flex-1">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid gap-12 lg:grid-cols-3">
              {/* Left Column - Preview & Details */}
              <div className="lg:col-span-2 space-y-8">
                {/* Image Gallery */}
                <div className="aspect-video bg-muted rounded-2xl border border-border flex items-center justify-center overflow-hidden">
                   <div className="text-center">
                      <FileText className="h-20 w-20 text-muted-foreground/30 mx-auto" />
                      <p className="mt-4 text-muted-foreground">Main Floor Plan Preview</p>
                      <Button variant="ghost" className="mt-2 gap-2">
                        <Maximize2 className="h-4 w-4" />
                        View Full Screen
                      </Button>
                   </div>
                </div>

                {/* Tabs Information */}
                <Tabs defaultValue="overview">
                  <TabsList className="w-full justify-start bg-card border border-border">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="specs">Specifications</TabsTrigger>
                    <TabsTrigger value="features">Features</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="mt-6">
                    <Card className="border-border bg-card">
                      <CardContent className="p-6">
                        <h3 className="font-serif text-lg font-medium text-foreground mb-4">Description</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {plan.description}
                        </p>
                        <p className="mt-4 text-muted-foreground leading-relaxed">
                          This meticulously designed {plan.style} plan offers a perfect balance of open-concept 
                          living spaces and private retreats. The flow between the kitchen, dining, and living areas 
                          is seamless, making it ideal for both entertaining and everyday family life.
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="specs" className="mt-6">
                    <Card className="border-border bg-card">
                      <CardContent className="p-6 grid gap-6 sm:grid-cols-2">
                        <div className="space-y-4">
                          <h4 className="font-medium text-foreground flex items-center gap-2">
                            <Ruler className="h-4 w-4 text-primary" />
                            Dimensions
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between border-b border-border/50 pb-2">
                              <span className="text-muted-foreground">Total Heated Area</span>
                              <span className="text-foreground font-medium">{plan.sqft.toLocaleString()} sq ft</span>
                            </div>
                            <div className="flex justify-between border-b border-border/50 pb-2">
                              <span className="text-muted-foreground">Bedrooms</span>
                              <span className="text-foreground font-medium">{plan.bedrooms}</span>
                            </div>
                            <div className="flex justify-between border-b border-border/50 pb-2">
                              <span className="text-muted-foreground">Bathrooms</span>
                              <span className="text-foreground font-medium">{plan.bathrooms}</span>
                            </div>
                            <div className="flex justify-between border-b border-border/50 pb-2">
                              <span className="text-muted-foreground">Stories</span>
                              <span className="text-foreground font-medium">1</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h4 className="font-medium text-foreground flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-primary" />
                            Construction
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between border-b border-border/50 pb-2">
                              <span className="text-muted-foreground">Foundation</span>
                              <span className="text-foreground font-medium">Slab / Crawlspace</span>
                            </div>
                            <div className="flex justify-between border-b border-border/50 pb-2">
                              <span className="text-muted-foreground">Exterior Walls</span>
                              <span className="text-foreground font-medium">2x6 Frame</span>
                            </div>
                            <div className="flex justify-between border-b border-border/50 pb-2">
                              <span className="text-muted-foreground">Roof Type</span>
                              <span className="text-foreground font-medium">Gable / Hip</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="features" className="mt-6">
                    <Card className="border-border bg-card">
                      <CardContent className="p-6">
                        <div className="grid gap-3 sm:grid-cols-2">
                          {features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CheckCircle className="h-4 w-4 text-primary" />
                              {feature}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Right Column - Architect & Support */}
              <div className="space-y-6">
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="font-serif text-lg text-foreground">Meet the Architect</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-serif text-lg text-primary font-bold">
                        {plan.architectName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{plan.architectName}</p>
                        <p className="text-xs text-muted-foreground">Verified Designer</p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-4" asChild>
                      <Link href={`/marketplace/professionals/${plan.architectId}`}>View Profile</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="font-serif text-lg text-foreground">What&apos;s Included?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                      <span>Full Architectural Set (PDF)</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                      <span>Detailed Floor Plans</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                      <span>Exterior Elevations</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                      <span>Roof Plan & Detail</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Info className="h-4 w-4 text-amber-500 mt-0.5" />
                      <span className="text-xs">Modified sets available upon request</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border bg-card bg-primary/5">
                  <CardContent className="p-6">
                    <h4 className="font-medium text-foreground">Need help choosing?</h4>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Our experts can help you select the best plan for your land and budget.
                    </p>
                    <Button className="w-full mt-4 gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Talk to an Expert
                    </Button>
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
