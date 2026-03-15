"use client"

import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"

export interface AnalyticsData {
  stats: {
    label: string
    value: string
    change: string
    trend: "up" | "down" | "neutral"
    icon?: string
  }[]
  chartData?: { name: string, value: number }[]
}

export function useAnalytics() {
  return useQuery<AnalyticsData>({
    queryKey: ["analytics", "overview"],
    queryFn: async () => {
      return apiClient.get("/analytics/overview")
    },
  })
}
