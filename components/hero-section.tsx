"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, MessageSquare, Drum } from "lucide-react"
import type { Database } from "@/types/supabase"
import { scrollToSection } from "@/utils/scroll-utils"
import MagneticElement from "./magnetic-element"

type Profile = Database["public"]["Tables"]["profile"]["Row"] | null

interface HeroSectionProps {
  profile?: Profile
}

export default function HeroSection({ profile }: HeroSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0")
          }
        })
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <section id="home" className="pt-40 pb-20 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-40 -left-20 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-40 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div
        ref={sectionRef}
        className="container mx-auto px-4 opacity-0 translate-y-10 transition-all duration-1000 ease-out"
      >
        {/* Hero content */}
        <div className="max-w-4xl mx-auto">
          <MagneticElement strength={50} className="inline-block">
            <div className="px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-full text-rose-400 font-medium text-sm mb-6 backdrop-blur-sm animate-pulse-slow interactive-element">
              <Drum className="inline-block mr-2 h-4 w-4" />
              Professional Drummer
            </div>
          </MagneticElement>

          <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
            {profile?.full_name || "Ameer Albarouky"}
            <span className="block text-rose-500 mt-1">{profile?.stage_name || "Drummer 8amar"}</span>
          </h1>
          <p className="text-xl text-zinc-300 mb-8 max-w-3xl">
            {profile?.headline ||
              "Bringing rhythm and soul to every performance. Experience the passion and energy of one of Syria's most talented drummers."}
          </p>
          <div className="flex flex-wrap gap-4">
            <MagneticElement strength={70}>
              <Button
                className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-6 interactive-element"
                onClick={() => scrollToSection("events")}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Upcoming Events
              </Button>
            </MagneticElement>

            <MagneticElement strength={70}>
              <Button
                variant="outline"
                className="border-zinc-700 text-white hover:bg-purple-500 hover:border-purple-600 px-6 py-6 transition-colors interactive-element"
                onClick={() => scrollToSection("contact")}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Get in Touch
              </Button>
            </MagneticElement>
          </div>
        </div>
      </div>
    </section>
  )
}
