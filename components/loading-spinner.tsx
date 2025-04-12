"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoadingSpinnerController() {
  useEffect(() => {
    const handleBeforeNavigate = () => {
      const spinner = document.getElementById('global-loading-spinner')
      if (spinner) {
        spinner.classList.remove('opacity-0', 'pointer-events-none')
        spinner.classList.add('opacity-100')
      }
    }

    const handleAfterNavigate = () => {
      const spinner = document.getElementById('global-loading-spinner')
      if (spinner) {
        spinner.classList.add('opacity-0', 'pointer-events-none')
        spinner.classList.remove('opacity-100')
      }
    }

    // Show spinner on page load
    window.addEventListener('load', handleAfterNavigate)
    
    // Show spinner on navigation
    window.addEventListener('beforeunload', handleBeforeNavigate)
    
    // For client-side navigation
    document.addEventListener('next-route-change-start', handleBeforeNavigate)
    document.addEventListener('next-route-change-complete', handleAfterNavigate)
    document.addEventListener('next-route-change-error', handleAfterNavigate)
    
    // Alternative event names
    document.addEventListener('routeChangeStart', handleBeforeNavigate)
    document.addEventListener('routeChangeComplete', handleAfterNavigate)
    document.addEventListener('routeChangeError', handleAfterNavigate)

    return () => {
      window.removeEventListener('load', handleAfterNavigate)
      window.removeEventListener('beforeunload', handleBeforeNavigate)
      
      document.removeEventListener('next-route-change-start', handleBeforeNavigate)
      document.removeEventListener('next-route-change-complete', handleAfterNavigate)
      document.removeEventListener('next-route-change-error', handleAfterNavigate)
      
      document.removeEventListener('routeChangeStart', handleBeforeNavigate)
      document.removeEventListener('routeChangeComplete', handleAfterNavigate)
      document.removeEventListener('routeChangeError', handleAfterNavigate)
    }
  }, [])

  return null
}