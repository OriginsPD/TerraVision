import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { v4 as uuidv4 } from "uuid"

/**
 * Saves an uploaded File to public/uploads/{folder}/{uuid}.{ext}
 * Returns the public URL path: /uploads/{folder}/{uuid}.{ext}
 */
export async function saveUploadedFile(
  file: File,
  folder: string
): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const ext = file.name.split(".").pop() ?? "bin"
  const filename = `${uuidv4().replace(/-/g, "")}.${ext}`

  const uploadDir = path.join(process.cwd(), "public", "uploads", folder)
  await mkdir(uploadDir, { recursive: true })

  const filePath = path.join(uploadDir, filename)
  await writeFile(filePath, buffer)

  return `/uploads/${folder}/${filename}`
}
