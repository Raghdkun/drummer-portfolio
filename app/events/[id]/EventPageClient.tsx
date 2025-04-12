"use client"

import Image from "next/image"
import { Calendar, Clock, MapPin, ArrowLeft, Share2, CalendarPlus, Info, MessageSquare } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"
import CustomCursor from "@/components/custom-cursor"
import CursorParticles from "@/components/cursor-particles"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useRouter } from "next/navigation"

interface Event {
  id: string
  title: string
  description?: string
  image_url?: string
  event_date: string
  event_time?: string
  location?: string
  venue_name?: string
  duration?: string
  capacity?: number | string
  age_restriction?: string
  event_details?: string
  event_highlights?: string[]
  performer_notes?: string
  ticket_url?: string
  faq?: { question: string; answer: string }[]
  additional_images?: string[]
  is_featured?: boolean
}

interface SiteConfig {
  site_name?: string
  description?: string
  logo_url?: string
  twitter_url?: string
  instagram_url?: string
}

interface RelatedEvent {
  id: string
  title: string
  description?: string
  image_url?: string
  event_date: string
}

interface EventPageClientProps {
  event: Event
  siteConfig: SiteConfig
  relatedEvents: RelatedEvent[]
}

export default function EventPageClient({ event, siteConfig, relatedEvents }: EventPageClientProps) {
  const router = useRouter()

  // Format date
  const formattedDate = format(new Date(event.event_date), "EEEE, MMMM d, yyyy")

  // Add to calendar URL (Google Calendar)
  const handleAddToCalendar = () => {
    const startDate = format(new Date(event.event_date), "yyyyMMdd")
    let startTime = ""
    if (event.event_time) {
      // Convert event_time (like "7:00 PM") to 24-hour format for Google Calendar
      const timeParts = event.event_time.match(/(\d+):(\d+)\s?(AM|PM)?/i)
      if (timeParts) {
        let hours = Number.parseInt(timeParts[1])
        const minutes = timeParts[2]
        const period = timeParts[3]

        if (period && period.toUpperCase() === "PM" && hours < 12) {
          hours += 12
        } else if (period && period.toUpperCase() === "AM" && hours === 12) {
          hours = 0
        }

        startTime = `T${hours.toString().padStart(2, "0")}${minutes}00`
      }
    }

    const endDate = startDate
    const endTime = startTime

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate}${startTime || "T000000"}/${endDate}${endTime || "T235959"}&details=${encodeURIComponent(event.description || "")}&location=${encodeURIComponent(event.location || "")}`

    window.open(calendarUrl, "_blank")
  }

  // Share function (Twitter sharing)
  const handleShareEvent = () => {
    const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://ameeralbarouky.com"}/events/${event.id}`
    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${event.title} at ${event.venue_name || event.location || ""} on ${formattedDate}`)}&url=${encodeURIComponent(shareUrl)}`

    window.open(twitterShareUrl, "_blank")
  }

  // Map URL
  const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(event.venue_name ? `${event.venue_name}, ${event.location}` : event.location || "")}`

  // Process event highlights
  const highlights = Array.isArray(event.event_highlights) ? event.event_highlights : []

  // Process FAQs
  const faqs = Array.isArray(event.faq) ? event.faq : []

  // Process additional images
  const additionalImages = Array.isArray(event.additional_images) ? event.additional_images : []

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 relative">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-40 -left-20 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-40 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4">
       

          <div className="grid md:grid-cols-2 gap-8">
            <div className="order-2 md:order-1">
              <div className="flex flex-col h-full justify-center">
                {event.is_featured && (
                  <div className="inline-block px-3 py-1 bg-rose-500/20 border border-rose-500/40 rounded-full text-rose-400 font-medium text-xs mb-4">
                    Featured Event
                  </div>
                )}

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{event.title}</h1>

                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center text-zinc-300">
                    <Calendar className="h-5 w-5 mr-2 text-rose-400" />
                    <span>{formattedDate}</span>
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
                </div>

                <p className="text-zinc-300 mb-8">{event.description}</p>

                <div className="flex flex-wrap gap-3">
                  {event.ticket_url && (
                    <a href={event.ticket_url} target="_blank" rel="noopener noreferrer">
                      <Button className="bg-rose-500 hover:bg-rose-600">Get Tickets</Button>
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <div className="relative rounded-2xl overflow-hidden border-2 border-zinc-800 shadow-2xl">
                <div className="aspect-video w-full relative">
                  <Image
                    src={event.image_url || "/placeholder.svg?height=600&width=900"}
                    alt={event.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Details Section */}
      <section className="py-12 bg-zinc-900/50 relative">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Venue Information */}
            <div className="bg-zinc-800/30 border border-zinc-700/30 rounded-xl p-6 hover:border-rose-500/30 transition-colors duration-300">
              <h2 className="text-xl font-bold mb-4">Venue Information</h2>
              <div className="space-y-4">
                {event.venue_name && (
                  <div>
                    <h3 className="text-sm font-medium text-zinc-400">Venue</h3>
                    <p className="text-lg font-medium">{event.venue_name}</p>
                  </div>
                )}

                {event.location && (
                  <div>
                    <h3 className="text-sm font-medium text-zinc-400">Location</h3>
                    <p className="text-lg font-medium">{event.location}</p>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-zinc-400">Date & Time</h3>
                  <p className="text-lg font-medium">{formattedDate}</p>
                  {event.event_time && <p className="text-lg font-medium">{event.event_time}</p>}
                </div>

                {event.duration && (
                  <div>
                    <h3 className="text-sm font-medium text-zinc-400">Duration</h3>
                    <p className="text-lg font-medium">{event.duration}</p>
                  </div>
                )}

                {event.capacity && (
                  <div>
                    <h3 className="text-sm font-medium text-zinc-400">Capacity</h3>
                    <p className="text-lg font-medium">{event.capacity}</p>
                  </div>
                )}

                {event.age_restriction && (
                  <div>
                    <h3 className="text-sm font-medium text-zinc-400">Age Restriction</h3>
                    <p className="text-lg font-medium">{event.age_restriction}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-3">
                {event.location && (
                  <Button
                    variant="outline"
                    className="w-full border-zinc-700"
                    onClick={() => window.open(mapUrl, "_blank")}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    View on Map
                  </Button>
                )}
                
                <Button variant="outline" className="w-full border-zinc-700" onClick={handleAddToCalendar}>
                  <CalendarPlus className="h-4 w-4 mr-2" />
                  Add to Calendar
                </Button>

                <Button variant="outline" className="w-full border-zinc-700" onClick={handleShareEvent}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Event
                </Button>
              </div>
            </div>

            {/* Event Details */}
            <div className="md:col-span-2 bg-zinc-800/30 border border-zinc-700/30 rounded-xl p-6 hover:border-rose-500/30 transition-colors duration-300">
              <h2 className="text-xl font-bold mb-4">Event Details</h2>
              <div className="prose prose-invert max-w-none">
                {event.event_details ? (
                  <div className="whitespace-pre-line text-zinc-300">{event.event_details}</div>
                ) : (
                  <p className="text-zinc-300">
                    Join Ameer Albarouky, known professionally as Drummer 8amar (قمر), for an extraordinary live
                    performance showcasing his mastery of rhythm and percussion.
                  </p>
                )}

                {/* Event Highlights */}
                {highlights.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-bold mb-3 flex items-center">
                      <Info className="h-5 w-5 mr-2 text-rose-400" />
                      Event Highlights
                    </h3>
                    <ul className="space-y-2">
                      {highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-rose-400 mr-2">•</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Performer Notes */}
                {event.performer_notes && (
                  <div className="mt-8 bg-zinc-800/50 border border-zinc-700/30 rounded-lg p-4">
                    <h3 className="text-lg font-bold mb-3 flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2 text-rose-400" />
                      About the Performer
                    </h3>
                    <div className="text-zinc-300 whitespace-pre-line">{event.performer_notes}</div>
                  </div>
                )}

                {event.ticket_url && (
                  <div className="mt-6">
                    <a href={event.ticket_url} target="_blank" rel="noopener noreferrer" className="inline-block">
                      <Button className="bg-rose-500 hover:bg-rose-600">Get Tickets Now</Button>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Images Section */}
      {additionalImages.length > 0 && (
        <section className="py-12 relative">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Event Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {additionalImages.map((imageUrl, index) => (
                <div key={index} className="relative aspect-video rounded-lg overflow-hidden border border-zinc-800">
                  <Image
                    src={imageUrl || "/placeholder.svg?height=400&width=600"}
                    alt={`${event.title} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <section className="py-12 bg-zinc-900/50 relative">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-zinc-800 hover:border-zinc-700">
                  <AccordionTrigger className="text-left font-medium py-4">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-zinc-300 pb-4">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      {/* Related Events Section */}
      {relatedEvents.length > 0 && (
        <section className="py-12 relative">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">Other Upcoming Events</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedEvents.map((relatedEvent) => (
                <div
                  key={relatedEvent.id}
                  className="bg-zinc-800/30 border border-zinc-700/30 rounded-xl overflow-hidden hover:border-rose-500/30 transition-all duration-300 h-full hover:-translate-y-1 cursor-pointer"
                  onClick={() => router.push(`/events/${relatedEvent.id}`)}
                >
                  <div className="aspect-video relative">
                    <Image
                      src={relatedEvent.image_url || "/placeholder.svg?height=300&width=500"}
                      alt={relatedEvent.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2 line-clamp-1">{relatedEvent.title}</h3>

                    <div className="flex items-center text-zinc-400 text-sm mb-3">
                      <Calendar className="h-4 w-4 mr-2 text-rose-400" />
                      <span>{format(new Date(relatedEvent.event_date), "MMMM d, yyyy")}</span>
                    </div>

                    <p className="text-zinc-300 text-sm line-clamp-2">{relatedEvent.description}</p>
                  </div>
                </div>
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
