import { NextRequest } from "next/server"
import { db } from "@/lib/server/db"
import { requireAuth } from "@/lib/server/auth"
import { baseResponse, errorResponse } from "@/lib/server/response"
import { generate3dModel } from "@/lib/server/3d-engine"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const propertyId = parseInt(id)

  try {
    const { userId } = await requireAuth(req)
    if (isNaN(propertyId)) return errorResponse("Invalid property ID", 400)

    const property = await (db.property as any).findUnique({ 
      where: { id: propertyId },
      include: { images: true }
    })
    if (!property) return errorResponse("Property not found", 404)
    if (property.ownerId !== userId) return errorResponse("Forbidden", 403)
    if (!property.imageUrl) {
      return errorResponse("Property must have an image before generating a 3D model", 400)
    }

    const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;
    const toAbsolute = (url: string | null) => {
      if (!url) return undefined;
      return url.startsWith("http") ? url : `${origin}${url}`;
    };

    const absoluteImageUrl = toAbsolute(property.imageUrl)!;
    const p = property as any;
    
    // Extract valid perspectives and collect spare images
    const typedPerspectives: Record<string, string> = {};
    const spareImages: string[] = [];

    p.images?.forEach((img: any) => {
      const absoluteUrl = toAbsolute(img.url);
      if (!absoluteUrl) return;

      if (img.type && ["front", "back", "left", "right"].includes(img.type)) {
        typedPerspectives[img.type] = absoluteUrl;
      } else {
        spareImages.push(absoluteUrl);
      }
    });

    // Fill the gaps with spare images (best-effort mapping)
    const getPerspective = (type: string, legacyUrl?: string) => {
      if (typedPerspectives[type]) return typedPerspectives[type];
      if (legacyUrl) return toAbsolute(legacyUrl);
      return spareImages.shift(); // Pull an untyped image if this specific perspective is missing
    };

    const perspectives = {
      front: getPerspective("front", p.imageUrlFront),
      back: getPerspective("back", p.imageUrlBack),
      left: getPerspective("left", p.imageUrlLeft),
      right: getPerspective("right", p.imageUrlRight),
    };

    console.log("[generate-3d] Preparing payload:", {
      main: absoluteImageUrl,
      perspectives: Object.keys(perspectives).filter(k => (perspectives as any)[k])
    });

    let modelUrl;
    // Mock logic:
    // 1. If MOCK_MODE is true, always use mock.
    // 2. If it's localhost, the real API cannot reach us, so we MUST use mock.
    const mockVar = process.env.NEXT_PUBLIC_MOCK_MODE || process.env.MOCK_MODE;
    const isMockMode = String(mockVar).toLowerCase() === "true";
    const isLocalhost = absoluteImageUrl.includes("localhost") || absoluteImageUrl.includes("127.0.0.1");

    if (isMockMode || isLocalhost) {
      console.log(`[generate-3d] Using MOCK mode (isMockMode: ${isMockMode}, isLocalhost: ${isLocalhost})`);
      modelUrl = "https://modelviewer.dev/shared-assets/models/Astronaut.glb";
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
    } else {
      console.log("[generate-3d] Using REAL mode. Attempting AI generation...");
      modelUrl = await generate3dModel(absoluteImageUrl, perspectives)
    }

    const updated = await db.property.update({
      where: { id: propertyId },
      data: {
        model_3d_url: toAbsolute(modelUrl),
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
    console.error("[generate-3d] Error details:", e)
    
    const message = e instanceof Error ? e.message : "Failed to generate 3D model"
    const isDNSFailure = message.includes("EAI_AGAIN") || message.includes("fetch failed");
    const isDev = process.env.NODE_ENV === "development";

    // SMART FAILOVER: If in dev and API is unreachable, use mock model instead of failing
    if (isDNSFailure && isDev) {
      console.warn(`[generate-3d] API unreachable (${message}). Falling back to MOCK model to avoid unblocking developer.`);
      const mockUrl = "https://modelviewer.dev/shared-assets/models/Astronaut.glb";
      
      const updated = await db.property.update({
        where: { id: propertyId },
        data: {
          model_3d_url: mockUrl,
          isModelGenerated: true,
        },
      })
      
      return baseResponse({
        property: {
          id: updated.id,
          model_url: updated.model_3d_url,
          is_model_generated: updated.isModelGenerated,
        },
      }, "3D model generated (Fell back to MOCK due to API connectivity issue)")
    }

    const envContext = `(MockVar: ${process.env.NEXT_PUBLIC_MOCK_MODE}, NODE_ENV: ${process.env.NODE_ENV})`;
    return errorResponse(`${message} ${envContext}`, 500)
  }
}
