"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Share2, Phone, Mail, MessageSquare, CheckCircle2, Building2, Sparkles, Send, Loader2 } from "lucide-react"
import type { Property } from "@/lib/data"
import { motion } from "framer-motion"
import { useStartConversation } from "@/hooks/api/use-messages"
import { toast } from "sonner"
import { FavoriteButton } from "@/components/ui/favorite-button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { inquirySchema, type InquiryFormValues } from "@/lib/validations"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import Link from "next/link"

interface PropertyContactProps {
  property: Property
}

export function PropertyContact({ property }: PropertyContactProps) {
  const router = useRouter()
  const { mutate: startConversation, isPending } = useStartConversation()

  const form = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      message: "",
    },
  })

  const onSubmit = (values: InquiryFormValues) => {
    if (isPending) return

    startConversation({ 
      receiverId: property.ownerId, 
      initialMessage: `Inquiry about ${property.title}: ${values.message}` 
    }, {
      onSuccess: () => {
        toast.success("Inquiry sent successfully!")
        router.push("/dashboard/messages")
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to send inquiry")
      }
    })
  }

  return (
    <div className="space-y-8">
      {/* Price & Action Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-[2.5rem] border border-white/20 p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />
        
        <div className="flex items-baseline justify-between mb-8 relative z-10">
          <div>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 block">Property Price</span>
            <p className="font-serif text-4xl font-bold text-foreground">${property.price.toLocaleString()}</p>
          </div>
          <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30 px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-[10px]">
            {property.status}
          </Badge>
        </div>

        <div className="space-y-4 relative z-10">
          <Button variant="glossy" className="w-full py-8 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20">
            Schedule a Private Visit
          </Button>
          <Button variant="outline" className="w-full py-8 text-lg font-bold rounded-2xl border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10">
            Make an Official Offer
          </Button>
        </div>

        <div className="mt-6 flex gap-3 relative z-10">
          <FavoriteButton propertyId={property.id} variant="full" />
          <button className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10 transition-all hover:bg-white/10">
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </motion.div>

      {/* Seller Card */}
      <div className="glass rounded-[2.5rem] border border-white/20 p-8 shadow-xl">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-6">Property Representative</h3>
        <div className="flex items-center gap-4 mb-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            <Avatar className="h-16 w-16 rounded-2xl border-2 border-white/20 shadow-xl relative z-10">
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold text-xl">
                {property.ownerName.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">{property.ownerName}</p>
            <div className="flex items-center gap-1.5 text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 mt-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Verified Platinum Seller
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="rounded-xl h-12 font-bold gap-2 border-white/10 bg-white/5">
            <Phone className="h-4 w-4 text-primary" />
            Call
          </Button>
          <Button variant="outline" className="rounded-xl h-12 font-bold gap-2 border-white/10 bg-white/5">
            <Mail className="h-4 w-4 text-accent" />
            Email
          </Button>
        </div>
      </div>

      {/* Modern Contact Form */}
      <div className="glass rounded-[2.5rem] border border-white/20 p-8 shadow-xl">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-2xl bg-accent/20 flex items-center justify-center border border-accent/30">
            <MessageSquare className="h-5 w-5 text-accent" />
          </div>
          Quick Inquiry
        </h3>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Your Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your interests..."
                      rows={4}
                      className="rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 resize-none font-medium p-4"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant="glossy" className="w-full py-7 font-bold rounded-2xl gap-2 text-base" disabled={isPending}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Submit Inquiry
            </Button>
            <p className="text-[10px] text-center text-muted-foreground/60 font-medium">
              By clicking submit, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        </Form>
      </div>

      {/* Discovery Marketplace CTA */}
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="rounded-[2.5rem] bg-gradient-to-br from-primary/20 to-accent/20 border border-white/20 p-8 relative overflow-hidden group shadow-xl"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/20 transition-colors" />
        
        <div className="flex flex-col gap-4 relative z-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-lg border border-white/30">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground leading-tight">Dreaming of building your home?</p>
            <p className="mt-3 text-base font-medium text-muted-foreground leading-relaxed">
              Unlock our exclusive directory of world-class architects and contractors upon property purchase.
            </p>
            <Link 
              href="/marketplace" 
              className="mt-6 inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
            >
              Browse Professionals
              <Sparkles className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
