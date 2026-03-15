"use client"

import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"

export interface AnalyticsData {
  overview: {
    totalProperties: number
    totalUsers: number
    totalConversations: number
    totalValuation: number
    averagePrice: number
  }
  typeDistribution: {
    type: string
    count: number
  }[]
  topProperties: {
    id: number
    title: string
    views: number
    price: number
    location: string
  }[]
  ownerStats: {
    myProperties: number
    myMessages: number
  } | null
}

export function useAnalytics() {
  return useQuery<AnalyticsData>({
    queryKey: ["analytics"],
    queryFn: async () => {
      return apiClient.get("/analytics") as Promise<AnalyticsData>
    },
  })
}
