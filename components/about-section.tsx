"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import type { Database } from "@/types/supabase"
import type { LucideIcon } from "lucide-react"
import * as LucideIcons from "lucide-react"
import { motion } from "framer-motion"

type Profile = Database["public"]["Tables"]["profile"]["Row"] | null
type Stat = Database["public"]["Tables"]["stats"]["Row"]
type Specialty = Database["public"]["Tables"]["specialties"]["Row"]
type Instrument = Database["public"]["Tables"]["instruments"]["Row"]

interface AboutSectionProps {
  profile?: Profile
  stats?: Stat[]
  specialties?: Specialty[]
  instruments?: Instrument[]
}

export default function AboutSection({ profile, stats = [], specialties = [], instruments = [] }: AboutSectionProps) {
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

  // Helper function to get Lucide icon by name
  const getIconByName = (name: string | null): LucideIcon => {
    if (!name || !(name in LucideIcons)) {
      return LucideIcons.Music
    }
    return LucideIcons[name as keyof typeof LucideIcons]
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  }

  const imageVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  }

  return (
    <section id="about-section" className="py-12 sm:py-16 md:py-20 relative cursor-hover-area overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-40 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div
        ref={sectionRef}
        className="container mx-auto px-4 sm:px-6 opacity-0 translate-y-10 transition-all duration-1000 ease-out"
      >
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10 items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Image container - improved for mobile */}
          <motion.div className="relative w-full flex justify-center md:justify-start" variants={imageVariants}>
            {/* Gradient border with responsive sizing */}
            <div className="relative w-[85%] sm:w-[70%] md:w-[90%] max-w-[320px] md:max-w-[400px]">
              <div
                className="absolute -top-3 -left-3 w-full h-full bg-gradient-to-br from-rose-500 to-purple-500 rounded-2xl transform rotate-3"
                style={{ aspectRatio: "4/5" }}
              />

              {/* Main image container */}
              <div
                className="relative w-full overflow-hidden rounded-2xl border-2 border-zinc-800 shadow-xl"
                style={{ aspectRatio: "4/5" }}
              >
                <Image
                  src={profile?.profile_image_url || "/placeholder.svg?height=600&width=500"}
                  alt={profile?.full_name || "Ameer Albarouky - Drummer 8amar"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 85vw, (max-width: 768px) 70vw, (max-width: 1024px) 45vw, 400px"
                  priority
                />
              </div>

              {/* Name badge with responsive sizing */}
              <div className="absolute -bottom-4 -right-4 bg-zinc-900 rounded-xl p-2.5 sm:p-3 shadow-xl border border-zinc-800 transform rotate-3">
                <p className="text-xs sm:text-sm font-medium">Syrian Drummer</p>
                <p className="text-sm sm:text-lg md:text-xl font-bold text-rose-500">
                  {profile?.full_name || "Ameer Albarouky"}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Content container */}
          <div className="space-y-3 sm:space-y-4 md:space-y-5">
            <motion.h3 className="text-2xl sm:text-3xl font-bold" variants={itemVariants}>
              The Rhythm Master
            </motion.h3>
            <motion.p className="text-zinc-300 text-sm sm:text-base" variants={itemVariants}>
              {profile?.bio_full ||
                "Ameer Albarouky, known professionally as Drummer 8amar (قمر), is a renowned Syrian drummer with over a decade of experience in the music industry. His unique style blends traditional Middle Eastern rhythms with modern techniques, creating a distinctive sound that has captivated audiences worldwide."}
            </motion.p>
            <motion.p className="text-zinc-300 text-sm sm:text-base" variants={itemVariants}>
              Beginning his journey at a young age, Ameer has performed with numerous acclaimed artists and bands across
              Syria and the Middle East. His passion for drumming extends beyond performance to education, where he has
              taught hundreds of aspiring drummers through workshops and private lessons.
            </motion.p>
            <motion.p className="text-zinc-300 text-sm sm:text-base" variants={itemVariants}>
              Ameer's performances are characterized by his energetic stage presence and technical prowess, making each
              show a memorable experience for his audience. His dedication to his craft has earned him recognition as
              one of Syria's most talented percussionists.
            </motion.p>

            <motion.div className="pt-3 sm:pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4" variants={itemVariants}>
              <div className="bg-zinc-800/50 rounded-lg p-3 sm:p-4 border border-zinc-700/50 hover:border-rose-500/30 transition-colors cursor-hover-area">
                <h4 className="font-medium mb-1.5 sm:mb-2">Specialties</h4>
                <ul className="text-zinc-300 space-y-0.5 sm:space-y-1 text-sm sm:text-base">
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
              <div className="bg-zinc-800/50 rounded-lg p-3 sm:p-4 border border-zinc-700/50 hover:border-rose-500/30 transition-colors cursor-hover-area">
                <h4 className="font-medium mb-1.5 sm:mb-2">Instruments</h4>
                <ul className="text-zinc-300 space-y-0.5 sm:space-y-1 text-sm sm:text-base">
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
            </motion.div>
          </div>
        </motion.div>

        {/* Stats section */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5 mt-8 sm:mt-12 md:mt-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {stats.length > 0
            ? stats.map((stat) => {
                const IconComponent = getIconByName(stat.icon_name)
                return (
                  <motion.div
                    key={stat.id}
                    className="bg-zinc-800/30 border border-zinc-700/30 rounded-xl p-4 sm:p-5 text-center hover:bg-zinc-800/50 transition-colors duration-300 hover:border-rose-500/30 cursor-hover-area"
                    variants={itemVariants}
                  >
                    <div className="bg-rose-500/10 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 text-rose-400">
                      <IconComponent className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">{stat.stat_value}</h3>
                    <p className="text-zinc-400 text-sm sm:text-base">{stat.stat_name}</p>
                  </motion.div>
                )
              })
            : [
                { icon: <LucideIcons.Drum className="h-5 w-5 sm:h-6 sm:w-6" />, value: "150+", label: "Performances" },
                { icon: <LucideIcons.Award className="h-5 w-5 sm:h-6 sm:w-6" />, value: "12", label: "Awards" },
                {
                  icon: <LucideIcons.Music className="h-5 w-5 sm:h-6 sm:w-6" />,
                  value: "20+",
                  label: "Collaborations",
                },
                { icon: <LucideIcons.Users className="h-5 w-5 sm:h-6 sm:w-6" />, value: "1000+", label: "Students" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="bg-zinc-800/30 border border-zinc-700/30 rounded-xl p-4 sm:p-5 text-center hover:bg-zinc-800/50 transition-colors duration-300 hover:border-rose-500/30 cursor-hover-area"
                  variants={itemVariants}
                >
                  <div className="bg-rose-500/10 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 text-rose-400">
                    {stat.icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</h3>
                  <p className="text-zinc-400 text-sm sm:text-base">{stat.label}</p>
                </motion.div>
              ))}
        </motion.div>
      </div>
    </section>
  )
}
