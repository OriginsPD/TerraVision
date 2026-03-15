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
import { Eye, EyeOff, User, Home, Building2, Mail, Lock, UserCircle, Github, Chrome, Sparkles } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, type RegisterFormValues } from "@/lib/validations"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const roles = [
  { id: "buyer", label: "Buyer", description: "Looking to purchase", icon: User, color: "text-primary", bg: "bg-primary/10" },
  { id: "owner", label: "Owner", description: "Sell or list assets", icon: Home, color: "text-accent", bg: "bg-accent/10" },
  { id: "professional", label: "Expert", description: "Architect or builder", icon: Building2, color: "text-primary", bg: "bg-primary/10" },
]

function toBackendRole(frontendRole: string): string {
  if (frontendRole === "professional") return "architect"
  return frontendRole
}

export function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "buyer",
      terms: undefined,
    },
  })

  const onSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true)
    try {
      const parts = values.name.trim().split(/\s+/)
      const firstName = parts[0] ?? ""
      const lastName = parts.slice(1).join(" ") || firstName
      
      await apiClient.post("/auth/register", {
        email: values.email,
        password: values.password,
        firstName,
        lastName,
        role: toBackendRole(values.role),
      })
      toast.success("Account created! Welcome to TerraVision.")
      router.push("/login")
    } catch (error: any) {
      toast.error(error.message || "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Full Name</FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        type="text"
                        placeholder="John Doe"
                        className="pl-12 h-14 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 transition-all font-medium"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Email Address</FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        className="pl-12 h-14 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 transition-all font-medium"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Password</FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="password"
                        className="pl-12 pr-12 h-14 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 transition-all font-medium"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="space-y-3 pt-2">
                  <FormLabel className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Select your role</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="grid grid-cols-3 gap-2"
                    >
                      {roles.map((role) => (
                        <div key={role.id}>
                          <RadioGroupItem value={role.id} id={role.id} className="sr-only" />
                          <Label
                            htmlFor={role.id}
                            className={cn(
                              "flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 transition-all cursor-pointer h-full text-center",
                              field.value === role.id ? "border-primary bg-primary/10" : "border-white/5 bg-white/5 hover:bg-white/10"
                            )}
                          >
                            <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", role.bg)}>
                              <role.icon className={cn("h-5 w-5", role.color)} />
                            </div>
                            <span className={cn("text-xs font-bold uppercase tracking-widest", field.value === role.id ? "text-primary" : "text-muted-foreground")}>
                              {role.label}
                            </span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="flex items-start gap-3 ml-1">
                <FormControl>
                  <Checkbox
                    className="mt-1 rounded-md border-white/20 data-[state=checked]:bg-primary"
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="cursor-pointer text-sm font-medium text-muted-foreground/80 leading-relaxed">
                    I agree to the <Link href="/terms" className="text-primary font-bold hover:underline">Terms</Link> and <Link href="/privacy" className="text-primary font-bold hover:underline">Privacy Policy</Link>
                  </FormLabel>
                </div>
                {/* Notice we won't output FormMessage here as Zod catches form.terms globally but we want it below */}
              </FormItem>
            )}
          />
          {form.formState.errors.terms && (
             <p className="text-destructive text-sm ml-1 font-medium">{form.formState.errors.terms.message}</p>
          )}

          <Button type="submit" variant="glossy" className="w-full h-16 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20" disabled={isLoading}>
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
            <div className="absolute inset-0 flex items-center"><Separator className="bg-white/10" /></div>
            <div className="relative flex justify-center"><span className="bg-background px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Alternative Register</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button type="button" variant="outline" className="h-14 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 font-bold gap-3">
              <Chrome className="h-5 w-5 text-primary" />
              Google
            </Button>
            <Button type="button" variant="outline" className="h-14 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 font-bold gap-3">
              <Github className="h-5 w-5 text-foreground" />
              GitHub
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  )
}
