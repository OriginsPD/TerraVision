import { DashboardNav } from "@/components/dashboard/dashboard-nav"

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
      <DashboardNav />
      <div className="flex">
        {children}
      </div>
    </div>
  )
}
