import { NextRequest } from "next/server"
import { db } from "@/lib/server/db"
import { requireAuth } from "@/lib/server/auth"
import { paginatedResponse, errorResponse, baseResponse } from "@/lib/server/response"
import { saveUploadedFile } from "@/lib/server/storage"
import { PropertyType, Prisma } from "@prisma/client"

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
    latitude: p.latitude,
    longitude: p.longitude,
    type: p.type,
    amenities: p.amenities || [],
    views: p.views || 0,
    land_size: p.landSize,
    image_url: p.imageUrl,
    is_model_generated: p.isModelGenerated ?? false,
    model_url: p.model_3d_url,
    owner_id: p.ownerId,
    created_at: p.createdAt,
    images: allImages,
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "10")))
    
    // Filters
    const search = searchParams.get("search") ?? ""
    const type = searchParams.get("type") as PropertyType | null
    const amenities = searchParams.get("amenities")?.split(",").filter(Boolean)
    const minPrice = searchParams.get("min_price") ? parseFloat(searchParams.get("min_price")!) : undefined
    const maxPrice = searchParams.get("max_price") ? parseFloat(searchParams.get("max_price")!) : undefined

    const where: Prisma.PropertyWhereInput = {}
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    if (type) {
      where.type = type
    }

    if (amenities && amenities.length > 0) {
      where.amenities = { hasEvery: amenities }
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {
        gte: minPrice,
        lte: maxPrice
      }
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
    const type = (formData.get("type") as PropertyType) || PropertyType.HOUSE
    const amenities = formData.getAll("amenities") as string[]
    const landSize = parseFloat(formData.get("land_size") as string)
    
    // Manual geocoding or mock for now
    const latitude = formData.get("latitude") ? parseFloat(formData.get("latitude") as string) : null
    const longitude = formData.get("longitude") ? parseFloat(formData.get("longitude") as string) : null

    if (!title || isNaN(price) || !location || isNaN(landSize)) {
      return errorResponse("title, price, location, and land_size are required", 400)
    }

    const imageFiles = [
      { file: formData.get("image") as File, type: "main" },
      { file: formData.get("image_front") as File, type: "front" },
      { file: formData.get("image_back") as File, type: "back" },
      { file: formData.get("image_left") as File, type: "left" },
      { file: formData.get("image_right") as File, type: "right" },
    ].filter(f => f.file && f.file.size > 0)

    const imageUploads = []
    let mainImageUrl: string | null = null

    for (const item of imageFiles) {
      const url = await saveUploadedFile(item.file, "properties")
      if (url) {
        imageUploads.push({ url, type: item.type })
        if (item.type === "main") mainImageUrl = url
      }
    }

    const property = await db.property.create({
      data: {
        title,
        description,
        price,
        location,
        latitude,
        longitude,
        type,
        amenities,
        landSize,
        imageUrl: mainImageUrl,
        imageUrlFront: imageUploads.find(i => i.type === "front")?.url,
        imageUrlBack: imageUploads.find(i => i.type === "back")?.url,
        imageUrlLeft: imageUploads.find(i => i.type === "left")?.url,
        imageUrlRight: imageUploads.find(i => i.type === "right")?.url,
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
    console.error("[properties POST]", e)
    return errorResponse(e instanceof Error ? e.message : "Internal server error", 500)
  }
}
