'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useSession } from 'next-auth/react'

// Types for our data
export interface UserData {
  id?: string
  name?: string
  email?: string
  university?: string
  dateOfBirth?: string
  assessments?: Assessment[]
  journalEntries?: JournalEntry[]
  moodEntries?: MoodEntry[]
  onboardingCompleted?: boolean
}

export interface Assessment {
  id: string
  phq9Score: number
  gad7Score: number
  pss10Score: number
  overallWellnessScore: number
  riskLevel: string
  answers: any
  recommendations?: any
  completedAt: string
}

export interface JournalEntry {
  id: string
  title: string
  content: string
  mood?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface MoodEntry {
  id: string
  mood: string
  notes?: string
  createdAt: string
}

interface MongooseContextType {
  data: UserData
  loading: boolean
  isLoggedIn: boolean
  personalizedRecommendations: string[]
  loadUserData: () => Promise<void>
  updateData: (updates: Partial<UserData>) => void
  completeOnboarding: (onboardingData: any) => Promise<void>
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  deleteJournalEntry: (id: string) => Promise<void>
  updateJournalEntry: (id: string, updates: Partial<JournalEntry>) => Promise<void>
  updateMood: (mood: string, notes?: string) => Promise<void>
  saveAssessment: (assessment: any) => Promise<void>
  refreshUserProfile: () => Promise<void>
  logout: () => void
}

const MongooseContext = createContext<MongooseContextType | undefined>(undefined)

function getDefaultUserData(): UserData {
  return {
    assessments: [],
    journalEntries: [],
    moodEntries: [],
    onboardingCompleted: false,
  }
}

export function MongooseProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [data, setData] = useState<UserData>(getDefaultUserData())
  const [loading, setLoading] = useState(true)

  // Helper function for API calls
  const apiCall = async (url: string, options: RequestInit = {}) => {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        const errorMessage = `API call failed: ${response.status} ${response.statusText || 'Unknown error'}`
        console.error(errorMessage, { url, status: response.status })
        
        // Create an error object with status information
        const error = new Error(errorMessage) as Error & { status: number }
        error.status = response.status
        throw error
      }

