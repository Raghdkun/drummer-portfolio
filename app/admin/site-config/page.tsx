"use client"

import DashboardLayout from "@/components/admin/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClientSupabaseClient } from "@/lib/supabase"
import type { Database } from "@/types/supabase"
import { useEffect, useState } from "react"
import { toast } from "sonner"

type SiteConfig = Database["public"]["Tables"]["site_config"]["Row"]

export default function SiteConfigPage() {
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const supabase = createClientSupabaseClient()

  useEffect(() => {
    const fetchSiteConfig = async () => {
      setIsLoading(true)
      try {
        const { data, error } = await supabase.from("site_config").select("*").limit(1).single()

        if (error) {
          throw error
        }

        setSiteConfig(data)
      } catch (error) {
        console.error("Error fetching site config:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSiteConfig()
  }, [supabase])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSiteConfig((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!siteConfig) return

    setIsSaving(true)
    try {
      const { error } = await supabase.from("site_config").upsert({
        ...siteConfig,
        updated_at: new Date().toISOString(),
      })

      if (error) {
        throw error
      }

      toast.success("Site configuration updated successfully")
    } catch (error) {
      console.error("Error updating site config:", error)
      toast.error("Failed to update site configuration")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Site Configuration</h1>
          <div className="h-96 bg-zinc-900 animate-pulse rounded-lg"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Site Configuration</h1>
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="site_title">Site Title</Label>
                    <Input
                      id="site_title"
                      name="site_title"
                      value={siteConfig?.site_title || ""}
                      onChange={handleChange}
                      placeholder="Site Title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="site_description">Site Description</Label>
                    <Textarea
                      id="site_description"
                      name="site_description"
                      value={siteConfig?.site_description || ""}
                      onChange={handleChange}
                      placeholder="Site Description"
                      rows={3}
                    />
                  </div>
                </div>

                <h2 className="text-xl font-semibold pt-4">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact_email">Contact Email</Label>
                    <Input
                      id="contact_email"
                      name="contact_email"
                      value={siteConfig?.contact_email || ""}
                      onChange={handleChange}
                      placeholder="contact@example.com"
                      type="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_phone">Contact Phone</Label>
                    <Input
                      id="contact_phone"
                      name="contact_phone"
                      value={siteConfig?.contact_phone || ""}
                      onChange={handleChange}
                      placeholder="+1 234 567 890"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
                    <Input
                      id="whatsapp_number"
                      name="whatsapp_number"
                      value={siteConfig?.whatsapp_number || ""}
                      onChange={handleChange}
                      placeholder="+1 234 567 890"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={siteConfig?.location || ""}
                      onChange={handleChange}
                      placeholder="City, Country"
                    />
                  </div>
                </div>

                <h2 className="text-xl font-semibold pt-4">Social Media</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="social_instagram">Instagram</Label>
                    <Input
                      id="social_instagram"
                      name="social_instagram"
                      value={siteConfig?.social_instagram || ""}
                      onChange={handleChange}
                      placeholder="https://instagram.com/username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="social_facebook">Facebook</Label>
                    <Input
                      id="social_facebook"
                      name="social_facebook"
                      value={siteConfig?.social_facebook || ""}
                      onChange={handleChange}
                      placeholder="https://facebook.com/username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="social_youtube">YouTube</Label>
                    <Input
                      id="social_youtube"
                      name="social_youtube"
                      value={siteConfig?.social_youtube || ""}
                      onChange={handleChange}
                      placeholder="https://youtube.com/channel"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}