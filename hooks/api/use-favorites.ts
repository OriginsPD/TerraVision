"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import { mapBackendProperty } from "./use-properties"
import { toast } from "sonner"

export function useFavorites() {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      // GET /favorites/ -> raw array of FavoriteOut
      // FavoriteOut: { id, user_id, property_id, created_at, property?: PropertyOut }
      const data = (await apiClient.get("/favorites/")) as any[]
      if (!Array.isArray(data)) return []
      return data.map((f: any) => ({
        id: f.id,
        property_id: f.property_id,
        // Include the mapped property if available for display
        property: f.property ? mapBackendProperty(f.property) : null,
      }))
    },
  })
}

export function useAddFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (propertyId: string | number) => {
      // Backend expects integer property_id
      const id = typeof propertyId === "string" ? parseInt(propertyId, 10) : propertyId
      return apiClient.post("/favorites/", { property_id: id })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] })
      toast.success("Added to favorites")
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to add favorite")
    },
  })
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (propertyId: string | number) => {
      // propertyId here is the backend integer property_id (not the favorite row id)
      const id = typeof propertyId === "string" ? parseInt(propertyId, 10) : propertyId
      return apiClient.delete(`/favorites/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] })
      toast.success("Removed from favorites")
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to remove favorite")
    },
  })
}

export function useIsFavorite(propertyId: string | number) {
  const { data: favorites } = useFavorites()
  const id = typeof propertyId === "string" ? parseInt(propertyId, 10) : propertyId
  return !!(favorites as any[])?.find((f: any) => f.property_id === id)
}
