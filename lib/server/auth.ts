/**
 * Server-side auth utilities using `jose` (Edge-runtime compatible).
 *
 * JWT format matches the Python backend exactly:
 *   { sub, role, type: "access"|"refresh", iss: "terravision-api", exp, iat }
 *   Algorithm: HS256
 */

import { SignJWT, jwtVerify, type JWTPayload } from "jose"
import { errorResponse } from "./response"

function getSecret(): Uint8Array {
  // Accept both JWT_SECRET and SECRET_KEY (backend naming)
  const secret = process.env.JWT_SECRET || process.env.SECRET_KEY
  if (!secret) throw new Error("JWT_SECRET or SECRET_KEY must be configured")
  return new TextEncoder().encode(secret)
}

const ISSUER = "terravision-api"
const ACCESS_EXPIRY = "30m"
const REFRESH_EXPIRY = "7d"

export interface TokenPayload extends JWTPayload {
  sub: string
  role: string
  type: "access" | "refresh"
}

export async function createAccessToken(
  userId: string,
  role: string
): Promise<string> {
  return new SignJWT({ sub: userId, role, type: "access" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(ISSUER)
    .setIssuedAt()
    .setExpirationTime(ACCESS_EXPIRY)
    .sign(getSecret())
}

export async function createRefreshToken(
  userId: string,
  role: string
): Promise<string> {
  return new SignJWT({ sub: userId, role, type: "refresh" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(ISSUER)
    .setIssuedAt()
    .setExpirationTime(REFRESH_EXPIRY)
    .sign(getSecret())
}

export async function verifyToken(token: string): Promise<TokenPayload> {
  const { payload } = await jwtVerify(token, getSecret(), {
    issuer: ISSUER,
  })
  return payload as TokenPayload
}

export function extractBearerToken(req: Request): string | null {
  const auth = req.headers.get("Authorization") ?? req.headers.get("authorization")
  if (!auth || !auth.startsWith("Bearer ")) return null
  return auth.slice(7)
}

export async function requireAuth(
  req: Request
): Promise<{ userId: string; role: string }> {
  const token = extractBearerToken(req)
  if (!token) {
    throw errorResponse("Authentication required", 401)
  }
  try {
    const payload = await verifyToken(token)
    if (payload.type !== "access") {
      throw errorResponse("Invalid token type", 401)
    }
    return { userId: payload.sub as string, role: payload.role }
  } catch (e) {
    if (e instanceof Response) throw e
    throw errorResponse("Invalid or expired token", 401)
  }
}

export async function requireRole(
  req: Request,
  allowedRoles: string[]
): Promise<{ userId: string; role: string }> {
  const auth = await requireAuth(req)
  // Normalize: compare lowercase role against lowercase allowed list
  const normalizedRole = auth.role.toLowerCase()
  const allowed = allowedRoles.map((r) => r.toLowerCase())
  if (!allowed.includes(normalizedRole)) {
    throw errorResponse("Insufficient permissions", 403)
  }
  return auth
}
