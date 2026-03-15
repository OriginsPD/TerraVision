import { NextRequest } from "next/server"
import { db } from "@/lib/server/db"
import { requireAuth } from "@/lib/server/auth"
import { baseResponse, errorResponse } from "@/lib/server/response"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serializeProfessional(p: any) {
  return {
    id: p.id,
    userId: p.userId,
    profession: p.profession,
    bio: p.bio,
    hourly_rate: p.hourlyRate,
    hourlyRate: p.hourlyRate,
    portfolio_url: p.portfolioUrl,
    portfolioUrl: p.portfolioUrl,
    name: `${p.user?.firstName ?? ""} ${p.user?.lastName ?? ""}`.trim(),
    email: p.user?.email,
    role: (p.user?.role ?? "BUYER").toLowerCase(),
    user: p.user
      ? {
          id: p.user.id,
          email: p.user.email,
          firstName: p.user.firstName,
          lastName: p.user.lastName,
          full_name: `${p.user.firstName ?? ""} ${p.user.lastName ?? ""}`.trim(),
          role: (p.user.role ?? "BUYER").toLowerCase(),
          isActive: p.user.isActive ?? true,
        }
      : null,
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const profId = parseInt(id)
    if (isNaN(profId)) return errorResponse("Invalid professional ID", 400)

    const professional = await db.professional.findUnique({
      where: { id: profId },
      include: { user: true },
    })

    if (!professional) return errorResponse("Professional not found", 404)

    return baseResponse({ professional: serializeProfessional(professional) })
  } catch (e) {
    if (e instanceof Response) return e
    console.error("[professional GET]", e)
    return errorResponse("Internal server error", 500)
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await requireAuth(req)
    const { id } = await params
    const profId = parseInt(id)
    if (isNaN(profId)) return errorResponse("Invalid professional ID", 400)

    const professional = await db.professional.findUnique({ where: { id: profId } })
    if (!professional) return errorResponse("Professional not found", 404)
    if (professional.userId !== userId) return errorResponse("Forbidden", 403)

    const body = await req.json().catch(() => ({}))
    const updates: Record<string, unknown> = {}
    if (body.bio !== undefined) updates.bio = body.bio
    if (body.profession !== undefined) updates.profession = body.profession
    if (body.hourly_rate !== undefined) updates.hourlyRate = body.hourly_rate
    if (body.hourlyRate !== undefined) updates.hourlyRate = body.hourlyRate
    if (body.portfolio_url !== undefined) updates.portfolioUrl = body.portfolio_url
    if (body.portfolioUrl !== undefined) updates.portfolioUrl = body.portfolioUrl

    const updated = await db.professional.update({
      where: { id: profId },
      data: updates,
      include: { user: true },
    })

    return baseResponse({ professional: serializeProfessional(updated) })
  } catch (e) {
    if (e instanceof Response) return e
    console.error("[professional PUT]", e)
    return errorResponse("Internal server error", 500)
  }
}
