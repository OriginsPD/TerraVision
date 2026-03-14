"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  CreditCard, 
  ShieldCheck, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  Lock,
  Wallet,
  Zap,
  Building2,
  Clock,
  Loader2
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { usePurchaseFloorPlan, useHireProfessional } from "@/hooks/api/use-transactions"

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  type: "floor-plan" | "professional"
  data: {
    id: string
    title: string
    price: number
    subtitle?: string
  }
}

export function CheckoutModal({ isOpen, onClose, type, data }: CheckoutModalProps) {
  const [step, setStep] = useState<"details" | "payment" | "success">("details")
  const [projectDetails, setProjectDetails] = useState("")
  
  const { mutate: purchasePlan, isPending: isPurchasing } = usePurchaseFloorPlan()
  const { mutate: hirePro, isPending: isHiring } = useHireProfessional()

  const handleNext = () => {
    if (type === "professional" && step === "details") {
      setStep("payment")
    } else {
      setStep("payment")
    }
  }

  const handleProcess = () => {
    if (type === "floor-plan") {
      purchasePlan(data.id, {
        onSuccess: () => setStep("success")
      })
    } else {
      hirePro({ professionalId: data.id, projectDetails }, {
        onSuccess: () => setStep("success")
      })
    }
  }

  const resetAndClose = () => {
    onClose()
    setTimeout(() => setStep("details"), 300)
  }

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-[500px] glass border-white/20 p-0 overflow-hidden rounded-[2.5rem] shadow-2xl">
        <AnimatePresence mode="wait">
          {step === "details" && (
            <motion.div 
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8"
            >
              <DialogHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-lg">
                    {type === "floor-plan" ? <Download className="h-5 w-5 text-primary" /> : <Building2 className="h-5 w-5 text-primary" />}
                  </div>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-bold uppercase tracking-widest text-[10px]">
                    {type === "floor-plan" ? "Digital Asset" : "Professional Service"}
                  </Badge>
                </div>
                <DialogTitle className="text-3xl font-serif font-bold text-foreground leading-tight">
                  {type === "floor-plan" ? "Acquire License" : "Request Consultation"}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground text-lg font-medium">
                  {data.title}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-8 space-y-6">
                <div className="glass bg-white/5 rounded-3xl p-6 border border-white/10 shadow-xl">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Pricing</span>
                    <span className="text-3xl font-serif font-bold text-primary">${data.price.toLocaleString()}{type === "professional" && "/hr"}</span>
                  </div>
                  <Separator className="bg-white/10 mb-4" />
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm font-medium text-foreground/80">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>{type === "floor-plan" ? "Lifetime commercial usage license" : "Verified professional background"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-medium text-foreground/80">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>{type === "floor-plan" ? "Full high-res PDF & DWG exports" : "Initial design scope analysis"}</span>
                    </div>
                  </div>
                </div>

                {type === "professional" && (
                  <div className="space-y-3">
                    <Label htmlFor="details" className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Project Scope</Label>
                    <Textarea 
                      id="details" 
                      placeholder="Briefly describe your project and terrain..." 
                      className="rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 h-32"
                      value={projectDetails}
                      onChange={(e) => setProjectDetails(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="mt-10">
                <Button 
                  onClick={handleNext} 
                  variant="glossy" 
                  className="w-full py-8 text-xl font-bold rounded-2xl gap-3 shadow-xl shadow-primary/30"
                >
                  Continue to Secure Payment
                  <Zap className="h-5 w-5 fill-white" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === "payment" && (
            <motion.div 
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8"
            >
              <div className="flex items-center gap-2 text-primary font-bold text-sm mb-8 cursor-pointer hover:underline" onClick={() => setStep("details")}>
                <Clock className="h-4 w-4 rotate-180" />
                Back to Details
              </div>

              <DialogHeader>
                <DialogTitle className="text-3xl font-serif font-bold text-foreground">Secure Checkout</DialogTitle>
                <div className="mt-2 flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full w-fit border border-emerald-500/20">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Bank-Grade Encryption</span>
                </div>
              </DialogHeader>

              <div className="mt-8 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Card Information</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input placeholder="Card number" className="pl-12 h-14 rounded-2xl bg-white/5 border-white/10" disabled />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="MM/YY" className="h-14 rounded-2xl bg-white/5 border-white/10" disabled />
                    <Input placeholder="CVC" className="h-14 rounded-2xl bg-white/5 border-white/10" disabled />
                  </div>
                </div>

                <div className="glass bg-white/5 rounded-2xl p-6 border border-white/10">
                   <div className="flex justify-between items-center text-sm font-bold text-muted-foreground mb-2">
                      <span>Order Total</span>
                      <span>${data.price.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between items-center text-sm font-bold text-muted-foreground">
                      <span>Processing Fee</span>
                      <span className="text-emerald-500">$0.00 (Promo)</span>
                   </div>
                   <Separator className="bg-white/10 my-4" />
                   <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-foreground">Final Price</span>
                      <span className="text-2xl font-serif font-bold text-primary">${data.price.toLocaleString()}</span>
                   </div>
                </div>
              </div>

              <div className="mt-10">
                <Button 
                  onClick={handleProcess} 
                  disabled={isPurchasing || isHiring}
                  variant="glossy" 
                  className="w-full py-8 text-xl font-bold rounded-2xl gap-3 shadow-xl shadow-primary/30"
                >
                  {(isPurchasing || isHiring) ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <>
                      <Lock className="h-5 w-5" />
                      Complete Transaction
                    </>
                  )}
                </Button>
                <div className="mt-4 flex items-center justify-center gap-2 opacity-50">
                   <Wallet className="h-4 w-4" />
                   <span className="text-[10px] font-bold uppercase tracking-widest">Stripe Secure Payment</span>
                </div>
              </div>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 text-center"
            >
              <div className="mx-auto h-24 w-24 rounded-[2rem] bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 shadow-2xl shadow-emerald-500/20 mb-8">
                <CheckCircle2 className="h-12 w-12 text-emerald-500" />
              </div>
              <h2 className="text-4xl font-serif font-bold text-foreground mb-4">Transaction Successful!</h2>
              <p className="text-xl font-medium text-muted-foreground/80 leading-relaxed mb-10">
                {type === "floor-plan" 
                  ? "Your license has been issued and your digital files are ready for download in your dashboard." 
                  : "Your consultation request has been sent. The professional will reach out to you via the inbox."}
              </p>
              <div className="space-y-4">
                <Button asChild variant="glossy" className="w-full py-7 font-bold rounded-2xl">
                  <Link href={type === "floor-plan" ? "/dashboard/purchases" : "/dashboard/messages"}>
                    {type === "floor-plan" ? "View My Library" : "Open Inbox"}
                  </Link>
                </Button>
                <Button variant="ghost" onClick={resetAndClose} className="w-full font-bold text-muted-foreground hover:text-foreground">
                  Close Checkout
                </Button>
              </div>
              <div className="mt-8 flex justify-center">
                 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">+500 TV Rewards</span>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
