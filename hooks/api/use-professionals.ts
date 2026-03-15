"use client"

import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { Professional } from "@/lib/data"

function mapBackendProfessional(p: any): Professional {
  const user = p.user ?? {}
  const firstName: string = user.firstName ?? user.first_name ?? ""
  const lastName: string = user.lastName ?? user.last_name ?? ""
  const name =
    p.name ??
    user.full_name ??
    (firstName || lastName ? `${firstName} ${lastName}`.trim() : "Unknown")

  return {
    id: p.id?.toString() ?? p.user_id?.toString() ?? "0",
    name,
    email: p.email ?? user.email ?? "",
    profession: p.profession ?? "architect",
    specialty: p.specialty ?? p.bio ?? "",
    bio: p.bio ?? "",
    location: p.location ?? user.location ?? "Remote",
    rating: p.rating ?? 4.5,
    reviewCount: p.reviewCount ?? p.review_count ?? 0,
    hourlyRate: p.hourlyRate ?? p.hourly_rate ?? 0,
    completedProjects: p.completedProjects ?? p.completed_projects ?? 0,
    portfolioUrl: p.portfolioUrl ?? p.portfolio_url ?? undefined,
    verified: p.verified ?? false,
    avatar: p.avatar ?? undefined,
  }
}

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
<<<<<<< HEAD
      const data = (await apiClient.get("/professionals/")) as any
      const list: any[] = Array.isArray(data) ? data : data?.professionals ?? []
      return list.map(mapBackendProfessional)
=======
      const data = await apiClient.get("/professionals/")
      return (data as any[]).map(mapBackendProfessional)
>>>>>>> d8991edf2c3eb8cd066b3f70983136f50a2d6ffb
    },
  })
}

export function useProfessional(id: string) {
  return useQuery({
    queryKey: ["professionals", id],
    queryFn: async () => {
<<<<<<< HEAD
      const data = (await apiClient.get(`/professionals/${id}`)) as any
=======
      const data = await apiClient.get(`/professionals/${id}`)
>>>>>>> d8991edf2c3eb8cd066b3f70983136f50a2d6ffb
      return mapBackendProfessional(data)
    },
    enabled: !!id,
  })
}
