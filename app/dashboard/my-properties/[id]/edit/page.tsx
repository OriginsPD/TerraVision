"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Box, Check, Loader2, Sparkles, LayoutGrid, Info, Zap, ChevronRight, MapPin, DollarSign, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import { ImageUploader } from "@/components/ui/image-uploader"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { propertyFormSchema, type PropertyFormValues } from "@/lib/validations"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Spinner } from "@/components/ui/spinner"

const AMENITIES_OPTIONS = [
  "Pool", "Smart Home", "Home Theater", "Gym", "Guest House", 
  "Solar Panels", "Sustainable Design", "Beach Access", "Wine Cellar"
]

export default function EditPropertyPage() {
  const router = useRouter()
  const { id } = useParams()
  const queryClient = useQueryClient()

  const { data: property, isLoading: isFetching } = useQuery({
    queryKey: ["properties", id],
    queryFn: async () => {
      return apiClient.get(`/properties/${id}`) as any
    }
  })

  const { mutate: updateProperty, isPending: isUpdating } = useMutation({
    mutationFn: async (data: FormData) => {
      return apiClient.put(`/properties/${id}`, data, { isMultipart: true })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties", id] })
      toast.success("Property updated successfully")
      router.push(`/properties/${id}`)
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update property")
    }
  })

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

  useEffect(() => {
    if (property) {
      form.reset({
        title: property.title,
        description: property.description,
        location: property.location,
        price: property.price,
        land_size: property.land_size,
        type: property.type || "HOUSE",
        amenities: property.amenities || [],
      })
    }
  }, [property, form])

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

    if (files.main) data.append("image", files.main)
    if (files.front) data.append("image_front", files.front)
    if (files.back) data.append("image_back", files.back)
    if (files.left) data.append("image_left", files.left)
    if (files.right) data.append("image_right", files.right)

    updateProperty(data)
  }

  if (isFetching) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-20">
        <Spinner className="h-12 w-12 text-primary" />
        <p className="mt-4 text-sm font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Loading property details...</p>
      </div>
    )
  }

  return (
    <main className="flex-1 p-6 lg:p-10 bg-background/50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors group mb-4"
            type="button"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </button>
          <h1 className="font-serif text-4xl font-bold text-foreground">Edit <span className="text-gradient">Property Listing</span></h1>
          <p className="text-lg font-medium text-muted-foreground/80 mt-2">Update your listing details and visual data.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-10 lg:grid-cols-[1fr_380px]">
            <div className="space-y-8">
              <Card className="glass border-white/10 rounded-[3rem] overflow-hidden">
                <CardHeader className="p-10 pb-4">
                  <CardTitle className="text-2xl font-bold">Basic Details</CardTitle>
                </CardHeader>
                <CardContent className="p-10 pt-4 space-y-8">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Property Title</FormLabel>
                        <FormControl>
                          <Input className="h-14 rounded-2xl bg-white/5 border-white/10" {...field} />
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
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-14 rounded-2xl bg-white/5 border-white/10">
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
                            <Input type="number" className="h-14 rounded-2xl bg-white/5 border-white/10" {...field} />
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
                            <Input type="number" step="0.1" className="h-14 rounded-2xl bg-white/5 border-white/10" {...field} />
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
                          <Input className="h-14 rounded-2xl bg-white/5 border-white/10" {...field} />
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
                          <Textarea rows={5} className="rounded-[2rem] bg-white/5 border-white/10" {...field} />
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
                              <FormItem key={amenity} className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border border-white/5 bg-white/5 p-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(amenity)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), amenity])
                                        : field.onChange(field.value?.filter((value) => value !== amenity))
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-medium leading-none cursor-pointer">{amenity}</FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-white/10 rounded-[3rem] overflow-hidden">
                <CardHeader className="p-10 pb-4">
                  <CardTitle className="text-2xl font-bold">Update Visuals</CardTitle>
                  <p className="mt-2 text-sm text-muted-foreground">Only upload images you wish to replace. Existing images will be kept otherwise.</p>
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

            <div className="space-y-8">
              <Card className="glass border-white/10 rounded-[3rem] overflow-hidden">
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-xl font-bold">New Hero Asset</CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-4">
                  <ImageUploader label="Replace Cover Photo" aspectRatio="video" onImageSelect={(f) => handleFileSelect(f, "main")} />
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Button type="submit" variant="glossy" className="w-full py-8 text-xl font-bold rounded-2xl" disabled={isUpdating}>
                  {isUpdating ? <><Loader2 className="h-6 w-6 animate-spin mr-2" /> Saving...</> : "Update Listing"}
                </Button>
                <Button variant="outline" className="w-full h-14 rounded-2xl font-bold border-white/10 bg-white/5" type="button" onClick={() => router.back()}>
                  Cancel Changes
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </main>
  )
}
