"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { createClientSupabaseClient } from "@/lib/supabase"
import { resizeImage, isImageFile, formatFileSize } from "@/utils/image-utils"
import { toast } from "sonner"
import { Upload, X, ImageIcon, AlertCircle } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

interface ImageUploadProps {
  messageId: string
  onImageUploaded: (imageUrl: string) => void
}

export default function ImageUpload({ messageId, onImageUploaded }: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClientSupabaseClient()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset states
    setError(null)
    setUploadProgress(0)

    // Validate file type
    if (!isImageFile(file)) {
      setError("Please select a valid image file (JPEG, PNG, GIF, WEBP)")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB")
      return
    }

    try {
      // Create preview
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)
      setSelectedFile(file)
    } catch (err) {
      console.error("Error creating preview:", err)
      setError("Failed to preview image")
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadProgress(0)
    setError(null)

    try {
      // Resize image before upload
      const resizedFile = await resizeImage(selectedFile)

      // Generate a unique filename
      const fileExt = selectedFile.name.split(".").pop()
      const fileName = `${messageId}/${uuidv4()}.${fileExt}`
      const filePath = `message-attachments/${fileName}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage.from("message-attachments").upload(filePath, resizedFile, {
        cacheControl: "3600",
        upsert: false,
        onUploadProgress: (progress) => {
          const percent = (progress.loaded / progress.total) * 100
          setUploadProgress(Math.round(percent))
        },
      })

      if (error) throw error

      // Get public URL
      const { data: urlData } = supabase.storage.from("message-attachments").getPublicUrl(filePath)

      // Call the callback with the image URL
      onImageUploaded(urlData.publicUrl)

      // Reset states
      setSelectedFile(null)
      setPreviewUrl(null)
      toast.success("Image uploaded successfully")
    } catch (err) {
      console.error("Error uploading image:", err)
      setError("Failed to upload image. Please try again.")
      toast.error("Failed to upload image")
    } finally {
      setIsUploading(false)
    }
  }

  const handleCancel = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setSelectedFile(null)
    setPreviewUrl(null)
    setError(null)
    setUploadProgress(0)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-zinc-300">Upload Image</h4>
        {!selectedFile && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={triggerFileInput}
            className="border-zinc-700"
            disabled={isUploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            Select Image
          </Button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
      />

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-md p-3 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {selectedFile && previewUrl ? (
        <div className="bg-zinc-800/50 rounded-lg border border-zinc-700/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <ImageIcon className="h-4 w-4 text-zinc-400 mr-2" />
              <span className="text-sm text-zinc-300 truncate max-w-[200px]">{selectedFile.name}</span>
            </div>
            <span className="text-xs text-zinc-500">{formatFileSize(selectedFile.size)}</span>
          </div>

          <div className="relative aspect-video w-full overflow-hidden rounded-md bg-zinc-900">
            <Image
              src={previewUrl || "/placeholder.svg"}
              alt="Preview"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 500px"
            />
          </div>

          {isUploading && (
            <div className="mt-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-400">Uploading...</span>
                <span className="text-xs text-zinc-400">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-1.5" />
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="border-zinc-700"
              disabled={isUploading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleUpload}
              className="bg-rose-500 hover:bg-rose-600"
              disabled={isUploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={triggerFileInput}
          className="border-2 border-dashed border-zinc-700 rounded-lg p-6 text-center hover:border-rose-500/50 transition-colors cursor-pointer"
        >
          <ImageIcon className="h-8 w-8 mx-auto text-zinc-500 mb-2" />
          <p className="text-zinc-400 text-sm mb-1">Drag and drop an image, or click to browse</p>
          <p className="text-zinc-500 text-xs">JPEG, PNG, GIF, WEBP (max 5MB)</p>
        </div>
      )}
    </div>
  )
}
