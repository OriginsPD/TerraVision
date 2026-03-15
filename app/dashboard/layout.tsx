import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { Suspense } from "react"

export const metadata = {
  title: "Dashboard | TerraVision",
  description: "Manage your properties, listings, and professional connections.",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div className="h-20 bg-background/5 animate-pulse" />}>
        <DashboardNav />
      </Suspense>
      <div className="flex">
        {children}
      </div>
    </div>
  )
}
