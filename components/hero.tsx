"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Music, Play, ChevronRight } from "lucide-react"
import type { Database } from "@/types/supabase"
import { scrollToSection } from "@/utils/scroll-utils"

type Profile = Database["public"]["Tables"]["profile"]["Row"] | null
type Media = Database["public"]["Tables"]["media"]["Row"]

interface HeroProps {
  profile?: Profile
  featuredMedia?: Media[]
}

export default function Hero({ profile, featuredMedia = [] }: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100", "translate-y-0")
        }
      },
      { threshold: 0.1 },
    )

    if (heroRef.current) {
      observer.observe(heroRef.current)
    }

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current)
      }
    }
  }, [])

  // Find a featured image for the hero
  const heroImage =
    featuredMedia.find((media) => media.media_type === "image")?.url ||
    profile?.profile_image_url ||
    "/placeholder.svg?height=600&width=500"

  return (
    <section id="home" className="relative min-h-screen pt-20 flex items-center" ref={heroRef}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      </div>

      {/* Animated circles */}
      <div
        className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-rose-500 animate-ping"
        style={{ animationDuration: "3s" }}
      />
      <div
        className="absolute top-3/4 right-1/3 w-3 h-3 rounded-full bg-purple-500 animate-ping"
        style={{ animationDuration: "4s" }}
      />
      <div
        className="absolute bottom-1/4 left-1/2 w-2 h-2 rounded-full bg-amber-500 animate-ping"
        style={{ animationDuration: "5s" }}
      />

      <div className="container mx-auto px-4 opacity-0 translate-y-10 transition-all duration-1000 ease-out">
        {/* Z-Pattern Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Top Left: Logo/Badge */}
          <div className="flex flex-col justify-start items-start">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-rose-500 to-purple-500 p-0.5 rounded-full">
                <div className="bg-black rounded-full p-3">
                  <span className="text-2xl font-bold">
                    <span className="text-rose-500">8</span>amar
                  </span>
                </div>
              </div>
              <div className="bg-zinc-900/80 backdrop-blur-sm px-4 py-2 rounded-full border border-zinc-800/50">
                <div className="flex items-center">
                  <Music className="h-4 w-4 text-rose-400 mr-2" />
                  <span className="text-sm font-medium">Professional Drummer</span>
                </div>
              </div>
            </div>

            {/* Decorative element */}
            <div className="hidden md:block relative w-full h-[300px] mb-8">
              <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-br from-rose-500/10 to-purple-500/10 rounded-2xl border border-zinc-800/30 overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/5"></div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-rose-500/20 rounded-full blur-xl"></div>
                <div className="absolute top-10 left-10 w-20 h-20 bg-purple-500/20 rounded-full blur-xl"></div>
              </div>

              {/* Experience badge */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-zinc-900/90 backdrop-blur-sm rounded-xl p-5 border border-zinc-800 shadow-xl">
                <p className="text-center text-sm font-medium text-zinc-400">Experience</p>
                <p className="text-center text-3xl font-bold text-rose-500">
                  {profile?.years_experience || "10"}+ Years
                </p>
                <div className="mt-3 pt-3 border-t border-zinc-800">
                  <div className="flex justify-between text-center">
                    <div className="px-2">
                      <p className="text-xl font-bold">150+</p>
                      <p className="text-xs text-zinc-500">Shows</p>
                    </div>
                    <div className="px-2 border-l border-r border-zinc-800">
                      <p className="text-xl font-bold">12+</p>
                      <p className="text-xs text-zinc-500">Awards</p>
                    </div>
                    <div className="px-2">
                      <p className="text-xl font-bold">1000+</p>
                      <p className="text-xs text-zinc-500">Students</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Right: Profile Image */}
          <div className="flex justify-end items-start">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <div className="relative w-[280px] h-[280px] md:w-[320px] md:h-[320px] rounded-full overflow-hidden border-2 border-zinc-800 shadow-2xl">
                <Image
                  src={heroImage || "/placeholder.svg"}
                  alt={profile?.full_name || "Ameer Albarouky"}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 bg-zinc-900 rounded-full p-3 shadow-xl border border-zinc-800">
                <div className="bg-rose-500/20 rounded-full p-2">
                  <Music className="h-6 w-6 text-rose-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Left: CTA Buttons */}
          <div className="flex flex-col justify-end items-start">
            <div className="space-y-4 w-full md:max-w-md">
              <Button
                className="w-full bg-rose-500 hover:bg-rose-600 text-white py-6 group"
                onClick={() => scrollToSection("events")}
              >
                <Play className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                Watch Performances
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                variant="outline"
                className="w-full border-zinc-700 text-white hover:bg-zinc-800 py-6"
                onClick={() => scrollToSection("about")}
              >
                View Gallery
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                className="w-full text-zinc-400 hover:text-white hover:bg-zinc-800/50 py-6"
                onClick={() => scrollToSection("contact")}
              >
                Get in Touch
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Bottom Right: Heading and Description */}
          <div className="flex flex-col justify-end items-start md:items-end text-left md:text-right">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              {profile?.full_name || "Ameer Albarouky"}
              <span className="block text-rose-500">{profile?.stage_name || "Drummer 8amar"}</span>
            </h1>

            <p className="text-base md:text-lg text-zinc-300 max-w-md mb-6">
              {profile?.headline ||
                "Bringing rhythm and soul to every performance. Experience the passion and energy of one of Syria's most talented drummers."}
            </p>

            <div className="flex space-x-4">
              <div className="h-1 w-12 bg-rose-500 rounded-full"></div>
              <div className="h-1 w-8 bg-purple-500 rounded-full"></div>
              <div className="h-1 w-4 bg-amber-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
