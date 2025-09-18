"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

// Types that match the local storage interface
export interface UserProfile {
  id?: string
  name: string
  email: string
  university: string
  completedAt: string
}

export interface AssessmentScores {
  phq9Score: number
  gad7Score: number
  pss10Score: number
  overallWellnessScore: number
  riskLevel: 'excellent' | 'mild' | 'moderate' | 'challenging'
  completedAt: string
}

export interface OnboardingData {
  completed: boolean
  userProfile?: UserProfile
  assessmentData?: AssessmentScores
  answers?: Record<string, any>
  recommendations?: string[]
}

export interface JournalEntry {
  id: string
  title: string
  content: string
  tags: string[]
  mood?: string
  createdAt: string
  updatedAt: string
}

export interface UserData {
  onboarding: OnboardingData
  journals: JournalEntry[]
  currentMood?: string
  moodHistory: Array<{
    mood: string
    timestamp: string
  }>
  preferences: {
    theme?: string
    notifications?: boolean
    privacy?: 'private' | 'anonymous'
  }
  sessionId: string
  lastActive: string
}

interface DatabaseProviderContextType {
  data: UserData
  updateData: (updates: Partial<UserData>) => void
  updateOnboarding: (updates: Partial<OnboardingData>) => void
  clearData: () => void
  logout: () => void
  isLoggedIn: boolean
  wellnessLevel: string
  personalizedRecommendations: string[]
  completeOnboarding: (userProfile: UserProfile, assessmentData: AssessmentScores, answers: Record<string, any>) => Promise<void>
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateJournalEntry: (id: string, updates: Partial<Omit<JournalEntry, 'id' | 'createdAt'>>) => Promise<void>
  deleteJournalEntry: (id: string) => Promise<void>
  getJournalEntry: (id: string) => JournalEntry | undefined
  updateMood: (mood: string) => Promise<void>
  loading: boolean
}

const DatabaseProviderContext = createContext<DatabaseProviderContextType | undefined>(undefined)

