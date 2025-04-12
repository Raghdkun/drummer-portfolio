"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin, PhoneIcon as WhatsApp } from "lucide-react"
import type { Database } from "@/types/supabase"

type SiteConfig = Database["public"]["Tables"]["site_config"]["Row"] | null

interface ContactProps {
  siteConfig?: SiteConfig
}

export default function Contact({ siteConfig }: ContactProps) {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100", "translate-y-0")
        }
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

  const socialLinks = [
    {
      icon: <Instagram className="h-5 w-5" />,
      label: "Instagram",
      href: siteConfig?.social_instagram || "#",
    },
    {
      icon: <Facebook className="h-5 w-5" />,
      label: "Facebook",
      href: siteConfig?.social_facebook || "#",
    },
    {
      icon: <Youtube className="h-5 w-5" />,
      label: "YouTube",
      href: siteConfig?.social_youtube || "#",
    },
  ]

  return (
    <section id="contact" className="py-20 relative cursor-hover-area">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-40 -right-20 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -left-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div
        ref={sectionRef}
        className="container mx-auto px-4 opacity-0 translate-y-10 transition-all duration-1000 ease-out"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Get in <span className="text-rose-500">Touch</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Book Drummer 8amar for your next event or reach out for collaborations
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div className="bg-zinc-800/30 border border-zinc-700/30 rounded-xl p-6 hover:border-rose-500/30 transition-colors duration-300 cursor-hover-area">
              <h3 className="text-xl font-bold mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-rose-500/10 w-10 h-10 rounded-full flex items-center justify-center mr-4 text-rose-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Email</p>
                    <p className="font-medium">{siteConfig?.contact_email || "contact@drummer8amar.com"}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-rose-500/10 w-10 h-10 rounded-full flex items-center justify-center mr-4 text-rose-400">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Phone</p>
                    <p className="font-medium">{siteConfig?.contact_phone || "+963 123 456 789"}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-rose-500/10 w-10 h-10 rounded-full flex items-center justify-center mr-4 text-rose-400">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Location</p>
                    <p className="font-medium">{siteConfig?.location || "Damascus, Syria"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-800/30 border border-zinc-700/30 rounded-xl p-6 hover:border-rose-500/30 transition-colors duration-300 cursor-hover-area">
              <h3 className="text-xl font-bold mb-4">Follow on Social Media</h3>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 px-4 py-2 rounded-lg transition-colors cursor-hover-area"
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-zinc-800/30 border border-zinc-700/30 rounded-xl p-6 cursor-hover-area">
            <div className="space-y-6">
              <h3 className="text-xl font-bold mb-4">Send a Message</h3>
              <p className="text-zinc-300">
                Get in touch with Drummer 8amar directly via WhatsApp for bookings, collaborations, or any inquiries.
              </p>

              <div className="bg-zinc-900/60 rounded-lg p-6 border border-zinc-700/50">
                <div className="flex items-center mb-4">
                  <div className="bg-green-500/10 w-10 h-10 rounded-full flex items-center justify-center mr-4 text-green-400">
                    <WhatsApp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">WhatsApp</p>
                    <p className="font-medium">{siteConfig?.whatsapp_number || "+971 55 529 3876"}</p>
                  </div>
                </div>

                <a
                  href={`http://wa.me/${(siteConfig?.whatsapp_number || "+971555293876").replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full cursor-hover-area"
                >
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white transition-all duration-300 group">
                    <span className="flex items-center">
                      Chat on WhatsApp
                      <WhatsApp className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                    </span>
                  </Button>
                </a>

                <p className="text-center text-zinc-400 text-sm mt-4">Available 7 days a week, 9am - 9pm (GMT+4)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
