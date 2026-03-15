import { NextRequest } from "next/server"
import { db } from "@/lib/server/db"
import { requireAuth } from "@/lib/server/auth"
import { baseResponse, errorResponse } from "@/lib/server/response"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serializeMessage(m: any) {
  return {
    id: m.id,
    conversation_id: m.conversationId,
    sender_id: m.senderId,
    content: m.content,
    is_read: m.is_read ?? false,
    created_at: m.createdAt,
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await requireAuth(req)
    const { id } = await params
    const convId = parseInt(id)
    if (isNaN(convId)) return errorResponse("Invalid conversation ID", 400)

    const { searchParams } = new URL(req.url)
    const since = searchParams.get("since")

    const conversation = await db.conversation.findUnique({
      where: { id: convId },
    })
    if (!conversation) return errorResponse("Conversation not found", 404)

    // Verify user is a participant
    if (conversation.user1Id !== userId && conversation.user2Id !== userId) {
      return errorResponse("Forbidden", 403)
    }

    const where: any = { conversationId: convId }
    if (since) {
      where.createdAt = { gt: new Date(since) }
    }

    const messages = await db.message.findMany({
      where,
      orderBy: { createdAt: "asc" },
    })

    // Background: Mark messages as read if the current user is NOT the sender
    if (messages.length > 0) {
      await db.message.updateMany({
        where: {
          conversationId: convId,
          senderId: { not: userId },
          is_read: { not: true },
          id: { in: messages.map(m => m.id) }
        },
        data: { is_read: true }
      })
    }

    return baseResponse({ messages: messages.map(serializeMessage) })
  } catch (e) {
    if (e instanceof Response) return e
    console.error("[messages GET]", e)
    return errorResponse("Internal server error", 500)
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await requireAuth(req)
    const { id } = await params
    const convId = parseInt(id)
    if (isNaN(convId)) return errorResponse("Invalid conversation ID", 400)

    const conversation = await db.conversation.findUnique({
      where: { id: convId },
    })
    if (!conversation) return errorResponse("Conversation not found", 404)

    if (conversation.user1Id !== userId && conversation.user2Id !== userId) {
      return errorResponse("Forbidden", 403)
    }

    const body = await req.json().catch(() => ({}))
    const content: string | undefined = body.content
    if (!content?.trim()) return errorResponse("Message content is required", 400)

    const message = await db.message.create({
      data: {
        conversationId: convId,
        senderId: userId,
        content: content.trim(),
      },
    })

    return baseResponse(
      { message: serializeMessage(message) },
      "Message sent",
      201
    )
  } catch (e) {
    if (e instanceof Response) return e
    console.error("[messages POST]", e)
    return errorResponse("Internal server error", 500)
  }
}
