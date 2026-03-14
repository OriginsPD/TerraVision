"use client"

import { useState, useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X, Image as ImageIcon, CheckCircle2, Cloud, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface ImageUploaderProps {
  onImageSelect: (file: File | null) => void
  label?: string
  className?: string
  aspectRatio?: "square" | "video"
  initialImage?: string
}

export function ImageUploader({ 
  onImageSelect, 
  label = "Upload Image", 
  className,
  aspectRatio = "square",
  initialImage
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(initialImage || null)
  const [isHovered, setIsHovered] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      onImageSelect(file)
    }
  }, [onImageSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  })

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPreview(null)
    onImageSelect(null)
  }

  return (
    <div className={cn("space-y-3", className)}>
      <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">{label}</Label>
      
      <div 
        {...getRootProps()}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "relative overflow-hidden cursor-pointer transition-all duration-500 rounded-[2rem] border-2 border-dashed group",
          aspectRatio === "square" ? "aspect-square" : "aspect-video",
          isDragActive ? "border-primary bg-primary/10" : "border-white/10 bg-white/5 hover:border-primary/30",
          preview ? "border-solid border-white/20" : ""
        )}
      >
        <input {...getInputProps()} />
        
        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div 
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full w-full relative"
            >
              <img src={preview} alt="Preview" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                   <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-white" />
                   </div>
                   <span className="text-xs font-bold text-white uppercase tracking-widest">Change Photo</span>
                </div>
              </div>
              
              <button 
                onClick={removeImage}
                className="absolute top-4 right-4 z-20 h-10 w-10 rounded-full bg-rose-500/80 backdrop-blur-md text-white flex items-center justify-center shadow-lg hover:bg-rose-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="absolute bottom-4 left-4 z-20 glass px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-2 shadow-xl">
                 <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                 <span className="text-[10px] font-bold text-white uppercase tracking-widest">Ready for 3D AI</span>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full w-full flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="relative">
                <motion.div 
                  animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                  className="h-16 w-16 rounded-3xl bg-primary/20 border border-primary/30 flex items-center justify-center mb-4 shadow-lg group-hover:shadow-primary/20"
                >
                  <Cloud className="h-8 w-8 text-primary" />
                </motion.div>
                <motion.div 
                  animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.5 }}
                  className="absolute -top-2 -right-2"
                >
                  <Sparkles className="h-6 w-6 text-accent fill-accent" />
                </motion.div>
              </div>
              <p className="text-sm font-bold text-foreground mb-1">Drag & drop or click</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                PNG, JPG or WEBP<br />(Max 10MB)
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Animated Corner Accents */}
        <div className="absolute top-0 left-0 h-8 w-8 border-t-2 border-l-2 border-primary/30 rounded-tl-[2rem] opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-primary/30 rounded-br-[2rem] opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  )
}

function Label({ children, className }: { children: React.ReactNode, className?: string }) {
  return <label className={cn("block", className)}>{children}</label>
}
