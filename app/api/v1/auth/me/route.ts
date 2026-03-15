import { NextRequest } from "next/server"
import { db } from "@/lib/server/db"
import { requireAuth } from "@/lib/server/auth"
import { baseResponse, errorResponse } from "@/lib/server/response"

export async function GET(req: NextRequest) {
  try {
    const { userId } = await requireAuth(req)

    const user = await db.user.findUnique({
      where: { id: userId },
      include: { professional: true },
    })

    if (!user) {
      return errorResponse("User not found", 404)
    }

    return baseResponse({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        full_name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
        role: (user.role ?? "BUYER").toLowerCase(),
        isActive: user.isActive ?? true,
        professional: user.professional
          ? {
              id: user.professional.id,
              profession: user.professional.profession,
              bio: user.professional.bio,
              hourlyRate: user.professional.hourlyRate,
              portfolioUrl: user.professional.portfolioUrl,
            }
          : null,
      },
    })
  } catch (e) {
    if (e instanceof Response) return e
    console.error("[auth/me]", e)
    return errorResponse("Internal server error", 500)
  }
}
