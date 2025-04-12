"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Clock, ArrowRight, ArrowLeft, Users } from "lucide-react"
import type { Database } from "@/types/supabase"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"

type Event = Database["public"]["Tables"]["events"]["Row"]

interface EventsProps {
  upcomingEvents?: Event[]
  pastEvents?: Event[]
}

export default function Events({ upcomingEvents = [], pastEvents = [] }: EventsProps) {
  const router = useRouter()
  const sectionRef = useRef<HTMLDivElement>(null)
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100", "translate-y-0")
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  // If no upcoming events, use fallback data
  const events =
    upcomingEvents.length > 0
      ? upcomingEvents
      : [
          {
            id: "1",
            title: "Rhythm & Soul Festival",
            description:
              "Join Drummer 8amar for an unforgettable night of rhythm and percussion at the annual Rhythm & Soul Festival.",
            event_date: new Date().toISOString(),
            event_time: "8:00 PM",
            location: "Damascus Opera House, Syria",
            venue_name: "Damascus Opera House",
            image_url: "/placeholder.svg?height=400&width=600",
            is_featured: true,
            is_upcoming: true,
            ticket_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            category_id: null,
            event_details: null,
            event_highlights: null,
            performer_notes: null,
            additional_images: null,
            faq: null,
            event_type: "performance",
            capacity: null,
            age_restriction: null,
            duration: null,
          },
          {
            id: "2",
            title: "Middle Eastern Beats Workshop",
            description:
              "Learn the fundamentals of Middle Eastern percussion in this hands-on workshop led by Ameer Albarouky.",
            event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            event_time: "4:00 PM",
            location: "Music Academy, Aleppo",
            venue_name: "Music Academy",
            image_url: "/placeholder.svg?height=400&width=600",
            is_featured: false,
            is_upcoming: true,
            ticket_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            category_id: null,
            event_details: null,
            event_highlights: null,
            performer_notes: null,
            additional_images: null,
            faq: null,
            event_type: "workshop",
            capacity: null,
            age_restriction: null,
            duration: null,
          },
          {
            id: "3",
            title: "Summer Concert Series",
            description:
              "Experience the magic of live drumming against the backdrop of the historic Citadel of Damascus.",
            event_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            event_time: "7:30 PM",
            location: "Citadel of Damascus, Syria",
            venue_name: "Citadel of Damascus",
            image_url: "/placeholder.svg?height=400&width=600",
            is_featured: false,
            is_upcoming: true,
            ticket_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            category_id: null,
            event_details: null,
            event_highlights: null,
            performer_notes: null,
            additional_images: null,
            faq: null,
            event_type: "performance",
            capacity: null,
            age_restriction: null,
            duration: null,
          },
        ]

  const nextSlide = () => {
    setActiveSlide((prev) => (prev === events.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? events.length - 1 : prev - 1))
  }

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

  const handleNavigateToEvent = (eventId: string) => {
    router.push(`/events/${eventId}`)
  }

  return (
    <section id="events" className="py-20 relative bg-zinc-900/50 cursor-hover-area">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-40 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div
        ref={sectionRef}
        className="container mx-auto px-4 opacity-0 translate-y-10 transition-all duration-1000 ease-out"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Upcoming <span className="text-rose-500">Events</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Catch Drummer 8amar live in action at these upcoming performances and workshops
          </p>
        </div>

        <div className="relative">
          {/* Featured Event Slider */}
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              {events.map((event) => (
                <div key={event.id} className="w-full flex-shrink-0">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="relative cursor-hover-area">
                      <Image
                        src={event.image_url || "/placeholder.svg?height=400&width=600"}
                        alt={event.title}
                        width={600}
                        height={400}
                        className="w-full h-[300px] md:h-[400px] object-cover rounded-xl"
                      />
                      <div className="absolute top-4 left-4 bg-rose-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </div>
                      {event.event_type && (
                        <div className="absolute top-4 right-4">
                          <Badge className={getEventTypeColor(event.event_type)}>
                            {event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1)}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center space-y-6">
                      <h3 className="text-2xl md:text-3xl font-bold">{event.title}</h3>
                      <p className="text-zinc-300">{event.description}</p>
                      <div className="space-y-3">
                        <div className="flex items-center text-zinc-300">
                          <Calendar className="h-5 w-5 mr-3 text-rose-400" />
                          <span>{format(new Date(event.event_date), "MMMM d, yyyy")}</span>
                        </div>
                        {event.event_time && (
                          <div className="flex items-center text-zinc-300">
                            <Clock className="h-5 w-5 mr-3 text-rose-400" />
                            <span>{event.event_time}</span>
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center text-zinc-300">
                            <MapPin className="h-5 w-5 mr-3 text-rose-400" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        {event.capacity && (
                          <div className="flex items-center text-zinc-300">
                            <Users className="h-5 w-5 mr-3 text-rose-400" />
                            <span>{event.capacity}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <Button
                          className="bg-rose-500 hover:bg-rose-600 text-white cursor-hover-area"
                          onClick={() => handleNavigateToEvent(event.id)}
                        >
                          Learn More
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        {event.ticket_url && (
                          <a href={event.ticket_url} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="border-zinc-700 hover:bg-zinc-800 cursor-hover-area">
                              Get Tickets
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slider Controls */}
          <div className="flex justify-center mt-8 gap-4">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-zinc-700 text-white hover:bg-zinc-800 cursor-hover-area"
              onClick={prevSlide}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex gap-2">
              {events.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors cursor-hover-area ${
                    index === activeSlide ? "bg-rose-500" : "bg-zinc-700"
                  }`}
                  onClick={() => setActiveSlide(index)}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-zinc-700 text-white hover:bg-zinc-800 cursor-hover-area"
              onClick={nextSlide}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Past Events Gallery */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold mb-8">Past Performances</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(pastEvents.length > 0
              ? pastEvents
              : [1, 2, 3, 4].map((num) => ({
                  id: num.toString(),
                  title: `Performance at Damascus Music Festival 202${num}`,
                  image_url: `/placeholder.svg?height=300&width=300`,
                  event_date: new Date().toISOString(),
                  description: null,
                  event_time: null,
                  location: null,
                  venue_name: null,
                  is_featured: false,
                  is_upcoming: false,
                  ticket_url: null,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                  category_id: null,
                  event_details: null,
                  event_highlights: null,
                  performer_notes: null,
                  additional_images: null,
                  faq: null,
                  event_type: null,
                  capacity: null,
                  age_restriction: null,
                  duration: null,
                }))
            ).map((event) => (
              <div
                key={event.id}
                className="group relative overflow-hidden rounded-lg aspect-square cursor-hover-area"
                onClick={() => handleNavigateToEvent(event.id)}
              >
                <Image
                  src={event.image_url || `/placeholder.svg?height=300&width=300`}
                  alt={event.title}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white font-medium">{event.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
