"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface UserProfile {
  name: string
  email: string
  avatar: string
  bio: string
}

interface NotificationSettings {
  journalReminders: boolean
  meditationReminders: boolean
  moodCheckIns: boolean
  weeklyReports: boolean
}

interface JournalEntry {
  id: string
  date: string
  title: string
  content: string
  mood: string
  tags: string[]
}

interface OnboardingData {
  completed: boolean
  stressLevel: number
  sleepQuality: number
  exerciseFrequency: string
  socialSupport: number
  academicPressure: number
  personalityType: string
  mentalHealthGoals: string[]
  answers?: Record<string, any>
  scores?: any
  recommendations?: any[]
  completedAt?: string
}

interface AppData {
  profile: UserProfile
  notifications: NotificationSettings
  journals: JournalEntry[]
  onboarding: OnboardingData
  currentMood: string
  lastMoodUpdate: string
}

const defaultData: AppData = {
  profile: {
    name: "Student",
    email: "",
    avatar: "/student-avatar.png",
    bio: "",
  },
  notifications: {
    journalReminders: true,
    meditationReminders: true,
    moodCheckIns: true,
    weeklyReports: false,
  },
  journals: [],
  onboarding: {
    completed: false,
    stressLevel: 5,
    sleepQuality: 5,
    exerciseFrequency: "sometimes",
    socialSupport: 5,
    academicPressure: 5,
    personalityType: "",
    mentalHealthGoals: [],
  },
  currentMood: "neutral",
  lastMoodUpdate: "",
}

interface LocalStorageContextType {
  data: AppData
  updateProfile: (profile: Partial<UserProfile>) => void
  updateNotifications: (notifications: Partial<NotificationSettings>) => void
  addJournalEntry: (entry: Omit<JournalEntry, "id">) => void
  updateJournalEntry: (id: string, entry: Partial<JournalEntry>) => void
  deleteJournalEntry: (id: string) => void
  updateOnboarding: (onboarding: Partial<OnboardingData>) => void
  updateMood: (mood: string) => void
  getRecommendations: () => string[]
}

const LocalStorageContext = createContext<LocalStorageContextType | undefined>(undefined)

export function LocalStorageProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(defaultData)

  useEffect(() => {
    const savedData = localStorage.getItem("mindfulU-data")
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setData({ ...defaultData, ...parsed })
      } catch (error) {
        console.error("Error parsing saved data:", error)
      }
    }
  }, [])

  const saveData = (newData: AppData) => {
    setData(newData)
    localStorage.setItem("mindfulU-data", JSON.stringify(newData))
  }

  const updateProfile = (profile: Partial<UserProfile>) => {
    const newData = { ...data, profile: { ...data.profile, ...profile } }
    saveData(newData)
  }

  const updateNotifications = (notifications: Partial<NotificationSettings>) => {
    const newData = { ...data, notifications: { ...data.notifications, ...notifications } }
    saveData(newData)
  }

  const addJournalEntry = (entry: Omit<JournalEntry, "id">) => {
    const newEntry = { ...entry, id: Date.now().toString() }
    const newData = { ...data, journals: [newEntry, ...data.journals] }
    saveData(newData)
  }

  const updateJournalEntry = (id: string, entry: Partial<JournalEntry>) => {
    const newJournals = data.journals.map((j) => (j.id === id ? { ...j, ...entry } : j))
    const newData = { ...data, journals: newJournals }
    saveData(newData)
  }

  const deleteJournalEntry = (id: string) => {
    const newJournals = data.journals.filter((j) => j.id !== id)
    const newData = { ...data, journals: newJournals }
    saveData(newData)
  }

  const updateOnboarding = (onboarding: Partial<OnboardingData>) => {
    const newData = { ...data, onboarding: { ...data.onboarding, ...onboarding } }
    saveData(newData)
  }

  const updateMood = (mood: string) => {
    const newData = {
      ...data,
      currentMood: mood,
      lastMoodUpdate: new Date().toISOString(),
    }
    saveData(newData)
  }

  const getRecommendations = (): string[] => {
    const { onboarding, currentMood } = data
    const recommendations: string[] = []

    if (onboarding.stressLevel > 7) {
      recommendations.push("Try the 4-7-8 breathing exercise to reduce stress")
      recommendations.push("Consider a 10-minute guided meditation")
    }

    if (onboarding.sleepQuality < 4) {
      recommendations.push("Practice evening meditation for better sleep")
      recommendations.push("Try the body scan relaxation technique")
    }

    if (onboarding.exerciseFrequency === "rarely") {
      recommendations.push("Start with a 5-minute mindful walking session")
    }

    if (currentMood === "sad" || currentMood === "anxious") {
      recommendations.push("Write in your journal about your feelings")
      recommendations.push("Try the loving-kindness meditation")
    }

    if (onboarding.socialSupport < 4) {
      recommendations.push("Consider reaching out to a friend or counselor")
    }

    return recommendations.length > 0
      ? recommendations
      : [
          "Keep up your wellness routine!",
          "Try exploring a new meditation technique",
          "Consider writing in your journal today",
        ]
  }

  const value = {
    data,
    updateProfile,
    updateNotifications,
    addJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    updateOnboarding,
    updateMood,
    getRecommendations,
  }

  return <LocalStorageContext.Provider value={value}>{children}</LocalStorageContext.Provider>
}

export const useLocalStorage = () => {
  const context = useContext(LocalStorageContext)
  if (context === undefined) {
    throw new Error("useLocalStorage must be used within a LocalStorageProvider")
  }
  return context
}
