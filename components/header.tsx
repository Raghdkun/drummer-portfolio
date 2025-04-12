"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { scrollToSection } from "@/utils/scroll-utils"
import { motion, AnimatePresence } from "framer-motion"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  // Track scroll position for styling changes
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      // Determine active section based on scroll position
      const sections = ["home", "about-section", "events", "contact"]
      for (const section of sections.reverse()) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (mobileMenuOpen && !(e.target as Element).closest(".mobile-menu-container")) {
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [mobileMenuOpen])

  // Navigation links - now with About as a regular link
  const navLinks = [
    { name: "Home", href: "home" },
    { name: "About", href: "about-section" },
    { name: "Events", href: "events" },
    { name: "Contact", href: "contact" },
  ]

  const handleNavClick = (href: string) => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "auto"
    }

    // Check if we're on a different page and need to navigate to homepage sections
    const isHomePage = window.location.pathname === "/" || window.location.pathname === "";
    
    if (!isHomePage) {
      // If we're not on the homepage, redirect to homepage with the section anchor
      window.location.href = `/#${href}`;
      return;
    }

    // If we're already on the homepage, just scroll to the section
    scrollToSection(href)
    setMobileMenuOpen(false)
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out",
        isScrolled
          ? "bg-black/85 backdrop-blur-md py-3 shadow-lg shadow-black/10"
          : "bg-transparent backdrop-blur-sm py-6",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center relative">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={`#${link.href}`}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick(link.href)
                }}
                className={cn(
                  "px-5 py-2 text-sm font-medium tracking-wide transition-colors rounded-full relative group cursor-hover-area",
                  activeSection === link.href ? "text-white" : "text-zinc-400 hover:text-white hover:bg-white/5",
                )}
              >
                {link.name}
                {activeSection === link.href && (
                  <motion.span
                    layoutId="activeSection"
                    className="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-purple-500/20 rounded-full -z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden absolute right-0 top-0 text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed top-[var(--header-height,60px)] left-0 right-0 bg-black/95 backdrop-blur-md border-t border-zinc-800/50 mobile-menu-container overflow-hidden z-50"
            style={
              {
                "--header-height": isScrolled ? "60px" : "80px",
              } as React.CSSProperties
            }
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={`#${link.href}`}
                    onClick={(e) => {
                      e.preventDefault()
                      handleNavClick(link.href)
                    }}
                    className={cn(
                      "text-center py-3 px-4 text-base font-medium transition-colors rounded-lg cursor-hover-area",
                      activeSection === link.href
                        ? "bg-gradient-to-r from-rose-500/20 to-purple-500/20 text-white"
                        : "text-zinc-400 hover:text-white hover:bg-white/5",
                    )}
                  >
                    <span className="relative">
                      {link.name}
                      {activeSection === link.href && (
                        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-rose-500 to-purple-500 rounded-full"></span>
                      )}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
