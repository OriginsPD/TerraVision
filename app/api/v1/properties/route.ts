import { NextRequest } from "next/server"
import { db } from "@/lib/server/db"
import { requireAuth } from "@/lib/server/auth"
import { paginatedResponse, errorResponse, baseResponse } from "@/lib/server/response"
import { saveUploadedFile } from "@/lib/server/storage"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serializeProperty(p: any) {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    price: p.price,
    location: p.location,
    land_size: p.landSize,
    image_url: p.imageUrl,
    is_model_generated: p.isModelGenerated ?? false,
    model_url: p.model_3d_url,
    owner_id: p.ownerId,
    created_at: p.createdAt,
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "10")))
    const search = searchParams.get("search") ?? ""
    const minPrice = searchParams.get("min_price")
      ? parseFloat(searchParams.get("min_price")!)
      : undefined
    const maxPrice = searchParams.get("max_price")
      ? parseFloat(searchParams.get("max_price")!)
      : undefined

    const where: Record<string, unknown> = {}
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {}
      if (minPrice !== undefined) (where.price as Record<string, number>).gte = minPrice
      if (maxPrice !== undefined) (where.price as Record<string, number>).lte = maxPrice
    }

    const [properties, total] = await Promise.all([
      db.property.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      db.property.count({ where }),
    ])

    return paginatedResponse("properties", properties.map(serializeProperty), total, page, limit)
  } catch (e) {
    if (e instanceof Response) return e
    console.error("[properties GET]", e)
    return errorResponse("Internal server error", 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await requireAuth(req)

    const user = await db.user.findUnique({ where: { id: userId } })
    if (!user || (user.role ?? "BUYER").toLowerCase() !== "owner") {
      return errorResponse("Only property owners can create listings", 403)
    }

    const formData = await req.formData()
    const title = formData.get("title") as string
    const description = formData.get("description") as string | null
    const price = parseFloat(formData.get("price") as string)
    const location = formData.get("location") as string
    const landSize = parseFloat(formData.get("land_size") as string)
    const imageFile = formData.get("image") as File | null

    if (!title || isNaN(price) || !location || isNaN(landSize)) {
      return errorResponse("title, price, location, and land_size are required", 400)
    }

    let imageUrl: string | null = null
    if (imageFile && imageFile.size > 0) {
      imageUrl = await saveUploadedFile(imageFile, "properties")
    }

    const property = await db.property.create({
      data: {
        title,
        description,
        price,
        location,
        landSize,
        imageUrl,
        ownerId: userId,
      },
    })

    return baseResponse({ property: serializeProperty(property) }, "Property created", 201)
  } catch (e) {
    if (e instanceof Response) return e
    console.error("[properties POST]", e)
    return errorResponse("Internal server error", 500)
  }
}
