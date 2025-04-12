"use client"

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function NavigationEvents() {
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