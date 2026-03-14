import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { MapPin, Box, Heart, Trash2 } from "lucide-react"
import { properties } from "@/lib/data"

export const metadata = {
  title: "Favorites | TerraVision",
  description: "View your saved properties.",
}

export default function FavoritesPage() {
  // Mock saved properties (would come from database)
  const savedProperties = properties.slice(0, 5)

  return (
    <main className="flex-1 p-4 lg:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl tracking-tight text-foreground">Saved Properties</h1>
            <p className="mt-1 text-muted-foreground">
              {savedProperties.length} properties saved
            </p>
          </div>
        </div>

        {savedProperties.length === 0 ? (
          <Empty>
            <EmptyMedia variant="icon">
              <Heart className="size-6" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>No saved properties</EmptyTitle>
              <EmptyDescription>Start exploring properties and save your favorites for later.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild>
                <Link href="/properties">Browse Properties</Link>
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <div className="space-y-4">
            {savedProperties.map((property) => (
              <Card key={property.id} className="transition-all hover:border-primary/50">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    {/* Image */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted sm:aspect-[4/3] sm:w-48 sm:rounded-l-xl">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Box className="h-8 w-8 text-muted-foreground/30" />
                      </div>
                      {property.has3D && (
                        <Badge variant="secondary" className="absolute left-2 top-2 gap-1">
                          <Box className="h-3 w-3" />
                          3D
                        </Badge>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col justify-between p-4">
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <Link href={`/properties/${property.id}`} className="group">
                              <h3 className="font-medium text-foreground group-hover:text-primary">
                                {property.title}
                              </h3>
                            </Link>
                            <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5" />
                              {property.location}
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                          {property.description}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <p className="font-serif text-xl text-foreground">${property.price.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">{property.size} {property.sizeUnit}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                          </Badge>
                          <Button size="sm" asChild>
                            <Link href={`/properties/${property.id}`}>View Details</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
