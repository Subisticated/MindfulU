"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useLocalStorage } from "@/components/local-storage-provider"

export function OnboardingCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { data } = useLocalStorage()

  useEffect(() => {
    // Skip onboarding check for onboarding page and landing page
    if (pathname === "/onboarding" || pathname === "/") {
      return
    }

    // If onboarding is not completed, redirect to onboarding
    if (!data?.onboarding?.completed) {
      router.push("/onboarding")
    }
  }, [data?.onboarding?.completed, pathname, router])

  // Show children if onboarding is completed or on allowed pages
  if (pathname === "/onboarding" || pathname === "/" || data?.onboarding?.completed) {
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
