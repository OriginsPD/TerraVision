/**
 * auth.ts – centralised token management for the TerraVision frontend.
 *
 * Tokens are stored in localStorage (access) and an httpOnly-style cookie
 * (for the middleware to read server-side).  All helpers are safe to call
 * in SSR contexts (they no-op when `window` is not available).
 */

const ACCESS_TOKEN_KEY = "tv_access_token"
const REFRESH_TOKEN_KEY = "tv_refresh_token"

// ─── Getters ──────────────────────────────────────────────────────────────────

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

// ─── Setters ──────────────────────────────────────────────────────────────────

export function setTokens(accessToken: string, refreshToken?: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  }
  // Also set a cookie so Next.js middleware can read the token server-side
  // (not httpOnly so JS can clear it on logout)
  const maxAge = 60 * 60 * 24 * 7 // 7 days
  document.cookie = `tv_token=${accessToken}; path=/; max-age=${maxAge}; SameSite=Strict`
}

// ─── Clear / Logout ───────────────────────────────────────────────────────────

export function clearTokens(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  // Expire the cookie immediately
  document.cookie = "tv_token=; path=/; max-age=0; SameSite=Strict"
}

/**
 * Full client-side logout:
 *  1. Optionally calls the backend /auth/logout endpoint
 *  2. Clears all stored tokens
 *  3. Redirects to /login
 */
export async function logout(): Promise<void> {
  try {
    const token = getAccessToken()
    if (token) {
      await fetch("/api/v1/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
    }
  } catch {
    // Ignore – we always clear tokens locally
  } finally {
    clearTokens()
    if (typeof window !== "undefined") {
      window.location.href = "/login"
    }
  }
}

// ─── Token Refresh ────────────────────────────────────────────────────────────

let refreshPromise: Promise<string | null> | null = null

/**
 * Attempts to refresh the access token using the stored refresh token.
 * Concurrent refresh attempts are de-duplicated via a shared promise.
 * Returns the new access token, or null if refresh fails (forces logout).
 */
export async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise

  refreshPromise = (async () => {
    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      clearTokens()
      return null
    }

    try {
      const res = await fetch("/api/v1/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      })

      if (!res.ok) {
        clearTokens()
        return null
      }

      const json = await res.json()
      // Backend wraps in BaseResponse: { success, data: { access_token, refresh_token } }
      const data = json.data ?? json
      const newAccessToken: string = data.access_token
      const newRefreshToken: string | undefined = data.refresh_token

      setTokens(newAccessToken, newRefreshToken)
      return newAccessToken
    } catch {
      clearTokens()
      return null
    } finally {
      refreshPromise = null
    }
  })()

  return refreshPromise
}
