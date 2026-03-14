"use client"

import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"

export function useProfessionals() {
  return useQuery({
    queryKey: ["professionals"],
    queryFn: async () => {
      const data = await apiClient.get("/professionals/")
      return data as any[]
    },
  })
}

export function useProfessional(id: string) {
  return useQuery({
    queryKey: ["professionals", id],
    queryFn: async () => {
      const data = await apiClient.get(`/professionals/${id}`)
      return data
    },
  })
}
