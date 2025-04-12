import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, MapPin, ArrowLeft, Users, Share2, CalendarPlus } from "lucide-react"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"
import CustomCursor from "@/components/custom-cursor"
import CursorParticles from "@/components/cursor-particles"
import { Badge } from "@/components/ui/badge"
import EventActions from "@/components/event-actions"

export const metadata: Metadata = {
  title: "Events - Ameer Albarouky",
  description: "Upcoming and past performances by professional drummer Ameer Albarouky (Drummer 8amar).",
}

export const revalidate = 3600 // Revalidate every hour

export default async function EventsPage() {
  const supabase = createServerSupabaseClient()

  // Fetch upcoming events
  const { data: upcomingEvents = [] } = await supabase
    .from("events")
    .select("*")
    .eq("is_upcoming", true)
    .order("event_date", { ascending: true })
    .then((response) => response)
    .catch(() => ({ data: [] }))

  // Fetch past events
  const { data: pastEvents = [] } = await supabase
    .from("events")
    .select("*")
    .eq("is_upcoming", false)
    .order("event_date", { ascending: false })
    .then((response) => response)
    .catch(() => ({ data: [] }))

  // Fetch site config
  const { data: siteConfig } = await supabase
    .from("site_config")
    .select("*")
    .limit(1)
    .single()
    .then((response) => response)
    .catch(() => ({ data: null }))

  // Helper function to get event type badge color
  const getEventTypeColor = (type: string | null) => {
    if (!type) return "bg-zinc-500/10 text-zinc-400"

    switch (type) {
      case "performance":
        return "bg-blue-500/10 text-blue-400"
      case "workshop":
        return "bg-green-500/10 text-green-400"
      case "masterclass":
        return "bg-purple-500/10 text-purple-400"
      case "festival":
        return "bg-amber-500/10 text-amber-400"
      case "competition":
        return "bg-red-500/10 text-red-400"
      default:
        return "bg-zinc-500/10 text-zinc-400"
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-40 -left-20 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-40 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4">
          <div className="flex items-center mb-8">
            <Link href="/" className="inline-flex items-center text-zinc-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Upcoming <span className="text-rose-500">Events</span>
          </h1>
          <p className="text-zinc-300 text-lg max-w-2xl mb-12">
            Join Drummer 8amar at one of his upcoming performances or workshops and experience the passion and energy of
            one of Syria's most talented drummers.
          </p>

          {upcomingEvents.length > 0 ? (
            <div className="grid gap-8">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-zinc-800/30 border border-zinc-700/30 rounded-xl overflow-hidden hover:border-rose-500/30 transition-all duration-300"
                >
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="relative h-48 md:h-full">
                      <Image
                        src={event.image_url || "/placeholder.svg?height=300&width=400"}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                      {event.is_featured && (
                        <div className="absolute top-3 left-3 bg-rose-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                          Featured
                        </div>
                      )}
                      {event.event_type && (
                        <div className="absolute top-3 right-3">
                          <Badge className={getEventTypeColor(event.event_type)}>
                            {event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1)}
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="p-6 md:col-span-2 flex flex-col">
                      <h2 className="text-2xl font-bold mb-3">{event.title}</h2>

                      <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex items-center text-zinc-300">
                          <Calendar className="h-5 w-5 mr-2 text-rose-400" />
                          <span>{format(new Date(event.event_date), "MMMM d, yyyy")}</span>
                        </div>

                        {event.event_time && (
                          <div className="flex items-center text-zinc-300">
                            <Clock className="h-5 w-5 mr-2 text-rose-400" />
                            <span>{event.event_time}</span>
                          </div>
                        )}

                        {event.location && (
                          <div className="flex items-center text-zinc-300">
                            <MapPin className="h-5 w-5 mr-2 text-rose-400" />
                            <span>{event.location}</span>
                          </div>
                        )}

                        {event.capacity && (
                          <div className="flex items-center text-zinc-300">
                            <Users className="h-5 w-5 mr-2 text-rose-400" />
                            <span>{event.capacity}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-zinc-300 mb-6 flex-grow line-clamp-2">{event.description}</p>

                      <div className="flex flex-wrap gap-3 mt-auto">
                        <Link href={`/events/${event.id}`}>
                          <Button className="bg-rose-500 hover:bg-rose-600">View Details</Button>
                        </Link>

                        {event.ticket_url && (
                          <a href={event.ticket_url} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="border-zinc-700">
                              Get Tickets
                            </Button>
                          </a>
                        )}
                        
                        <EventActions event={event} variant="outline" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-zinc-800/30 border border-zinc-700/30 rounded-xl p-8 text-center">
              <Calendar className="h-12 w-12 mx-auto text-zinc-600 mb-4" />
              <h3 className="text-xl font-medium mb-2">No upcoming events</h3>
              <p className="text-zinc-400 mb-0">Check back soon for upcoming performances and workshops.</p>
            </div>
          )}
        </div>
      </section>

      {/* Past Events Section */}
      {pastEvents.length > 0 && (
        <section className="py-12 bg-zinc-900/50 relative">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">Past Performances</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <Link href={`/events/${event.id}`} key={event.id}>
                  <div className="bg-zinc-800/30 border border-zinc-700/30 rounded-xl overflow-hidden hover:border-rose-500/30 transition-all duration-300 h-full hover:-translate-y-1">
                    <div className="aspect-video relative">
                      <Image
                        src={event.image_url || "/placeholder.svg?height=300&width=500"}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                      {event.event_type && (
                        <div className="absolute top-3 right-3">
                          <Badge className={getEventTypeColor(event.event_type)}>
                            {event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1)}
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <h3 className="font-bold text-lg mb-2 line-clamp-1">{event.title}</h3>

                      <div className="flex items-center text-zinc-400 text-sm mb-3">
                        <Calendar className="h-4 w-4 mr-2 text-rose-400" />
                        <span>{format(new Date(event.event_date), "MMMM d, yyyy")}</span>
                      </div>

                      <p className="text-zinc-300 text-sm line-clamp-2">{event.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer siteConfig={siteConfig} />
      <CustomCursor />
      <CursorParticles />
    </main>
  )
}
