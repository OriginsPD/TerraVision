"use client"

import { useQuery } from "@tanstack/react-query"
import { floorPlans } from "@/lib/data"

export function useFloorPlans() {
  return useQuery({
    queryKey: ["floor-plans"],
    queryFn: async () => {
      // Backend doesn't have floor plans yet, using mock
      await new Promise(resolve => setTimeout(resolve, 500))
      return floorPlans
    },
  })
}

export function useFloorPlan(id: string) {
  return useQuery({
    queryKey: ["floor-plans", id],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500))
      return floorPlans.find(p => p.id === id)
    },
  })
}
