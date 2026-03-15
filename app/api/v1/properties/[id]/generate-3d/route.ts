import { NextRequest } from "next/server"
import { db } from "@/lib/server/db"
import { requireAuth } from "@/lib/server/auth"
import { baseResponse, errorResponse } from "@/lib/server/response"
import { generate3dModel } from "@/lib/server/nanobanana"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await requireAuth(req)
    const { id } = await params
    const propertyId = parseInt(id)
    if (isNaN(propertyId)) return errorResponse("Invalid property ID", 400)

    const property = await db.property.findUnique({ where: { id: propertyId } })
    if (!property) return errorResponse("Property not found", 404)
    if (property.ownerId !== userId) return errorResponse("Forbidden", 403)
    if (!property.imageUrl) {
      return errorResponse("Property must have an image before generating a 3D model", 400)
    }

    const modelUrl = await generate3dModel(property.imageUrl)

    const updated = await db.property.update({
      where: { id: propertyId },
      data: {
        model_3d_url: modelUrl,
        isModelGenerated: true,
      },
    })

    return baseResponse({
      property: {
        id: updated.id,
        model_url: updated.model_3d_url,
        is_model_generated: updated.isModelGenerated,
      },
    }, "3D model generated successfully")
  } catch (e) {
    if (e instanceof Response) return e
    console.error("[generate-3d]", e)
    return errorResponse("Failed to generate 3D model", 500)
  }
}
