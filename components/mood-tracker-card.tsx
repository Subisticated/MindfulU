"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, TrendingUp, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useMongoose } from "@/components/mongoose-provider"
import { useTranslation } from "@/components/translation-provider"

const moods = [
  { value: "amazing", label: "Amazing", emoji: "😄", color: "text-green-500" },
  { value: "good", label: "Good", emoji: "😊", color: "text-blue-500" },
  { value: "neutral", label: "Neutral", emoji: "😐", color: "text-yellow-500" },
  { value: "low", label: "Low", emoji: "😔", color: "text-orange-500" },
  { value: "sad", label: "Sad", emoji: "😢", color: "text-red-500" },
  { value: "anxious", label: "Anxious", emoji: "😰", color: "text-purple-500" },
]

interface MoodData {
  mood: string
  timestamp: number
}

const MOOD_PERSISTENCE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

export function MoodTrackerCard() {
  const { data: session } = useSession()
  const { data, updateMood } = useMongoose()
  const { t } = useTranslation()
  const [selectedMood, setSelectedMood] = useState<string>("")
  const [isLogged, setIsLogged] = useState(false)
  const [lastMoodData, setLastMoodData] = useState<MoodData | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<number>(0)

  const moods = [
    { value: "amazing", label: t("dashboard.mood_tracker.excellent"), emoji: "😄", color: "text-green-500" },
    { value: "good", label: t("dashboard.mood_tracker.good"), emoji: "😊", color: "text-blue-500" },
    { value: "neutral", label: t("dashboard.mood_tracker.okay"), emoji: "😐", color: "text-yellow-500" },
    { value: "low", label: t("dashboard.mood_tracker.not_great"), emoji: "😔", color: "text-orange-500" },
    { value: "sad", label: t("dashboard.mood_tracker.terrible"), emoji: "😢", color: "text-red-500" },
    { value: "anxious", label: "Anxious", emoji: "😰", color: "text-purple-500" },
  ]

  // Load mood from localStorage on component mount
  useEffect(() => {
    const savedMoodData = localStorage.getItem('lastMoodLog')
    if (savedMoodData) {
      try {
        const moodData: MoodData = JSON.parse(savedMoodData)
        const timeSinceLogged = Date.now() - moodData.timestamp
        
        if (timeSinceLogged < MOOD_PERSISTENCE_DURATION) {
          setLastMoodData(moodData)
          setSelectedMood(moodData.mood)
          setTimeRemaining(MOOD_PERSISTENCE_DURATION - timeSinceLogged)
        } else {
          // Remove expired mood data
          localStorage.removeItem('lastMoodLog')
        }
      } catch (error) {
        console.error('Error parsing saved mood data:', error)
        localStorage.removeItem('lastMoodLog')
      }
    }
  }, [])

  // Update time remaining every second
  useEffect(() => {
    if (lastMoodData && timeRemaining > 0) {
      const interval = setInterval(() => {
        const timeSinceLogged = Date.now() - lastMoodData.timestamp
        const remaining = MOOD_PERSISTENCE_DURATION - timeSinceLogged
        
        if (remaining <= 0) {
          setLastMoodData(null)
          setTimeRemaining(0)
          setSelectedMood("")
          localStorage.removeItem('lastMoodLog')
          clearInterval(interval)
        } else {
          setTimeRemaining(remaining)
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [lastMoodData, timeRemaining])

  // Update selected mood from database if available (get most recent mood entry)
  useEffect(() => {
    if (data?.moodEntries && data.moodEntries.length > 0 && !lastMoodData) {
      const mostRecentMood = data.moodEntries[0].mood
      setSelectedMood(mostRecentMood)
    }
  }, [data?.moodEntries, lastMoodData])

  const handleLogMood = async () => {
    if (selectedMood) {
      // Save mood data with timestamp to localStorage
      const moodData: MoodData = {
        mood: selectedMood,
        timestamp: Date.now()
      }
      
      localStorage.setItem('lastMoodLog', JSON.stringify(moodData))
      setLastMoodData(moodData)
      setTimeRemaining(MOOD_PERSISTENCE_DURATION)

      // Save using MongooseProvider (which handles both local state and database)
      try {
        await updateMood(selectedMood, `Mood logged via dashboard tracker`)
        console.log('Mood entry saved successfully')
      } catch (error) {
        console.error('Error saving mood entry:', error)
      }
      
      setIsLogged(true)
      setTimeout(() => setIsLogged(false), 2000)
    }
  }

  const selectedMoodData = moods.find((mood) => mood.value === selectedMood)
  const isShowingPersistedMood = lastMoodData && timeRemaining > 0

  // Format time remaining
  const formatTimeRemaining = (ms: number): string => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="bg-background/60 backdrop-blur-sm border-2 border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
              <Heart className="h-5 w-5 text-primary" />
            </motion.div>
            {t("dashboard.mood_tracker.title")}
            {isShowingPersistedMood && (
              <motion.div
                className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Clock className="h-3 w-3" />
                {formatTimeRemaining(timeRemaining)}
              </motion.div>
            )}
          </CardTitle>
          <CardDescription>
            {isShowingPersistedMood 
              ? "Your recent mood is saved for 5 minutes" 
              : t("dashboard.mood_tracker.how_feeling")
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Select value={selectedMood} onValueChange={setSelectedMood}>
              <SelectTrigger>
                <SelectValue placeholder={t("dashboard.mood_tracker.how_feeling")} />
              </SelectTrigger>
              <SelectContent>
                {moods.map((mood) => (
                  <SelectItem key={mood.value} value={mood.value}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{mood.emoji}</span>
                      <span>{mood.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <AnimatePresence>
            {selectedMoodData && (
              <motion.div
                className="flex items-center justify-center p-4 bg-muted/50 rounded-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <motion.span
                  className="text-4xl mr-3"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                >
                  {selectedMoodData.emoji}
                </motion.span>
                <div className="flex-1">
                  <p className={`font-medium ${selectedMoodData.color}`}>
                    {selectedMoodData.label}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isShowingPersistedMood 
                      ? `Logged ${Math.floor((Date.now() - lastMoodData!.timestamp) / 60000)} min ago`
                      : "Thanks for sharing how you feel"
                    }
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              onClick={handleLogMood} 
              disabled={!selectedMood || isLogged} 
              className="w-full"
            >
              <AnimatePresence mode="wait">
                {isLogged ? (
                  <motion.div
                    key="logged"
                    className="flex items-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Mood Logged!
                  </motion.div>
                ) : (
                  <motion.span
                    key="log"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {isShowingPersistedMood ? "Update Mood" : t("dashboard.mood_tracker.log_mood")}
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
