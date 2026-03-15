"use client"

import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"

/**
 * Floor plans currently live in the marketplace as purchasable items.
 * The backend endpoint is GET /floor-plans/; we fall back gracefully
 * if the endpoint returns an empty list or errors.
 */
export function useFloorPlans() {
  return useQuery({
    queryKey: ["floor-plans"],
    queryFn: async () => {
      try {
        const data = (await apiClient.get("/floor-plans/")) as any
        const list: any[] = Array.isArray(data)
          ? data
          : data?.floor_plans ?? data?.floorPlans ?? []
        return list
      } catch {
        return []
      }
    },
  })
}

export function useFloorPlan(id: string) {
  return useQuery({
    queryKey: ["floor-plans", id],
    queryFn: async () => {
      const data = (await apiClient.get(`/floor-plans/${id}`)) as any
      return data
    },
    enabled: !!id,
  })
}
