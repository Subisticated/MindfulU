"use client"

import { lazy, Suspense } from 'react'
import { PageLoadingSkeleton } from '@/lib/lazy-components'

// HOC for lazy loading pages
export function withLazyLoading(
  importFn: () => Promise<{ default: React.ComponentType<any> }>,
  fallback: React.ReactNode = <PageLoadingSkeleton />
) {
  const LazyComponent = lazy(importFn)
  
  return function LazyLoadedPage(props: any) {
    return (
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    )
  }
}

// Route-based lazy loading
export const LazyPages = {
  // Main app pages
  Dashboard: lazy(() => import('@/app/dashboard/page')),
  Journal: lazy(() => import('@/app/journal/page')),
  Meditation: lazy(() => import('@/app/meditation/page')),
  Breathing: lazy(() => import('@/app/breathing/page')),
  FocusTimer: lazy(() => import('@/app/focus-timer/page')),
  Booking: lazy(() => import('@/app/booking/page')),
  Settings: lazy(() => import('@/app/settings/page')),
  AIAssistant: lazy(() => import('@/app/ai-assistant/page')),
  CounselorDashboard: lazy(() => import('@/app/counselor-dashboard/page')),
  CompleteAssessment: lazy(() => import('@/app/complete-assessment/page')),
  Onboarding: lazy(() => import('@/app/onboarding/page')),
  
  // Auth pages
  SignIn: lazy(() => import('@/app/auth/signin/page')),
  SignUp: lazy(() => import('@/app/auth/signup/page')),
} as const

// Dynamic page loader with route-based code splitting
export function PageLoader({ pageName, ...props }: { pageName: string } & Record<string, any>) {
  const PageComponent = (LazyPages as any)[pageName]
  
  if (!PageComponent) {
    return <div>Page not found</div>
  }
  
  return (
    <Suspense fallback={<PageLoadingSkeleton />}>
      <PageComponent {...props} />
    </Suspense>
  )
}
