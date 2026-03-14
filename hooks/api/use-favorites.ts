"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

export function useFavorites() {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      return apiClient.get("/favorites")
    },
  })
}

export function useAddFavorite() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (propertyId: string) => {
      return apiClient.post("/favorites", { property_id: propertyId })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] })
      toast.success("Added to favorites")
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to add favorite")
    }
  })
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (propertyId: string) => {
      // Handle both full ID and numeric ID for robustness
      const id = propertyId.includes('prop-') ? propertyId.split('-')[1] : propertyId
      return apiClient.delete(`/favorites/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] })
      toast.success("Removed from favorites")
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to remove favorite")
    }
  })
}

export function useIsFavorite(propertyId: string) {
  const { data: favorites } = useFavorites()
  return !!favorites?.find((f: any) => f.property_id === propertyId || f.id.toString() === propertyId)
}
