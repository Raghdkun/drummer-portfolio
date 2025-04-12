import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowLeft } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { createServerSupabaseClient } from "@/lib/supabase"

export default async function EventNotFound() {
  const supabase = createServerSupabaseClient()

  // Fetch site config for the footer
  const { data: siteConfig } = await supabase
    .from("site_config")
    .select("*")
    .limit(1)
    .single()
    .then((response) => response)
    .catch(() => ({ data: null }))

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white">
      <Header />

      <section className="pt-32 pb-20 flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex justify-center mb-8">
            <div className="bg-rose-500/10 w-24 h-24 rounded-full flex items-center justify-center">
              <Calendar className="h-12 w-12 text-rose-400" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">Event Not Found</h1>
          <p className="text-zinc-300 text-lg max-w-lg mx-auto mb-8">
            The event you're looking for doesn't exist or has been removed.
          </p>

          <Link href="/#events">
            <Button className="bg-rose-500 hover:bg-rose-600">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Button>
          </Link>
        </div>
      </section>

      <Footer siteConfig={siteConfig} />
    </main>
  )
}
