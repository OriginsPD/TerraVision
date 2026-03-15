import { NextRequest } from "next/server"
import { db } from "@/lib/server/db"
import { verifyToken, createAccessToken } from "@/lib/server/auth"
import { errorResponse } from "@/lib/server/response"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const refreshToken: string | undefined = body.refresh_token

    if (!refreshToken) {
      return errorResponse("Refresh token is required", 400)
    }

    // Verify the JWT
    let payload
    try {
      payload = await verifyToken(refreshToken)
    } catch {
      return errorResponse("Invalid refresh token", 401)
    }

    if (payload.type !== "refresh") {
      return errorResponse("Invalid token type", 401)
    }

    // Verify session exists and is not expired (uses `token` column)
    const session = await db.session.findUnique({
      where: { token: refreshToken },
    })

    if (!session) {
      return errorResponse("Session not found or already invalidated", 401)
    }

    if (session.expiresAt < new Date()) {
      await db.session.delete({ where: { id: session.id } })
      return errorResponse("Refresh token expired", 401)
    }

    const newAccessToken = await createAccessToken(
      payload.sub as string,
      payload.role
    )

    return Response.json({
      access_token: newAccessToken,
      token_type: "bearer",
    })
  } catch (e) {
    if (e instanceof Response) return e
    console.error("[refresh]", e)
    return errorResponse("Internal server error", 500)
  }
}
