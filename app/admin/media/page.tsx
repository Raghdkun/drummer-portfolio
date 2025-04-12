"use client"

import DashboardLayout from "@/components/admin/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClientSupabaseClient } from "@/lib/supabase"
import type { Database } from "@/types/supabase"
import { Edit, ImageIcon, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import Image from "next/image"

type Media = Database["public"]["Tables"]["media"]["Row"]

export default function MediaPage() {
  const [media, setMedia] = useState<Media[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientSupabaseClient()

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.from("media").select("*").order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      setMedia(data || [])
    } catch (error) {
      console.error("Error fetching media:", error)
      toast.error("Failed to load media")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteMedia = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media item?")) {
      return
    }

    try {
      const { error } = await supabase.from("media").delete().eq("id", id)

      if (error) {
        throw error
      }

      setMedia((prev) => prev.filter((item) => item.id !== id))
      toast.success("Media deleted successfully")
    } catch (error) {
      console.error("Error deleting media:", error)
      toast.error("Failed to delete media")
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Media</h1>
          <Link href="/admin/media/new">
            <Button className="bg-rose-500 hover:bg-rose-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Media
            </Button>
          </Link>
        </div>
        <p className="text-zinc-400">Manage your images, videos, and other media files.</p>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-zinc-900 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : media.length === 0 ? (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <ImageIcon className="h-12 w-12 mx-auto text-zinc-600 mb-4" />
                <h3 className="text-xl font-medium mb-2">No media found</h3>
                <p className="text-zinc-400 mb-6">
                  You haven't added any media yet. Add your first image or video to get started.
                </p>
                <Link href="/admin/media/new">
                  <Button className="bg-rose-500 hover:bg-rose-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Media
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="bg-zinc-900 border-zinc-800 mb-6">
              <CardHeader>
                <CardTitle>Featured Media</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {media
                    .filter((item) => item.is_featured)
                    .map((item) => (
                      <div key={item.id} className="group relative bg-zinc-800 rounded-lg overflow-hidden">
                        <div className="aspect-video relative">
                          <Image src={item.url || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                        </div>
                        <div className="p-3">
                          <h3 className="font-medium truncate">{item.title}</h3>
                          <p className="text-zinc-400 text-sm">
                            {item.media_type.charAt(0).toUpperCase() + item.media_type.slice(1)}
                          </p>
                        </div>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex space-x-2">
                            <Link href={`/admin/media/edit/${item.id}`}>
                              <Button variant="outline" size="icon" className="bg-zinc-900/80 border-zinc-700 h-8 w-8">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="icon"
                              className="bg-zinc-900/80 border-zinc-700 h-8 w-8 hover:bg-red-500/10 hover:text-red-400 hover:border-red-400"
                              onClick={() => handleDeleteMedia(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle>All Media</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {media
                    .filter((item) => !item.is_featured)
                    .map((item) => (
                      <div key={item.id} className="group relative bg-zinc-800 rounded-lg overflow-hidden">
                        <div className="aspect-video relative">
                          <Image src={item.url || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                        </div>
                        <div className="p-3">
                          <h3 className="font-medium truncate">{item.title}</h3>
                          <p className="text-zinc-400 text-sm">
                            {item.media_type.charAt(0).toUpperCase() + item.media_type.slice(1)}
                          </p>
                        </div>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex space-x-2">
                            <Link href={`/admin/media/edit/${item.id}`}>
                              <Button variant="outline" size="icon" className="bg-zinc-900/80 border-zinc-700 h-8 w-8">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="icon"
                              className="bg-zinc-900/80 border-zinc-700 h-8 w-8 hover:bg-red-500/10 hover:text-red-400 hover:border-red-400"
                              onClick={() => handleDeleteMedia(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
