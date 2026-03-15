"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { Eye, EyeOff, Mail, Lock, ShieldCheck, Github, Chrome } from "lucide-react"
import { setTokens } from "@/lib/auth"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginFormValues } from "@/lib/validations"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

export function LoginForm() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  })

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true)

    try {
      const params = new URLSearchParams()
      params.append("username", values.email)
      params.append("password", values.password)

      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        const message = typeof error.detail === "string" ? error.detail : error.detail?.message ?? "Login failed"
        throw new Error(message)
      }

      const json = await response.json()
      const data = json.data ?? json
      const accessToken: string = data.access_token
      const refreshToken: string | undefined = data.refresh_token

      setTokens(accessToken, refreshToken)

      await queryClient.invalidateQueries({ queryKey: ["user", "me"] })

      toast.success("Welcome back! Login successful.")
      router.push("/dashboard")
    } catch (error: any) {
      toast.error(error.message || "Invalid credentials. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 space-y-6">
          <div className="space-y-5">
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
                        className="pl-12 h-14 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all font-medium"
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
                  <div className="flex items-center justify-between ml-1">
                    <FormLabel className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Password</FormLabel>
                    <Link href="/forgot-password" className="text-xs font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-widest">
                      Forgot access?
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-12 pr-12 h-14 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all font-medium"
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
          </div>

          <FormField
            control={form.control}
            name="remember"
            render={({ field }) => (
              <FormItem className="flex items-start gap-3 ml-1 space-y-0">
                <FormControl>
                  <Checkbox
                    className="rounded-md border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="cursor-pointer text-sm font-bold text-muted-foreground/80 hover:text-foreground transition-colors">
                    Keep me logged in
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          <Button type="submit" variant="glossy" className="w-full h-16 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20 gap-3" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner className="h-5 w-5" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="h-5 w-5" />
                <span>Secure Sign In</span>
              </>
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
      </Form>
    </motion.div>
  )
}
