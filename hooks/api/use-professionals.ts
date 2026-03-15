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

export function useProfessionals() {
  return useQuery({
    queryKey: ["professionals"],
    queryFn: async () => {
      const data = (await apiClient.get("/professionals/")) as any
      const list: any[] = Array.isArray(data) ? data : data?.professionals ?? []
      return list.map(mapBackendProfessional)
    },
  })
}

export function useProfessional(id: string) {
  return useQuery({
    queryKey: ["professionals", id],
    queryFn: async () => {
      const data = (await apiClient.get(`/professionals/${id}`)) as any
      return mapBackendProfessional(data)
    },
    enabled: !!id,
  })
}
