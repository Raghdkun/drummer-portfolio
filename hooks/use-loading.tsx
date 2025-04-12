"use client"

import { useState, useEffect } from 'react'

export function useLoading() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Set loading to false when component mounts (page is loaded)
    const timer = setTimeout(() => {
      setIsLoading(false)
      
      const spinner = document.getElementById('global-loading-spinner')
      if (spinner) {
        spinner.classList.add('opacity-0', 'pointer-events-none')
        spinner.classList.remove('opacity-100')
      }
    }, 300) // Small delay to ensure content is rendered

    // Show spinner on initial load
    const spinner = document.getElementById('global-loading-spinner')
    if (spinner && isLoading) {
      spinner.classList.remove('opacity-0', 'pointer-events-none')
      spinner.classList.add('opacity-100')
    }

    return () => clearTimeout(timer)
  }, [isLoading])

  return { isLoading, setIsLoading }
}