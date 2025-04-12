"use client"

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'

function NavigationEventsContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // This effect runs on route change
    const spinner = document.getElementById('global-loading-spinner')
    if (spinner) {
      // First show the spinner
      spinner.classList.remove('opacity-0', 'pointer-events-none')
      spinner.classList.add('opacity-100')
      
      // Then hide it after a short delay
      setTimeout(() => {
        spinner.classList.add('opacity-0', 'pointer-events-none')
        spinner.classList.remove('opacity-100')
      }, 500)
    }
  }, [pathname, searchParams])

  return null
}

export default function NavigationEvents() {
  return (
    <Suspense fallback={null}>
      <NavigationEventsContent />
    </Suspense>
  )
}