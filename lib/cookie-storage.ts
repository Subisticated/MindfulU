"use client"

import Cookies from 'js-cookie'

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
  riskLevel: 'minimal' | 'mild' | 'moderate' | 'severe'
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
  preferences: {
    theme?: string
    notifications?: boolean
    privacy?: 'private' | 'anonymous'
  }
  sessionId: string
  lastActive: string
}

const COOKIE_NAME = 'mindfulU-data'
const COOKIE_EXPIRY_DAYS = 30

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
  preferences: {
    theme: 'system',
    notifications: true,
    privacy: 'private'
  },
  sessionId: generateSessionId(),
  lastActive: new Date().toISOString()
})

// Save user data to cookies
export const saveUserData = (data: Partial<UserData>): void => {
  try {
    const currentData = getUserData()
    const updatedData: UserData = {
      ...currentData,
      ...data,
      lastActive: new Date().toISOString()
    }
    
    // Save to cookies with 30-day expiry
    Cookies.set(COOKIE_NAME, JSON.stringify(updatedData), {
      expires: COOKIE_EXPIRY_DAYS,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })
    
    // Also save to localStorage as backup
    if (typeof window !== 'undefined') {
      localStorage.setItem(COOKIE_NAME, JSON.stringify(updatedData))
    }
  } catch (error) {
    console.error('Error saving user data:', error)
  }
}

// Get user data from cookies
export const getUserData = (): UserData => {
  try {
    // First try to get from cookies
    const cookieData = Cookies.get(COOKIE_NAME)
    if (cookieData) {
      return { ...getDefaultUserData(), ...JSON.parse(cookieData) }
    }
    
    // Fallback to localStorage
    if (typeof window !== 'undefined') {
      const localData = localStorage.getItem(COOKIE_NAME)
      if (localData) {
        const parsedData = JSON.parse(localData)
        // Save to cookies for future use
        saveUserData(parsedData)
        return { ...getDefaultUserData(), ...parsedData }
      }
    }
    
    // Return default data if nothing found
    const defaultData = getDefaultUserData()
    saveUserData(defaultData) // Save default data
    return defaultData
  } catch (error) {
    console.error('Error retrieving user data:', error)
    return getDefaultUserData()
  }
}

// Update onboarding data specifically
export const updateOnboardingData = (data: Partial<OnboardingData>): void => {
  const currentData = getUserData()
  const updatedData: UserData = {
    ...currentData,
    onboarding: {
      ...currentData.onboarding,
      ...data
    }
  }
  saveUserData(updatedData)
}

// Update user preferences
export const updateUserPreferences = (preferences: Partial<UserData['preferences']>): void => {
  const currentData = getUserData()
  const updatedData: UserData = {
    ...currentData,
    preferences: {
      ...currentData.preferences,
      ...preferences
    }
  }
  saveUserData(updatedData)
}

// Clear all user data (logout)
export const clearUserData = (): void => {
  try {
    Cookies.remove(COOKIE_NAME)
    if (typeof window !== 'undefined') {
      localStorage.removeItem(COOKIE_NAME)
    }
  } catch (error) {
    console.error('Error clearing user data:', error)
  }
}

// Check if user is "logged in" (has completed onboarding)
export const isUserLoggedIn = (): boolean => {
  const data = getUserData()
  return data.onboarding.completed && !!data.onboarding.userProfile
}

// Get user's wellness level for personalization
export const getUserWellnessLevel = (): string => {
  const data = getUserData()
  return data.onboarding.assessmentData?.riskLevel || 'unknown'
}

// Get personalized recommendations based on user data
export const getPersonalizedRecommendations = (): string[] => {
  const data = getUserData()
  const assessmentData = data.onboarding.assessmentData
  
  if (!assessmentData) return []
  
  const recommendations: string[] = []
  
  // Add recommendations based on scores
  if (assessmentData.phq9Score >= 10) {
    recommendations.push('Consider speaking with a counselor about your mental health')
    recommendations.push('Try daily journaling to process your thoughts')
  }
  
  if (assessmentData.gad7Score >= 8) {
    recommendations.push('Practice breathing exercises and meditation')
    recommendations.push('Consider anxiety management techniques')
  }
  
  if (assessmentData.pss10Score >= 20) {
    recommendations.push('Focus on stress reduction activities')
    recommendations.push('Try progressive muscle relaxation')
  }
  
  // Always add general wellness recommendations
  recommendations.push('Maintain a consistent sleep schedule')
  recommendations.push('Stay connected with friends and family')
  recommendations.push('Engage in regular physical activity')
  
  return recommendations
}

// Journal Management Functions
export const addJournalEntry = (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>): void => {
  const data = getUserData()
  const newEntry: JournalEntry = {
    ...entry,
    id: `journal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  data.journals = [newEntry, ...data.journals]
  saveUserData(data)
}

export const updateJournalEntry = (id: string, updates: Partial<Omit<JournalEntry, 'id' | 'createdAt'>>): void => {
  const data = getUserData()
  const entryIndex = data.journals.findIndex(entry => entry.id === id)
  
  if (entryIndex !== -1) {
    data.journals[entryIndex] = {
      ...data.journals[entryIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    saveUserData(data)
  }
}

export const deleteJournalEntry = (id: string): void => {
  const data = getUserData()
  data.journals = data.journals.filter(entry => entry.id !== id)
  saveUserData(data)
}

export const getJournalEntry = (id: string): JournalEntry | undefined => {
  const data = getUserData()
  return data.journals.find(entry => entry.id === id)
}
