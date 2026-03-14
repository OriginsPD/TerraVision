"use client"

import { useState, useMemo } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PropertyFilters, type FilterState } from "@/components/properties/property-filters"
import { PropertyGrid } from "@/components/properties/property-grid"
import { Spinner } from "@/components/ui/spinner"
import { useProperties } from "@/hooks/api/use-properties"
import { motion } from "framer-motion"
import { Sparkles, LayoutGrid, Search } from "lucide-react"

export default function PropertiesPage() {
  const { data: allProperties, isLoading, error } = useProperties()
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    priceRange: [0, 10000000],
    sizeRange: [0, 1000],
    selectedTypes: []
  })

  const filteredProperties = useMemo(() => {
    if (!allProperties) return []
    
    let filtered = [...allProperties]

    if (filters.search) {
      const s = filters.search.toLowerCase()
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(s) || 
        p.location.toLowerCase().includes(s)
      )
    }

    filtered = filtered.filter(p => 
      p.price >= filters.priceRange[0] && 
      p.price <= filters.priceRange[1]
    )

    filtered = filtered.filter(p => 
      p.size >= filters.sizeRange[0] && 
      p.size <= filters.sizeRange[1]
    )

    if (filters.selectedTypes.length > 0) {
      filtered = filtered.filter(p => filters.selectedTypes.includes(p.type))
    }

    return filtered
  }, [allProperties, filters])

  return (
    <main className="min-h-screen bg-background selection:bg-primary/30">
      <Navbar />
      
      {/* Glossy Header Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/10 via-background to-transparent" />
        <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-accent/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-[10%] left-[5%] w-[200px] h-[200px] bg-primary/20 rounded-full blur-[80px] animate-pulse delay-700" />

        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
          >
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary border border-primary/20 mb-4">
                <LayoutGrid className="h-3 w-3" />
                Marketplace
              </div>
              <h1 className="font-serif text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
                Property <span className="text-gradient">Listings</span>
              </h1>
              <p className="mt-4 text-xl font-medium text-muted-foreground/80 max-w-2xl leading-relaxed">
                Explore our handpicked collection of premium land and estates. Use our immersive 3D viewer to experience them before you visit.
              </p>
            </div>

            <div className="glass px-6 py-4 rounded-3xl border border-white/20 shadow-xl flex flex-col items-center justify-center min-w-[160px]">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Total Available</span>
              <span className="text-4xl font-serif font-bold text-primary">{filteredProperties.length}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-12 relative">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[320px_1fr]">
            {/* Filters Sidebar - More modern & glossy */}
            <aside className="hidden lg:block">
              <div className="sticky top-32">
                <div className="mb-6 flex items-center gap-3 px-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Search className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Refine Search</h3>
                </div>
                <div className="rounded-[2.5rem] border border-white/20 bg-white/5 backdrop-blur-md p-2 shadow-xl">
                  <PropertyFilters onFilterChange={setFilters} />
                </div>
              </div>
            </aside>

            {/* Property Grid Area */}
            <div className="min-h-[600px]">
              {isLoading ? (
                <div className="flex h-96 flex-col items-center justify-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                    <Spinner className="h-12 w-12 text-primary relative z-10" />
                  </div>
                  <p className="text-lg font-bold text-muted-foreground animate-pulse">Loading Properties...</p>
                </div>
              ) : error ? (
                <div className="flex h-96 flex-col items-center justify-center text-center p-8 rounded-[2.5rem] border border-destructive/20 bg-destructive/5 backdrop-blur-md">
                  <div className="h-16 w-16 rounded-2xl bg-destructive/20 flex items-center justify-center mb-4">
                    <Sparkles className="h-8 w-8 text-destructive rotate-45" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Something went wrong</h3>
                  <p className="text-muted-foreground max-w-md">{(error as Error).message}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="mt-6 px-8 py-3 rounded-full bg-destructive text-white font-bold hover:bg-destructive/80 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : filteredProperties.length === 0 ? (
                <div className="flex h-96 flex-col items-center justify-center text-center p-8 rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-md">
                  <div className="h-20 w-20 rounded-[2rem] bg-white/10 flex items-center justify-center mb-6 border border-white/20 shadow-xl">
                    <Search className="h-10 w-10 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-3xl font-bold text-foreground mb-2">No properties found</h3>
                  <p className="text-lg text-muted-foreground max-w-md font-medium">Try adjusting your filters to find what you're looking for.</p>
                  <button 
                    onClick={() => setFilters({ search: "", priceRange: [0, 10000000], sizeRange: [0, 1000], selectedTypes: [] })}
                    className="mt-8 px-10 py-4 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <PropertyGrid properties={filteredProperties} />
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
