import { NextRequest } from "next/server"
import { db } from "@/lib/server/db"
import { requireAuth } from "@/lib/server/auth"
import { baseResponse, errorResponse } from "@/lib/server/response"
import { saveUploadedFile } from "@/lib/server/storage"

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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const professionalId = searchParams.get("professional_id")
      ? parseInt(searchParams.get("professional_id")!)
      : undefined

    const floorPlans = await db.floorPlan.findMany({
      where: professionalId ? { professional_id: professionalId } : undefined,
      orderBy: { createdAt: "asc" },
    })

    return baseResponse({ floor_plans: floorPlans.map(serializeFloorPlan) })
  } catch (e) {
    if (e instanceof Response) return e
    console.error("[floor-plans GET]", e)
    return errorResponse("Internal server error", 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await requireAuth(req)

    // Find the professional profile for this user
    const professional = await db.professional.findUnique({ where: { userId } })
    if (!professional) {
      return errorResponse("Professional profile not found", 404)
    }

    const formData = await req.formData()

    const imageFile = formData.get("image") as File | null
    let imageUrl: string | null = null
    if (imageFile && imageFile.size > 0) {
      imageUrl = await saveUploadedFile(imageFile, "floor-plans")
    }

    const floorPlan = await db.floorPlan.create({
      data: {
        professional_id: professional.id,
        title: (formData.get("title") as string) ?? null,
        description: (formData.get("description") as string) ?? null,
        price: formData.get("price") ? parseFloat(formData.get("price") as string) : null,
        sqft: formData.get("sqft") ? parseInt(formData.get("sqft") as string) : null,
        bedrooms: formData.get("bedrooms") ? parseInt(formData.get("bedrooms") as string) : null,
        bathrooms: formData.get("bathrooms") ? parseFloat(formData.get("bathrooms") as string) : null,
        style: (formData.get("style") as string) ?? null,
        imageUrl,
      },
    })

    return baseResponse(
      { floor_plan: serializeFloorPlan(floorPlan) },
      "Floor plan created",
      201
    )
  } catch (e) {
    if (e instanceof Response) return e
    console.error("[floor-plans POST]", e)
    return errorResponse("Internal server error", 500)
  }
}
