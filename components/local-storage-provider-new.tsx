"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { 
  getUserData, 
  saveUserData, 
  updateOnboardingData, 
  clearUserData, 
  isUserLoggedIn,
  getUserWellnessLevel,
  getPersonalizedRecommendations,
  UserData, 
  OnboardingData, 
  AssessmentScores,
  UserProfile
} from '@/lib/cookie-storage'

interface LocalStorageContextType {
  data: UserData
  updateData: (updates: Partial<UserData>) => void
  updateOnboarding: (updates: Partial<OnboardingData>) => void
  clearData: () => void
  isLoggedIn: boolean
  wellnessLevel: string
  personalizedRecommendations: string[]
  completeOnboarding: (userProfile: UserProfile, assessmentData: AssessmentScores, answers: Record<string, any>) => void
}

const LocalStorageContext = createContext<LocalStorageContextType | undefined>(undefined)

export function LocalStorageProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<UserData | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load data from cookies/localStorage on client side
    if (typeof window !== 'undefined') {
      try {
        const userData = getUserData()
        setData(userData)
      } catch (error) {
        console.error('Error loading user data:', error)
        setData(getUserData()) // Get default data
      }
      setIsLoaded(true)
    }
  }, [])

  const updateData = (updates: Partial<UserData>) => {
    if (!data) return
    
    const updatedData = { ...data, ...updates }
    setData(updatedData)
    saveUserData(updatedData)
  }

  const updateOnboardingState = (updates: Partial<OnboardingData>) => {
    if (!data) return
    
    const updatedData = {
      ...data,
      onboarding: {
        ...data.onboarding,
        ...updates
      }
    }
    setData(updatedData)
    updateOnboardingData(updates)
  }

  const completeOnboarding = (
    userProfile: UserProfile, 
    assessmentData: AssessmentScores, 
    answers: Record<string, any>
  ) => {
    const onboardingUpdate: OnboardingData = {
      completed: true,
      userProfile,
      assessmentData,
      answers,
      recommendations: getPersonalizedRecommendations()
    }
    
    updateOnboardingState(onboardingUpdate)
  }

  const clearDataHandler = () => {
    clearUserData()
    const defaultData = getUserData()
    setData(defaultData)
  }

  // Don't render until data is loaded on client side
  if (!isLoaded || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card to-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-b-transparent border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your wellness journey...</p>
        </div>
      </div>
    )
  }

  const contextValue: LocalStorageContextType = {
    data,
    updateData,
    updateOnboarding: updateOnboardingState,
    clearData: clearDataHandler,
    isLoggedIn: isUserLoggedIn(),
    wellnessLevel: getUserWellnessLevel(),
    personalizedRecommendations: getPersonalizedRecommendations(),
    completeOnboarding
  }

  return (
    <LocalStorageContext.Provider value={contextValue}>
      {children}
    </LocalStorageContext.Provider>
  )
}

export function useLocalStorage() {
  const context = useContext(LocalStorageContext)
  if (context === undefined) {
    throw new Error('useLocalStorage must be used within a LocalStorageProvider')
  }
  return context
}

// Export types for backward compatibility
export type { UserData as LocalStorageData, OnboardingData }
