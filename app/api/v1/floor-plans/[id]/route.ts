import { NextRequest } from "next/server"
import { db } from "@/lib/server/db"
import { requireAuth } from "@/lib/server/auth"
import { baseResponse, errorResponse } from "@/lib/server/response"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serializeFloorPlan(fp: any) {
  return {
    id: fp.id,
    professional_id: fp.professional_id,
    title: fp.title,
    description: fp.description,
    price: fp.price,
    sqft: fp.sqft,
    bedrooms: fp.bedrooms,
    bathrooms: fp.bathrooms,
    style: fp.style,
    image_url: fp.imageUrl,
    file_url: fp.file_url,
    created_at: fp.createdAt,
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const fpId = parseInt(id)
    if (isNaN(fpId)) return errorResponse("Invalid floor plan ID", 400)

    const floorPlan = await db.floorPlan.findUnique({ where: { id: fpId } })
    if (!floorPlan) return errorResponse("Floor plan not found", 404)

    return baseResponse({ floor_plan: serializeFloorPlan(floorPlan) })
  } catch (e) {
    if (e instanceof Response) return e
    console.error("[floor-plan GET]", e)
    return errorResponse("Internal server error", 500)
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await requireAuth(req)
    const { id } = await params
    const fpId = parseInt(id)
    if (isNaN(fpId)) return errorResponse("Invalid floor plan ID", 400)

    const floorPlan = await db.floorPlan.findUnique({
      where: { id: fpId },
      include: { professional: true },
    })
    if (!floorPlan) return errorResponse("Floor plan not found", 404)
    if (floorPlan.professional.userId !== userId) return errorResponse("Forbidden", 403)

    await db.floorPlan.delete({ where: { id: fpId } })

    return baseResponse(null, "Floor plan deleted")
  } catch (e) {
    if (e instanceof Response) return e
    console.error("[floor-plan DELETE]", e)
    return errorResponse("Internal server error", 500)
  }
}
