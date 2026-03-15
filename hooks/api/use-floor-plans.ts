"use client"

import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import { floorPlans as mockFloorPlans } from "@/lib/data"

/**
 * Floor plans currently live in the marketplace as purchasable items.
 * The backend endpoint is GET /floor-plans/; we fall back gracefully to
 * the local mock data if the endpoint returns an empty list or errors.
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
        if (list.length > 0) return list
      } catch {
        // Backend may not have floor plans yet – fall through to mock
      }
      return mockFloorPlans
    },
  })
}

export function useFloorPlan(id: string) {
  return useQuery({
    queryKey: ["floor-plans", id],
    queryFn: async () => {
      try {
        const data = (await apiClient.get(`/floor-plans/${id}`)) as any
        if (data) return data
      } catch {
        // Fall back to mock
      }
      return mockFloorPlans.find((p) => p.id === id)
    },
    enabled: !!id,
  })
}
