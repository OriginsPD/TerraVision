import { NextRequest } from "next/server"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"
import { db } from "@/lib/server/db"
import { baseResponse, errorResponse } from "@/lib/server/response"
import { UserRole } from "@prisma/client"

function mapRole(role: string): UserRole {
  const map: Record<string, UserRole> = {
    buyer: UserRole.BUYER,
    owner: UserRole.OWNER,
    architect: UserRole.ARCHITECT,
    mason: UserRole.MASON,
    carpenter: UserRole.CARPENTER,
    contractor: UserRole.CONTRACTOR,
    admin: UserRole.ADMIN,
    professional: UserRole.ARCHITECT,
  }
  return map[role?.toLowerCase()] ?? UserRole.BUYER
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    if (!body) return errorResponse("Invalid JSON body", 400)

    const { firstName, lastName, email, password, role: rawRole } = body

    if (!email || !password) {
      return errorResponse("Email and password are required", 400)
    }

    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
      return errorResponse("Email already registered", 400)
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const userId = uuidv4().replace(/-/g, "")
    const accountId = uuidv4().replace(/-/g, "")
    const role = mapRole(rawRole ?? "buyer")

    // Create user
    const user = await db.user.create({
      data: {
        id: userId,
        email,
        firstName: firstName ?? "",
        lastName: lastName ?? "",
        role,
        isActive: true,
      },
    })

    // Store password in account table (Better Auth pattern)
    await db.account.create({
      data: {
        id: accountId,
        account_id: userId,
        provider_id: "credential",
        userId: user.id,
        password: hashedPassword,
      },
    })

    // If the user is a professional role, create the professional profile
    const professionalRoles = ["architect", "mason", "carpenter", "contractor"]
    if (professionalRoles.includes(rawRole?.toLowerCase())) {
      await db.professional.create({
        data: {
          userId: user.id,
          profession: rawRole?.toLowerCase(),
        },
      })
    }

    return baseResponse(
      {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          full_name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
          role: (user.role ?? "BUYER").toLowerCase(),
          isActive: user.isActive ?? true,
        },
      },
      "Registration successful",
      201
    )
  } catch (e) {
    if (e instanceof Response) return e
    console.error("[register]", e)
    return errorResponse("Internal server error", 500)
  }
}
