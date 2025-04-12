"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import type { Database } from "@/types/supabase"
import type { LucideIcon } from "lucide-react"
import * as LucideIcons from "lucide-react"
import { Button } from "@/components/ui/button"
import { scrollToSection } from "@/utils/scroll-utils"

type Profile = Database["public"]["Tables"]["profile"]["Row"] | null
type Stat = Database["public"]["Tables"]["stats"]["Row"]
type Specialty = Database["public"]["Tables"]["specialties"]["Row"]
type Instrument = Database["public"]["Tables"]["instruments"]["Row"]

interface AboutProps {
  profile?: Profile
  stats?: Stat[]
  specialties?: Specialty[]
  instruments?: Instrument[]
}

export default function About({ profile, stats = [], specialties = [], instruments = [] }: AboutProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

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

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
      if (statsRef.current) {
        observer.unobserve(statsRef.current)
      }
    }
  }, [])

  // Helper function to get Lucide icon by name
  const getIconByName = (name: string | null): LucideIcon => {
    if (!name || !(name in LucideIcons)) {
      return LucideIcons.Music
    }
    return LucideIcons[name as keyof typeof LucideIcons]
  }

  return (
    <section id="about" className="pt-40 pb-20 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-40 -left-20 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-40 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div
        ref={sectionRef}
        className="container mx-auto px-4 opacity-0 translate-y-10 transition-all duration-1000 ease-out"
      >
        {/* Hero-like introduction */}
        <div className="mb-28 max-w-4xl mx-auto">
          <div className="inline-block px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-full text-rose-400 font-medium text-sm mb-6 backdrop-blur-sm animate-pulse-slow">
            <LucideIcons.Drum className="inline-block mr-2 h-4 w-4" />
            Professional Drummer
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
            {profile?.full_name || "Ameer Albarouky"}
            <span className="block text-rose-500 mt-1">{profile?.stage_name || "Drummer 8amar"}</span>
          </h1>
          <p className="text-xl text-zinc-300 mb-8 max-w-3xl">
            {profile?.headline ||
              "Bringing rhythm and soul to every performance. Experience the passion and energy of one of Syria's most talented drummers."}
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-6"
              onClick={() => scrollToSection("events")}
            >
              <LucideIcons.Calendar className="mr-2 h-4 w-4" />
              Upcoming Events
            </Button>
            <Button
              variant="outline"
              className="border-zinc-700 text-white hover:bg-zinc-800 px-6 py-6"
              onClick={() => scrollToSection("contact")}
            >
              <LucideIcons.MessageSquare className="mr-2 h-4 w-4" />
              Get in Touch
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-full h-full bg-gradient-to-br from-rose-500 to-purple-500 rounded-2xl transform rotate-3" />
            <Image
              src={profile?.profile_image_url || "/placeholder.svg?height=600&width=500"}
              alt={profile?.full_name || "Ameer Albarouky - Drummer 8amar"}
              width={500}
              height={600}
              className="relative rounded-2xl w-full h-auto object-cover border-2 border-zinc-800"
              priority
            />
            <div className="absolute -bottom-6 -right-6 bg-zinc-900 rounded-xl p-4 shadow-xl border border-zinc-800 transform rotate-3">
              <p className="text-sm font-medium">Syrian Drummer</p>
              <p className="text-xl font-bold text-rose-500">{profile?.full_name || "Ameer Albarouky"}</p>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold">The Rhythm Master</h3>
            <p className="text-zinc-300">
              {profile?.bio_full ||
                "Ameer Albarouky, known professionally as Drummer 8amar (قمر), is a renowned Syrian drummer with over a decade of experience in the music industry. His unique style blends traditional Middle Eastern rhythms with modern techniques, creating a distinctive sound that has captivated audiences worldwide."}
            </p>
            <p className="text-zinc-300">
              Beginning his journey at a young age, Ameer has performed with numerous acclaimed artists and bands across
              Syria and the Middle East. His passion for drumming extends beyond performance to education, where he has
              taught hundreds of aspiring drummers through workshops and private lessons.
            </p>
            <p className="text-zinc-300">
              Ameer's performances are characterized by his energetic stage presence and technical prowess, making each
              show a memorable experience for his audience. His dedication to his craft has earned him recognition as
              one of Syria's most talented percussionists.
            </p>

            <div className="pt-4 grid grid-cols-2 gap-4">
              <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
                <h4 className="font-medium mb-2">Specialties</h4>
                <ul className="text-zinc-300 space-y-1">
                  {specialties.length > 0 ? (
                    specialties.map((specialty, index) => <li key={specialty.id}>• {specialty.name}</li>)
                  ) : (
                    <>
                      <li>• Middle Eastern Rhythms</li>
                      <li>• Jazz Percussion</li>
                      <li>• Live Performance</li>
                      <li>• Studio Recording</li>
                    </>
                  )}
                </ul>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
                <h4 className="font-medium mb-2">Instruments</h4>
                <ul className="text-zinc-300 space-y-1">
                  {instruments.length > 0 ? (
                    instruments.map((instrument, index) => <li key={instrument.id}>• {instrument.name}</li>)
                  ) : (
                    <>
                      <li>• Drum Kit</li>
                      <li>• Darbuka</li>
                      <li>• Riq</li>
                      <li>• Cajon</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 opacity-0 translate-y-10 transition-all duration-1000 delay-300 ease-out"
        >
          {stats.length > 0
            ? stats.map((stat) => {
                const IconComponent = getIconByName(stat.icon_name)
                return (
                  <div
                    key={stat.id}
                    className="bg-zinc-800/30 border border-zinc-700/30 rounded-xl p-6 text-center hover:bg-zinc-800/50 transition-colors duration-300 hover:border-rose-500/30"
                  >
                    <div className="bg-rose-500/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-400">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1">{stat.stat_value}</h3>
                    <p className="text-zinc-400">{stat.stat_name}</p>
                  </div>
                )
              })
            : [
                { icon: <LucideIcons.Drum className="h-6 w-6" />, value: "150+", label: "Performances" },
                { icon: <LucideIcons.Award className="h-6 w-6" />, value: "12", label: "Awards" },
                { icon: <LucideIcons.Music className="h-6 w-6" />, value: "20+", label: "Collaborations" },
                { icon: <LucideIcons.Users className="h-6 w-6" />, value: "1000+", label: "Students" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-zinc-800/30 border border-zinc-700/30 rounded-xl p-6 text-center hover:bg-zinc-800/50 transition-colors duration-300 hover:border-rose-500/30"
                >
                  <div className="bg-rose-500/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-400">
                    {stat.icon}
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                  <p className="text-zinc-400">{stat.label}</p>
                </div>
              ))}
        </div>
      </div>
    </section>
  )
}
