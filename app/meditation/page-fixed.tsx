"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Play, Pause, RotateCcw, ArrowLeft, Flower2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { PageLayout } from "@/components/page-layout"
import { EnhancedCard } from "@/components/enhanced-card"

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
    <PageLayout
      title="Guided Meditation"
      description="Mindful meditation sessions to reduce stress and improve focus"
      icon={<Flower2 />}
      actions={
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      }
    >
      <AnimatePresence mode="wait">
        {!selectedMeditation ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2"
          >
            {meditations.map((meditation) => (
              <motion.div key={meditation.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <EnhancedCard
                  title={meditation.title}
                  description={meditation.description}
                  className="h-full"
                  onClick={() => startMeditation(meditation)}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary">
                          {Math.floor(meditation.duration / 60)}
                        </div>
                        <div className="text-sm text-muted-foreground">minutes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">
                          Perfect for
                        </div>
                        <div className="text-base font-medium">
                          {meditation.id === 1 ? "Stress Relief" : 
                           meditation.id === 2 ? "Focus" :
                           meditation.id === 3 ? "Sleep" : "Quick Reset"}
                        </div>
                      </div>
                    </div>
                    <Button className="w-full h-12 text-base">
                      <Play className="h-5 w-5 mr-2" />
                      Start Meditation
                    </Button>
                  </div>
                </EnhancedCard>
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
                  <Progress value={progress} className="w-full h-3" />
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
                  Choose Different Meditation
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  )
}
