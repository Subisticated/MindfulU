"use client"

import { lazy, Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

// Loading fallback components
export const PageLoadingSkeleton = () => (
  <div className="min-h-screen bg-background">
    <div className="container mx-auto p-6 space-y-6">
      <Skeleton className="h-8 w-64" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
)

export const ComponentLoadingSkeleton = ({ className = "" }: { className?: string }) => (
  <div className={`space-y-4 ${className}`}>
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-32 w-full" />
  </div>
)

export const CardLoadingSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-32 w-full" />
    </CardContent>
  </Card>
)

// Lazy wrapper component with error boundary
export function LazyWrapper({ 
  children, 
  fallback = <PageLoadingSkeleton />,
  className = ""
}: { 
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string 
}) {
  return (
    <Suspense fallback={fallback}>
      <div className={className}>
        {children}
      </div>
    </Suspense>
  )
}

// Lazy load major components
export const LazyDashboard = lazy(() => import('@/app/dashboard/page'))
export const LazyJournal = lazy(() => import('@/app/journal/page'))
export const LazyMeditation = lazy(() => import('@/app/meditation/page'))
export const LazyBreathing = lazy(() => import('@/app/breathing/page'))
export const LazyFocusTimer = lazy(() => import('@/app/focus-timer/page'))
export const LazyBooking = lazy(() => import('@/app/booking/page'))
export const LazySettings = lazy(() => import('@/app/settings/page'))
export const LazyAIAssistant = lazy(() => import('@/app/ai-assistant/page'))
export const LazyCounselorDashboard = lazy(() => import('@/app/counselor-dashboard/page'))
export const LazyCompleteAssessment = lazy(() => import('@/app/complete-assessment/page'))
export const LazyOnboarding = lazy(() => import('@/app/onboarding/page'))

// Lazy load components
export const LazyMoodTrackerCard = lazy(() => import('@/components/mood-tracker-card').then(m => ({ default: m.MoodTrackerCard })))
export const LazyDailyJournalCard = lazy(() => import('@/components/daily-journal-card').then(m => ({ default: m.DailyJournalCard })))
export const LazyDailyToolsCard = lazy(() => import('@/components/daily-tools-card').then(m => ({ default: m.DailyToolsCard })))
export const LazyWellnessInsights = lazy(() => import('@/components/wellness-insights').then(m => ({ default: m.WellnessInsights })))
export const LazyAIAssistantCard = lazy(() => import('@/components/ai-assistant-card').then(m => ({ default: m.AIAssistantCard })))
export const LazyJournalModal = lazy(() => import('@/components/journal-modal').then(m => ({ default: m.JournalModal })))

// Lazy load Questionnaire components
export const LazyQuestionnaire = lazy(() => import('@/components/Questionnaire/Questionnaire').then(m => ({ default: m.Questionnaire })))
export const LazyQuickQuestionnaire = lazy(() => import('@/components/Questionnaire/QuickQuestionnaire').then(m => ({ default: m.QuickQuestionnaire })))
export const LazyQuestionCard = lazy(() => import('@/components/Questionnaire/QuestionCard').then(m => ({ default: m.QuestionCard })))
