import type React from "react"
import { AuthProvider } from "@/contexts/auth-context"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Dashboard - Ameer Albarouky",
  description: "Content Management System for Ameer Albarouky's website",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-zinc-950 text-white">{children}</div>
    </AuthProvider>
  )
}
