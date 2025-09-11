"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Play, Pause, RotateCcw, ArrowLeft } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

const meditations = [
  { id: 1, title: "Stress Relief", duration: 300, description: "Release tension and find calm" },
  { id: 2, title: "Focus & Clarity", duration: 600, description: "Enhance concentration for studying" },
  { id: 3, title: "Sleep Preparation", duration: 900, description: "Wind down for better rest" },
  { id: 4, title: "Quick Reset", duration: 180, description: "3-minute energy refresh" },
]

export default function MeditationPage() {
  const [selectedMeditation, setSelectedMeditation] = useState<(typeof meditations)[0] | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1
          if (selectedMeditation) {
            setProgress(((selectedMeditation.duration - newTime) / selectedMeditation.duration) * 100)
          }
          if (newTime <= 0) {
            setIsPlaying(false)
            return 0
          }
          return newTime
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, timeLeft, selectedMeditation])

  const startMeditation = (meditation: (typeof meditations)[0]) => {
    setSelectedMeditation(meditation)
    setTimeLeft(meditation.duration)
    setProgress(0)
    setIsPlaying(true)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const resetMeditation = () => {
    if (selectedMeditation) {
      setTimeLeft(selectedMeditation.duration)
      setProgress(0)
      setIsPlaying(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Guided Meditation</h1>
      </div>

      <AnimatePresence mode="wait">
        {!selectedMeditation ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid gap-4 md:grid-cols-2"
          >
            {meditations.map((meditation) => (
              <motion.div key={meditation.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => startMeditation(meditation)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {meditation.title}
                      <span className="text-sm font-normal text-muted-foreground">
                        {Math.floor(meditation.duration / 60)} min
                      </span>
                    </CardTitle>
                    <CardDescription>{meditation.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      Start Session
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="max-w-md mx-auto"
          >
            <Card>
              <CardHeader className="text-center">
                <CardTitle>{selectedMeditation.title}</CardTitle>
                <CardDescription>{selectedMeditation.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <motion.div
                    className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center mb-4"
                    animate={isPlaying ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                    transition={{ duration: 4, repeat: isPlaying ? Number.POSITIVE_INFINITY : 0 }}
                  >
                    <div className="text-2xl font-mono font-bold">{formatTime(timeLeft)}</div>
                  </motion.div>
                  <Progress value={progress} className="w-full" />
                </div>

                <div className="flex justify-center gap-4">
                  <Button onClick={togglePlayPause} size="lg">
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                  <Button onClick={resetMeditation} variant="outline" size="lg">
                    <RotateCcw className="h-5 w-5" />
                  </Button>
                </div>

                <Button variant="ghost" className="w-full" onClick={() => setSelectedMeditation(null)}>
                  Choose Different Session
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
