"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Play, Pause, RotateCcw, Coffee, Brain } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

const timerPresets = [
  { id: 1, name: "Pomodoro", work: 1500, break: 300, longBreak: 900, cycles: 4 },
  { id: 2, name: "Short Focus", work: 900, break: 180, longBreak: 600, cycles: 3 },
  { id: 3, name: "Deep Work", work: 3600, break: 600, longBreak: 1200, cycles: 2 },
  { id: 4, name: "Study Sprint", work: 600, break: 120, longBreak: 480, cycles: 6 },
]

type TimerPhase = "work" | "break" | "longBreak"

export default function FocusTimerPage() {
  const [selectedTimer, setSelectedTimer] = useState<(typeof timerPresets)[0] | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [phase, setPhase] = useState<TimerPhase>("work")
  const [currentCycle, setCurrentCycle] = useState(1)
  const [totalCycles, setTotalCycles] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (isActive && timeLeft === 0 && selectedTimer) {
      // Timer finished, move to next phase
      if (phase === "work") {
        if (currentCycle === selectedTimer.cycles) {
          // Long break after completing all cycles
          setPhase("longBreak")
          setTimeLeft(selectedTimer.longBreak)
          setCurrentCycle(1)
          setTotalCycles((prev) => prev + 1)
        } else {
          // Short break
          setPhase("break")
          setTimeLeft(selectedTimer.break)
        }
      } else {
        // Break finished, back to work
        setPhase("work")
        setTimeLeft(selectedTimer.work)
        if (phase === "break") {
          setCurrentCycle((prev) => prev + 1)
        }
      }
    }
    return () => clearInterval(interval)
  }, [isActive, timeLeft, phase, currentCycle, selectedTimer])

  const startTimer = (timer: (typeof timerPresets)[0]) => {
    setSelectedTimer(timer)
    setPhase("work")
    setTimeLeft(timer.work)
    setCurrentCycle(1)
    setTotalCycles(0)
    setIsActive(true)
  }

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    if (selectedTimer) {
      setPhase("work")
      setTimeLeft(selectedTimer.work)
      setCurrentCycle(1)
      setTotalCycles(0)
      setIsActive(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getPhaseInfo = () => {
    switch (phase) {
      case "work":
        return { text: "Focus Time", icon: Brain, color: "text-primary" }
      case "break":
        return { text: "Short Break", icon: Coffee, color: "text-green-600" }
      case "longBreak":
        return { text: "Long Break", icon: Coffee, color: "text-blue-600" }
    }
  }

  const getProgress = () => {
    if (!selectedTimer) return 0
    const totalTime =
      phase === "work" ? selectedTimer.work : phase === "break" ? selectedTimer.break : selectedTimer.longBreak
    return ((totalTime - timeLeft) / totalTime) * 100
  }

  const phaseInfo = getPhaseInfo()

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Focus Timer</h1>
      </div>

      <AnimatePresence mode="wait">
        {!selectedTimer ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid gap-4 md:grid-cols-2"
          >
            {timerPresets.map((timer) => (
              <motion.div key={timer.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => startTimer(timer)}>
                  <CardHeader>
                    <CardTitle>{timer.name}</CardTitle>
                    <CardDescription>
                      {Math.floor(timer.work / 60)} min work • {Math.floor(timer.break / 60)} min break
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground mb-4">
                      {timer.cycles} cycles • {Math.floor(timer.longBreak / 60)} min long break
                    </div>
                    <Button className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      Start Timer
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
                <CardTitle className="flex items-center justify-center gap-2">
                  <phaseInfo.icon className={`h-5 w-5 ${phaseInfo.color}`} />
                  {phaseInfo.text}
                </CardTitle>
                <CardDescription>
                  {selectedTimer.name} • Cycle {currentCycle}/{selectedTimer.cycles}
                  {totalCycles > 0 && ` • Completed: ${totalCycles}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <motion.div
                    className="w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center mb-4"
                    animate={isActive ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                    transition={{ duration: 2, repeat: isActive ? Number.POSITIVE_INFINITY : 0 }}
                  >
                    <div className="text-3xl font-mono font-bold">{formatTime(timeLeft)}</div>
                  </motion.div>
                  <Progress value={getProgress()} className="w-full" />
                </div>

                <div className="flex justify-center gap-4">
                  <Button onClick={toggleTimer} size="lg">
                    {isActive ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                  <Button onClick={resetTimer} variant="outline" size="lg">
                    <RotateCcw className="h-5 w-5" />
                  </Button>
                </div>

                <Button variant="ghost" className="w-full" onClick={() => setSelectedTimer(null)}>
                  Choose Different Timer
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