      return response.json()
    } catch (error) {
      // If it's already our custom error, re-throw it
      if (error instanceof Error && 'status' in error) {
        throw error
      }
      
      // For other errors (network issues, etc.), wrap them
      console.error('Network or parsing error:', error)
      const networkError = new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`) as Error & { status: number }
      networkError.status = 0
      throw networkError
    }
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
      const userData = await apiCall('/api/user/profile')
      console.log('Loaded user data:', { 
        hasAssessments: userData.assessments?.length > 0, 
        assessmentCount: userData.assessments?.length || 0,
        onboardingWillBe: userData.assessments?.length > 0 
      })
      setData({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        university: userData.university,
        dateOfBirth: userData.dateOfBirth,
        assessments: userData.assessments || [],
        journalEntries: userData.journalEntries || [],
        moodEntries: userData.moodEntries || [],
        onboardingCompleted: userData.assessments?.length > 0,
      })
    } catch (error: any) {
      // If user doesn't exist (404), that's fine - use default data
      if (error.status === 404 || error.message.includes('404')) {
        console.log('User not found in database, using default data')
        setData(getDefaultUserData())
      } else {
        console.error('Failed to load user data:', error)
        setData(getDefaultUserData())
      }
    } finally {
      setLoading(false)
    }
  }

  // Complete onboarding with assessment
  const completeOnboarding = async (onboardingData: any) => {
    try {
      // Restructure the data to match what the API expects
      const assessmentPayload = {
        phq9Score: onboardingData.assessmentData?.phq9Score || 0,
        gad7Score: onboardingData.assessmentData?.gad7Score || 0,
        pss10Score: onboardingData.assessmentData?.pss10Score || 0,
        overallWellnessScore: onboardingData.assessmentData?.overallWellnessScore || 0,
        riskLevel: onboardingData.assessmentData?.riskLevel || "mild",
        answers: onboardingData.answers || {},
        recommendations: onboardingData.assessmentData?.recommendations || null,
      }

      console.log('Attempting to save assessment:', assessmentPayload)
      const assessment = await apiCall('/api/assessments', {
        method: 'POST',
        body: JSON.stringify(assessmentPayload),
      })
      
      console.log('Assessment saved successfully:', assessment)
      
      // Immediately update local state to mark onboarding as completed and add assessment
      setData(prev => ({
        ...prev,
        onboardingCompleted: true,
        assessments: [assessment, ...(prev.assessments || [])],
        // Also update user profile data if provided
        name: onboardingData.userProfile?.name || prev.name,
        email: onboardingData.userProfile?.email || prev.email,
        university: onboardingData.userProfile?.university || prev.university,
      }))
      
      console.log('Local state updated: onboardingCompleted set to true')
      
      // Refresh data from server after a short delay to ensure consistency
      setTimeout(async () => {
        try {
          await loadUserData()
          console.log('User data refreshed after assessment completion')
        } catch (error) {
          console.error('Failed to refresh user data, but onboarding is marked complete:', error)
        }
      }, 500)
    } catch (error: any) {
      console.error('Failed to complete onboarding:', error)
      // Even if API fails, mark onboarding as completed locally to prevent infinite loop
      // This is important for offline functionality and error resilience
      setData(prev => ({
        ...prev,
        onboardingCompleted: true,
        // Still update user profile data locally
        name: onboardingData.userProfile?.name || prev.name,
        email: onboardingData.userProfile?.email || prev.email,
        university: onboardingData.userProfile?.university || prev.university,
      }))
      
      console.log('Marked onboarding as complete locally despite API error to prevent redirect loop')
    }
  }

  // Add journal entry
  const addJournalEntry = async (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const journalEntry = await apiCall('/api/journal', {
        method: 'POST',
        body: JSON.stringify({
          title: entry.title,
          content: entry.content,
          mood: entry.mood,
          tags: entry.tags ? JSON.stringify(entry.tags) : undefined,
        }),
      })

      // Update local state
      setData(prev => ({
        ...prev,
        journalEntries: [journalEntry, ...(prev.journalEntries || [])],
      }))
    } catch (error: any) {
      console.error('Failed to add journal entry:', error)
      // Don't throw to prevent app crashes - just log the error
      if (error.status === 404) {
        console.log('User not found for journal entry, but continuing...')
      }
    }
  }

  // Delete journal entry
  const deleteJournalEntry = async (id: string) => {
    try {
      await apiCall(`/api/journal?id=${id}`, {
        method: 'DELETE',
      })

      // Update local state
      setData(prev => ({
        ...prev,
        journalEntries: prev.journalEntries?.filter(entry => entry.id !== id) || [],
      }))
    } catch (error: any) {
      console.error('Failed to delete journal entry:', error)
      // Don't throw to prevent app crashes
      if (error.status === 404) {
        console.log('Journal entry not found for deletion, but continuing...')
      }
    }
  }

  // Update journal entry
  const updateJournalEntry = async (id: string, updates: Partial<JournalEntry>) => {
    try {
      const updatedEntry = await apiCall(`/api/journal/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      })

      // Update local state
      setData(prev => ({
        ...prev,
        journalEntries: prev.journalEntries?.map(entry => 
          entry.id === id ? { ...entry, ...updatedEntry } : entry
        ) || [],
      }))
    } catch (error: any) {
      console.error('Failed to update journal entry:', error)
      // Don't throw to prevent app crashes
      if (error.status === 404) {
        console.log('Journal entry not found for update, but continuing...')
      }
    }
  }

  // Update mood
  const updateMood = async (mood: string, notes?: string) => {
    try {
      const moodEntry = await apiCall('/api/mood', {
        method: 'POST',
        body: JSON.stringify({ mood, notes }),
      })

      // Update local state
      setData(prev => ({
        ...prev,
        moodEntries: [moodEntry, ...(prev.moodEntries || [])],
      }))
    } catch (error: any) {
      console.error('Failed to update mood:', error)
      // Don't throw to prevent app crashes
      if (error.status === 404) {
        console.log('User not found for mood update, but continuing...')
      }
    }
  }

  // Save assessment
  const saveAssessment = async (assessment: any) => {
    try {
      const savedAssessment = await apiCall('/api/assessments', {
        method: 'POST',
        body: JSON.stringify(assessment),
      })

      // Update local state
      setData(prev => ({
        ...prev,
        assessments: [savedAssessment, ...(prev.assessments || [])],
        onboardingCompleted: true,
      }))
    } catch (error: any) {
      console.error('Failed to save assessment:', error)
      // Don't throw to prevent app crashes
      if (error.status === 404) {
        console.log('User not found for assessment save, but continuing...')
      }
    }
  }

  // Refresh user profile
  const refreshUserProfile = async () => {
    await loadUserData()
  }

  // Update data locally
  const updateData = (updates: Partial<UserData>) => {
    setData(prev => ({ ...prev, ...updates }))
  }

  // Logout function 
  const logout = () => {
    setData({})
    // You could also add signOut from next-auth here if needed
  }

  // Get personalized recommendations based on assessments
  const getPersonalizedRecommendations = (): string[] => {
    const latestAssessment = data.assessments?.[0]
    if (!latestAssessment) {
      return [
        "Complete your wellness assessment to get personalized recommendations",
        "Start with daily meditation for 5-10 minutes",
        "Practice gratitude journaling each morning"
      ]
    }

    const recommendations: string[] = []
    
    if (latestAssessment.phq9Score > 10) {
      recommendations.push("Consider speaking with a mental health professional")
      recommendations.push("Practice daily mindfulness exercises")
    }
    
    if (latestAssessment.gad7Score > 8) {
      recommendations.push("Try breathing exercises when feeling anxious")
      recommendations.push("Regular physical exercise can help manage anxiety")
    }
    
    if (latestAssessment.pss10Score > 20) {
      recommendations.push("Focus on stress management techniques")
      recommendations.push("Consider time management strategies")
    }

    if (recommendations.length === 0) {
      recommendations.push("Keep maintaining your current wellness practices")
      recommendations.push("Regular check-ins with yourself are beneficial")
    }

    return recommendations
  }

  // Load data when session changes
  useEffect(() => {
    if (status === 'loading') return
    loadUserData()
  }, [session, status])

  const value: MongooseContextType = {
    data,
    loading,
    isLoggedIn: !!session,
    personalizedRecommendations: getPersonalizedRecommendations(),
    loadUserData,
    updateData,
    completeOnboarding,
    addJournalEntry,
    deleteJournalEntry,
    updateJournalEntry,
    updateMood,
    saveAssessment,
    refreshUserProfile,
    logout,
  }

  return (
    <MongooseContext.Provider value={value}>
      {children}
    </MongooseContext.Provider>
  )
}

export function useMongoose() {
  const context = useContext(MongooseContext)
  if (context === undefined) {
    throw new Error('useMongoose must be used within a MongooseProvider')
  }
  return context
}
