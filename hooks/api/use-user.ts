"use client"

import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import { getAccessToken } from "@/lib/auth"

// Backend roles
export type BackendRole =
  | "buyer"
  | "owner"
  | "architect"
  | "mason"
  | "carpenter"
  | "contractor"
  | "admin"

// Frontend simplified role
export type UserRole = "buyer" | "owner" | "professional"

export interface User {
  id: number
  email: string
  full_name: string
  role: UserRole
  is_active: boolean
}

/**
 * Maps the backend UserOut (camelCase aliases) to the frontend User shape.
 * Backend returns: { id, email, firstName, lastName, role, isActive, ... }
 */
export function mapBackendUser(raw: any): User {
  const backendRole: BackendRole = raw.role ?? "buyer"
  const professionalRoles: BackendRole[] = ["architect", "mason", "carpenter", "contractor"]

  const role: UserRole = professionalRoles.includes(backendRole)
    ? "professional"
    : backendRole === "admin"
    ? "owner"
    : (backendRole as UserRole)

  const firstName: string = raw.firstName ?? raw.first_name ?? ""
  const lastName: string = raw.lastName ?? raw.last_name ?? ""
  const full_name =
    raw.full_name ??
    (firstName || lastName ? `${firstName} ${lastName}`.trim() : raw.email)

  return {
    id: raw.id,
    email: raw.email,
    full_name,
    role,
    is_active: raw.isActive ?? raw.is_active ?? true,
  }
}

export function useUser() {
  return useQuery<User>({
    queryKey: ["user", "me"],
    queryFn: async () => {
      // GET /auth/me -> BaseResponse { data: { user: UserOut } }
      // api-client unwraps the outer envelope, returning { user: UserOut }
      const data = (await apiClient.get("/auth/me")) as any
      const raw = data?.user ?? data
      return mapBackendUser(raw)
    },
    // Only run when a token exists
    enabled: typeof window !== "undefined" && !!getAccessToken(),
    staleTime: 5 * 60 * 1000,
    retry: false,
  })
}
