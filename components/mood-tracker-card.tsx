"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, TrendingUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useLocalStorage } from "@/components/local-storage-provider"

const moods = [
  { value: "amazing", label: "Amazing", emoji: "😄", color: "text-green-500" },
  { value: "good", label: "Good", emoji: "😊", color: "text-blue-500" },
  { value: "neutral", label: "Neutral", emoji: "😐", color: "text-yellow-500" },
  { value: "low", label: "Low", emoji: "😔", color: "text-orange-500" },
  { value: "sad", label: "Sad", emoji: "😢", color: "text-red-500" },
  { value: "anxious", label: "Anxious", emoji: "😰", color: "text-purple-500" },
]

export function MoodTrackerCard() {
  const { data, updateMood } = useLocalStorage()
  const [selectedMood, setSelectedMood] = useState<string>("")
  const [isLogged, setIsLogged] = useState(false)

  useEffect(() => {
    if (data.currentMood) {
      setSelectedMood(data.currentMood)
    }
  }, [data.currentMood])

  const handleLogMood = () => {
    if (selectedMood) {
      updateMood(selectedMood)
      setIsLogged(true)
      setTimeout(() => setIsLogged(false), 2000)
    }
  }

  const selectedMoodData = moods.find((mood) => mood.value === selectedMood)

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
              <Heart className="h-5 w-5 text-primary" />
            </motion.div>
            Mood Tracker
          </CardTitle>
          <CardDescription>How are you feeling right now?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Select value={selectedMood} onValueChange={setSelectedMood}>
              <SelectTrigger>
                <SelectValue placeholder="Select your current mood" />
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
                <div>
                  <p className={`font-medium ${selectedMoodData.color}`}>Feeling {selectedMoodData.label}</p>
                  <p className="text-sm text-muted-foreground">Thanks for sharing how you feel</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button onClick={handleLogMood} disabled={!selectedMood || isLogged} className="w-full">
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
                    Log Mood
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