// Generate a unique session ID
const generateSessionId = (): string => {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

// Default user data structure
const getDefaultUserData = (): UserData => ({
  onboarding: {
    completed: false
  },
  journals: [],
  currentMood: undefined,
  moodHistory: [],
  preferences: {
    theme: 'system',
    notifications: true,
    privacy: 'private'
  },
  sessionId: generateSessionId(),
  lastActive: new Date().toISOString()
})

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [data, setData] = useState<UserData>(getDefaultUserData())
  const [loading, setLoading] = useState(true)

  // API helper function
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`/api${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`)
    }

    return response.json()
  }

  // Load user data from database
  const loadUserData = async () => {
    if (!session?.user?.email) {
      setData(getDefaultUserData())
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      
      // Fetch user profile and assessment data
      const userProfileResponse = await apiCall('/user/profile')
      const journalResponse = await apiCall('/journal')
      const moodResponse = await apiCall('/mood')

      const userData: UserData = {
        onboarding: {
          completed: userProfileResponse.hasCompletedAssessment || false,
          userProfile: userProfileResponse.user ? {
            id: userProfileResponse.user.id,
            name: userProfileResponse.user.name || '',
            email: userProfileResponse.user.email,
            university: userProfileResponse.user.university || '',
            completedAt: userProfileResponse.latestAssessment?.completedAt || new Date().toISOString()
          } : undefined,
          assessmentData: userProfileResponse.latestAssessment ? {
            phq9Score: userProfileResponse.latestAssessment.phq9Score,
            gad7Score: userProfileResponse.latestAssessment.gad7Score,
            pss10Score: userProfileResponse.latestAssessment.pss10Score,
            overallWellnessScore: userProfileResponse.latestAssessment.overallWellnessScore,
            riskLevel: userProfileResponse.latestAssessment.riskLevel,
            completedAt: userProfileResponse.latestAssessment.completedAt
          } : undefined,
          answers: userProfileResponse.latestAssessment ? 
            JSON.parse(userProfileResponse.latestAssessment.answers || '{}') : undefined,
          recommendations: userProfileResponse.latestAssessment?.recommendations ? 
            JSON.parse(userProfileResponse.latestAssessment.recommendations || '[]') : undefined
        },
        journals: journalResponse.entries?.map((entry: any) => ({
          id: entry.id,
          title: entry.title,
          content: entry.content,
          tags: entry.tags ? JSON.parse(entry.tags) : [],
          mood: entry.mood,
          createdAt: entry.createdAt,
          updatedAt: entry.updatedAt
        })) || [],
        currentMood: moodResponse.currentMood,
        moodHistory: moodResponse.moodHistory?.map((mood: any) => ({
          mood: mood.mood,
          timestamp: mood.createdAt
        })) || [],
        preferences: {
          theme: 'system',
          notifications: true,
          privacy: 'private'
        },
        sessionId: generateSessionId(),
        lastActive: new Date().toISOString()
      }

      setData(userData)
    } catch (error) {
      console.error('Error loading user data:', error)
      setData(getDefaultUserData())
    } finally {
      setLoading(false)
    }
  }

  // Load data when session changes
  useEffect(() => {
    if (status !== 'loading') {
      loadUserData()
    }
  }, [session, status])

  const updateData = (updates: Partial<UserData>) => {
    setData(prev => ({ ...prev, ...updates, lastActive: new Date().toISOString() }))
  }

  const updateOnboarding = (updates: Partial<OnboardingData>) => {
    setData(prev => ({
      ...prev,
      onboarding: { ...prev.onboarding, ...updates },
      lastActive: new Date().toISOString()
    }))
  }

  const completeOnboarding = async (
    userProfile: UserProfile, 
    assessmentData: AssessmentScores, 
    answers: Record<string, any>
  ) => {
    try {
      // Save assessment to database
      await apiCall('/assessments', {
        method: 'POST',
        body: JSON.stringify({
          ...assessmentData,
          answers
        })
      })

      // Update user profile if needed
      if (userProfile.university) {
        await apiCall('/user/profile', {
          method: 'PUT',
          body: JSON.stringify({
            university: userProfile.university
          })
        })
      }

      // Update local state
      const onboardingUpdate: OnboardingData = {
        completed: true,
        userProfile,
        assessmentData,
        answers,
        recommendations: getPersonalizedRecommendations(assessmentData)
      }
      
      updateOnboarding(onboardingUpdate)
    } catch (error) {
      console.error('Error completing onboarding:', error)
      throw error
    }
  }

  const addJournalEntry = async (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await apiCall('/journal', {
        method: 'POST',
        body: JSON.stringify({
          title: entry.title,
          content: entry.content,
          mood: entry.mood,
          tags: entry.tags
        })
      })

      // Refresh journal entries
      await loadUserData()
    } catch (error) {
      console.error('Error adding journal entry:', error)
      throw error
    }
  }

  const updateJournalEntry = async (id: string, updates: Partial<Omit<JournalEntry, 'id' | 'createdAt'>>) => {
    try {
      await apiCall(`/journal/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      })

      // Update local state
      setData(prev => ({
        ...prev,
        journals: prev.journals.map(entry => 
          entry.id === id 
            ? { ...entry, ...updates, updatedAt: new Date().toISOString() }
            : entry
        )
      }))
    } catch (error) {
      console.error('Error updating journal entry:', error)
      throw error
    }
  }

  const deleteJournalEntry = async (id: string) => {
    try {
      await apiCall(`/journal/${id}`, {
        method: 'DELETE'
      })

      // Update local state
      setData(prev => ({
        ...prev,
        journals: prev.journals.filter(entry => entry.id !== id)
      }))
    } catch (error) {
      console.error('Error deleting journal entry:', error)
      throw error
    }
  }

  const getJournalEntry = (id: string): JournalEntry | undefined => {
    return data.journals.find(entry => entry.id === id)
  }

  const updateMood = async (mood: string) => {
    try {
      await apiCall('/mood', {
        method: 'POST',
        body: JSON.stringify({ mood })
      })

      // Update local state
      setData(prev => ({
        ...prev,
        currentMood: mood,
        moodHistory: [
          { mood, timestamp: new Date().toISOString() },
          ...prev.moodHistory
        ].slice(0, 30) // Keep last 30 mood entries
      }))
    } catch (error) {
      console.error('Error updating mood:', error)
      throw error
    }
  }

  const getPersonalizedRecommendations = (assessment?: AssessmentScores): string[] => {
    if (!assessment) return []

    const recommendations: string[] = []
    
    if (assessment.phq9Score > 10) {
      recommendations.push("Consider talking to a counselor about your feelings")
      recommendations.push("Try daily journaling to express your thoughts")
    }
    
    if (assessment.gad7Score > 8) {
      recommendations.push("Practice daily breathing exercises")
      recommendations.push("Try meditation to reduce anxiety")
    }
    
    if (assessment.pss10Score > 20) {
      recommendations.push("Focus on stress management techniques")
      recommendations.push("Consider time management strategies")
    }

    if (recommendations.length === 0) {
      recommendations.push("Keep up your great mental health habits!")
      recommendations.push("Continue regular self-check-ins")
    }

    return recommendations
  }

  const clearData = () => {
    setData(getDefaultUserData())
  }

  const logout = () => {
    clearData()
    // The actual logout will be handled by NextAuth
  }

  // Show loading screen while data is being loaded
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card to-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-b-transparent border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your wellness journey...</p>
        </div>
      </div>
    )
  }

  const contextValue: DatabaseProviderContextType = {
    data,
    updateData,
    updateOnboarding,
    clearData,
    logout,
    isLoggedIn: !!session,
    wellnessLevel: data.onboarding.assessmentData?.riskLevel || 'unknown',
    personalizedRecommendations: getPersonalizedRecommendations(data.onboarding.assessmentData),
    completeOnboarding,
    addJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    getJournalEntry,
    updateMood,
    loading
  }

  return (
    <DatabaseProviderContext.Provider value={contextValue}>
      {children}
    </DatabaseProviderContext.Provider>
  )
}

export function useDatabase() {
  const context = useContext(DatabaseProviderContext)
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider')
  }
  return context
}

// Export types for backward compatibility
export type { UserData as DatabaseData }
