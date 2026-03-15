import { NextRequest } from "next/server"
import { db } from "@/lib/server/db"
import { requireAuth } from "@/lib/server/auth"
import { baseResponse, paginatedResponse, errorResponse } from "@/lib/server/response"

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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "10")))
    const role = searchParams.get("role")
    const search = searchParams.get("search") ?? ""

    const where: Record<string, unknown> = {}
    if (role) {
      where.user = { role: { equals: role.toUpperCase() } }
    }
    if (search) {
      where.OR = [
        { bio: { contains: search, mode: "insensitive" } },
        { user: { firstName: { contains: search, mode: "insensitive" } } },
        { user: { lastName: { contains: search, mode: "insensitive" } } },
      ]
    }

    const [professionals, total] = await Promise.all([
      db.professional.findMany({
        where,
        include: { user: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: "asc" },
      }),
      db.professional.count({ where }),
    ])

    return paginatedResponse(
      "professionals",
      professionals.map(serializeProfessional),
      total,
      page,
      limit
    )
  } catch (e) {
    if (e instanceof Response) return e
    console.error("[professionals GET]", e)
    return errorResponse("Internal server error", 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await requireAuth(req)

    const existing = await db.professional.findUnique({ where: { userId } })
    if (existing) {
      return errorResponse("Professional profile already exists", 400)
    }

    const body = await req.json().catch(() => ({}))

    const professional = await db.professional.create({
      data: {
        userId,
        profession: body.profession ?? null,
        bio: body.bio ?? null,
        hourlyRate: body.hourly_rate ?? body.hourlyRate ?? null,
        portfolioUrl: body.portfolio_url ?? body.portfolioUrl ?? null,
      },
      include: { user: true },
    })

    return baseResponse(
      { professional: serializeProfessional(professional) },
      "Professional profile created",
      201
    )
  } catch (e) {
    if (e instanceof Response) return e
    console.error("[professionals POST]", e)
    return errorResponse("Internal server error", 500)
  }
}
