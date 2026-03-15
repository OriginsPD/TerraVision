"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Spinner } from "@/components/ui/spinner"
import { Search, Send, Phone, Video, MoreVertical, CheckCircle2, MessageSquare, ArrowLeft, Info, Sparkles, Loader2 } from "lucide-react"
import { useConversations, useMessages, useSendMessage } from "@/hooks/api/use-messages"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { messageSchema, type MessageFormValues } from "@/lib/validations"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"

export default function MessagesPage() {
  const { data: conversations, isLoading: loadingConv } = useConversations()
  const [selectedId, setSelectedId] = useState<number | string | null>(null)
  const { data: messages, isLoading: loadingMsgs } = useMessages(selectedId || "")
  const { mutate: sendMessage, isPending: isSending } = useSendMessage()
  
  const [searchQuery, setSearchSearchQuery] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  const selectedConversation = conversations?.find((c: any) => c.id === selectedId)

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  })

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const onSubmit = (values: MessageFormValues) => {
    if (!selectedId || isSending) return

    sendMessage({ conversationId: selectedId, content: values.content }, {
      onSuccess: () => form.reset()
    })
  }

  const filteredConversations = conversations?.filter((c: any) => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <main className="flex-1 bg-background/50 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] -z-10" />

      <div className="flex h-[calc(100vh-5rem)] max-w-7xl mx-auto p-4 lg:p-8 gap-6">
        {/* Conversations List - Glossy Sidebar */}
        <div className={cn(
          "w-full lg:w-[380px] flex flex-col gap-4 transition-all duration-300",
          selectedId ? "hidden lg:flex" : "flex"
        )}>
          <div className="flex items-center justify-between px-2">
            <h1 className="text-3xl font-serif font-bold text-foreground flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-primary/20 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              Inbox
            </h1>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 rounded-full font-bold">
              {conversations?.filter((c: any) => c.unread > 0).length || 0} New
            </Badge>
          </div>

          <div className="glass rounded-[2rem] border border-white/10 flex flex-col h-full overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/10 bg-white/5">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  placeholder="Search conversations..." 
                  className="pl-11 h-12 rounded-2xl bg-white/5 border-white/5 focus:border-primary/30 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-3 space-y-2">
                {loadingConv ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Spinner className="h-8 w-8 text-primary" />
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Retrieving Encrypted Comms</p>
                  </div>
                ) : filteredConversations?.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-sm font-bold text-muted-foreground opacity-50">No conversations found</p>
                  </div>
                ) : (
                  filteredConversations?.map((conv: any) => (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      key={conv.id}
                      onClick={() => setSelectedId(conv.id)}
                      className={cn(
                        "flex w-full items-start gap-4 rounded-[1.5rem] p-4 text-left transition-all relative group",
                        selectedId === conv.id
                          ? "bg-primary/20 border border-primary/30 shadow-lg"
                          : "hover:bg-white/5 border border-transparent"
                      )}
                    >
                      <div className="relative">
                        <Avatar className="h-12 w-12 rounded-2xl border-2 border-white/10 shadow-lg">
                          <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold">
                            {conv.avatar}
                          </AvatarFallback>
                        </Avatar>
                        {conv.unread > 0 && (
                          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white border-2 border-background shadow-lg">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="truncate font-bold text-foreground group-hover:text-primary transition-colors">{conv.name}</p>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">{conv.time}</span>
                        </div>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">{conv.role}</p>
                        <p className="mt-1 truncate text-sm font-medium text-muted-foreground/80 leading-snug">{conv.lastMessage}</p>
                      </div>
                      {selectedId === conv.id && (
                        <motion.div layoutId="active-nav" className="absolute left-0 top-4 bottom-4 w-1 bg-primary rounded-full" />
                      )}
                    </motion.button>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Chat Area - Glossy Main Container */}
        <div className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          !selectedId ? "hidden lg:flex" : "flex"
        )}>
          {selectedId ? (
            <div className="glass rounded-[2.5rem] border border-white/10 flex flex-col h-full overflow-hidden shadow-2xl relative">
              {/* Chat Header */}
              <div className="flex items-center justify-between border-b border-white/10 px-8 py-5 bg-white/5 backdrop-blur-md relative z-10">
                <div className="flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="lg:hidden h-10 w-10 rounded-xl"
                    onClick={() => setSelectedId(null)}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <Avatar className="h-12 w-12 rounded-2xl border-2 border-white/10 shadow-lg">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold">
                      {selectedConversation?.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-xl text-foreground">{selectedConversation?.name}</p>
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{selectedConversation?.role} • Online</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl bg-white/5 border-white/10 hover:bg-primary/20 hover:border-primary/30 transition-all">
                    <Phone className="h-5 w-5 text-primary" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl bg-white/5 border-white/10 hover:bg-accent/20 hover:border-accent/30 transition-all">
                    <Video className="h-5 w-5 text-accent" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl hover:bg-white/5">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Messages Area */}
              <ScrollArea className="flex-1 p-8">
                {loadingMsgs ? (
                  <div className="flex flex-col items-center justify-center h-full py-40 gap-4">
                    <Spinner className="h-10 w-10 text-primary" />
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Decrypting Dialogue...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Timestamp Badge */}
                    <div className="flex justify-center">
                      <Badge variant="outline" className="bg-white/5 border-white/10 text-[10px] font-bold text-muted-foreground py-1 px-4 rounded-full uppercase tracking-widest">
                        Today, March 14
                      </Badge>
                    </div>

                    <AnimatePresence initial={false}>
                      {messages?.map((msg: any, i: number) => (
                        <motion.div
                          initial={{ opacity: 0, x: msg.isOwn ? 20 : -20, scale: 0.95 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          key={msg.id || i}
                          className={cn(
                            "flex w-full max-w-2xl mx-auto",
                            msg.isOwn ? "justify-end" : "justify-start"
                          )}
                        >
                          <div className={cn(
                            "group relative px-6 py-4 transition-all duration-300",
                            msg.isOwn 
                              ? "bg-primary text-white rounded-t-[2rem] rounded-bl-[2rem] rounded-br-[0.5rem] shadow-xl shadow-primary/20 ml-12" 
                              : "bg-white/10 backdrop-blur-md border border-white/10 text-foreground rounded-t-[2rem] rounded-br-[2rem] rounded-bl-[0.5rem] shadow-lg mr-12"
                          )}>
                            <p className="text-sm md:text-base font-medium leading-relaxed">{msg.content}</p>
                            <div className={cn(
                              "mt-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest",
                              msg.isOwn ? "text-white/60" : "text-muted-foreground"
                            )}>
                              {msg.time}
                              {msg.isOwn && <CheckCircle2 className="h-3 w-3" />}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <div ref={scrollRef} />
                  </div>
                )}
              </ScrollArea>

              {/* Message Input - Glossy Footer */}
              <div className="border-t border-white/10 p-6 bg-white/5 backdrop-blur-xl relative z-10">
                <Form {...form}>
                  <form className="flex items-center gap-4 max-w-4xl mx-auto" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem className="relative flex-1 group">
                          <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity" />
                          <FormControl>
                            <Input
                              placeholder="Type your message here..."
                              className="relative z-10 h-14 rounded-[1.5rem] bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all font-medium pr-12"
                              {...field}
                            />
                          </FormControl>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
                             <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white/10 text-muted-foreground">
                               <Sparkles className="h-4 w-4" />
                             </Button>
                          </div>
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      variant="glossy" 
                      size="icon" 
                      className="h-14 w-14 rounded-2xl shrink-0 shadow-xl shadow-primary/20 transition-transform active:scale-90"
                      disabled={isSending}
                    >
                      {isSending ? <Loader2 className="h-6 w-6 animate-spin" /> : <Send className="h-6 w-6 fill-white" />}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          ) : (
            /* Empty State - No Conversation Selected */
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-16 rounded-[4rem] border border-white/10 shadow-2xl max-w-lg"
              >
                <div className="h-24 w-24 rounded-[2rem] bg-primary/20 flex items-center justify-center border border-primary/30 shadow-lg mx-auto mb-8 animate-bounce">
                  <MessageSquare className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-4xl font-serif font-bold text-foreground mb-4">Start a <span className="text-gradient">Conversation</span></h2>
                <p className="text-xl font-medium text-muted-foreground/80 leading-relaxed mb-10">
                  Select a contact from the sidebar to view your messages and start collaborating on your next project.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass bg-white/5 p-6 rounded-[2rem] border border-white/10">
                    <Info className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Verified Comms</p>
                  </div>
                  <div className="glass bg-white/5 p-6 rounded-[2rem] border border-white/10">
                    <Sparkles className="h-6 w-6 text-accent mx-auto mb-2" />
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">AI Assisted</p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}




