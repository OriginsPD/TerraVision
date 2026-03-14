"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"

export function useConversations() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      return apiClient.get("/messages/conversations")
    },
  })
}

export function useMessages(conversationId: number | string) {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      return apiClient.get(`/messages/conversations/${conversationId}/messages`)
    },
    refetchInterval: 3000, // Poll for new messages every 3 seconds
  })
}

export function useSendMessage() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ conversationId, content }: { conversationId: number | string, content: string }) => {
      return apiClient.post(`/messages/conversations/${conversationId}/messages`, { content })
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
    mutationFn: async ({ receiverId, initialMessage }: { receiverId: string, initialMessage: string }) => {
      return apiClient.post("/messages/conversations", { receiver_id: receiverId, initial_message: initialMessage })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] })
    },
  })
}
