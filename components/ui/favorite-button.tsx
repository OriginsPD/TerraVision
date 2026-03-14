"use client"

import { Heart, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAddFavorite, useRemoveFavorite, useIsFavorite } from "@/hooks/api/use-favorites"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface FavoriteButtonProps {
  propertyId: string
  className?: string
  variant?: "icon" | "full"
}

export function FavoriteButton({ propertyId, className, variant = "icon" }: FavoriteButtonProps) {
  const isFavorite = useIsFavorite(propertyId)
  const { mutate: add, isPending: isAdding } = useAddFavorite()
  const { mutate: remove, isPending: isRemoving } = useRemoveFavorite()
  
  const isLoading = isAdding || isRemoving

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isLoading) return
    
    if (isFavorite) {
      remove(propertyId)
    } else {
      add(propertyId)
    }
  }

  if (variant === "full") {
    return (
      <Button
        onClick={toggleFavorite}
        disabled={isLoading}
        variant="outline"
        className={cn(
          "flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-white/5 border border-white/10 font-bold text-sm transition-all hover:bg-white/10",
          isFavorite && "border-primary/30 bg-primary/5",
          className
        )}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Heart className={cn("h-5 w-5 transition-all", isFavorite ? "fill-primary text-primary scale-110" : "text-foreground")} />
        )}
        {isFavorite ? "Saved" : "Save Property"}
      </Button>
    )
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className={cn(
        "z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 border border-white/30 backdrop-blur-md transition-all hover:bg-white/40 active:scale-90 disabled:opacity-50",
        isFavorite && "border-primary/50 bg-primary/10",
        className
      )}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Loader2 className="h-5 w-5 animate-spin text-white" />
          </motion.div>
        ) : (
          <motion.div
            key={isFavorite ? "active" : "inactive"}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileTap={{ scale: 1.2 }}
          >
            <Heart className={cn("h-5 w-5 transition-all", isFavorite ? "fill-primary text-primary" : "text-white")} />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  )
}
