"use client"

import type React from "react"

import DashboardLayout from "@/components/admin/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClientSupabaseClient } from "@/lib/supabase"
import type { Database } from "@/types/supabase"
import { useEffect, useState } from "react"
import { toast } from "sonner"

type Profile = Database["public"]["Tables"]["profile"]["Row"]

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const supabase = createClientSupabaseClient()

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true)
      try {
        const { data, error } = await supabase.from("profile").select("*").limit(1).single()

        if (error) {
          throw error
        }

        setProfile(data)
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [supabase])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    setIsSaving(true)
    try {
      const { error } = await supabase.from("profile").upsert({
        ...profile,
        updated_at: new Date().toISOString(),
      })

      if (error) {
        throw error
      }

      toast.success("Profile updated successfully")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Profile</h1>
          <div className="h-96 bg-zinc-900 animate-pulse rounded-lg"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-zinc-400">Manage your personal and professional information.</p>

        <form onSubmit={handleSubmit}>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your name and biographical information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    value={profile?.full_name || ""}
                    onChange={handleChange}
                    className="bg-zinc-800 border-zinc-700"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stage_name">Stage Name</Label>
                  <Input
                    id="stage_name"
                    name="stage_name"
                    value={profile?.stage_name || ""}
                    onChange={handleChange}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="headline">Headline</Label>
                <Input
                  id="headline"
                  name="headline"
                  value={profile?.headline || ""}
                  onChange={handleChange}
                  className="bg-zinc-800 border-zinc-700"
                  placeholder="Professional Drummer & Percussionist"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio_short">Short Bio</Label>
                <Textarea
                  id="bio_short"
                  name="bio_short"
                  value={profile?.bio_short || ""}
                  onChange={handleChange}
                  className="bg-zinc-800 border-zinc-700 min-h-[100px]"
                  placeholder="A brief introduction (1-2 sentences)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio_full">Full Bio</Label>
                <Textarea
                  id="bio_full"
                  name="bio_full"
                  value={profile?.bio_full || ""}
                  onChange={handleChange}
                  className="bg-zinc-800 border-zinc-700 min-h-[200px]"
                  placeholder="Your complete biography"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="profile_image_url">Profile Image URL</Label>
                  <Input
                    id="profile_image_url"
                    name="profile_image_url"
                    value={profile?.profile_image_url || ""}
                    onChange={handleChange}
                    className="bg-zinc-800 border-zinc-700"
                    placeholder="https://example.com/profile.jpg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cover_image_url">Cover Image URL</Label>
                  <Input
                    id="cover_image_url"
                    name="cover_image_url"
                    value={profile?.cover_image_url || ""}
                    onChange={handleChange}
                    className="bg-zinc-800 border-zinc-700"
                    placeholder="https://example.com/cover.jpg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="years_experience">Years of Experience</Label>
                <Input
                  id="years_experience"
                  name="years_experience"
                  type="number"
                  value={profile?.years_experience || ""}
                  onChange={handleChange}
                  className="bg-zinc-800 border-zinc-700"
                  min="0"
                />
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 flex justify-end">
            <Button type="submit" className="bg-rose-500 hover:bg-rose-600" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
