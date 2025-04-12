import type { Metadata } from "next"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import EventPageClient from "./EventPageClient"

export const revalidate = 3600 // Revalidate every hour

type Props = {
  params: { id: string }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createServerSupabaseClient()
  
  try {
    const { data: event } = await supabase
      .from("events")
      .select("*")
      .eq("id", params.id)
      .single()
    
    if (!event) {
      return {
        title: "Event Not Found - Ameer Albarouky",
        description: "The event you are looking for does not exist.",
      }
    }

    return {
      title: `${event.title} - Ameer Albarouky`,
      description: event.description || "Join Drummer 8amar for an unforgettable performance.",
      openGraph: {
        images: [event.image_url || "/placeholder.svg?height=600&width=1200"],
      }
    }
  } catch (error) {
    return {
      title: "Event Not Found - Ameer Albarouky",
      description: "The event you are looking for does not exist.",
    }
  }
}

export default async function EventPage({ params }: Props) {
  const supabase = createServerSupabaseClient()
  
  try {
    // Fetch event details
    const { data: event } = await supabase
      .from("events")
      .select("*")
      .eq("id", params.id)
      .single()
    
    if (!event) {
      notFound()
    }

    // Fetch site config
    const { data: siteConfig } = await supabase
      .from("site_config")
      .select("*")
      .limit(1)
      .single()

    // Fetch related events (upcoming)
    const { data: relatedEvents = [] } = await supabase
      .from("events")
      .select("*")
      .eq("is_upcoming", true)
      .neq("id", event.id)
      .order("event_date", { ascending: true })
      .limit(3)

    return <EventPageClient event={event} siteConfig={siteConfig} relatedEvents={relatedEvents} />
  } catch (error) {
    notFound()
  }
}
