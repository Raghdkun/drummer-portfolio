"use client"

import DashboardLayout from "@/components/admin/dashboard-layout"
import MediaForm from "@/components/admin/media-form"

export default function NewMediaPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Add New Media</h1>
        <p className="text-zinc-400">Upload a new image or video to your website.</p>

        <MediaForm />
      </div>
    </DashboardLayout>
  )
}
