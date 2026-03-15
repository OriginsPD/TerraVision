import { NextRequest } from "next/server"
import { db } from "@/lib/server/db"
import { requireAuth } from "@/lib/server/auth"
import { baseResponse, errorResponse } from "@/lib/server/response"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serializeConversation(c: any, currentUserId: string) {
  const otherUser =
    c.user1Id === currentUserId ? c.user2 : c.user1
  const lastMessage = c.messages?.[c.messages.length - 1] ?? null

  return {
    id: c.id,
    created_at: c.createdAt,
    other_user: {
      id: otherUser.id,
      full_name: `${otherUser.firstName ?? ""} ${otherUser.lastName ?? ""}`.trim(),
      email: otherUser.email,
    },
    last_message: lastMessage
      ? {
          id: lastMessage.id,
          content: lastMessage.content,
          sender_id: lastMessage.senderId,
          created_at: lastMessage.createdAt,
        }
      : null,
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await requireAuth(req)

    const conversations = await db.conversation.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      include: {
        user1: true,
        user2: true,
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return baseResponse({
      conversations: conversations.map((c) => serializeConversation(c, userId)),
    })
  } catch (e) {
    if (e instanceof Response) return e
    console.error("[conversations GET]", e)
    return errorResponse("Internal server error", 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await requireAuth(req)

    const body = await req.json().catch(() => ({}))
    const recipientId: string | undefined = body.recipient_id ?? body.recipientId

    if (!recipientId) return errorResponse("recipient_id is required", 400)
    if (recipientId === userId) return errorResponse("Cannot create conversation with yourself", 400)

    const recipient = await db.user.findUnique({ where: { id: recipientId } })
    if (!recipient) return errorResponse("Recipient not found", 404)

    // Find existing conversation between these two users
    const existing = await db.conversation.findFirst({
      where: {
        OR: [
          { user1Id: userId, user2Id: recipientId },
          { user1Id: recipientId, user2Id: userId },
        ],
      },
      include: {
        user1: true,
        user2: true,
        messages: { orderBy: { createdAt: "asc" } },
      },
    })

    if (existing) {
      return baseResponse({
        conversation: serializeConversation(existing, userId),
      })
    }

    const conversation = await db.conversation.create({
      data: {
        user1Id: userId,
        user2Id: recipientId,
      },
      include: {
        user1: true,
        user2: true,
        messages: true,
      },
    })

    return baseResponse(
      { conversation: serializeConversation(conversation, userId) },
      "Conversation created",
      201
    )
  } catch (e) {
    if (e instanceof Response) return e
    console.error("[conversations POST]", e)
    return errorResponse("Internal server error", 500)
  }
}
