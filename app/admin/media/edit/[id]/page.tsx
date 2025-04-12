"use client"

import DashboardLayout from "@/components/admin/dashboard-layout"
import MediaForm from "@/components/admin/media-form"
import { createClientSupabaseClient } from "@/lib/supabase"
import type { Database } from "@/types/supabase"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

type Media = Database["public"]["Tables"]["media"]["Row"]

export default function EditMediaPage() {
  const [media, setMedia] = useState<Media | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const params = useParams()
  const router = useRouter()
  const mediaId = params.id as string
  const supabase = createClientSupabaseClient()

  useEffect(() => {
    const fetchMedia = async () => {
      setIsLoading(true)
      try {
        const { data, error } = await supabase.from("media").select("*").eq("id", mediaId).single()

        if (error) {
          throw error
        }

        setMedia(data)
      } catch (error) {
        console.error("Error fetching media:", error)
        toast.error("Failed to load media")
        router.push("/admin/media")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMedia()
  }, [mediaId, router, supabase])

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Edit Media</h1>
          <div className="h-96 bg-zinc-900 animate-pulse rounded-lg"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!media) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Media Not Found</h1>
          <p className="text-zinc-400">The media item you're looking for doesn't exist.</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Edit Media</h1>
        <p className="text-zinc-400">Update the details of your media item.</p>

        <MediaForm media={media} isEdit />
      </div>
    </DashboardLayout>
  )
}
