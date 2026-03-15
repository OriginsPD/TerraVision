/**
 * NanoBanana 3D model generation API wrapper.
 * POST https://api.nanobanana.ai/v1/generate-3d
 * Returns a model URL string.
 */
export async function generate3dModel(imageUrl: string): Promise<string> {
  const apiKey = process.env.NANOBANANA_API_KEY
  if (!apiKey) {
    throw new Error("NANOBANANA_API_KEY is not configured")
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 60_000)

  try {
    const response = await fetch("https://api.nanobanana.ai/v1/generate-3d", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ image_url: imageUrl }),
      signal: controller.signal,
    })

    if (!response.ok) {
      const text = await response.text().catch(() => response.statusText)
      throw new Error(`NanoBanana API error: ${text}`)
    }

    const data = (await response.json()) as { model_url?: string; url?: string }
    const modelUrl = data.model_url ?? data.url
    if (!modelUrl) {
      throw new Error("NanoBanana API did not return a model URL")
    }
    return modelUrl
  } finally {
    clearTimeout(timeout)
  }
}
