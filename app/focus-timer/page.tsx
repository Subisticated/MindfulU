"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Play, Pause, RotateCcw, Coffee, Brain, Timer } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { PageLayout } from "@/components/page-layout"
import { EnhancedCard } from "@/components/enhanced-card"

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
        setCurrentCycle((prev) => prev + 1)
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
        return { text: "Focus Time", icon: Brain, color: "text-blue-500" }
      case "break":
        return { text: "Short Break", icon: Coffee, color: "text-green-500" }
      case "longBreak":
        return { text: "Long Break", icon: Coffee, color: "text-purple-500" }
    }
  }

  const getProgress = () => {
    if (!selectedTimer) return 0
    const totalTime = phase === "work" ? selectedTimer.work : phase === "break" ? selectedTimer.break : selectedTimer.longBreak
    return ((totalTime - timeLeft) / totalTime) * 100
  }

  const phaseInfo = getPhaseInfo()

  return (
    <PageLayout
      title="Focus Timer"
      description="Boost productivity with structured work and break intervals"
      icon={<Timer />}
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
        {!selectedTimer ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2"
          >
            {timerPresets.map((timer) => (
              <motion.div key={timer.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <EnhancedCard
                  title={timer.name}
                  description={`${Math.floor(timer.work / 60)} min work • ${Math.floor(timer.break / 60)} min break`}
                  className="h-full"
                  onClick={() => startTimer(timer)}
                >
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3 p-4 bg-muted/30 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{Math.floor(timer.work / 60)}</div>
                        <div className="text-xs text-muted-foreground">Work</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{Math.floor(timer.break / 60)}</div>
                        <div className="text-xs text-muted-foreground">Break</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{timer.cycles}</div>
                        <div className="text-xs text-muted-foreground">Cycles</div>
                      </div>
                    </div>
                    <Button className="w-full h-12 text-base">
                      <Play className="h-5 w-5 mr-2" />
                      Start Timer
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
            <Card className="bg-background/60 backdrop-blur-sm border-2 border-border/50 hover:border-primary/30 shadow-lg transition-all duration-300">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <phaseInfo.icon className={`h-5 w-5 ${phaseInfo.color}`} />
                  {phaseInfo.text}
                </CardTitle>
                <CardDescription>
                  Cycle {currentCycle} of {selectedTimer.cycles} • Total completed: {totalCycles}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <motion.div
                    className="text-6xl font-mono font-bold mb-4"
                    animate={isActive ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                    transition={{ duration: 1, repeat: isActive ? Number.POSITIVE_INFINITY : 0 }}
                  >
                    {formatTime(timeLeft)}
                  </motion.div>
                  <Progress value={getProgress()} className="w-full h-3" />
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
    </PageLayout>
  )
}
