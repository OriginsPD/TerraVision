import { NextRequest } from "next/server"
import { db } from "@/lib/server/db"
import { requireAuth } from "@/lib/server/auth"
import { baseResponse, errorResponse } from "@/lib/server/response"

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ property_id: string }> }
) {
  try {
    const { userId } = await requireAuth(req)
    const { property_id } = await params
    const propertyId = parseInt(property_id)
    if (isNaN(propertyId)) return errorResponse("Invalid property ID", 400)

    await db.favorite.deleteMany({
      where: { userId, propertyId },
    })

    return baseResponse(null, "Removed from favorites")
  } catch (e) {
    if (e instanceof Response) return e
    console.error("[favorites DELETE]", e)
    return errorResponse("Internal server error", 500)
  }
}
