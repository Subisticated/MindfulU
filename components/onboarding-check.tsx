"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useMongoose } from "@/components/mongoose-provider"

export function OnboardingCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { data, loading } = useMongoose()

  useEffect(() => {
    // Skip onboarding check for static files, API routes, and special Next.js paths
    if (
      pathname === "/onboarding" || 
      pathname === "/" ||
      pathname.startsWith("/_next/") ||
      pathname.startsWith("/api/") ||
      pathname.startsWith("/.well-known/") ||
      pathname.includes("static/chunks") ||
      pathname.endsWith(".js") ||
      pathname.endsWith(".css") ||
      pathname.endsWith(".json")
    ) {
      return
    }

    // Don't redirect while data is still loading
    if (loading) {
      return
    }

    console.log('OnboardingCheck: pathname=', pathname, 'onboardingCompleted=', data?.onboardingCompleted, 'hasAssessments=', (data?.assessments?.length || 0) > 0)

    // Check if onboarding is completed (either flag is true OR user has assessments)
    const hasCompletedOnboarding = data?.onboardingCompleted || (data?.assessments?.length || 0) > 0

    // If onboarding is not completed, redirect to onboarding
    if (!hasCompletedOnboarding) {
      console.log('Redirecting to onboarding because onboardingCompleted is:', data?.onboardingCompleted, 'and assessments length is:', data?.assessments?.length)
      router.push("/onboarding")
    }
  }, [data?.onboardingCompleted, data?.assessments?.length, pathname, router, loading])

  // Show children if onboarding is completed or on allowed pages
  const hasCompletedOnboarding = data?.onboardingCompleted || (data?.assessments?.length || 0) > 0
  const allowedPages = ["/onboarding", "/", "/settings", "/auth/signin", "/auth/signup"]
  const isStaticFile = pathname.startsWith("/_next/") || pathname.startsWith("/api/") || pathname.startsWith("/.well-known/") || pathname.includes("static/chunks") || pathname.endsWith(".js") || pathname.endsWith(".css") || pathname.endsWith(".json")
  const shouldShowContent = allowedPages.includes(pathname) || hasCompletedOnboarding === true || isStaticFile
  
  // Only log for actual page routes, not static files
  if (!isStaticFile) {
    console.log('OnboardingCheck render: pathname=', pathname, 'onboardingCompleted=', data?.onboardingCompleted, 'hasAssessments=', (data?.assessments?.length || 0) > 0, 'shouldShowContent=', shouldShowContent)
  }
  
  // Show loading spinner while data is being loaded
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your wellness journey...</p>
        </div>
      </div>
    )
  }
  
  if (shouldShowContent) {
    return <>{children}</>
  }

  // Show loading state while redirecting
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground">Setting up your wellness journey...</p>
      </div>
    </div>
  )
}
