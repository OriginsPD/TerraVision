"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h2 className="text-4xl font-serif font-bold mb-4">404 - Not Found</h2>
      <p className="text-muted-foreground mb-8">The property or page you are looking for does not exist.</p>
      <Button asChild className="rounded-2xl">
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  )
}
