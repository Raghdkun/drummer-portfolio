"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createClientSupabaseClient } from "@/lib/supabase"
import type { Database } from "@/types/supabase"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

type Media = Database["public"]["Tables"]["media"]["Row"]
type MediaInsert = Database["public"]["Tables"]["media"]["Insert"]

interface MediaFormProps {
  media?: Media
  isEdit?: boolean
}

export default function MediaForm({ media, isEdit = false }: MediaFormProps) {
  const initialData: MediaInsert = media || {
    title: "",
    description: "",
    media_type: "image",
    url: "",
    thumbnail_url: "",
    is_featured: false,
  }

  const [formData, setFormData] = useState<MediaInsert>(initialData)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const supabase = createClientSupabaseClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      if (isEdit && media) {
        // Update existing media
        const { error } = await supabase
          .from("media")
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", media.id)

        if (error) throw error
        toast.success("Media updated successfully")
      } else {
        // Create new media
        const { error } = await supabase.from("media").insert({
          ...formData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (error) throw error
        toast.success("Media created successfully")
      }

      router.push("/admin/media")
    } catch (error) {
      console.error("Error saving media:", error)
      toast.error(isEdit ? "Failed to update media" : "Failed to create media")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle>{isEdit ? "Edit Media" : "Add New Media"}</CardTitle>
          <CardDescription>
            {isEdit ? "Update the details of your media" : "Add a new image or video to your website"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="bg-zinc-800 border-zinc-700"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              className="bg-zinc-800 border-zinc-700 min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="media_type">Media Type</Label>
            <Select value={formData.media_type} onValueChange={(value) => handleSelectChange("media_type", value)}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700">
                <SelectValue placeholder="Select media type" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">Media URL</Label>
            <Input
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              className="bg-zinc-800 border-zinc-700"
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail_url">Thumbnail URL (optional)</Label>
            <Input
              id="thumbnail_url"
              name="thumbnail_url"
              value={formData.thumbnail_url || ""}
              onChange={handleChange}
              className="bg-zinc-800 border-zinc-700"
              placeholder="https://example.com/thumbnail.jpg"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_featured"
              checked={formData.is_featured}
              onCheckedChange={(checked) => handleCheckboxChange("is_featured", checked as boolean)}
            />
            <Label htmlFor="is_featured" className="cursor-pointer">
              Feature this media on the homepage
            </Label>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-end space-x-4">
        <Button type="button" variant="outline" className="border-zinc-700" onClick={() => router.push("/admin/media")}>
          Cancel
        </Button>
        <Button type="submit" className="bg-rose-500 hover:bg-rose-600" disabled={isSaving}>
          {isSaving ? "Saving..." : isEdit ? "Update Media" : "Add Media"}
        </Button>
      </div>
    </form>
  )
}
