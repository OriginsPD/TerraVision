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
      const user = await apiClient.get("/auth/me")
      
      // Map backend roles to frontend roles
      let frontendRole: UserRole = "buyer"
      const backendRole = user.role?.toLowerCase()
      
      if (backendRole === "owner") {
        frontendRole = "owner"
      } else if (["architect", "mason", "carpenter", "contractor"].includes(backendRole)) {
        frontendRole = "professional"
      } else if (backendRole === "buyer") {
        frontendRole = "buyer"
      }
      
      return {
        ...user,
        role: frontendRole
      }
    },
    // Don't refetch on every window focus for the user profile
    staleTime: 5 * 60 * 1000, 
  })
}
