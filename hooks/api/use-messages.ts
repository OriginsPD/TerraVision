"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"

/**
 * Maps a backend ConversationOut to a shape convenient for the UI.
 *
 * ConversationOut: {
 *   id, user1_id, user2_id, created_at,
 *   other_user: UserOut,
 *   last_message: string,
 *   unread_count: int
 * }
 */
function mapConversation(c: any) {
  const other = c.other_user ?? {}
  const firstName: string = other.firstName ?? other.first_name ?? ""
  const lastName: string = other.lastName ?? other.last_name ?? ""
  const name =
    other.full_name ??
    (firstName || lastName ? `${firstName} ${lastName}`.trim() : other.email ?? "Unknown")

  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const role: string = other.role ?? "user"

  return {
    id: c.id,
    name,
    role,
    avatar: initials,
    lastMessage: c.last_message ?? "",
    time: c.updated_at ?? c.created_at ?? "",
    unread: c.unread_count ?? 0,
  }
}

export function useConversations() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      // GET /messages/conversations -> raw array of ConversationOut
      const data = (await apiClient.get("/messages/conversations")) as any[]
      if (!Array.isArray(data)) return []
      return data.map(mapConversation)
    },
  })
}

export function useMessages(conversationId: number | string) {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      const data = (await apiClient.get(
        `/messages/conversations/${conversationId}/messages`
      )) as any[]
      return Array.isArray(data) ? data : []
    },
    enabled: !!conversationId,
    refetchInterval: 3000, // Poll for new messages every 3 seconds
  })
}

export function useSendMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      conversationId,
      content,
    }: {
      conversationId: number | string
      content: string
    }) => {
      return apiClient.post(`/messages/conversations/${conversationId}/messages`, {
        content,
      })
    },
    onSuccess: (_, { conversationId }) => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] })
      queryClient.invalidateQueries({ queryKey: ["conversations"] })
    },
  })
}

export function useStartConversation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      receiverId,
      initialMessage,
    }: {
      receiverId: string | number
      initialMessage: string
    }) => {
      return apiClient.post("/messages/conversations", {
        receiver_id: typeof receiverId === "string" ? parseInt(receiverId, 10) : receiverId,
        initial_message: initialMessage,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] })
    },
  })
}
