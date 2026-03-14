"use client"

import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"

// Helper to map backend professional to frontend format
export const mapBackendProfessional = (p: any) => ({
  id: p.id.toString(),
  name: p.user?.full_name || "Professional",
  email: p.user?.email || "",
  profession: p.profession || "Expert",
  specialty: p.profession === "architect" ? "Custom Design" : "Construction",
  bio: p.bio || "",
  rating: 4.9,
  reviewCount: 24,
  location: "Remote / Local",
  hourlyRate: p.hourly_rate || 0,
  portfolioUrl: p.portfolio_url || "",
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.user?.full_name || p.id}`,
  verified: true,
  completedProjects: 12
})

export function useProfessionals() {
  return useQuery({
    queryKey: ["professionals"],
    queryFn: async () => {
      const data = await apiClient.get("/professionals/")
      return (data as any[]).map(mapBackendProfessional)
    },
  })
}

export function useProfessional(id: string) {
  return useQuery({
    queryKey: ["professionals", id],
    queryFn: async () => {
      const data = await apiClient.get(`/professionals/${id}`)
      return mapBackendProfessional(data)
    },
  })
}
