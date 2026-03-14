"use client"

import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"

export function useFloorPlans() {
  return useQuery({
    queryKey: ["floor-plans"],
    queryFn: async () => {
      return apiClient.get("/floor-plans/")
    },
  })
}

export function useFloorPlan(id: string) {
  return useQuery({
    queryKey: ["floor-plans", id],
    queryFn: async () => {
      return apiClient.get(`/floor-plans/${id}`)
    },
  })
}
