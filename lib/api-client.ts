/**
 * api-client.ts – Thin HTTP client for the TerraVision backend.
 *
 * Responsibilities:
 *  • Attach Bearer token to every request
 *  • Unwrap the FastAPI BaseResponse envelope ({ success, data, message })
 *  • On 401: attempt one silent token refresh, then retry original request
 *  • Throw plain Error with a human-readable message on failure
 */

import { getAccessToken, refreshAccessToken, clearTokens } from "./auth"

const envApiUrl = process.env.NEXT_PUBLIC_API_URL
const BASE_URL =
  envApiUrl && (typeof window === "undefined" || !envApiUrl.includes("localhost") || process.env.NODE_ENV === "development")
    ? envApiUrl
    : "/api/v1"

type RequestOptions = {
  headers?: Record<string, string>
  body?: unknown
  method?: string
  isMultipart?: boolean
}

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

async function request(path: string, options: RequestOptions = {}): Promise<unknown> {
  const url = `${BASE_URL}${path}`
  const token = getAccessToken()

  const headers: Record<string, string> = { ...options.headers }
  if (token) headers["Authorization"] = `Bearer ${token}`

  let body: BodyInit | undefined
  if (options.body !== undefined) {
    if (options.isMultipart) {
      // FormData – do not set Content-Type (browser sets it with boundary)
      body = options.body as FormData
    } else {
      headers["Content-Type"] = "application/json"
      body = JSON.stringify(options.body)
    }
  }

  let response = await fetch(url, {
    method: options.method ?? "GET",
    headers,
    body,
  })

  // ── 401 handling: refresh and retry once ──────────────────────────────────
  if (response.status === 401) {
    const token = getAccessToken()
    if (!token) {
      // Not logged in – just return error, do not redirect
      throw new Error("Unauthorized")
    }

    const newToken = await refreshAccessToken()
    if (newToken) {
      headers["Authorization"] = `Bearer ${newToken}`
      response = await fetch(url, { method: options.method ?? "GET", headers, body })
    } else {
      // Refresh failed – force logout
      if (typeof window !== "undefined" && window.location.pathname !== "/") {
        window.location.href = "/login"
      }
      throw new Error("Session expired. Please log in again.")
    }
  }

  // ── 204 No Content ────────────────────────────────────────────────────────
  if (response.status === 204) return null

  // ── Parse JSON ────────────────────────────────────────────────────────────
  const json = await response.json().catch(() => ({ detail: response.statusText }))

  if (!response.ok) {
    // FastAPI error shape: { detail: string | { message } }
    const detail = json?.detail
    const message =
      typeof detail === "string"
        ? detail
        : detail?.message ?? detail?.error?.message ?? response.statusText
    throw new Error(message || "An error occurred")
  }

  // ── Unwrap BaseResponse envelope ─────────────────────────────────────────
  // Most endpoints return: { success: true, data: <payload>, message?: string }
  // Raw-array endpoints (favorites, messages) return arrays directly.
  if (
    json !== null &&
    typeof json === "object" &&
    !Array.isArray(json) &&
    "success" in json &&
    "data" in json
  ) {
    return json.data
  }

  return json
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const apiClient = {
  get: (path: string, options: Omit<RequestOptions, "method" | "body"> = {}) =>
    request(path, { ...options, method: "GET" }),

  post: (
    path: string,
    body: unknown,
    options: Omit<RequestOptions, "method" | "body"> = {}
  ) => request(path, { ...options, method: "POST", body }),

  put: (
    path: string,
    body: unknown,
    options: Omit<RequestOptions, "method" | "body"> = {}
  ) => request(path, { ...options, method: "PUT", body }),

  patch: (
    path: string,
    body: unknown,
    options: Omit<RequestOptions, "method" | "body"> = {}
  ) => request(path, { ...options, method: "PATCH", body }),

  delete: (path: string, options: Omit<RequestOptions, "method"> = {}) =>
    request(path, { ...options, method: "DELETE" }),
}
