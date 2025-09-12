"use client"

import { useState } from "react"
import { Sidebar, MobileMenuButton } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { JournalModal } from "@/components/journal-modal"
import { MoodTrackerCard } from "@/components/mood-tracker-card"
import { DailyToolsCard } from "@/components/daily-tools-card"
import { AIAssistantCard } from "@/components/ai-assistant-card"
import { WellnessInsights } from "@/components/wellness-insights"
import { useLocalStorage } from "@/components/local-storage-provider"
import { BookOpen, Plus, Brain } from "lucide-react"
import { motion } from "framer-motion"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0
  },
}

export default function DashboardPage() {
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false)
  const { data, isLoggedIn } = useLocalStorage()
  const userName = data?.onboarding?.userProfile?.name || "Student"
  const hasAssessmentData = data?.onboarding?.completed && data?.onboarding?.assessmentData

  return (
    <div className="flex h-screen bg-background">
      <MobileMenuButton />
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="pt-20 md:pt-0">
          <motion.div
            className="container p-4 md:p-6 space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-balance">Welcome back!</h1>
              <p className="text-muted-foreground text-pretty">
                {hasAssessmentData 
                  ? `Let's check on your wellness journey, ${userName}.`
                  : `Complete your assessment to get personalized insights, ${userName}.`
                }
              </p>
            </motion.div>

            {/* Dashboard Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {/* Mood Tracker */}
              <motion.div variants={cardVariants}>
                <MoodTrackerCard />
              </motion.div>

              {/* Journaling Card */}
              <motion.div variants={cardVariants}>
                <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        Quick Journal
                      </CardTitle>
                      <CardDescription>
                        Capture your thoughts and reflect on your day
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={() => setIsJournalModalOpen(true)}
                        className="w-full"
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        New Entry
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Wellness Insights */}
              <motion.div variants={cardVariants} className="md:col-span-2 lg:col-span-1">
                <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                  <WellnessInsights />
                </motion.div>
              </motion.div>

              {/* Daily Tools */}
              <motion.div variants={cardVariants}>
                <DailyToolsCard />
              </motion.div>

              {/* AI Assistant - spans full width on larger screens */}
              <motion.div variants={cardVariants} className="md:col-span-2 lg:col-span-3">
                <AIAssistantCard />
              </motion.div>
            </motion.div>

            {/* Journal Modal */}
            <JournalModal open={isJournalModalOpen} onOpenChange={setIsJournalModalOpen} />
          </motion.div>
        </div>
      </main>
    </div>
  )
}
