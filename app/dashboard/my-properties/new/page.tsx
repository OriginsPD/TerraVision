"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Box, Check, Loader2, Sparkles, LayoutGrid, Info, Zap, ChevronRight, MapPin, DollarSign, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useCreateProperty } from "@/hooks/api/use-properties"
import { ImageUploader } from "@/components/ui/image-uploader"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { propertyFormSchema, type PropertyFormValues } from "@/lib/validations"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

const AMENITIES_OPTIONS = [
  "Pool", "Smart Home", "Home Theater", "Gym", "Guest House", 
  "Solar Panels", "Sustainable Design", "Beach Access", "Wine Cellar"
]

export default function NewPropertyPage() {
  const router = useRouter()
  const { mutate: createProperty, isPending: isLoading } = useCreateProperty()

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      location: "",
      price: 0,
      land_size: 0,
      type: "HOUSE",
      amenities: [],
    },
  })

  const [files, setFiles] = useState<{
    main: File | null;
    front: File | null;
    back: File | null;
    left: File | null;
    right: File | null;
  }>({
    main: null,
    front: null,
    back: null,
    left: null,
    right: null,
  })

  const handleFileSelect = (file: File | null, type: keyof typeof files) => {
    setFiles(prev => ({ ...prev, [type]: file }))
  }

  const onSubmit = (values: PropertyFormValues) => {
    if (!files.main) {
      toast.error("Please upload a cover image for your property")
      return
    }

    const data = new FormData()
    data.append("title", values.title)
    data.append("description", values.description)
    data.append("location", values.location)
    data.append("price", values.price.toString())
    data.append("land_size", values.land_size.toString())
    data.append("type", values.type || "HOUSE")
    
    if (values.amenities && values.amenities.length > 0) {
      values.amenities.forEach(a => data.append("amenities", a))
    }

    // Mock geocoding coordinates for simulation
    data.append("latitude", (34 + Math.random() * 2).toString())
    data.append("longitude", (-118 + Math.random() * 2).toString())

    data.append("image", files.main)
    
    if (files.front) data.append("image_front", files.front)
    if (files.back) data.append("image_back", files.back)
    if (files.left) data.append("image_left", files.left)
    if (files.right) data.append("image_right", files.right)

    createProperty(data, {
      onSuccess: (result: any) => {
        const propertyId = result?.property?.id || result?.data?.id || result?.id;
        if (propertyId) {
          toast.success("Listing published! AI model generation is now in queue.")
          router.push(`/properties/${propertyId}`)
        } else {
          toast.error("Property created, but ID was missing. Redirecting to dashboard.")
          router.push("/dashboard/my-properties")
        }
      },

      onError: (err: any) => {
        if (process.env.NEXT_PUBLIC_MOCK_MODE === 'true') {
           toast.success("Development Mode: Listing created successfully!")
           router.push("/dashboard/my-properties")
           return
        }
        toast.error(err.message || "Failed to create listing")
      }
    })
  }

  return (
    <main className="flex-1 p-6 lg:p-10 bg-background/50 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] -z-10" />

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors group mb-4"
              type="button"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Dashboard
            </button>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-lg">
                <LayoutGrid className="h-6 w-6 text-primary" />
              </div>
              <h1 className="font-serif text-4xl font-bold text-foreground">Create <span className="text-gradient">New Listing</span></h1>
            </div>
            <p className="text-lg font-medium text-muted-foreground/80">Showcase your property with AI-powered 3D visualization.</p>
          </div>

          <div className="flex items-center gap-3">
             <div className="glass px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Network Secure</span>
             </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-10 lg:grid-cols-[1fr_380px]">
            {/* Main Form Area */}
            <div className="space-y-8">
              <Card className="glass border-white/10 rounded-[3rem] overflow-hidden shadow-2xl">
                <CardHeader className="p-10 pb-4">
                  <CardTitle className="text-2xl font-bold flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <Info className="h-4 w-4 text-primary" />
                    </div>
                    Basic Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-10 pt-4 space-y-8">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Property Title</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Input 
                              placeholder="e.g., Ultra-Modern Hillside Estate" 
                              className="h-14 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all font-medium text-lg px-6"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-6 sm:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Property Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-14 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 transition-all font-medium">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-popover border-white/10">
                              <SelectItem value="HOUSE">House</SelectItem>
                              <SelectItem value="VILLA">Villa</SelectItem>
                              <SelectItem value="APARTMENT">Apartment</SelectItem>
                              <SelectItem value="CHALET">Chalet</SelectItem>
                              <SelectItem value="PENTHOUSE">Penthouse</SelectItem>
                              <SelectItem value="LAND">Land</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Asking Price ($)</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                              <Input 
                                type="number" 
                                placeholder="250000" 
                                className="pl-12 h-14 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all font-bold"
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
                      name="land_size"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Total Area (acres)</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Maximize2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
                              <Input 
                                type="number" 
                                step="0.1" 
                                placeholder="2.5" 
                                className="pl-12 h-14 rounded-2xl bg-white/5 border-white/10 focus:border-accent/50 focus:ring-accent/20 transition-all font-bold"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Geographic Location</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input 
                              placeholder="e.g., Beverly Hills, CA" 
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
                    name="description"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Property Story</FormLabel>
                        <FormControl>
                          <Textarea 
                            rows={5} 
                            placeholder="Describe the soul of this property, its potential, and unique features..." 
                            className="rounded-[2rem] bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all font-medium p-6 resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Amenities</Label>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                      {AMENITIES_OPTIONS.map((amenity) => (
                        <FormField
                          key={amenity}
                          control={form.control}
                          name="amenities"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={amenity}
                                className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border border-white/5 bg-white/5 p-4 hover:bg-white/10 transition-colors"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(amenity)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), amenity])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== amenity
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-medium leading-none cursor-pointer">
                                  {amenity}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-white/10 rounded-[3rem] overflow-hidden shadow-2xl">
                <CardHeader className="p-10 pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-bold flex items-center gap-3">
                      <div className="h-8 w-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <Zap className="h-4 w-4 text-accent" />
                      </div>
                      Multi-Angle Data
                    </CardTitle>
                    <Badge className="bg-accent/20 text-accent border border-accent/30 font-bold uppercase tracking-widest text-[10px] px-3 py-1">Required for 3D AI</Badge>
                  </div>
                  <p className="mt-2 text-sm font-medium text-muted-foreground leading-relaxed">Provide visual data from multiple vectors to ensure high-fidelity model generation.</p>
                </CardHeader>
                <CardContent className="p-10 pt-4">
                  <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                    <ImageUploader label="Front" onImageSelect={(f) => handleFileSelect(f, "front")} />
                    <ImageUploader label="Back" onImageSelect={(f) => handleFileSelect(f, "back")} />
                    <ImageUploader label="Left" onImageSelect={(f) => handleFileSelect(f, "left")} />
                    <ImageUploader label="Right" onImageSelect={(f) => handleFileSelect(f, "right")} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Area */}
            <div className="space-y-8">
              <Card className="glass border-white/10 rounded-[3rem] overflow-hidden shadow-2xl">
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-xl font-bold">Hero Asset</CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-4">
                  <ImageUploader 
                    label="Primary Cover Photo" 
                    aspectRatio="video" 
                    onImageSelect={(f) => handleFileSelect(f, "main")} 
                  />
                  <p className="mt-6 text-xs font-medium text-muted-foreground leading-relaxed text-center italic">
                    This image will be the first point of contact for potential buyers in the marketplace.
                  </p>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Button 
                  type="submit" 
                  variant="glossy" 
                  className="w-full py-8 text-xl font-bold rounded-2xl shadow-xl shadow-primary/30 gap-3" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-6 w-6" />
                      Publish Listing
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full h-14 rounded-2xl font-bold border-white/10 bg-white/5 hover:bg-white/10" 
                  type="button" 
                  onClick={() => router.back()}
                >
                  Save as Draft
                </Button>
              </div>

              {/* Smart Assistant Card */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="rounded-[3rem] bg-gradient-to-br from-primary/20 to-accent/20 border border-white/20 p-8 relative overflow-hidden group shadow-xl"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                  <Box className="h-24 w-24 text-primary" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                     <div className="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center border border-white/30">
                        <Sparkles className="h-4 w-4 text-white" />
                     </div>
                     <span className="text-[10px] font-bold text-white uppercase tracking-widest">AI Concierge</span>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2 leading-tight">Optimizing your 3D experience</h4>
                  <p className="text-sm font-medium text-white/70 leading-relaxed mb-6">
                    Our system automatically analyzes your uploads to determine the optimal terrain mesh and lighting for your property.
                  </p>
                  <div className="flex items-center gap-2 text-white font-bold text-xs group cursor-pointer">
                     Check AI requirements
                     <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            </div>
          </form>
        </Form>
      </div>
    </main>
  )
}

