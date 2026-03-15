import { NextRequest } from "next/server"
import { db } from "@/lib/server/db"
import { requireAuth } from "@/lib/server/auth"
import { baseResponse, errorResponse } from "@/lib/server/response"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serializeFavorite(f: any) {
  return {
    id: f.id,
    user_id: f.userId,
    property_id: f.propertyId,
    created_at: f.createdAt,
    property: f.property
      ? {
          id: f.property.id,
          title: f.property.title,
          description: f.property.description,
          price: f.property.price,
          location: f.property.location,
          land_size: f.property.landSize,
          image_url: f.property.imageUrl,
          is_model_generated: f.property.isModelGenerated ?? false,
          model_url: f.property.model_3d_url,
          owner_id: f.property.ownerId,
        }
      : null,
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await requireAuth(req)

    const favorites = await db.favorite.findMany({
      where: { userId },
      include: { property: true },
      orderBy: { createdAt: "desc" },
    })

    return baseResponse({ favorites: favorites.map(serializeFavorite) })
  } catch (e) {
    if (e instanceof Response) return e
    console.error("[favorites GET]", e)
    return errorResponse("Internal server error", 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await requireAuth(req)

    const body = await req.json().catch(() => ({}))
    const propertyId = parseInt(body.property_id ?? body.propertyId)
    if (isNaN(propertyId)) return errorResponse("property_id is required", 400)

    const property = await db.property.findUnique({ where: { id: propertyId } })
    if (!property) return errorResponse("Property not found", 404)

    // Check if already favorited (no unique constraint on the table)
    const existing = await db.favorite.findFirst({
      where: { userId, propertyId },
    })
    if (existing) {
      return baseResponse(
        { favorite: serializeFavorite({ ...existing, property }) },
        "Already in favorites"
      )
    }

    const favorite = await db.favorite.create({
      data: { userId, propertyId },
      include: { property: true },
    })

    return baseResponse({ favorite: serializeFavorite(favorite) }, "Added to favorites", 201)
  } catch (e) {
    if (e instanceof Response) return e
    console.error("[favorites POST]", e)
    return errorResponse("Internal server error", 500)
  }
}
