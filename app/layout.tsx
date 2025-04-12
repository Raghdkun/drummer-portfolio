import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import "./styles/animations.css" // Import the animations CSS
import LoadingSpinnerController from "@/components/loading-spinner"
import NavigationEvents from "@/components/navigation-events"
import ClientCursorEffects from "@/components/client-cursor-effects"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ameer Albarouky - Professional Drummer",
  description: "Official website of Ameer Albarouky, professional drummer and percussionist known as Drummer 8amar.",
  
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Loading spinner - visible by default on initial page load */}
        <div id="global-loading-spinner" className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300 opacity-100">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-rose-500/30 border-t-rose-500 animate-spin"></div>
            <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-transparent border-r-purple-500 animate-spin-slow"></div>
          </div>
        </div>
        <LoadingSpinnerController />
        <NavigationEvents />
        {children}
        
        {/* Client-side cursor effects */}
        <ClientCursorEffects />
        
        {/* Script to hide spinner after page load */}
        <script dangerouslySetInnerHTML={{
          __html: `
            window.addEventListener('load', function() {
              setTimeout(function() {
                const spinner = document.getElementById('global-loading-spinner');
                if (spinner) {
                  spinner.classList.add('opacity-0', 'pointer-events-none');
                  spinner.classList.remove('opacity-100');
                }
              }, 300);
            });
          `
        }} />
      </body>
    </html>
  );
}


import './globals.css'