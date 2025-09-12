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
  addJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  getJournalEntry,
  updateMood,
  UserData, 
  OnboardingData, 
  AssessmentScores,
  UserProfile,
  JournalEntry
} from '@/lib/cookie-storage'

interface LocalStorageContextType {
  data: UserData
  updateData: (updates: Partial<UserData>) => void
  updateOnboarding: (updates: Partial<OnboardingData>) => void
  clearData: () => void
  logout: () => void
  isLoggedIn: boolean
  wellnessLevel: string
  personalizedRecommendations: string[]
  completeOnboarding: (userProfile: UserProfile, assessmentData: AssessmentScores, answers: Record<string, any>) => void
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateJournalEntry: (id: string, updates: Partial<Omit<JournalEntry, 'id' | 'createdAt'>>) => void
  deleteJournalEntry: (id: string) => void
  getJournalEntry: (id: string) => JournalEntry | undefined
  updateMood: (mood: string) => void
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

  const logoutHandler = () => {
    clearUserData()
    const defaultData = getUserData()
    setData(defaultData)
    // Optional: redirect to home page
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
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
    logout: logoutHandler,
    isLoggedIn: isUserLoggedIn(),
    wellnessLevel: getUserWellnessLevel(),
    personalizedRecommendations: getPersonalizedRecommendations(),
    completeOnboarding,
    addJournalEntry: (entry) => {
      addJournalEntry(entry)
      setData(getUserData()) // Refresh the data after adding
    },
    updateJournalEntry: (id, updates) => {
      updateJournalEntry(id, updates)
      setData(getUserData()) // Refresh the data after updating
    },
    deleteJournalEntry: (id) => {
      deleteJournalEntry(id)
      setData(getUserData()) // Refresh the data after deleting
    },
    getJournalEntry,
    updateMood: (mood) => {
      updateMood(mood)
      setData(getUserData()) // Refresh the data after updating mood
    }
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
