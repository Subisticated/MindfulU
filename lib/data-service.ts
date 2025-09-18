"use client"

// Types that match the local storage interface
export interface UserProfile {
  id: string
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

export interface JournalEntryData {
  id: string
  title: string
  content: string
  tags: string[]
  mood?: string
  createdAt: string
  updatedAt: string
}

export interface MoodEntryData {
  mood: string
  notes?: string
  timestamp: string
}

export interface UserPreferencesData {
  theme?: string
  notifications?: boolean
  privacy?: 'private' | 'anonymous'
}

// Data service class that encapsulates all database operations
export class DataService {
  private apiBase = '/api'

  // Helper method for API calls
  private async apiCall(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.apiBase}${endpoint}`, {
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

  // User Profile Operations
  async getUserProfile(): Promise<UserProfile | null> {
    try {
      const response = await this.apiCall('/user/profile')
      return response.user || null
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
      return null
    }
  }

  async updateUserProfile(updates: Partial<UserProfile>): Promise<boolean> {
    try {
      await this.apiCall('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(updates),
      })
      return true
    } catch (error) {
      console.error('Failed to update user profile:', error)
      return false
    }
  }

  // Assessment Operations
  async saveAssessment(assessment: AssessmentScores, answers: Record<string, any>): Promise<boolean> {
    try {
      await this.apiCall('/assessments', {
        method: 'POST',
        body: JSON.stringify({ ...assessment, answers }),
      })
      return true
    } catch (error) {
      console.error('Failed to save assessment:', error)
      return false
    }
  }

  async getLatestAssessment(): Promise<AssessmentScores | null> {
    try {
      const response = await this.apiCall('/assessments?latest=true')
      return response.assessment || null
    } catch (error) {
      console.error('Failed to fetch latest assessment:', error)
      return null
    }
  }

  // Journal Operations
  async getJournalEntries(): Promise<JournalEntryData[]> {
    try {
      const response = await this.apiCall('/journal')
      return response.entries || []
    } catch (error) {
      console.error('Failed to fetch journal entries:', error)
      return []
    }
  }

  async addJournalEntry(entry: Omit<JournalEntryData, 'id' | 'createdAt' | 'updatedAt'>): Promise<JournalEntryData | null> {
    try {
      const response = await this.apiCall('/journal', {
        method: 'POST',
        body: JSON.stringify(entry),
      })
      return response.entry || null
    } catch (error) {
      console.error('Failed to add journal entry:', error)
      return null
    }
  }

  async updateJournalEntry(id: string, updates: Partial<Omit<JournalEntryData, 'id' | 'createdAt'>>): Promise<boolean> {
    try {
      await this.apiCall(`/journal/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      })
      return true
    } catch (error) {
      console.error('Failed to update journal entry:', error)
      return false
    }
  }

  async deleteJournalEntry(id: string): Promise<boolean> {
    try {
      await this.apiCall(`/journal/${id}`, {
        method: 'DELETE',
      })
      return true
    } catch (error) {
      console.error('Failed to delete journal entry:', error)
      return false
    }
  }

  async getJournalEntry(id: string): Promise<JournalEntryData | null> {
    try {
      const response = await this.apiCall(`/journal/${id}`)
      return response.entry || null
    } catch (error) {
      console.error('Failed to fetch journal entry:', error)
      return null
    }
  }

  // Mood Operations
  async saveMoodEntry(mood: string, notes?: string): Promise<boolean> {
    try {
      await this.apiCall('/mood', {
        method: 'POST',
        body: JSON.stringify({ mood, notes }),
      })
      return true
    } catch (error) {
      console.error('Failed to save mood entry:', error)
      return false
    }
  }

  async getMoodHistory(): Promise<MoodEntryData[]> {
    try {
      const response = await this.apiCall('/mood')
      return response.moods || []
    } catch (error) {
      console.error('Failed to fetch mood history:', error)
      return []
    }
  }

  async getCurrentMood(): Promise<string | null> {
    try {
      const response = await this.apiCall('/mood?latest=true')
      return response.mood || null
    } catch (error) {
      console.error('Failed to fetch current mood:', error)
      return null
    }
  }

  // User Preferences Operations
  async getUserPreferences(): Promise<UserPreferencesData> {
    try {
      const response = await this.apiCall('/user/preferences')
      return response.preferences || { theme: 'system', notifications: true, privacy: 'private' }
    } catch (error) {
      console.error('Failed to fetch user preferences:', error)
      return { theme: 'system', notifications: true, privacy: 'private' }
    }
  }

  async updateUserPreferences(preferences: Partial<UserPreferencesData>): Promise<boolean> {
    try {
      await this.apiCall('/user/preferences', {
        method: 'PUT',
        body: JSON.stringify(preferences),
      })
      return true
    } catch (error) {
      console.error('Failed to update user preferences:', error)
      return false
    }
  }

  // Wellness and Recommendations
  async getPersonalizedRecommendations(): Promise<string[]> {
    try {
      const assessment = await this.getLatestAssessment()
      if (!assessment) return []

      // Generate recommendations based on assessment
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
    } catch (error) {
      console.error('Failed to get recommendations:', error)
      return ["Take care of your mental health", "Remember to check in with yourself regularly"]
    }
  }

  async getWellnessLevel(): Promise<string> {
    try {
      const assessment = await this.getLatestAssessment()
      if (!assessment) return 'unknown'
      return assessment.riskLevel
    } catch (error) {
      console.error('Failed to get wellness level:', error)
      return 'unknown'
    }
  }

  // Check if user has completed onboarding
  async hasCompletedOnboarding(): Promise<boolean> {
    try {
      const assessment = await this.getLatestAssessment()
      return assessment !== null
    } catch (error) {
      console.error('Failed to check onboarding status:', error)
      return false
    }
  }
}

// Export a singleton instance
export const dataService = new DataService()
