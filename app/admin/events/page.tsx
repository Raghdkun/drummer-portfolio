"use client"

import DashboardLayout from "@/components/admin/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { createClientSupabaseClient } from "@/lib/supabase"
import type { Database } from "@/types/supabase"
import { Calendar, Edit, Plus, Trash2, Clock, MapPin, Users, ExternalLink, Info } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { format } from "date-fns"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type Event = Database["public"]["Tables"]["events"]["Row"]

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const supabase = createClientSupabaseClient()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.from("events").select("*").order("event_date", { ascending: false })

      if (error) {
        throw error
      }

      setEvents(data || [])
      setFilteredEvents(data || [])
    } catch (error) {
      console.error("Error fetching events:", error)
      toast.error("Failed to load events")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Filter events based on active tab and search query
    let filtered = [...events]

    // Apply tab filter
    if (activeTab === "upcoming") {
      filtered = filtered.filter((event) => event.is_upcoming)
    } else if (activeTab === "past") {
      filtered = filtered.filter((event) => !event.is_upcoming)
    } else if (activeTab === "featured") {
      filtered = filtered.filter((event) => event.is_featured)
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          (event.description && event.description.toLowerCase().includes(query)) ||
          (event.location && event.location.toLowerCase().includes(query)) ||
          (event.venue_name && event.venue_name.toLowerCase().includes(query)),
      )
    }

    setFilteredEvents(filtered)
  }, [events, activeTab, searchQuery])

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) {
      return
    }

    try {
      const { error } = await supabase.from("events").delete().eq("id", id)

      if (error) {
        throw error
      }

      setEvents((prev) => prev.filter((event) => event.id !== id))
      toast.success("Event deleted successfully")
    } catch (error) {
      console.error("Error deleting event:", error)
      toast.error("Failed to delete event")
    }
  }

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

  // Generate map URL
  const getMapUrl = (event: Event) => {
    return `https://maps.google.com/?q=${encodeURIComponent(
      event.venue_name ? `${event.venue_name}, ${event.location}` : event.location || "",
    )}`
  }

  // Count additional content
  const getAdditionalContentCount = (event: Event) => {
    let count = 0
    if (event.event_highlights && Array.isArray(event.event_highlights) && event.event_highlights.length > 0) count++
    if (event.faq && Array.isArray(event.faq) && event.faq.length > 0) count++
    if (event.additional_images && Array.isArray(event.additional_images) && event.additional_images.length > 0) count++
    if (event.performer_notes) count++
    if (event.event_details) count++
    return count
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Events</h1>
          <Link href="/admin/events/new">
            <Button className="bg-rose-500 hover:bg-rose-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </Link>
        </div>
        <p className="text-zinc-400">Manage your upcoming and past events.</p>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList className="grid grid-cols-4 w-full md:w-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="w-full md:w-64">
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-zinc-900 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-zinc-600 mb-4" />
                <h3 className="text-xl font-medium mb-2">No events found</h3>
                <p className="text-zinc-400 mb-6">
                  {searchQuery
                    ? "No events match your search criteria."
                    : activeTab === "all"
                      ? "You haven't added any events yet. Add your first event to get started."
                      : `No ${activeTab} events found.`}
                </p>
                <Link href="/admin/events/new">
                  <Button className="bg-rose-500 hover:bg-rose-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Event
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-[200px_1fr] lg:grid-cols-[250px_1fr]">
                    <div className="bg-zinc-800 p-6 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r border-zinc-700">
                      <div className="text-3xl font-bold mb-1">{format(new Date(event.event_date), "d")}</div>
                      <div className="text-xl text-zinc-400 mb-3">{format(new Date(event.event_date), "MMM yyyy")}</div>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {event.is_upcoming && (
                          <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30">Upcoming</Badge>
                        )}
                        {event.is_featured && (
                          <Badge className="bg-rose-500/20 text-rose-400 hover:bg-rose-500/30">Featured</Badge>
                        )}
                        {event.event_type && (
                          <Badge className={getEventTypeColor(event.event_type)}>
                            {event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1)}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <h3 className="text-xl font-bold">{event.title}</h3>
                        <div className="flex space-x-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <a href={`/events/${event.id}`} target="_blank" rel="noopener noreferrer">
                                  <Button variant="outline" size="sm" className="border-zinc-700">
                                    <ExternalLink className="h-4 w-4" />
                                  </Button>
                                </a>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View public event page</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <Link href={`/admin/events/edit/${event.id}`}>
                            <Button variant="outline" size="sm" className="border-zinc-700">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-zinc-700 hover:bg-red-500/10 hover:text-red-400 hover:border-red-400"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>

                      <p className="text-zinc-400 mb-4 line-clamp-2">{event.description}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        {event.event_time && (
                          <div className="flex items-center text-zinc-300">
                            <Clock className="h-4 w-4 mr-2 text-zinc-500" />
                            <span>{event.event_time}</span>
                          </div>
                        )}

                        {event.location && (
                          <div className="flex items-center text-zinc-300">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <a
                                    href={getMapUrl(event)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center hover:text-rose-400 transition-colors"
                                  >
                                    <MapPin className="h-4 w-4 mr-2 text-zinc-500" />
                                    <span>{event.location}</span>
                                  </a>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>View on Google Maps</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        )}

                        {event.duration && (
                          <div className="flex items-center text-zinc-300">
                            <Clock className="h-4 w-4 mr-2 text-zinc-500" />
                            <span>{event.duration}</span>
                          </div>
                        )}

                        {event.capacity && (
                          <div className="flex items-center text-zinc-300">
                            <Users className="h-4 w-4 mr-2 text-zinc-500" />
                            <span>{event.capacity}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {getAdditionalContentCount(event) > 0 && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center">
                                  <Badge variant="outline" className="border-zinc-700 bg-zinc-800">
                                    <Info className="h-3 w-3 mr-1" />
                                    {getAdditionalContentCount(event)} additional sections
                                  </Badge>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="text-sm">
                                  {event.event_highlights &&
                                    Array.isArray(event.event_highlights) &&
                                    event.event_highlights.length > 0 && (
                                      <div>• {event.event_highlights.length} highlights</div>
                                    )}
                                  {event.faq && Array.isArray(event.faq) && event.faq.length > 0 && (
                                    <div>• {event.faq.length} FAQs</div>
                                  )}
                                  {event.additional_images &&
                                    Array.isArray(event.additional_images) &&
                                    event.additional_images.length > 0 && (
                                      <div>• {event.additional_images.length} images</div>
                                    )}
                                  {event.performer_notes && <div>• Performer notes</div>}
                                  {event.event_details && <div>• Detailed description</div>}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}

                        {event.ticket_url && (
                          <a href={event.ticket_url} target="_blank" rel="noopener noreferrer">
                            <Badge variant="outline" className="border-zinc-700 bg-zinc-800 hover:bg-zinc-700">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Ticket Link
                            </Badge>
                          </a>
                        )}

                        {event.age_restriction && (
                          <Badge variant="outline" className="border-zinc-700 bg-zinc-800">
                            {event.age_restriction}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
