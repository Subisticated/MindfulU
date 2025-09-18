"use client"

import React, { createContext, useContext, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useMongoose } from "@/components/mongoose-provider"

interface UserFlowContextType {
  redirectToAppropriateRoute: () => void
}

const UserFlowContext = createContext<UserFlowContextType | undefined>(undefined)

interface UserFlowProviderProps {
  children: ReactNode
}

export function UserFlowProvider({ children }: UserFlowProviderProps) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { data: databaseData, loading } = useMongoose()

  const redirectToAppropriateRoute = () => {
    // Don't redirect if still loading
    if (status === "loading" || loading) {
      return
    }

    // If not authenticated, redirect to sign in
    if (!session) {
      router.push('/auth/signin')
      return
    }

    // If authenticated but onboarding not completed, redirect to onboarding
    if (!databaseData.onboardingCompleted) {
      router.push('/onboarding')
      return
    }

    // If onboarding completed, redirect to dashboard
    router.push('/dashboard')
  }

  return (
    <UserFlowContext.Provider value={{ redirectToAppropriateRoute }}>
      {children}
    </UserFlowContext.Provider>
  )
}

export function useUserFlow() {
  const context = useContext(UserFlowContext)
  if (context === undefined) {
    throw new Error('useUserFlow must be used within a UserFlowProvider')
  }
  return context
}
