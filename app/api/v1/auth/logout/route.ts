import { NextRequest } from "next/server"
import { db } from "@/lib/server/db"
import { baseResponse, errorResponse } from "@/lib/server/response"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const refreshToken = body.refresh_token

    if (refreshToken) {
      // Session table uses `token` column (not `refreshToken`)
      await db.session.deleteMany({
        where: { token: refreshToken },
      })
    }

    return baseResponse(null, "Logged out successfully")
  } catch (e) {
    if (e instanceof Response) return e
    console.error("[logout]", e)
    return errorResponse("Internal server error", 500)
  }
}
