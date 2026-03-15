import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import { v2 as cloudinary } from "cloudinary"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim().replace(/^['"]+|['"]+$/g, ''),
  api_key: process.env.CLOUDINARY_API_KEY?.trim().replace(/^['"]+|['"]+$/g, ''),
  api_secret: process.env.CLOUDINARY_API_SECRET?.trim().replace(/^['"]+|['"]+$/g, ''),
  secure: true
})

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: (process.env.AWS_ACCESS_KEY_ID || "").trim().replace(/^['"]+|['"]+$/g, ''),
    secretAccessKey: (process.env.AWS_SECRET_ACCESS_KEY || "").trim().replace(/^['"]+|['"]+$/g, ''),
  },
})

/**
 * Saves an uploaded File to AWS S3, or locally to public/uploads/ if AWS is not configured.
 * Returns the public URL path.
 */
export async function saveUploadedFile(
  file: File,
  folder: string
): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const ext = file.name.split(".").pop() ?? "bin"
  const filename = `${uuidv4().replace(/-/g, "")}.${ext}`
  
  const bucketName = process.env.AWS_S3_BUCKET_NAME?.trim().replace(/^['"]+|['"]+$/g, '')
  const useCloudinary = process.env.USE_CLOUDINARY?.trim().replace(/^['"]+|['"]+$/g, '') === "true"

  // 1. Priority: Cloudinary
  if (useCloudinary && process.env.CLOUDINARY_CLOUD_NAME) {
    try {
      console.log("[storage] Attempting Cloudinary upload...");
      const uploadResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: `terravision/${folder}`,
            resource_type: "auto",
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        ).end(buffer)
      }) as any

      return uploadResponse.secure_url
    } catch (error) {
      console.error("[storage] Cloudinary upload failed:", error)
      // Fall through to other storage methods
    }
  }

  // Diagnostic logging for S3
  if (!bucketName || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.log("[storage] S3 Configuration Missing or Cloudinary disabled:", {
      hasBucket: !!bucketName,
      hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
      hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY,
      useCloudinary,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME ? "PRESENT" : "MISSING"
    });
  }

  // 2. Priority: AWS S3
  if (bucketName && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    const key = `${folder}/${filename}`
    
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: file.type || "application/octet-stream",
    })

    await s3Client.send(command)
    
    // Construct the public URL for the S3 object
    return `https://${bucketName}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com/${key}`
  }

  // Fallback: Local Storage (Used for Development if S3 is not configured)
  console.log(`[storage] AWS S3 is not fully configured. Falling back to local storage for ${filename}.`)
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder)
  await mkdir(uploadDir, { recursive: true })

  const filePath = path.join(uploadDir, filename)
  await writeFile(filePath, buffer)

  return `/uploads/${folder}/${filename}`
}
