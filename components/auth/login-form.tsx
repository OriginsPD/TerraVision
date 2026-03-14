"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { Eye, EyeOff, Mail, Lock, ShieldCheck, Github, Chrome } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"
import { motion } from "framer-motion"

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const params = new URLSearchParams()
      params.append("username", formData.email)
      params.append("password", formData.password)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Login failed")
      }

      const data = await response.json()
      localStorage.setItem("token", data.access_token)
      document.cookie = `token=${data.access_token}; path=/; max-age=86400; SameSite=Strict`;
      toast.success("Welcome back! Login successful.")
      router.push("/dashboard")
    } catch (error: any) {
      // Role-based mock login logic for development
      if (process.env.NEXT_PUBLIC_MOCK_MODE === 'true' || error.message.includes('fetch')) {
        if (formData.email === "admin@test.com") {
          apiClient.setMockRole("owner");
          localStorage.setItem("token", "mock-token");
          toast.success("Development Mode: Logged in as Owner.");
          router.push("/dashboard");
          return;
        }
        if (formData.email === "buyer@test.com") {
          apiClient.setMockRole("buyer");
          localStorage.setItem("token", "mock-token");
          toast.success("Development Mode: Logged in as Buyer.");
          router.push("/dashboard");
          return;
        }
        if (formData.email === "expert@test.com") {
          apiClient.setMockRole("professional");
          localStorage.setItem("token", "mock-token");
          toast.success("Development Mode: Logged in as Expert.");
          router.push("/dashboard");
          return;
        }
      }
      toast.error(error.message || "Invalid credentials. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit} className="mt-10 space-y-6">
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Email Address</Label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="pl-12 h-14 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all font-medium"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <Label htmlFor="password" className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Password</Label>
              <Link href="/forgot-password" className="text-xs font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-widest">
                Forgot access?
              </Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-12 pr-12 h-14 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all font-medium"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 ml-1">
          <Checkbox
            id="remember"
            className="rounded-md border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            checked={formData.remember}
            onCheckedChange={(checked) => setFormData({ ...formData, remember: checked as boolean })}
          />
          <label htmlFor="remember" className="cursor-pointer text-sm font-bold text-muted-foreground/80 hover:text-foreground transition-colors">
            Keep me logged in for 30 days
          </label>
        </div>

        <Button type="submit" variant="glossy" className="w-full h-16 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20" disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center gap-3">
              <Spinner className="h-5 w-5" />
              <span>Authenticating...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              <span>Secure Sign In</span>
            </div>
          )}
        </Button>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <Separator className="bg-white/10" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Identity Provider
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button type="button" variant="outline" className="h-14 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 transition-all font-bold gap-3">
            <Chrome className="h-5 w-5 text-primary" />
            Google
          </Button>
          <Button type="button" variant="outline" className="h-14 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 transition-all font-bold gap-3">
            <Github className="h-5 w-5 text-foreground" />
            GitHub
          </Button>
        </div>
      </form>
    </motion.div>
  )
}
