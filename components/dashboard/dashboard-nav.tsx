"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Compass, 
  LayoutDashboard, 
  Building2, 
  Heart, 
  MessageSquare, 
  Settings,
  Bell,
  LogOut,
  User as UserIcon,
  Plus,
  Search,
  Sparkles,
  ShoppingBag,
  Briefcase,
  TrendingUp
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useUser, UserRole } from "@/hooks/api/use-user"

const navItemsByRole: Record<UserRole, any[]> = {
  buyer: [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/favorites", label: "Favorites", icon: Heart },
    { href: "/dashboard/purchases", label: "My Library", icon: ShoppingBag },
    { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  ],
  owner: [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/my-properties", label: "My Properties", icon: Building2 },
    { href: "/dashboard/analytics", label: "Analytics", icon: TrendingUp },
    { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  ],
  professional: [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/portfolio", label: "My Portfolio", icon: Briefcase },
    { href: "/dashboard/bookings", label: "Project Leads", icon: Sparkles },
    { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  ]
}

export function DashboardNav() {
  const pathname = usePathname()
  const { data: user, isLoading } = useUser()
  const role = user?.role || "buyer"
  const navItems = navItemsByRole[role]

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300">
      <div className="flex h-20 items-center justify-between px-4 lg:px-8 max-w-7xl mx-auto">
        {/* Left Side: Logo & Search */}
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg transition-transform group-hover:scale-110">
              <Compass className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl tracking-tight text-foreground font-bold hidden sm:block leading-none">
                Terra<span className="text-primary">Vision</span>
              </span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest hidden sm:block mt-1">
                {role} Console
              </span>
            </div>
          </Link>

          {/* Desktop Nav - Pill Style */}
          <nav className="hidden items-center gap-1 lg:flex bg-white/5 border border-white/10 p-1.5 rounded-2xl backdrop-blur-md">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== "/dashboard" && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all relative",
                    isActive 
                      ? "text-primary bg-primary/10" 
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  )}
                >
                  <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                  {item.label}
                  {isActive && <motion.div layoutId="nav-active" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Right Side: Actions & Profile */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center relative mr-2">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search assets..." 
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all w-48"
            />
          </div>

          {role === "owner" && (
            <Button size="sm" variant="glossy" asChild className="hidden gap-2 sm:flex rounded-xl font-bold px-5 h-11">
              <Link href="/dashboard/my-properties/new">
                <Plus className="h-4 w-4" />
                Post Property
              </Link>
            </Button>
          )}

          <Button variant="ghost" size="icon" className="relative h-11 w-11 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-primary border-2 border-background shadow-lg shadow-primary/40 animate-pulse" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-11 w-11 rounded-xl border border-white/20 p-0 shadow-lg hover:bg-white/10 transition-all">
                <Avatar className="h-full w-full rounded-xl">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold">
                    {user?.full_name?.split(" ").map(n => n[0]).join("") || "JD"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 glass mt-4 p-2 rounded-3xl border-white/20">
              <DropdownMenuLabel className="p-4">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-base font-bold">{user?.full_name || "John Doe"}</p>
                    <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px] uppercase font-bold px-2 py-0">
                      {role === "professional" ? "Expert" : role}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10 mx-2" />
              <div className="p-1 space-y-1">
                <DropdownMenuItem asChild className="rounded-xl p-3 focus:bg-primary/20 focus:text-primary transition-colors cursor-pointer font-bold">
                  <Link href="/dashboard" className="flex items-center gap-3 font-bold">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-xl p-3 focus:bg-primary/20 focus:text-primary transition-colors cursor-pointer font-bold">
                  <Link href="/dashboard/settings" className="flex items-center gap-3 font-bold">
                    <UserIcon className="h-4 w-4" />
                    Account Settings
                  </Link>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator className="bg-white/10 mx-2" />
              <DropdownMenuItem className="text-rose-500 rounded-xl p-3 font-bold focus:bg-rose-500/10 focus:text-rose-500 cursor-pointer">
                <LogOut className="mr-3 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Nav - Glossy Scrollable */}
      <nav className="flex items-center gap-2 overflow-x-auto border-t border-white/10 px-4 py-3 lg:hidden no-scrollbar">
        {navItems?.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/dashboard" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-shrink-0 items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all",
                isActive 
                  ? "bg-primary text-white shadow-lg shadow-primary/30" 
                  : "text-muted-foreground bg-white/5 border border-white/5 hover:text-foreground hover:bg-white/10"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
