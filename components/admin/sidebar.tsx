"use client"

import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"
import { LayoutDashboard, User, Calendar, ImageIcon, MessageSquare, Settings, LogOut, Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const navItems = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    name: "Profile",
    href: "/admin/profile",
    icon: <User className="h-5 w-5" />,
  },
  {
    name: "Events",
    href: "/admin/events",
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    name: "Media",
    href: "/admin/media",
    icon: <ImageIcon className="h-5 w-5" />,
  },
  // {
  //   name: "Messages",
  //   href: "/admin/messages",
  //   icon: <MessageSquare className="h-5 w-5" />,
  // },
  {
    name: "Contact Info",
    href: "/admin/site-config",
    icon: <Settings className="h-5 w-5" />,
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { signOut } = useAuth()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    router.push("/admin/login")
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-zinc-900 border-zinc-700"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Sidebar for desktop */}
      <div className="hidden lg:flex h-screen w-64 flex-col bg-zinc-900 border-r border-zinc-800 fixed">
        <div className="p-6">
          <Link href="/admin/dashboard" className="text-xl font-bold tracking-tighter">
            <span className="text-rose-500">8</span>amar Admin
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-3 text-sm rounded-md transition-colors",
                pathname === item.href
                  ? "bg-rose-500/10 text-rose-400"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800",
              )}
            >
              {item.icon}
              <span className="ml-3">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <button
            onClick={handleSignOut}
            className="flex items-center px-4 py-3 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md w-full transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-3">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Mobile sidebar */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="relative flex w-64 max-w-xs flex-col bg-zinc-900 pb-4 pt-5">
            <div className="px-6 pb-6 pt-2">
              <Link href="/admin/dashboard" className="text-xl font-bold tracking-tighter">
                <span className="text-rose-500">8</span>amar Admin
              </Link>
            </div>

            <nav className="flex-1 px-4 py-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm rounded-md transition-colors",
                    pathname === item.href
                      ? "bg-rose-500/10 text-rose-400"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800",
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t border-zinc-800">
              <button
                onClick={handleSignOut}
                className="flex items-center px-4 py-3 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md w-full transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="ml-3">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
