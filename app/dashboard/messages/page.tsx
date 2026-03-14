"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Send, Phone, Video, MoreVertical, CheckCircle2 } from "lucide-react"

const conversations = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Architect",
    avatar: "SC",
    lastMessage: "I'd love to discuss the floor plan for your property.",
    time: "2m ago",
    unread: 2,
  },
  {
    id: 2,
    name: "Michael Torres",
    role: "Contractor",
    avatar: "MT",
    lastMessage: "The quote is ready. Let me know if you have questions.",
    time: "1h ago",
    unread: 0,
  },
  {
    id: 3,
    name: "Emily Watson",
    role: "Interior Designer",
    avatar: "EW",
    lastMessage: "Great! I'll send over some design concepts tomorrow.",
    time: "3h ago",
    unread: 1,
  },
  {
    id: 4,
    name: "David Kim",
    role: "Buyer",
    avatar: "DK",
    lastMessage: "Is the property still available?",
    time: "1d ago",
    unread: 0,
  },
]

const messages = [
  {
    id: 1,
    sender: "Sarah Chen",
    content: "Hi! I saw your Hillside Estate property listing. It looks amazing!",
    time: "10:30 AM",
    isOwn: false,
  },
  {
    id: 2,
    sender: "You",
    content: "Thank you! Yes, it has great potential for a modern home design.",
    time: "10:32 AM",
    isOwn: true,
  },
  {
    id: 3,
    sender: "Sarah Chen",
    content: "I specialize in modern residential architecture and I'd love to discuss some ideas for the property. The hillside location offers some unique opportunities for dramatic views.",
    time: "10:35 AM",
    isOwn: false,
  },
  {
    id: 4,
    sender: "You",
    content: "That sounds great! What kind of designs do you have in mind?",
    time: "10:38 AM",
    isOwn: true,
  },
  {
    id: 5,
    sender: "Sarah Chen",
    content: "I'd love to discuss the floor plan for your property. I'm thinking a cantilevered design that maximizes the view while minimizing the footprint on the hillside.",
    time: "10:40 AM",
    isOwn: false,
  },
]

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [newMessage, setNewMessage] = useState("")

  return (
    <main className="flex-1">
      <div className="flex h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)]">
        {/* Conversations List */}
        <div className="w-full border-r border-border lg:w-80">
          <div className="flex h-full flex-col">
            <div className="border-b border-border p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search messages..." className="pl-9" />
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="space-y-1 p-2">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors ${
                      selectedConversation.id === conversation.id
                        ? "bg-primary/10"
                        : "hover:bg-muted"
                    }`}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {conversation.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="truncate font-medium text-foreground">{conversation.name}</p>
                        <span className="text-xs text-muted-foreground">{conversation.time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{conversation.role}</p>
                      <p className="mt-1 truncate text-sm text-muted-foreground">{conversation.lastMessage}</p>
                    </div>
                    {conversation.unread > 0 && (
                      <Badge className="h-5 w-5 rounded-full p-0 text-xs">{conversation.unread}</Badge>
                    )}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Chat Area */}
        <div className="hidden flex-1 flex-col lg:flex">
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {selectedConversation.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground">{selectedConversation.name}</p>
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">{selectedConversation.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                      message.isOwn
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`mt-1 text-xs ${message.isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="border-t border-border p-4">
            <form className="flex items-center gap-3" onSubmit={(e) => e.preventDefault()}>
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Empty State for Mobile */}
        <div className="flex flex-1 items-center justify-center lg:hidden">
          <Card className="mx-4 max-w-sm">
            <CardHeader>
              <CardTitle className="text-center text-base">Select a Conversation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-sm text-muted-foreground">
                Choose a conversation from the list to start messaging.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
