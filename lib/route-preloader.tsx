"use client"

import { lazy, Suspense, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PageLoadingSkeleton } from '@/lib/lazy-components'

// Preload function for components
const preloadComponent = (importFn: () => Promise<any>) => {
  const componentImport = importFn()
  return componentImport
}

// Route-based preloading system
export const routePreloader = {
  // Preload critical routes
  preloadDashboard: () => preloadComponent(() => import('@/app/dashboard/page')),
  preloadJournal: () => preloadComponent(() => import('@/app/journal/page')),
  preloadMeditation: () => preloadComponent(() => import('@/app/meditation/page')),
  preloadBreathing: () => preloadComponent(() => import('@/app/breathing/page')),
  preloadSettings: () => preloadComponent(() => import('@/app/settings/page')),
  preloadOnboarding: () => preloadComponent(() => import('@/app/onboarding/page')),
  
  // Preload heavy components
  preloadQuestionnaire: () => preloadComponent(() => import('@/components/Questionnaire/Questionnaire')),
  preloadQuickQuestionnaire: () => preloadComponent(() => import('@/components/Questionnaire/QuickQuestionnaire')),
}

// Hook for preloading routes on hover/focus
export const useRoutePreloader = () => {
  const preloadRoute = (routePath: string) => {
    const route = routePath.replace('/', '').toLowerCase()
    const preloadFn = (routePreloader as any)[`preload${route.charAt(0).toUpperCase() + route.slice(1)}`]
    if (preloadFn) {
      preloadFn()
    }
  }

  return { preloadRoute }
}

// Enhanced Link component with preloading
export const PreloadLink = ({ 
  href, 
  children, 
  className = "",
  preloadDelay = 200,
  ...props 
}: {
  href: string
  children: React.ReactNode
  className?: string
  preloadDelay?: number
} & React.ComponentProps<'a'>) => {
  const { preloadRoute } = useRoutePreloader()
  let preloadTimer: NodeJS.Timeout

  const handleMouseEnter = () => {
    preloadTimer = setTimeout(() => {
      preloadRoute(href)
    }, preloadDelay)
  }

  const handleMouseLeave = () => {
    if (preloadTimer) {
      clearTimeout(preloadTimer)
    }
  }

  return (
    <a
      href={href}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      {...props}
    >
      {children}
    </a>
  )
}

// Critical resource preloader
export const CriticalResourcePreloader = () => {
  useEffect(() => {
    // Preload critical routes after initial render
    const preloadCritical = async () => {
      // Wait a bit for initial page to settle
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Preload in order of importance
      routePreloader.preloadDashboard()
      
      // Then preload other common routes with delays
      setTimeout(() => routePreloader.preloadJournal(), 500)
      setTimeout(() => routePreloader.preloadMeditation(), 1000)
      setTimeout(() => routePreloader.preloadSettings(), 1500)
    }

    preloadCritical()
  }, [])

  return null // This is just a side-effect component
}

// Bundle analyzer helper (development only)
export const BundleAnalyzer = () => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 Lazy loading system active')
      console.log('📦 Available preloaders:', Object.keys(routePreloader))
    }
  }, [])

  return null
}
