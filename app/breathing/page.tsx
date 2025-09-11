"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Play, Pause, RotateCcw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

const breathingExercises = [
  { id: 1, name: "4-7-8 Technique", inhale: 4, hold: 7, exhale: 8, description: "Promotes relaxation and sleep" },
  { id: 2, name: "Box Breathing", inhale: 4, hold: 4, exhale: 4, description: "Navy SEAL technique for focus" },
  { id: 3, name: "Quick Calm", inhale: 3, hold: 3, exhale: 6, description: "Fast stress relief" },
  { id: 4, name: "Energy Boost", inhale: 6, hold: 2, exhale: 4, description: "Increase alertness" },
]

export default function BreathingPage() {
  const [selectedExercise, setSelectedExercise] = useState<(typeof breathingExercises)[0] | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
  const [timeLeft, setTimeLeft] = useState(0)
  const [cycle, setCycle] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isActive && selectedExercise && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (isActive && selectedExercise && timeLeft === 0) {
      // Move to next phase
      if (phase === "inhale") {
        setPhase("hold")
        setTimeLeft(selectedExercise.hold)
      } else if (phase === "hold") {
        setPhase("exhale")
        setTimeLeft(selectedExercise.exhale)
      } else {
        setPhase("inhale")
        setTimeLeft(selectedExercise.inhale)
        setCycle((prev) => prev + 1)
      }
    }
    return () => clearInterval(interval)
  }, [isActive, timeLeft, phase, selectedExercise])

  const startExercise = (exercise: (typeof breathingExercises)[0]) => {
    setSelectedExercise(exercise)
    setPhase("inhale")
    setTimeLeft(exercise.inhale)
    setCycle(0)
    setIsActive(true)
  }

  const toggleActive = () => {
    setIsActive(!isActive)
  }

  const resetExercise = () => {
    if (selectedExercise) {
      setPhase("inhale")
      setTimeLeft(selectedExercise.inhale)
      setCycle(0)
      setIsActive(false)
    }
  }

  const getPhaseText = () => {
    switch (phase) {
      case "inhale":
        return "Breathe In"
      case "hold":
        return "Hold"
      case "exhale":
        return "Breathe Out"
    }
  }

  const getCircleScale = () => {
    if (!isActive) return 1
    switch (phase) {
      case "inhale":
        return 1.3
      case "hold":
        return 1.3
      case "exhale":
        return 0.8
      default:
        return 1
    }
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
        <h1 className="text-3xl font-bold">Breathing Exercises</h1>
      </div>

      <AnimatePresence mode="wait">
        {!selectedExercise ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid gap-4 md:grid-cols-2"
          >
            {breathingExercises.map((exercise) => (
              <motion.div key={exercise.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => startExercise(exercise)}
                >
                  <CardHeader>
                    <CardTitle>{exercise.name}</CardTitle>
                    <CardDescription>{exercise.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground mb-4">
                      Inhale {exercise.inhale}s • Hold {exercise.hold}s • Exhale {exercise.exhale}s
                    </div>
                    <Button className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      Start Exercise
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
                <CardTitle>{selectedExercise.name}</CardTitle>
                <CardDescription>Cycle {cycle + 1}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <motion.div
                    className="w-48 h-48 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center mb-6"
                    animate={{ scale: getCircleScale() }}
                    transition={{
                      duration: selectedExercise
                        ? phase === "inhale"
                          ? selectedExercise.inhale
                          : phase === "hold"
                            ? selectedExercise.hold
                            : selectedExercise.exhale
                        : 1,
                      ease: "easeInOut",
                    }}
                  >
                    <div className="text-center">
                      <div className="text-lg font-semibold mb-2">{getPhaseText()}</div>
                      <div className="text-3xl font-mono font-bold">{timeLeft}</div>
                    </div>
                  </motion.div>
                </div>

                <div className="flex justify-center gap-4">
                  <Button onClick={toggleActive} size="lg">
                    {isActive ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                  <Button onClick={resetExercise} variant="outline" size="lg">
                    <RotateCcw className="h-5 w-5" />
                  </Button>
                </div>

                <Button variant="ghost" className="w-full" onClick={() => setSelectedExercise(null)}>
                  Choose Different Exercise
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
