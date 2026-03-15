import { NextRequest } from "next/server"
import { db } from "@/lib/server/db"
import { requireAuth } from "@/lib/server/auth"
import { baseResponse, errorResponse } from "@/lib/server/response"
import { saveUploadedFile } from "@/lib/server/storage"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serializeProperty(p: any) {
  const legacyImages = [
    p.imageUrl,
    p.imageUrlFront,
    p.imageUrlBack,
    p.imageUrlLeft,
    p.imageUrlRight
  ].filter(Boolean) as string[];

  const relationImages = p.images?.map((img: any) => img.url) || [];
  const allImages = Array.from(new Set([...legacyImages, ...relationImages]));

  return {
    id: p.id,
    title: p.title,
    description: p.description,
    price: p.price,
    location: p.location,
    land_size: p.landSize,
    image_url: p.imageUrl,
    image_url_front: p.imageUrlFront,
    image_url_back: p.imageUrlBack,
    image_url_left: p.imageUrlLeft,
    image_url_right: p.imageUrlRight,
    is_model_generated: p.isModelGenerated ?? false,
    model_url: p.model_3d_url,
    owner_id: p.ownerId,
    created_at: p.createdAt,
    images: allImages,
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const propertyId = parseInt(id)
    if (isNaN(propertyId)) return errorResponse("Invalid property ID", 400)

    const property = await db.property.findUnique({
      where: { id: propertyId },
      include: { images: true }
    })

    if (!property) return errorResponse("Property not found", 404)

    return baseResponse({ property: serializeProperty(property) })
  } catch (e) {
    if (e instanceof Response) return e
    console.error("[property GET]", e)
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
    const propertyId = parseInt(id)
    if (isNaN(propertyId)) return errorResponse("Invalid property ID", 400)

    const property = await db.property.findUnique({ where: { id: propertyId } })
    if (!property) return errorResponse("Property not found", 404)
    if (property.ownerId !== userId) return errorResponse("Forbidden", 403)

    const contentType = req.headers.get("content-type") ?? ""
    const updates: Record<string, unknown> = {}

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData()
      if (formData.get("title")) updates.title = formData.get("title")
      if (formData.get("description")) updates.description = formData.get("description")
      if (formData.get("price")) updates.price = parseFloat(formData.get("price") as string)
      if (formData.get("location")) updates.location = formData.get("location")
      if (formData.get("land_size")) updates.landSize = parseFloat(formData.get("land_size") as string)
      const imageFile = formData.get("image") as File | null
      if (imageFile && imageFile.size > 0) {
        updates.imageUrl = await saveUploadedFile(imageFile, "properties")
      }
    } else {
      const body = await req.json().catch(() => ({}))
      if (body.title !== undefined) updates.title = body.title
      if (body.description !== undefined) updates.description = body.description
      if (body.price !== undefined) updates.price = body.price
      if (body.location !== undefined) updates.location = body.location
      if (body.land_size !== undefined) updates.landSize = body.land_size
    }

    const updated = await db.property.update({
      where: { id: propertyId },
      data: updates,
      include: { images: true }
    })

    return baseResponse({ property: serializeProperty(updated) })
  } catch (e) {
    if (e instanceof Response) return e
    console.error("[property PUT]", e)
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
    const propertyId = parseInt(id)
    if (isNaN(propertyId)) return errorResponse("Invalid property ID", 400)

    const property = await db.property.findUnique({ where: { id: propertyId } })
    if (!property) return errorResponse("Property not found", 404)
    if (property.ownerId !== userId) return errorResponse("Forbidden", 403)

    await db.property.delete({ where: { id: propertyId } })

    return baseResponse(null, "Property deleted")
  } catch (e) {
    if (e instanceof Response) return e
    console.error("[property DELETE]", e)
    return errorResponse("Internal server error", 500)
  }
}
