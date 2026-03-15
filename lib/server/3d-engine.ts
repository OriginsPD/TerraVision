/**
 * NanoBanana 3D model generation API wrapper.
 * POST https://api.nanobanana.ai/v1/generate-3d
 * Returns a model URL string.
 */
export async function generate3dModel(
  imageUrl: string,
  perspectives?: {
    front?: string;
    back?: string;
    left?: string;
    right?: string;
  }
): Promise<string> {
  const apiKey = process.env.NANOBANANA_API_KEY?.trim().replace(/^['"]+|['"]+$/g, '')
  if (!apiKey) {
    throw new Error("NANOBANANA_API_KEY is not configured")
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 60_000)
  
  try {
    let lastError: Error | null = null;
    const maxRetries = 3;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch("https://api.nanobanana.ai/v1/generate-3d", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({ 
            image_url: imageUrl,
            image_front_url: perspectives?.front,
            image_back_url: perspectives?.back,
            image_left_url: perspectives?.left,
            image_right_url: perspectives?.right,
            format: "glb"
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          let errorMessage = `NanoBanana API error (${response.status})`
          try {
            const errorData = await response.json()
            errorMessage += `: ${JSON.stringify(errorData)}`
          } catch {
            const text = await response.text().catch(() => response.statusText)
            errorMessage += `: ${text}`
          }
          throw new Error(errorMessage)
        }

        const data = (await response.json()) as { model_url?: string; url?: string }
        const modelUrl = data.model_url ?? data.url
        if (!modelUrl) {
          throw new Error("NanoBanana API did not return a model URL")
        }
        return modelUrl;
      } catch (err: any) {
        lastError = err;
        const cause = err.cause;
        const errorMessage = err.message || "";
        const causeMessage = cause?.message || String(cause || "");
        
        const isNetworkError = 
          errorMessage.includes("fetch failed") || 
          errorMessage.includes("EAI_AGAIN") || 
          causeMessage.includes("EAI_AGAIN") ||
          err.name === "AbortError";
        
        if (isNetworkError && attempt < maxRetries - 1) {
          const delay = Math.pow(2, attempt) * 1000;
          console.warn(`[nanobanana] Attempt ${attempt + 1} failed, retrying in ${delay}ms... Details: ${errorMessage}${cause ? ` (Cause: ${causeMessage})` : ""}`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        console.error("[nanobanana] Final failure:", err);
        if (cause) console.error("[nanobanana] Underlying cause:", cause);
        
        // Throw a helpful error message that includes the cause
        throw new Error(`NanoBanana API fetch failed: ${errorMessage}${cause ? ` (Cause: ${causeMessage})` : ""}`);
      }
    }
    
    throw lastError || new Error("Failed to call NanoBanana API after retries");
  } finally {
    clearTimeout(timeout)
  }
}
