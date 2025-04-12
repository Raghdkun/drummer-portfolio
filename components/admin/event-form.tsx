"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClientSupabaseClient } from "@/lib/supabase"
import type { Database } from "@/types/supabase"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import EventHighlightsManager from "./event-highlights-manager"
import EventFAQManager from "./event-faq-manager"
import EventImagesManager from "./event-images-manager"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Event = Database["public"]["Tables"]["events"]["Row"]
type EventInsert = Database["public"]["Tables"]["events"]["Insert"]

interface EventFormProps {
  event?: Event
  isEdit?: boolean
}

export default function EventForm({ event, isEdit = false }: EventFormProps) {
  const initialData: EventInsert = event || {
    title: "",
    description: "",
    event_date: new Date().toISOString().split("T")[0],
    event_time: "",
    location: "",
    venue_name: "",
    image_url: "",
    is_featured: false,
    is_upcoming: true,
    ticket_url: "",
    event_type: "performance",
    duration: "",
    capacity: "",
    age_restriction: "",
    event_details: "",
    event_highlights: [],
    performer_notes: "",
    additional_images: [],
    faq: [],
  }

  const [formData, setFormData] = useState<EventInsert>(initialData)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
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

  const handleHighlightsChange = (highlights: string[]) => {
    setFormData((prev) => ({ ...prev, event_highlights: highlights }))
  }

  const handleFAQChange = (faq: any[]) => {
    setFormData((prev) => ({ ...prev, faq }))
  }

  const handleImagesChange = (images: string[]) => {
    setFormData((prev) => ({ ...prev, additional_images: images }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      if (isEdit && event) {
        // Update existing event
        const { error } = await supabase
          .from("events")
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", event.id)

        if (error) throw error
        toast.success("Event updated successfully")
      } else {
        // Create new event
        const { error } = await supabase.from("events").insert({
          ...formData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (error) throw error
        toast.success("Event created successfully")
      }

      router.push("/admin/events")
    } catch (error) {
      console.error("Error saving event:", error)
      toast.error(isEdit ? "Failed to update event" : "Failed to create event")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>{isEdit ? "Edit Event" : "Create New Event"}</CardTitle>
              <CardDescription>
                {isEdit ? "Update the details of your event" : "Add a new event to your website"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
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
                <Label htmlFor="description">Short Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  className="bg-zinc-800 border-zinc-700 min-h-[100px]"
                  placeholder="A brief description that will appear in event listings"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="event_date">Event Date</Label>
                  <Input
                    id="event_date"
                    name="event_date"
                    type="date"
                    value={formData.event_date}
                    onChange={handleChange}
                    className="bg-zinc-800 border-zinc-700"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event_time">Event Time</Label>
                  <Input
                    id="event_time"
                    name="event_time"
                    value={formData.event_time || ""}
                    onChange={handleChange}
                    className="bg-zinc-800 border-zinc-700"
                    placeholder="e.g. 7:00 PM"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="venue_name">Venue Name</Label>
                  <Input
                    id="venue_name"
                    name="venue_name"
                    value={formData.venue_name || ""}
                    onChange={handleChange}
                    className="bg-zinc-800 border-zinc-700"
                    placeholder="e.g. Damascus Opera House"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location || ""}
                    onChange={handleChange}
                    className="bg-zinc-800 border-zinc-700"
                    placeholder="e.g. Damascus, Syria"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Main Image URL</Label>
                <Input
                  id="image_url"
                  name="image_url"
                  value={formData.image_url || ""}
                  onChange={handleChange}
                  className="bg-zinc-800 border-zinc-700"
                  placeholder="https://example.com/event-image.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ticket_url">Ticket URL</Label>
                <Input
                  id="ticket_url"
                  name="ticket_url"
                  value={formData.ticket_url || ""}
                  onChange={handleChange}
                  className="bg-zinc-800 border-zinc-700"
                  placeholder="https://example.com/buy-tickets"
                />
              </div>

              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_upcoming"
                    checked={formData.is_upcoming}
                    onCheckedChange={(checked) => handleCheckboxChange("is_upcoming", checked as boolean)}
                  />
                  <Label htmlFor="is_upcoming" className="cursor-pointer">
                    This is an upcoming event
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => handleCheckboxChange("is_featured", checked as boolean)}
                  />
                  <Label htmlFor="is_featured" className="cursor-pointer">
                    Feature this event on the homepage
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
              <CardDescription>Add detailed information about your event</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="event_type">Event Type</Label>
                  <Select
                    value={formData.event_type || "performance"}
                    onValueChange={(value) => handleSelectChange("event_type", value)}
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700">
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="masterclass">Masterclass</SelectItem>
                      <SelectItem value="festival">Festival</SelectItem>
                      <SelectItem value="competition">Competition</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    name="duration"
                    value={formData.duration || ""}
                    onChange={handleChange}
                    className="bg-zinc-800 border-zinc-700"
                    placeholder="e.g. 2 hours"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    name="capacity"
                    value={formData.capacity || ""}
                    onChange={handleChange}
                    className="bg-zinc-800 border-zinc-700"
                    placeholder="e.g. 500 people"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="age_restriction">Age Restriction</Label>
                <Input
                  id="age_restriction"
                  name="age_restriction"
                  value={formData.age_restriction || ""}
                  onChange={handleChange}
                  className="bg-zinc-800 border-zinc-700"
                  placeholder="e.g. All ages, 18+, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="event_details">Detailed Description</Label>
                <Textarea
                  id="event_details"
                  name="event_details"
                  value={formData.event_details || ""}
                  onChange={handleChange}
                  className="bg-zinc-800 border-zinc-700 min-h-[200px]"
                  placeholder="Provide a detailed description of the event..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="performer_notes">Performer Notes</Label>
                <Textarea
                  id="performer_notes"
                  name="performer_notes"
                  value={formData.performer_notes || ""}
                  onChange={handleChange}
                  className="bg-zinc-800 border-zinc-700 min-h-[100px]"
                  placeholder="Additional information about the performer for this specific event..."
                />
              </div>

              <div className="space-y-2">
                <Label>Event Highlights</Label>
                <EventHighlightsManager
                  highlights={formData.event_highlights || []}
                  onChange={handleHighlightsChange}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Additional Media</CardTitle>
              <CardDescription>Add more images for the event gallery</CardDescription>
            </CardHeader>
            <CardContent>
              <EventImagesManager images={formData.additional_images || []} onChange={handleImagesChange} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="space-y-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Add FAQs to help attendees find information quickly</CardDescription>
            </CardHeader>
            <CardContent>
              <EventFAQManager faqs={formData.faq || []} onChange={handleFAQChange} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          className="border-zinc-700"
          onClick={() => router.push("/admin/events")}
        >
          Cancel
        </Button>
        <Button type="submit" className="bg-rose-500 hover:bg-rose-600" disabled={isSaving}>
          {isSaving ? "Saving..." : isEdit ? "Update Event" : "Create Event"}
        </Button>
      </div>
    </form>
  )
}
