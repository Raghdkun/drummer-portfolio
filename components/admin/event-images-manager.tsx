"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Plus, ImageIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface EventImagesManagerProps {
  images: string[]
  onChange: (images: string[]) => void
}

export default function EventImagesManager({ images = [], onChange }: EventImagesManagerProps) {
  const [newImageUrl, setNewImageUrl] = useState("")

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      const updatedImages = [...images, newImageUrl.trim()]
      onChange(updatedImages)
      setNewImageUrl("")
    }
  }

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index)
    onChange(updatedImages)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddImage()
    }
  }

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const updatedImages = [...images]
    const temp = updatedImages[index]
    updatedImages[index] = updatedImages[index - 1]
    updatedImages[index - 1] = temp
    onChange(updatedImages)
  }

  const handleMoveDown = (index: number) => {
    if (index === images.length - 1) return
    const updatedImages = [...images]
    const temp = updatedImages[index]
    updatedImages[index] = updatedImages[index + 1]
    updatedImages[index + 1] = temp
    onChange(updatedImages)
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Input
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter image URL..."
            className="bg-zinc-800 border-zinc-700 flex-1"
          />
          <Button
            type="button"
            onClick={handleAddImage}
            disabled={!newImageUrl.trim()}
            className="bg-rose-500 hover:bg-rose-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          {images.length === 0 ? (
            <p className="text-zinc-500 text-sm italic col-span-full">No additional images added yet.</p>
          ) : (
            images.map((imageUrl, index) => (
              <div key={index} className="bg-zinc-800/50 rounded-md border border-zinc-700/50 overflow-hidden group">
                <div className="aspect-video relative">
                  <Image
                    src={imageUrl || "/placeholder.svg?height=300&width=500"}
                    alt={`Event image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="h-8 w-8 bg-zinc-900/80 border-zinc-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m18 15-6-6-6 6" />
                      </svg>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleMoveDown(index)}
                      disabled={index === images.length - 1}
                      className="h-8 w-8 bg-zinc-900/80 border-zinc-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveImage(index)}
                      className="h-8 w-8 bg-zinc-900/80 border-zinc-700 hover:bg-red-500/10 hover:text-red-400 hover:border-red-400"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-2 text-xs text-zinc-400 truncate">
                  <div className="flex items-center">
                    <ImageIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="truncate">{imageUrl}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
