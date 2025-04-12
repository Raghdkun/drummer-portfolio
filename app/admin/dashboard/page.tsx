"use client"

import DashboardLayout from "@/components/admin/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClientSupabaseClient } from "@/lib/supabase"
import { Calendar, ImageIcon, MessageSquare, User } from "lucide-react"
import { useEffect, useState } from "react"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    events: 0,
    media: 0,
    messages: 0,
    testimonials: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientSupabaseClient()

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true)
      try {
        // Get counts from different tables
        const [eventsResponse, mediaResponse, messagesResponse, testimonialsResponse] = await Promise.all([
          supabase.from("events").select("id", { count: "exact", head: true }),
          supabase.from("media").select("id", { count: "exact", head: true }),
          supabase.from("contact_submissions").select("id", { count: "exact", head: true }),
          supabase.from("testimonials").select("id", { count: "exact", head: true }),
        ])

        setStats({
          events: eventsResponse.count || 0,
          media: mediaResponse.count || 0,
          messages: messagesResponse.count || 0,
          testimonials: testimonialsResponse.count || 0,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [supabase])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-zinc-400">Welcome to your content management system.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-zinc-400 text-sm font-normal">Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-rose-500 mr-4" />
                <div className="text-3xl font-bold">
                  {isLoading ? <div className="h-8 w-16 bg-zinc-800 animate-pulse rounded"></div> : stats.events}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-zinc-400 text-sm font-normal">Media Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <ImageIcon className="h-8 w-8 text-rose-500 mr-4" />
                <div className="text-3xl font-bold">
                  {isLoading ? <div className="h-8 w-16 bg-zinc-800 animate-pulse rounded"></div> : stats.media}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-zinc-400 text-sm font-normal">Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-rose-500 mr-4" />
                <div className="text-3xl font-bold">
                  {isLoading ? <div className="h-8 w-16 bg-zinc-800 animate-pulse rounded"></div> : stats.messages}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-zinc-400 text-sm font-normal">Testimonials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <User className="h-8 w-8 text-rose-500 mr-4" />
                <div className="text-3xl font-bold">
                  {isLoading ? <div className="h-8 w-16 bg-zinc-800 animate-pulse rounded"></div> : stats.testimonials}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Recent Events</CardTitle>
              <CardDescription>Latest events added to your website</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-zinc-800 animate-pulse rounded"></div>
                  ))}
                </div>
              ) : (
                <div className="text-zinc-400">
                  {stats.events === 0 ? (
                    <p>No events found. Add your first event from the Events section.</p>
                  ) : (
                    <p>Your events will appear here.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
              <CardDescription>Latest contact form submissions</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-zinc-800 animate-pulse rounded"></div>
                  ))}
                </div>
              ) : (
                <div className="text-zinc-400">
                  {stats.messages === 0 ? (
                    <p>No messages found. Messages from your contact form will appear here.</p>
                  ) : (
                    <p>Your messages will appear here.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
