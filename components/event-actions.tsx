"use client"

import { Button } from "@/components/ui/button"
import { Share2, CalendarPlus } from "lucide-react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

interface EventActionsProps {
  event: {
    id: string
    title: string
    description?: string
    event_date: string
    event_time?: string
    location?: string
    venue_name?: string
  }
  variant?: "primary" | "outline"
  showShare?: boolean
  showCalendar?: boolean
}

export default function EventActions({ 
  event, 
  variant = "primary", 
  showShare = true, 
  showCalendar = true 
}: EventActionsProps) {
  const router = useRouter()
  
  // Format date
  const formattedDate = format(new Date(event.event_date), "EEEE, MMMM d, yyyy")

  // Add to calendar URL (Google Calendar)
  const handleAddToCalendar = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
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
  const handleShareEvent = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://ameeralbarouky.com"}/events/${event.id}`
    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${event.title} at ${event.venue_name || event.location || ""} on ${formattedDate}`)}&url=${encodeURIComponent(shareUrl)}`

    window.open(twitterShareUrl, "_blank")
  }

  return (
    <div className="flex flex-wrap gap-3">
      {showCalendar && (
        <Button 
          variant={variant === "primary" ? "default" : "outline"} 
          className={variant === "primary" ? "bg-rose-500 hover:bg-rose-600" : "border-zinc-700"}
          onClick={handleAddToCalendar}
        >
          <CalendarPlus className="h-4 w-4 mr-2" />
          Add to Calendar
        </Button>
      )}
      
      {showShare && (
        <Button 
          variant="outline" 
          className="border-zinc-700"
          onClick={handleShareEvent}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share Event
        </Button>
      )}
    </div>
  )
}