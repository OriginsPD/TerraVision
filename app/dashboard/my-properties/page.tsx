"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, MoreVertical, Eye, Edit, Trash2, MapPin, Home, TrendingUp, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { apiClient } from "@/lib/api-client"
import { Spinner } from "@/components/ui/spinner"

export default function MyPropertiesPage() {
  const [myProperties, setMyProperties] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchMyProperties() {
      try {
        setIsLoading(true)
        const res = (await apiClient.get("/properties/")) as any
        const allProperties: any[] = res?.properties ?? (Array.isArray(res) ? res : [])
        setMyProperties(allProperties)
      } catch (error) {
        console.error("Failed to fetch properties", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchMyProperties()
  }, [])

  const stats = [
    { label: "Total Properties", value: myProperties.length.toString(), icon: Home, change: "+1 this month" },
    { label: "Total Views", value: "1,234", icon: Eye, change: "+12% vs last month" },
    { label: "Active Inquiries", value: "8", icon: TrendingUp, change: "3 new today" },
    { label: "Est. Portfolio Value", value: `$${(myProperties.reduce((acc, p) => acc + p.price, 0) / 1000000).toFixed(1)}M`, icon: DollarSign, change: "+5% this year" },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium text-foreground md:text-3xl">My Properties</h1>
          <p className="mt-1 text-muted-foreground">Manage your property listings</p>
        </div>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/dashboard/my-properties/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Property
          </Link>
        </Button>
      </div>

...

      {/* Properties List */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="font-serif text-lg text-foreground">Property Listings</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <Spinner className="h-8 w-8 text-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              {myProperties.map((property) => (
                <div
                  key={property.id}
                  className="flex flex-col gap-4 rounded-lg border border-border bg-secondary/30 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex gap-4">
                    <img 
                      src={property.image_url.startsWith('http') ? property.image_url : `http://localhost:8000${property.image_url}`} 
                      className="h-20 w-20 flex-shrink-0 rounded-lg object-cover" 
                      alt={property.title}
                    />
                    <div>
                      <h3 className="font-medium text-foreground">{property.title}</h3>
                      <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {property.location}
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge
                          variant={property.is_model_generated ? "default" : "secondary"}
                          className={property.is_model_generated ? "bg-primary text-primary-foreground" : ""}
                        >
                          {property.is_model_generated ? "3D Ready" : "Processing"}
                        </Badge>
                        <span className="text-sm text-muted-foreground">Active</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-foreground">${property.price.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{property.land_size} acres</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover border-border">
                        <DropdownMenuItem asChild>
                          <Link href={`/properties/${property.id}`} className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            View Listing
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Edit className="h-4 w-4" />
                          Edit Property
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2 text-destructive">
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
              {myProperties.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Home className="h-12 w-12 text-muted-foreground/20" />
                  <p className="mt-4 text-lg font-medium text-foreground">No properties yet</p>
                  <p className="text-sm text-muted-foreground">Start by adding your first property listing</p>
                  <Button asChild variant="outline" className="mt-6">
                    <Link href="/dashboard/my-properties/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Property
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
