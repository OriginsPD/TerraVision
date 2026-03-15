"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { Property } from "@/lib/data"

// Helper to map backend PropertyOut to frontend Property type.
// Backend fields: id, owner_id, title, description, location, price,
//   landSize (alias for land_size), image_url, model_3d_url,
//   is_model_generated, created_at
export const mapBackendProperty = (p: any): Property => ({
  id: p.id.toString(),
  title: p.title,
  description: p.description ?? "",
  location: p.location,
  address: p.location,
  latitude: p.latitude,
  longitude: p.longitude,
  price: p.price,
  size: p.landSize ?? p.land_size ?? 0,
  sizeUnit: "acres",
  type: p.type || "HOUSE",
  status: p.status || "available",
  has3D: !!(p.model_3d_url || p.model_url),
  model3DUrl: p.model_3d_url || p.model_url || null,
  generationStatus: (p.model_3d_url || p.model_url)
    ? "completed"
    : (p.is_model_generated === false && p.model_3d_url === null)
    ? "failed"
    : (p.generation_status === "pending")
    ? "pending"
    : "none",
  images: p.images || [],
  amenities: p.amenities || [],
  views: p.views || 0,
  ownerId: p.owner_id?.toString() ?? p.ownerId?.toString() ?? "",
  ownerName: "Owner",
  createdAt: p.created_at ?? p.createdAt ?? new Date().toISOString(),
  featured: !!p.featured,
})

export function useProperties() {
  return useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      // GET /properties/ -> PaginatedResponse
      // api-client unwraps BaseResponse envelope -> { properties: [...], pagination: {...} }
      const data = (await apiClient.get("/properties/")) as any
      const list: any[] = data?.properties ?? (Array.isArray(data) ? data : [])
      return list.map(mapBackendProperty)
    },
  })
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: ["properties", id],
    queryFn: async () => {
      // GET /properties/{id} -> BaseResponse { data: { property: PropertyOut } }
      // api-client unwraps -> { property: PropertyOut }
      const data = (await apiClient.get(`/properties/${id}`)) as any
      // Extract the nested property object
      const propertyData = data?.property ?? data
      return mapBackendProperty(propertyData)
    },
    enabled: !!id,
    // Poll every 5 seconds while 3D model is still being generated
    refetchInterval: (query) => {
      const property = query.state.data as Property | undefined
      if (property && !property.has3D) return 5000
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
