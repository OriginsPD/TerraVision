import { NextRequest } from "next/server"
import { db } from "@/lib/server/db"
import { requireAuth } from "@/lib/server/auth"
import { paginatedResponse, errorResponse, baseResponse } from "@/lib/server/response"
import { saveUploadedFile } from "@/lib/server/storage"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serializeProperty(p: any) {
  // Combine flattened perspective fields (for legacy/3D gen) 
  // and the new PropertyImage collection for the gallery.
  const legacyImages = [
    p.imageUrl,
    p.imageUrlFront,
    p.imageUrlBack,
    p.imageUrlLeft,
    p.imageUrlRight
  ].filter(Boolean) as string[];

  const relationImages = p.images?.map((img: any) => img.url) || [];
  
  // Create a unique set of all image URLs
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
    images: allImages, // Consolidated unique images
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
        include: { images: true }
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
    const imageFront = formData.get("image_front") as File | null
    const imageBack = formData.get("image_back") as File | null
    const imageLeft = formData.get("image_left") as File | null
    const imageRight = formData.get("image_right") as File | null

    if (!title || isNaN(price) || !location || isNaN(landSize)) {
      return errorResponse("title, price, location, and land_size are required", 400)
    }

    const imageUploads = [];

    let imageUrl: string | null = null
    if (imageFile && imageFile.size > 0) {
      imageUrl = await saveUploadedFile(imageFile, "properties");
      if (imageUrl) imageUploads.push({ url: imageUrl, type: "main" });
    }

    let imageUrlFront: string | null = null
    if (imageFront && imageFront.size > 0) {
      imageUrlFront = await saveUploadedFile(imageFront, "properties");
      if (imageUrlFront) imageUploads.push({ url: imageUrlFront, type: "front" });
    }

    let imageUrlBack: string | null = null
    if (imageBack && imageBack.size > 0) {
      imageUrlBack = await saveUploadedFile(imageBack, "properties");
      if (imageUrlBack) imageUploads.push({ url: imageUrlBack, type: "back" });
    }

    let imageUrlLeft: string | null = null
    if (imageLeft && imageLeft.size > 0) {
      imageUrlLeft = await saveUploadedFile(imageLeft, "properties");
      if (imageUrlLeft) imageUploads.push({ url: imageUrlLeft, type: "left" });
    }

    let imageUrlRight: string | null = null
    if (imageRight && imageRight.size > 0) {
      imageUrlRight = await saveUploadedFile(imageRight, "properties");
      if (imageUrlRight) imageUploads.push({ url: imageUrlRight, type: "right" });
    }

    const property = await db.property.create({
      data: {
        title,
        description,
        price,
        location,
        landSize,
        imageUrl,
        imageUrlFront,
        imageUrlBack,
        imageUrlLeft,
        imageUrlRight,
        ownerId: userId,
        images: {
          create: imageUploads
        }
      },
      include: {
        images: true
      }
    })

    return baseResponse({ property: serializeProperty(property) }, "Property created", 201)
  } catch (e) {
    if (e instanceof Response) return e
    console.error("[properties POST] Error details:", e)
    const message = e instanceof Error ? e.message : "Internal server error"
    return errorResponse(message, 500)
  }
}
