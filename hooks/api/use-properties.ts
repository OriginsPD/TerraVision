"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { Property } from "@/lib/data"

// Helper to map backend property to frontend Property type
export const mapBackendProperty = (p: any): Property => ({
  id: p.id.toString(),
  title: p.title,
  description: p.description,
  location: p.location,
  address: p.location,
  price: p.price,
  size: p.land_size,
  sizeUnit: "acres", // Backend doesn't currently store unit, defaulting to acres
  type: "land", // Defaulting to land as per original backend model
  status: "available",
  has3D: p.is_model_generated,
  model3DUrl: p.model_3d_url,
  generationStatus: p.is_model_generated ? "completed" : (p.model_3d_url ? "pending" : "none"),
  images: p.image_url ? [p.image_url, ...(p.images?.map((img: any) => img.url) || [])] : (p.images?.map((img: any) => img.url) || []),
  features: [],
  ownerId: p.owner_id.toString(),
  ownerName: "Owner",
  createdAt: p.created_at,
  featured: false,
})

export function useProperties() {
  return useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      const data = await apiClient.get("/properties/")
      return (data as any[]).map(mapBackendProperty)
    },
  })
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: ["properties", id],
    queryFn: async () => {
      const data = await apiClient.get(`/properties/${id}`)
      return mapBackendProperty(data)
    },
    // If the model is not yet generated, we poll every 5 seconds
    refetchInterval: (query) => {
      const property = query.state.data as Property | undefined
      if (property && !property.has3D) {
        return 5000
      }
      return false
    },
  })
}

export function useCreateProperty() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (formData: FormData) => {
      return apiClient.post("/properties/", formData, { isMultipart: true })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] })
    },
  })
}

export function useGenerateModel() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (propertyId: string) => {
      return apiClient.post(`/properties/${propertyId}/generate-3d`, {})
    },
    onSuccess: (_, propertyId) => {
      queryClient.invalidateQueries({ queryKey: ["properties", propertyId] })
    },
  })
}
