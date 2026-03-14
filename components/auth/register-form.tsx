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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Eye, EyeOff, User, Home, Building2, Mail, Lock, UserCircle, ShieldCheck, Github, Chrome, Sparkles } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const roles = [
  {
    id: "buyer",
    label: "Buyer",
    description: "Looking to purchase",
    icon: User,
    color: "text-primary",
    bg: "bg-primary/10"
  },
  {
    id: "owner",
    label: "Owner",
    description: "Sell or list assets",
    icon: Home,
    color: "text-accent",
    bg: "bg-accent/10"
  },
  {
    id: "professional",
    label: "Expert",
    description: "Architect or builder",
    icon: Building2,
    color: "text-primary",
    bg: "bg-primary/10"
  },
]

export function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
    terms: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await apiClient.post("/auth/register", {
        email: formData.email,
        password: formData.password,
        full_name: formData.name,
        role: formData.role,
      })

      toast.success("Account created! Welcome to TerraVision.")
      router.push("/login")
    } catch (error: any) {
      // Mock success for development
      if (formData.email.includes("test")) {
         toast.success("Development Mode: Account created.")
         router.push("/login")
         return
      }
      toast.error(error.message || "Registration failed. Please try again.")
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
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Full Name</Label>
            <div className="relative group">
              <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                className="pl-12 h-14 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all font-medium"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>

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
            <Label htmlFor="password" university-title className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Password</Label>
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

          {/* Role Selection - Glossy Pills */}
          <div className="space-y-3 pt-2">
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Select your role</Label>
            <RadioGroup
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value })}
              className="grid grid-cols-3 gap-2"
            >
              {roles.map((role) => (
                <div key={role.id}>
                  <RadioGroupItem value={role.id} id={role.id} className="sr-only" />
                  <Label
                    htmlFor={role.id}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 transition-all cursor-pointer h-full text-center",
                      formData.role === role.id
                        ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                        : "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20"
                    )}
                  >
                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", role.bg)}>
                      <role.icon className={cn("h-5 w-5", role.color)} />
                    </div>
                    <span className={cn("text-xs font-bold uppercase tracking-widest", formData.role === role.id ? "text-primary" : "text-muted-foreground")}>
                      {role.label}
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        <div className="flex items-start gap-3 ml-1">
          <Checkbox
            id="terms"
            className="mt-1 rounded-md border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            checked={formData.terms}
            onCheckedChange={(checked) => setFormData({ ...formData, terms: checked as boolean })}
            required
          />
          <label htmlFor="terms" className="cursor-pointer text-sm font-medium text-muted-foreground/80 leading-relaxed">
            I agree to the <Link href="/terms" className="text-primary font-bold hover:underline">Terms</Link> and <Link href="/privacy" className="text-primary font-bold hover:underline">Privacy Policy</Link>
          </label>
        </div>

        <Button type="submit" variant="glossy" className="w-full h-16 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20" disabled={isLoading || !formData.terms}>
          {isLoading ? (
            <div className="flex items-center gap-3">
              <Spinner className="h-5 w-5" />
              <span>Creating Account...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <span>Join TerraVision</span>
            </div>
          )}
        </Button>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <Separator className="bg-white/10" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
              Alternative Register
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
