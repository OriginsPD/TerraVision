import { NextRequest } from "next/server"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"
import { db } from "@/lib/server/db"
import { createAccessToken, createRefreshToken } from "@/lib/server/auth"
import { errorResponse } from "@/lib/server/response"

export async function POST(req: NextRequest) {
  try {
    let email: string | undefined
    let password: string | undefined

    const contentType = req.headers.get("content-type") ?? ""

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const text = await req.text()
      const params = new URLSearchParams(text)
      email = params.get("username") ?? undefined
      password = params.get("password") ?? undefined
    } else {
      const body = await req.json().catch(() => ({}))
      email = body.email ?? body.username
      password = body.password
    }

    if (!email || !password) {
      return errorResponse("Email and password are required", 400)
    }

    // Find user
    const user = await db.user.findUnique({
      where: { email },
      include: { accounts: true },
    })
    if (!user) {
      return errorResponse("Invalid email or password", 401)
    }

    // Find credential account with password
    const credentialAccount = user.accounts.find(
      (a) => a.provider_id === "credential" && a.password
    )
    if (!credentialAccount?.password) {
      return errorResponse("Invalid email or password", 401)
    }

    const valid = await bcrypt.compare(password, credentialAccount.password)
    if (!valid) {
      return errorResponse("Invalid email or password", 401)
    }

    if (user.isActive === false) {
      return errorResponse("Account is inactive", 403)
    }

    const roleStr = (user.role ?? "BUYER").toLowerCase()
    const accessToken = await createAccessToken(user.id, roleStr)
    const refreshToken = await createRefreshToken(user.id, roleStr)

    // Store refresh token in session table
    const sessionId = uuidv4().replace(/-/g, "")
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    await db.session.create({
      data: {
        id: sessionId,
        userId: user.id,
        token: refreshToken,
        expiresAt,
      },
    })

    // Return in the exact shape that login-form.tsx expects
    return Response.json({
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: "bearer",
    })
  } catch (e) {
    if (e instanceof Response) return e
    console.error("[login]", e)
    return errorResponse("Internal server error", 500)
  }
}
