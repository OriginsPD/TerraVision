"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, X, ChevronDown, Building2, Users, Compass, Briefcase, LayoutDashboard, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUser } from "@/hooks/api/use-user"
import { logout } from "@/lib/auth"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { data: user } = useUser()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const initials = user?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled
        ? "border-b border-white/20 bg-white/10 backdrop-blur-xl py-3 shadow-lg"
        : "bg-transparent py-5"
    )}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg transition-transform group-hover:scale-110">
            <Compass className="h-6 w-6 text-white" />
          </div>
          <span className="font-serif text-2xl tracking-tight text-foreground font-bold">
            Terra<span className="text-primary">Vision</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-2 lg:flex rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-md">
          <Link href="/properties" className="px-5 py-2 text-sm font-semibold text-foreground/80 transition-all hover:text-primary hover:bg-white/10 rounded-full">
            Properties
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 px-5 py-2 text-sm font-semibold text-foreground/80 transition-all hover:text-primary hover:bg-white/10 rounded-full outline-none">
              Marketplace
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-64 glass p-2 mt-2">
              <DropdownMenuItem asChild className="rounded-xl focus:bg-primary/20 focus:text-primary p-3">
                <Link href="/marketplace/professionals?category=architect" className="flex items-center gap-3">
                  <div className="bg-primary/20 p-2 rounded-lg"><Building2 className="h-4 w-4 text-primary" /></div>
                  <div><p className="font-bold">Architects</p><p className="text-xs text-muted-foreground">Custom designs & plans</p></div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="rounded-xl focus:bg-accent/20 focus:text-accent p-3">
                <Link href="/marketplace/professionals" className="flex items-center gap-3">
                  <div className="bg-accent/20 p-2 rounded-lg"><Users className="h-4 w-4 text-accent" /></div>
                  <div><p className="font-bold">Construction</p><p className="text-xs text-muted-foreground">Builders & contractors</p></div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="rounded-xl focus:bg-primary/20 focus:text-primary p-3">
                <Link href="/marketplace/floor-plans" className="flex items-center gap-3">
                  <div className="bg-primary/20 p-2 rounded-lg"><Briefcase className="h-4 w-4 text-primary" /></div>
                  <div><p className="font-bold">Floor Plans</p><p className="text-xs text-muted-foreground">Ready-made blueprints</p></div>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/how-it-works" className="px-5 py-2 text-sm font-semibold text-foreground/80 transition-all hover:text-primary hover:bg-white/10 rounded-full">
            How It Works
          </Link>
        </div>

        {/* Desktop CTA – auth-aware */}
        <div className="hidden items-center gap-4 lg:flex">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-xl border border-white/20 p-0 hover:bg-white/10">
                  <Avatar className="h-full w-full rounded-xl">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold text-sm">
                      {initials ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 glass mt-2 p-2 rounded-2xl border-white/20">
                <div className="px-3 py-2">
                  <p className="text-sm font-bold truncate">{user.full_name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem asChild className="rounded-xl p-3 focus:bg-primary/20 focus:text-primary cursor-pointer font-bold">
                  <Link href="/dashboard" className="flex items-center gap-2"><LayoutDashboard className="h-4 w-4" />Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem onClick={() => logout()} className="rounded-xl p-3 focus:bg-rose-500/10 text-rose-500 focus:text-rose-500 cursor-pointer font-bold">
                  <LogOut className="h-4 w-4 mr-2" />Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login" className="text-sm font-bold text-foreground hover:text-primary transition-colors">
                Sign In
              </Link>
              <Button variant="glossy" asChild className="rounded-full px-6 font-bold shadow-primary/20">
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 rounded-xl bg-white/10 border border-white/20"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6 text-foreground" /> : <Menu className="h-6 w-6 text-foreground" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[72px] z-50 bg-background/95 backdrop-blur-2xl lg:hidden animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-2 px-6 py-8">
            <Link href="/properties" className="flex items-center justify-between rounded-2xl p-4 text-lg font-bold text-foreground bg-white/5 border border-white/10" onClick={() => setMobileMenuOpen(false)}>
              Properties <ChevronDown className="-rotate-90 h-5 w-5 opacity-50" />
            </Link>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Link href="/marketplace/professionals?category=architect" className="flex flex-col gap-2 rounded-2xl p-4 text-sm font-bold text-foreground bg-primary/10 border border-primary/20" onClick={() => setMobileMenuOpen(false)}>
                <Building2 className="h-6 w-6 text-primary" />Architects
              </Link>
              <Link href="/marketplace/professionals" className="flex flex-col gap-2 rounded-2xl p-4 text-sm font-bold text-foreground bg-accent/10 border border-accent/20" onClick={() => setMobileMenuOpen(false)}>
                <Users className="h-6 w-6 text-accent" />Professionals
              </Link>
            </div>
            <Link href="/how-it-works" className="rounded-2xl p-4 text-lg font-bold text-foreground bg-white/5 border border-white/10 mt-2" onClick={() => setMobileMenuOpen(false)}>
              How It Works
            </Link>
            <div className="mt-8 flex flex-col gap-4">
              {user ? (
                <>
                  <Button variant="glossy" asChild className="w-full py-7 text-lg rounded-2xl">
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>Go to Dashboard</Link>
                  </Button>
                  <button onClick={() => { setMobileMenuOpen(false); logout() }} className="text-center py-2 font-bold text-rose-500">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Button variant="glossy" asChild className="w-full py-7 text-lg rounded-2xl">
                    <Link href="/register">Create Account</Link>
                  </Button>
                  <Link href="/login" className="text-center py-2 font-bold text-muted-foreground">
                    Already have an account? <span className="text-primary">Sign In</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
