"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { PageLayout } from "@/components/page-layout"
import { Button } from "@/components/ui/button"
import { JournalModal } from "@/components/journal-modal"
import { MoodTrackerCard } from "@/components/mood-tracker-card"
import { DailyToolsCard } from "@/components/daily-tools-card"
import { AIAssistantCard } from "@/components/ai-assistant-card"
import { WellnessInsights } from "@/components/wellness-insights"
import { useMongoose } from "@/components/mongoose-provider"
import { Plus, LayoutDashboard } from "lucide-react"
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
  const { data: session } = useSession()
  const { data } = useMongoose()
  const userName = session?.user?.name || data?.name || "Student"
  const hasAssessmentData = data?.onboardingCompleted && (data?.assessments?.length ?? 0) > 0

  return (
    <PageLayout
      title={`Welcome back, ${userName}!`}
      description={hasAssessmentData 
        ? "Let's check on your wellness journey today."
        : "Complete your assessment to get personalized insights."
      }
      icon={<LayoutDashboard className="h-6 w-6 md:h-8 md:w-8 text-primary" />}
      actions={
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button onClick={() => setIsJournalModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Quick Journal
          </Button>
        </motion.div>
      }
    >
      {/* Dashboard Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4 sm:space-y-6"
      >
        {/* Top Row: Quick Actions */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Mood Tracker */}
          <motion.div variants={cardVariants}>
            <MoodTrackerCard />
          </motion.div>

          {/* Daily Tools */}
          <motion.div variants={cardVariants}>
            <DailyToolsCard />
          </motion.div>

          {/* Wellness Insights */}
          <motion.div variants={cardVariants} className="md:col-span-2 lg:col-span-1">
            <WellnessInsights />
          </motion.div>
        </div>

        {/* AI Assistant - Full width */}
        <motion.div variants={cardVariants}>
          <AIAssistantCard />
        </motion.div>
      </motion.div>

      {/* Journal Modal */}
      <JournalModal open={isJournalModalOpen} onOpenChange={setIsJournalModalOpen} />
    </PageLayout>
  )
}
