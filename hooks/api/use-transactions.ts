"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

export function usePurchaseFloorPlan() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (planId: string) => {
      // In a real app, this would call a Stripe session or internal order API
      return apiClient.post(`/marketplace/floor-plans/${planId}/purchase`, {})
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-purchases"] })
      toast.success("Purchase successful! Your floor plan is now available in your dashboard.")
    },
    onError: (err: any) => {
      // Mock success for development if endpoint doesn't exist
      if (process.env.NEXT_PUBLIC_MOCK_MODE === 'true') {
        toast.success("Development Mode: Purchase simulated successfully!")
        return
      }
      toast.error(err.message || "Purchase failed")
    }
  })
}

export function useHireProfessional() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ professionalId, projectDetails }: { professionalId: string, projectDetails: string }) => {
      return apiClient.post(`/marketplace/professionals/${professionalId}/hire`, { details: projectDetails })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] })
      toast.success("Request sent! The professional will contact you soon via the inbox.")
    },
    onError: (err: any) => {
      if (process.env.NEXT_PUBLIC_MOCK_MODE === 'true') {
        toast.success("Development Mode: Hire request simulated successfully!")
        return
      }
      toast.error(err.message || "Request failed")
    }
  })
}
