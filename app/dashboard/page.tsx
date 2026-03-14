"use client"

import { useUser } from "@/hooks/api/use-user"
import { Spinner } from "@/components/ui/spinner"
import { BuyerOverview } from "@/components/dashboard/buyer-overview"
import { OwnerOverview } from "@/components/dashboard/owner-overview"
import { ExpertOverview } from "@/components/dashboard/expert-overview"
import { motion, AnimatePresence } from "framer-motion"

export default function DashboardPage() {
  const { data: user, isLoading } = useUser()

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-20 min-h-[60vh]">
        <Spinner className="h-12 w-12 text-primary" />
        <p className="mt-4 text-sm font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Personalizing your workspace</p>
      </div>
    )
  }

  const role = user?.role || "buyer"

  return (
    <main className="flex-1 min-h-screen">
      <AnimatePresence mode="wait">
        <motion.div
          key={role}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {role === "buyer" && <BuyerOverview user={user!} />}
          {role === "owner" && <OwnerOverview user={user!} />}
          {role === "professional" && <ExpertOverview user={user!} />}
        </motion.div>
      </AnimatePresence>
    </main>
  )
}
