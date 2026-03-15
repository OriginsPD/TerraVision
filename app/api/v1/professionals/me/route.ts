import { NextRequest } from "next/server"
import { db } from "@/lib/server/db"
import { requireAuth } from "@/lib/server/auth"
import { baseResponse, errorResponse } from "@/lib/server/response"

export async function GET(req: NextRequest) {
  try {
    const { userId } = await requireAuth(req)
    
    let professional = await db.professional.findUnique({
      where: { userId },
      include: { user: true }
    })

    if (!professional) {
      const user = await db.user.findUnique({ where: { id: userId } })
      const professionalRoles = ["ARCHITECT", "MASON", "CARPENTER", "CONTRACTOR"]
      
      if (user?.role && professionalRoles.includes(user.role.toUpperCase())) {
        professional = await db.professional.create({
          data: { 
            userId,
            profession: user.role.toLowerCase()
          },
          include: { user: true }
        })
      } else {
        return errorResponse("Professional profile not found", 404)
      }
    }

    return baseResponse(professional)
  } catch (e) {
    if (e instanceof Response) return e
    console.error("[professional GET]", e)
    return errorResponse("Internal server error", 500)
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId } = await requireAuth(req)
    const body = await req.json()

    const updated = await db.professional.update({
      where: { userId },
      data: {
        bio: body.bio,
        hourlyRate: body.hourlyRate,
        portfolioUrl: body.portfolioUrl,
        profession: body.specialty // Using specialty field for refined profession
      }
    })

    return baseResponse(updated, "Professional profile updated")
  } catch (e) {
    if (e instanceof Response) return e
    console.error("[professional PUT]", e)
    return errorResponse("Internal server error", 500)
  }
}
