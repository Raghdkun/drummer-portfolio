"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { createClientSupabaseClient } from "@/lib/supabase"
import { toast } from "sonner"
import { Trash2, ExternalLink, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"

interface ImageGalleryProps {
  messageId: string
  images: string[]
  onImageDeleted: (imageUrl: string) => void
}

export default function ImageGallery({ messageId, images, onImageDeleted }: ImageGalleryProps) {
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({})
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const supabase = createClientSupabaseClient()

  if (!images || images.length === 0) {
    return null
  }

  const handleDeleteImage = async (imageUrl: string) => {
    if (!confirm("Are you sure you want to delete this image?")) {
      return
    }

    setIsDeleting((prev) => ({ ...prev, [imageUrl]: true }))

    try {
      // Extract the path from the URL
      const urlObj = new URL(imageUrl)
      const pathWithBucket = urlObj.pathname
      // Remove the /storage/v1/object/public/ part
      const path = pathWithBucket.replace(/^\/storage\/v1\/object\/public\/message-attachments\//, "")

      // Delete from Supabase Storage
      const { error } = await supabase.storage.from("message-attachments").remove([path])

      if (error) throw error

      // Call the callback to update the parent component
      onImageDeleted(imageUrl)
      toast.success("Image deleted successfully")
    } catch (err) {
      console.error("Error deleting image:", err)
      toast.error("Failed to delete image")
    } finally {
      setIsDeleting((prev) => ({ ...prev, [imageUrl]: false }))
    }
  }

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-zinc-300">Attached Images ({images.length})</h4>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {images.map((imageUrl, index) => (
          <div
            key={index}
            className="group relative aspect-square bg-zinc-800 rounded-md overflow-hidden border border-zinc-700"
          >
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={`Attachment ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 33vw"
            />

            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-zinc-900/80 border-zinc-700"
                    onClick={() => setSelectedImage(imageUrl)}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px] bg-zinc-900 border-zinc-800">
                  <DialogHeader>
                    <DialogTitle>Image Preview</DialogTitle>
                    <DialogDescription>Full size image preview</DialogDescription>
                  </DialogHeader>
                  <div className="relative aspect-video w-full overflow-hidden rounded-md bg-zinc-950">
                    <Image
                      src={selectedImage || ""}
                      alt="Full size preview"
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 800px"
                    />
                  </div>
                  <div className="flex justify-between">
                    <DialogClose asChild>
                      <Button variant="outline" className="border-zinc-700">
                        Close
                      </Button>
                    </DialogClose>
                    <a href={selectedImage || ""} target="_blank" rel="noopener noreferrer">
                      <Button className="bg-rose-500 hover:bg-rose-600">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open Original
                      </Button>
                    </a>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-zinc-900/80 border-zinc-700 hover:bg-red-500/20 hover:text-red-400 hover:border-red-400"
                onClick={() => handleDeleteImage(imageUrl)}
                disabled={isDeleting[imageUrl]}
              >
                {isDeleting[imageUrl] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
