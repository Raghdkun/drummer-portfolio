import Link from "next/link"
import { Instagram } from "lucide-react"
import type { Database } from "@/types/supabase"

type SiteConfig = Database["public"]["Tables"]["site_config"]["Row"] | null

interface FooterProps {
  siteConfig?: SiteConfig
}

export default function Footer({ siteConfig }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-zinc-800 pt-16 pb-6">
      <div className="container mx-auto px-4">
        {/* Modern card layout with only two cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
          {/* Brand card */}
          <div className="bg-zinc-900/60 backdrop-blur-sm rounded-xl overflow-hidden border border-zinc-800 hover:border-rose-500/30 transition-all duration-300 group h-full transform hover:-translate-y-1 cursor-hover-area">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-purple-500/5 rounded-xl pointer-events-none"></div>
            <div className="p-8 relative h-full flex flex-col">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="inline-block mb-6 bg-zinc-800/50 px-4 py-2 rounded-full">
                    <Link href="/" className="text-3xl font-bold tracking-tighter inline-flex items-center">
                      <span className="text-rose-500">8</span>amar
                      <span className="ml-2 h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                    </Link>
                  </div>

                  <p className="text-zinc-400 text-lg leading-relaxed">
                    Professional drummer and percussionist bringing rhythm and soul to every performance.
                  </p>
                </div>

                <div className="mt-8">
                  <div className="flex space-x-3">
                    <div className="h-1 w-12 bg-rose-500 rounded-full"></div>
                    <div className="h-1 w-8 bg-purple-500 rounded-full"></div>
                    <div className="h-1 w-4 bg-amber-500 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-rose-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>

          {/* Quick links card */}
          <div className="bg-zinc-900/60 backdrop-blur-sm rounded-xl overflow-hidden border border-zinc-800 hover:border-rose-500/30 transition-all duration-300 group h-full transform hover:-translate-y-1 cursor-hover-area">
            <div className="p-8 relative h-full">
              <h3 className="text-xl font-semibold mb-6 inline-flex items-center">
                <span className="w-8 h-0.5 bg-gradient-to-r from-rose-500 to-purple-500 mr-3"></span>
                QUICK LINKS
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="#home"
                    className="text-zinc-300 hover:text-rose-400 transition-colors flex items-center group cursor-hover-area"
                  >
                    <span className="w-2 h-2 bg-rose-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                    <span className="text-lg">Home</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="#about"
                    className="text-zinc-300 hover:text-rose-400 transition-colors flex items-center group cursor-hover-area"
                  >
                    <span className="w-2 h-2 bg-rose-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                    <span className="text-lg">About</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="#events"
                    className="text-zinc-300 hover:text-rose-400 transition-colors flex items-center group cursor-hover-area"
                  >
                    <span className="w-2 h-2 bg-rose-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                    <span className="text-lg">Events</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="#contact"
                    className="text-zinc-300 hover:text-rose-400 transition-colors flex items-center group cursor-hover-area"
                  >
                    <span className="w-2 h-2 bg-rose-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                    <span className="text-lg">Contact</span>
                  </Link>
                </li>
              </ul>
              <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-purple-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
        </div>

        {/* Bottom section with copyright and attribution - kept as is */}
        <div className="border-t border-zinc-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-zinc-500 text-xs">
            &copy; {currentYear} {siteConfig?.site_title || "Ameer Albarouky"}. All rights reserved.
          </p>

          <div className="mt-4 md:mt-0">
            <Link
              href="https://instagram.com/raghdkun"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center"
            >
              <span className="text-zinc-500 text-xs mr-2">Developed by</span>
              <span className="relative">
                <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 via-rose-500/20 to-amber-500/20 text-xs font-medium">
                  @raghdkun
                </span>
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-rose-500 to-amber-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></span>
              </span>
              <Instagram className="h-3.5 w-3.5 ml-1.5 text-rose-400 group-hover:text-rose-300 transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
