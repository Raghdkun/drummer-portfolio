import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import AboutSection from "@/components/about-section"
import Events from "@/components/events"
import Contact from "@/components/contact"
import Footer from "@/components/footer"
import { createServerSupabaseClient } from "@/lib/supabase"

export const revalidate = 3600 // Revalidate every hour

export default async function Home() {
  const supabase = createServerSupabaseClient()

  // Fetch site configuration
  const { data: siteConfig } = await supabase
    .from("site_config")
    .select("*")
    .limit(1)
    .single()
    .then((response) => response)
    .catch(() => ({ data: null }))

  // Fetch profile data
  const { data: profile } = await supabase
    .from("profile")
    .select("*")
    .limit(1)
    .single()
    .then((response) => response)
    .catch(() => ({ data: null }))

  // Fetch stats
  const { data: stats = [] } = await supabase
    .from("stats")
    .select("*")
    .order("display_order", { ascending: true })
    .then((response) => response)
    .catch(() => ({ data: [] }))

  // Fetch specialties
  const { data: specialties = [] } = await supabase
    .from("specialties")
    .select("*")
    .order("display_order", { ascending: true })
    .then((response) => response)
    .catch(() => ({ data: [] }))

  // Fetch instruments
  const { data: instruments = [] } = await supabase
    .from("instruments")
    .select("*")
    .order("display_order", { ascending: true })
    .then((response) => response)
    .catch(() => ({ data: [] }))

  // Fetch upcoming events
  const { data: upcomingEvents = [] } = await supabase
    .from("events")
    .select("*")
    .eq("is_upcoming", true)
    .order("event_date", { ascending: true })
    .then((response) => response)
    .catch(() => ({ data: [] }))

  // Fetch past events
  const { data: pastEvents = [] } = await supabase
    .from("events")
    .select("*")
    .eq("is_upcoming", false)
    .order("event_date", { ascending: false })
    .limit(4)
    .then((response) => response)
    .catch(() => ({ data: [] }))

  // Fetch featured media
  const { data: featuredMedia = [] } = await supabase
    .from("media")
    .select("*")
    .eq("is_featured", true)
    .order("display_order", { ascending: true })
    .then((response) => response)
    .catch(() => ({ data: [] }))

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white">
      <Header />
      <HeroSection profile={profile} />
      <AboutSection profile={profile} stats={stats} specialties={specialties} instruments={instruments} />
      <Events upcomingEvents={upcomingEvents} pastEvents={pastEvents} />
      <Contact siteConfig={siteConfig} />
      <Footer siteConfig={siteConfig} />
    </main>
  )
}

// Add this import at the top of your file
import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

// For server components, use this pattern to create the client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
