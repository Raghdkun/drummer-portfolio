"use client"

import DashboardLayout from "@/components/admin/dashboard-layout"
import EventForm from "@/components/admin/event-form"
import { createClientSupabaseClient } from "@/lib/supabase"
import type { Database } from "@/types/supabase"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

type Event = Database["public"]["Tables"]["events"]["Row"]

export default function EditEventPage() {
  const [event, setEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const params = useParams()
  const router = useRouter()
  const eventId = params.id as string
  const supabase = createClientSupabaseClient()

  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true)
      try {
        const { data, error } = await supabase.from("events").select("*").eq("id", eventId).single()

        if (error) {
          throw error
        }

        setEvent(data)
      } catch (error) {
        console.error("Error fetching event:", error)
        toast.error("Failed to load event")
        router.push("/admin/events")
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvent()
  }, [eventId, router, supabase])

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Edit Event</h1>
          <div className="h-96 bg-zinc-900 animate-pulse rounded-lg"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!event) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Event Not Found</h1>
          <p className="text-zinc-400">The event you're looking for doesn't exist.</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Edit Event</h1>
        <p className="text-zinc-400">Update the details of your event.</p>

        <EventForm event={event} isEdit />
      </div>
    </DashboardLayout>
  )
}
