"use client"

import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"

export type UserRole = "buyer" | "owner" | "professional"

export interface User {
  id: number
  email: string
  full_name: string
  role: UserRole
  is_active: boolean
}

export function useUser() {
  return useQuery<User>({
    queryKey: ["user", "me"],
    queryFn: async () => {
      return apiClient.get("/users/me")
    },
    // Don't refetch on every window focus for the user profile
    staleTime: 5 * 60 * 1000, 
  })
}
