"use client"

import DashboardLayout from "@/components/admin/dashboard-layout"
import EventForm from "@/components/admin/event-form"

export default function NewEventPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Add New Event</h1>
        <p className="text-zinc-400">Create a new event to display on your website.</p>

        <EventForm />
      </div>
    </DashboardLayout>
  )
}
