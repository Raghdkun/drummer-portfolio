"use client"

import DashboardLayout from "@/components/admin/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { toast } from "sonner"
import {
  seedProfile,
  seedSiteConfig,
  seedSpecialties,
  seedInstruments,
  seedStats,
  seedEvents,
  seedMedia,
} from "../actions"

export default function SeedPage() {
  const [isSeeding, setIsSeeding] = useState(false)
  const [seedStatus, setSeedStatus] = useState<Record<string, boolean | null>>({
    profile: null,
    siteConfig: null,
    specialties: null,
    instruments: null,
    stats: null,
    events: null,
    media: null,
  })

  const handleSeedProfile = async () => {
    try {
      setSeedStatus((prev) => ({ ...prev, profile: false }))
      const result = await seedProfile()
      setSeedStatus((prev) => ({ ...prev, profile: result.success }))
      if (result.success) {
        toast.success("Profile seeded successfully")
      } else {
        toast.error(`Failed to seed profile: ${result.error}`)
      }
    } catch (error) {
      console.error("Error in handleSeedProfile:", error)
      setSeedStatus((prev) => ({ ...prev, profile: false }))
      toast.error("An unexpected error occurred while seeding profile")
    }
  }

  const handleSeedSiteConfig = async () => {
    try {
      setSeedStatus((prev) => ({ ...prev, siteConfig: false }))
      const result = await seedSiteConfig()
      setSeedStatus((prev) => ({ ...prev, siteConfig: result.success }))
      if (result.success) {
        toast.success("Site config seeded successfully")
      } else {
        toast.error(`Failed to seed site config: ${result.error}`)
      }
    } catch (error) {
      console.error("Error in handleSeedSiteConfig:", error)
      setSeedStatus((prev) => ({ ...prev, siteConfig: false }))
      toast.error("An unexpected error occurred while seeding site config")
    }
  }

  const handleSeedSpecialties = async () => {
    try {
      setSeedStatus((prev) => ({ ...prev, specialties: false }))
      const result = await seedSpecialties()
      setSeedStatus((prev) => ({ ...prev, specialties: result.success }))
      if (result.success) {
        toast.success("Specialties seeded successfully")
      } else {
        toast.error(`Failed to seed specialties: ${result.error}`)
      }
    } catch (error) {
      console.error("Error in handleSeedSpecialties:", error)
      setSeedStatus((prev) => ({ ...prev, specialties: false }))
      toast.error("An unexpected error occurred while seeding specialties")
    }
  }

  const handleSeedInstruments = async () => {
    try {
      setSeedStatus((prev) => ({ ...prev, instruments: false }))
      const result = await seedInstruments()
      setSeedStatus((prev) => ({ ...prev, instruments: result.success }))
      if (result.success) {
        toast.success("Instruments seeded successfully")
      } else {
        toast.error(`Failed to seed instruments: ${result.error}`)
      }
    } catch (error) {
      console.error("Error in handleSeedInstruments:", error)
      setSeedStatus((prev) => ({ ...prev, instruments: false }))
      toast.error("An unexpected error occurred while seeding instruments")
    }
  }

  const handleSeedStats = async () => {
    try {
      setSeedStatus((prev) => ({ ...prev, stats: false }))
      const result = await seedStats()
      setSeedStatus((prev) => ({ ...prev, stats: result.success }))
      if (result.success) {
        toast.success("Stats seeded successfully")
      } else {
        toast.error(`Failed to seed stats: ${result.error}`)
      }
    } catch (error) {
      console.error("Error in handleSeedStats:", error)
      setSeedStatus((prev) => ({ ...prev, stats: false }))
      toast.error("An unexpected error occurred while seeding stats")
    }
  }

  const handleSeedEvents = async () => {
    try {
      setSeedStatus((prev) => ({ ...prev, events: false }))
      const result = await seedEvents()
      setSeedStatus((prev) => ({ ...prev, events: result.success }))
      if (result.success) {
        toast.success("Events seeded successfully")
      } else {
        toast.error(`Failed to seed events: ${result.error}`)
      }
    } catch (error) {
      console.error("Error in handleSeedEvents:", error)
      setSeedStatus((prev) => ({ ...prev, events: false }))
      toast.error("An unexpected error occurred while seeding events")
    }
  }

  const handleSeedMedia = async () => {
    try {
      setSeedStatus((prev) => ({ ...prev, media: false }))
      const result = await seedMedia()
      setSeedStatus((prev) => ({ ...prev, media: result.success }))
      if (result.success) {
        toast.success("Media seeded successfully")
      } else {
        toast.error(`Failed to seed media: ${result.error}`)
      }
    } catch (error) {
      console.error("Error in handleSeedMedia:", error)
      setSeedStatus((prev) => ({ ...prev, media: false }))
      toast.error("An unexpected error occurred while seeding media")
    }
  }

  const handleSeedAll = async () => {
    setIsSeeding(true)
    setSeedStatus({
      profile: false,
      siteConfig: false,
      specialties: false,
      instruments: false,
      stats: false,
      events: false,
      media: false,
    })

    try {
      // Execute each seed function sequentially with proper error handling
      const profileResult = await seedProfile().catch((err) => {
        console.error("Error seeding profile:", err)
        return { success: false }
      })

      setSeedStatus((prev) => ({ ...prev, profile: profileResult.success }))

      const siteConfigResult = await seedSiteConfig().catch((err) => {
        console.error("Error seeding site config:", err)
        return { success: false }
      })

      setSeedStatus((prev) => ({ ...prev, siteConfig: siteConfigResult.success }))

      const specialtiesResult = await seedSpecialties().catch((err) => {
        console.error("Error seeding specialties:", err)
        return { success: false }
      })

      setSeedStatus((prev) => ({ ...prev, specialties: specialtiesResult.success }))

      const instrumentsResult = await seedInstruments().catch((err) => {
        console.error("Error seeding instruments:", err)
        return { success: false }
      })

      setSeedStatus((prev) => ({ ...prev, instruments: instrumentsResult.success }))

      const statsResult = await seedStats().catch((err) => {
        console.error("Error seeding stats:", err)
        return { success: false }
      })

      setSeedStatus((prev) => ({ ...prev, stats: statsResult.success }))

      const eventsResult = await seedEvents().catch((err) => {
        console.error("Error seeding events:", err)
        return { success: false }
      })

      setSeedStatus((prev) => ({ ...prev, events: eventsResult.success }))

      const mediaResult = await seedMedia().catch((err) => {
        console.error("Error seeding media:", err)
        return { success: false }
      })

      setSeedStatus((prev) => ({ ...prev, media: mediaResult.success }))

      const allSuccess = [
        profileResult,
        siteConfigResult,
        specialtiesResult,
        instrumentsResult,
        statsResult,
        eventsResult,
        mediaResult,
      ].every((result) => result.success)

      if (allSuccess) {
        toast.success("All data seeded successfully")
      } else {
        toast.error("Some seed operations failed")
      }
    } catch (error) {
      console.error("Error in handleSeedAll:", error)
      toast.error("Failed to seed database")
    } finally {
      setIsSeeding(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Seed Database</h1>
        <p className="text-zinc-400">
          Populate your database with initial data to get started quickly. This will create sample content for your
          website.
        </p>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>Seed Options</CardTitle>
            <CardDescription>Choose what data to seed into your database</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-800 rounded-lg">
                <h3 className="font-medium mb-2">Profile Information</h3>
                <p className="text-sm text-zinc-400 mb-4">Basic information about Ameer Albarouky</p>
                <div className="flex justify-between items-center">
                  <div>
                    {seedStatus.profile === true && <div className="text-green-400 text-sm">✓ Seeded successfully</div>}
                    {seedStatus.profile === false && <div className="text-amber-400 text-sm">⟳ Seeding...</div>}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSeedProfile}
                    disabled={seedStatus.profile === false || isSeeding}
                    className="border-zinc-700"
                  >
                    Seed
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-zinc-800 rounded-lg">
                <h3 className="font-medium mb-2">Site Configuration</h3>
                <p className="text-sm text-zinc-400 mb-4">Website settings and contact information</p>
                <div className="flex justify-between items-center">
                  <div>
                    {seedStatus.siteConfig === true && (
                      <div className="text-green-400 text-sm">✓ Seeded successfully</div>
                    )}
                    {seedStatus.siteConfig === false && <div className="text-amber-400 text-sm">⟳ Seeding...</div>}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSeedSiteConfig}
                    disabled={seedStatus.siteConfig === false || isSeeding}
                    className="border-zinc-700"
                  >
                    Seed
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-zinc-800 rounded-lg">
                <h3 className="font-medium mb-2">Specialties</h3>
                <p className="text-sm text-zinc-400 mb-4">Professional specialties and skills</p>
                <div className="flex justify-between items-center">
                  <div>
                    {seedStatus.specialties === true && (
                      <div className="text-green-400 text-sm">✓ Seeded successfully</div>
                    )}
                    {seedStatus.specialties === false && <div className="text-amber-400 text-sm">⟳ Seeding...</div>}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSeedSpecialties}
                    disabled={seedStatus.specialties === false || isSeeding}
                    className="border-zinc-700"
                  >
                    Seed
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-zinc-800 rounded-lg">
                <h3 className="font-medium mb-2">Instruments</h3>
                <p className="text-sm text-zinc-400 mb-4">Instruments played by Ameer</p>
                <div className="flex justify-between items-center">
                  <div>
                    {seedStatus.instruments === true && (
                      <div className="text-green-400 text-sm">✓ Seeded successfully</div>
                    )}
                    {seedStatus.instruments === false && <div className="text-amber-400 text-sm">⟳ Seeding...</div>}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSeedInstruments}
                    disabled={seedStatus.instruments === false || isSeeding}
                    className="border-zinc-700"
                  >
                    Seed
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-zinc-800 rounded-lg">
                <h3 className="font-medium mb-2">Statistics</h3>
                <p className="text-sm text-zinc-400 mb-4">Performance statistics and achievements</p>
                <div className="flex justify-between items-center">
                  <div>
                    {seedStatus.stats === true && <div className="text-green-400 text-sm">✓ Seeded successfully</div>}
                    {seedStatus.stats === false && <div className="text-amber-400 text-sm">⟳ Seeding...</div>}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSeedStats}
                    disabled={seedStatus.stats === false || isSeeding}
                    className="border-zinc-700"
                  >
                    Seed
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-zinc-800 rounded-lg">
                <h3 className="font-medium mb-2">Events</h3>
                <p className="text-sm text-zinc-400 mb-4">Upcoming and past events</p>
                <div className="flex justify-between items-center">
                  <div>
                    {seedStatus.events === true && <div className="text-green-400 text-sm">✓ Seeded successfully</div>}
                    {seedStatus.events === false && <div className="text-amber-400 text-sm">⟳ Seeding...</div>}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSeedEvents}
                    disabled={seedStatus.events === false || isSeeding}
                    className="border-zinc-700"
                  >
                    Seed
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-zinc-800 rounded-lg">
                <h3 className="font-medium mb-2">Media</h3>
                <p className="text-sm text-zinc-400 mb-4">Images and videos for the gallery</p>
                <div className="flex justify-between items-center">
                  <div>
                    {seedStatus.media === true && <div className="text-green-400 text-sm">✓ Seeded successfully</div>}
                    {seedStatus.media === false && <div className="text-amber-400 text-sm">⟳ Seeding...</div>}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSeedMedia}
                    disabled={seedStatus.media === false || isSeeding}
                    className="border-zinc-700"
                  >
                    Seed
                  </Button>
                </div>
              </div>
            </div>

            <Button onClick={handleSeedAll} className="w-full bg-rose-500 hover:bg-rose-600 mt-4" disabled={isSeeding}>
              {isSeeding ? "Seeding Database..." : "Seed All Data"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
