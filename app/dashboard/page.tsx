"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { PageLayout } from "@/components/page-layout"
import { Button } from "@/components/ui/button"
import { useMongoose } from "@/components/mongoose-provider"
import { Plus, LayoutDashboard, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { useTranslation } from "@/components/translation-provider"
import { pageAnimations } from "@/lib/animations"
import { AnimatedPage, AnimatedCard, AnimatedButton } from "@/components/ui/animated-components"
import { 
  LazyWrapper, 
  CardLoadingSkeleton,
  LazyJournalModal,
  LazyMoodTrackerCard,
  LazyDailyJournalCard,
  LazyDailyToolsCard,
  LazyAIAssistantCard,
  LazyWellnessInsights
} from "@/lib/lazy-components"

export default function DashboardPage() {
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false)
  const { data: session } = useSession()
  const { data } = useMongoose()
  const { t, locale } = useTranslation()
  const userName = session?.user?.name || data?.name || t("student")
  const hasAssessmentData = data?.onboardingCompleted && (data?.assessments?.length ?? 0) > 0

  return (
    <PageLayout
      title={t("welcome_back_user", { name: userName })}
      description={hasAssessmentData 
        ? t("track_wellness_journey")
        : t("complete_assessment_unlock")
      }
      icon={<LayoutDashboard className="h-8 w-8 md:h-10 md:w-10 text-primary" />}
      actions={
        <AnimatedButton
          onClick={() => setIsJournalModalOpen(true)} 
          className="gap-2 h-12 px-6 text-base font-medium"
        >
          <Plus className="h-5 w-5" />
          {t("dashboard.journal.write_entry")}
        </AnimatedButton>
      }
      fullWidth={true}
    >
      {/* Dashboard Grid - Optimized for PC and Tablet screens */}
      <AnimatedPage className="space-y-6 lg:space-y-8">
        {/* Top Row: Three main components with equal height */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-3 min-h-[300px]">
          {/* Mood Tracker - Positioned next to navigation panel */}
          <AnimatedCard className="h-full">
            <LazyWrapper fallback={<CardLoadingSkeleton />}>
              <LazyMoodTrackerCard />
            </LazyWrapper>
          </AnimatedCard>

          {/* Journal Card - Next to mood tracker */}
          <AnimatedCard className="h-full">
            <LazyWrapper fallback={<CardLoadingSkeleton />}>
              <LazyDailyJournalCard onOpenModal={() => setIsJournalModalOpen(true)} />
            </LazyWrapper>
          </AnimatedCard>

          {/* Wellness Tools - Next to journal */}
          <AnimatedCard className="h-full">
            <LazyWrapper fallback={<CardLoadingSkeleton />}>
              <LazyDailyToolsCard />
            </LazyWrapper>
          </AnimatedCard>
        </div>

        {/* Wellness Insights - Full width horizontal component */}
        {hasAssessmentData && (
          <AnimatedCard>
            <LazyWrapper fallback={<CardLoadingSkeleton />}>
              <LazyWellnessInsights />
            </LazyWrapper>
          </AnimatedCard>
        )}

        {/* AI Assistant - Coming Soon */}
        <AnimatedCard>
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-lg" />
            <div className="relative bg-gradient-to-br from-white/80 via-primary/5 to-purple/5 border-2 border-dashed border-primary/20 rounded-lg p-8 text-center">
              <motion.div
                className="mb-4 mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-purple/20 rounded-full flex items-center justify-center"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="h-8 w-8 text-primary" />
              </motion.div>
              <h3 className="text-xl font-semibold text-primary mb-2">
                {t("dashboard.ai_assistant.title")}
              </h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                {t("dashboard.ai_assistant.description")}
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary">
                <motion.div
                  className="w-2 h-2 bg-primary rounded-full"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                Coming Soon
              </div>
            </div>
          </div>
        </AnimatedCard>
      </AnimatedPage>

      {/* Journal Modal */}
      <LazyWrapper fallback={null}>
        <LazyJournalModal open={isJournalModalOpen} onOpenChange={setIsJournalModalOpen} />
      </LazyWrapper>
    </PageLayout>
  )
}
