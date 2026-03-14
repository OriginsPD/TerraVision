"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, Box, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { apiClient } from "@/lib/api-client"

export default function NewPropertyPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    land_size: "",
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: keyof typeof files) => {
    if (e.target.files && e.target.files[0]) {
      setFiles({ ...files, [type]: e.target.files[0] })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!files.main) {
      toast.error("Please upload a cover image")
      return
    }

    setIsLoading(true)
    try {
      const data = new FormData()
      data.append("title", formData.title)
      data.append("description", formData.description)
      data.append("location", formData.location)
      data.append("price", formData.price)
      data.append("land_size", formData.land_size)
      data.append("image", files.main)
      
      if (files.front) data.append("image_front", files.front)
      if (files.back) data.append("image_back", files.back)
      if (files.left) data.append("image_left", files.left)
      if (files.right) data.append("image_right", files.right)

      const token = localStorage.getItem("token")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/properties/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: data,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to create property")
      }

      const result = await response.json()
      toast.success("Property created! AI model generation started.")
      router.push(`/properties/${result.id}`)
    } catch (error: any) {
      toast.error(error.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const FileUpload = ({ label, id, file, onChange }: { label: string, id: string, file: File | null, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className={`relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
        file ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
      }`}>
        <input 
          type="file" 
          id={id} 
          className="absolute inset-0 opacity-0 cursor-pointer" 
          onChange={onChange}
          accept="image/*"
        />
        {file ? (
          <>
            <Check className="h-8 w-8 text-primary" />
            <p className="mt-2 text-xs text-center px-2 truncate w-full">{file.name}</p>
          </>
        ) : (
          <>
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-xs text-muted-foreground">Click to upload</p>
          </>
        )}
      </div>
    </div>
  )

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="font-serif text-2xl font-medium text-foreground">Add New Property</h1>
          <p className="text-muted-foreground">Fill in the details and upload photos for 3D generation</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Property Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g., Modern Hillside Estate" 
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    placeholder="250000" 
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="land_size">Land Size (acres)</Label>
                  <Input 
                    id="land_size" 
                    type="number" 
                    step="0.1" 
                    placeholder="2.5" 
                    value={formData.land_size}
                    onChange={(e) => setFormData({ ...formData, land_size: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  placeholder="e.g., Countryside, CA" 
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  rows={4} 
                  placeholder="Describe the property features..." 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg">Multi-Angle Photos (Required for 3D)</CardTitle>
              <p className="text-sm text-muted-foreground">Upload photos from different sides for better 3D accuracy</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <FileUpload label="Front View" id="front" file={files.front} onChange={(e) => handleFileChange(e, "front")} />
                <FileUpload label="Back View" id="back" file={files.back} onChange={(e) => handleFileChange(e, "back")} />
                <FileUpload label="Left View" id="left" file={files.left} onChange={(e) => handleFileChange(e, "left")} />
                <FileUpload label="Right View" id="right" file={files.right} onChange={(e) => handleFileChange(e, "right")} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg">Cover Image</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload label="Main Photo" id="main" file={files.main} onChange={(e) => handleFileChange(e, "main")} />
              <p className="mt-4 text-xs text-muted-foreground">
                This will be the primary image shown in listings.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "List Property"
              )}
            </Button>
            <Button variant="outline" className="w-full" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>

          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center gap-2 text-primary">
              <Box className="h-4 w-4" />
              <span className="text-sm font-medium">3D Generation</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Once uploaded, our AI will automatically process your images to generate a navigable 3D model. This usually takes 5-10 minutes.
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
