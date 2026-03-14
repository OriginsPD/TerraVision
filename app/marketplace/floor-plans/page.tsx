import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, FileText, Star, Bed, Bath, Square, Download } from "lucide-react"
import { floorPlans } from "@/lib/data"

export const metadata = {
  title: "Floor Plans | TerraVision",
  description: "Browse ready-to-build floor plans from top architects. Find the perfect design for your dream home.",
}

export default function FloorPlansPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="border-b border-border bg-card pt-24">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
                Floor Plans
              </h1>
              <p className="mt-2 text-muted-foreground">
                Ready-to-build designs from verified architects
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{floorPlans.length}</span> plans available
            </p>
          </div>

          {/* Filters */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search floor plans..." className="pl-9" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Styles</SelectItem>
                <SelectItem value="modern">Modern</SelectItem>
                <SelectItem value="farmhouse">Farmhouse</SelectItem>
                <SelectItem value="contemporary">Contemporary</SelectItem>
                <SelectItem value="rustic">Rustic</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Bedrooms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Beds</SelectItem>
                <SelectItem value="2">2 Bedrooms</SelectItem>
                <SelectItem value="3">3 Bedrooms</SelectItem>
                <SelectItem value="4">4+ Bedrooms</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="popular">
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Floor Plans Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {floorPlans.map((plan) => (
              <Link key={plan.id} href={`/marketplace/floor-plans/${plan.id}`} className="group block">
                <div className="overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
                  {/* Preview Image */}
                  <div className="relative aspect-[4/3] bg-muted">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FileText className="h-16 w-16 text-muted-foreground/30" />
                    </div>
                    <Badge className="absolute left-3 top-3">{plan.style}</Badge>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-medium text-foreground">{plan.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">by {plan.architectName}</p>
                    
                    <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{plan.description}</p>

                    {/* Specs */}
                    <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Square className="h-4 w-4" />
                        {plan.sqft.toLocaleString()} sqft
                      </div>
                      <div className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        {plan.bedrooms}
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="h-4 w-4" />
                        {plan.bathrooms}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                      <div>
                        <p className="font-serif text-xl text-foreground">${plan.price.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          <span className="text-foreground">{plan.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Download className="h-4 w-4" />
                          {plan.downloads}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
