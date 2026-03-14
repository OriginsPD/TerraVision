"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProfessionalFilters } from "@/components/marketplace/professional-filters"
import { ProfessionalGrid } from "@/components/marketplace/professional-grid"
import { apiClient } from "@/lib/api-client"
import { Spinner } from "@/components/ui/spinner"
import type { Professional } from "@/lib/data"

export default function ProfessionalsPage() {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchProfessionals() {
      try {
        setIsLoading(true)
        const data = await apiClient.get("/professionals/")
        
        const mapped: Professional[] = data.map((p: any) => ({
          id: p.id.toString(),
          name: p.user?.full_name || "Professional",
          email: p.user?.email || "",
          profession: p.profession,
          specialty: p.profession.charAt(0).toUpperCase() + p.profession.slice(1),
          bio: p.bio || "",
          location: "Not specified",
          rating: 4.5,
          reviewCount: 10,
          hourlyRate: p.hourly_rate || 0,
          completedProjects: 5,
          portfolioUrl: p.portfolio_url,
          verified: true,
          avatar: undefined,
        }))
        
        setProfessionals(mapped)
      } catch (error) {
        console.error("Failed to fetch professionals", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfessionals()
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="border-b border-border bg-card pt-24">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
                Find Professionals
              </h1>
              <p className="mt-2 text-muted-foreground">
                Connect with verified experts for your project
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{professionals.length}</span> professionals
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            {/* Filters Sidebar */}
            <aside className="hidden lg:block">
              <ProfessionalFilters />
            </aside>

            {/* Professional Grid */}
            <div>
              {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                  <Spinner className="h-8 w-8 text-primary" />
                </div>
              ) : (
                <ProfessionalGrid professionals={professionals} />
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
