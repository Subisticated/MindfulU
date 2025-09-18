"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useMongoose } from "@/components/mongoose-provider"
import { ArrowLeft, Clock, Target } from "lucide-react"
import { motion } from "framer-motion"
import { LazyWrapper, PageLoadingSkeleton, LazyQuestionnaire } from "@/lib/lazy-components"

export default function CompleteAssessmentPage() {
  const router = useRouter()
  const { data } = useMongoose()
  const [showInfo, setShowInfo] = useState(true)

  const handleStartCompleteAssessment = () => {
    setShowInfo(false)
  }

  const handleQuestionnaireComplete = (results: any) => {
    console.log("Complete assessment finished:", results)
    // Results are automatically saved by the questionnaire component
  }

  const goBack = () => {
    router.push("/dashboard")
  }

  if (showInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-full sm:max-w-2xl mx-auto w-full"
        >
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20"
              >
                <Target className="h-8 w-8 text-primary" />
              </motion.div>
              <CardTitle className="text-2xl font-bold">Complete Wellness Assessment</CardTitle>
              <p className="text-muted-foreground mt-2">
                Get a comprehensive analysis of your mental health and wellbeing
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Assessment Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Duration</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    5-7 minutes • 26 questions
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">What You'll Get</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Detailed insights & personalized recommendations
                  </p>
                </div>
              </div>

              {/* What's Included */}
              <div className="space-y-3">
                <h3 className="font-semibold">This assessment includes:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    PHQ-9: Depression screening (9 questions)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    GAD-7: Anxiety assessment (7 questions)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    PSS-10: Perceived stress scale (10 questions)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    Student-specific wellness questions
                  </li>
                </ul>
              </div>

              {/* Benefits */}
              <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-blue-50 border border-primary/20">
                <h3 className="font-semibold mb-2 text-primary">Why take the complete assessment?</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• More accurate wellness scoring</li>
                  <li>• Detailed breakdown by category</li>
                  <li>• Better personalized recommendations</li>
                  <li>• Track progress over time</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={goBack}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
                <Button
                  onClick={handleStartCompleteAssessment}
                  className="flex-1"
                >
                  Start Complete Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
      <LazyWrapper fallback={<PageLoadingSkeleton />}>
        <LazyQuestionnaire 
          onComplete={handleQuestionnaireComplete}
          initialData={data?.assessments?.[0]?.answers || {}}
        />
      </LazyWrapper>
    </div>
  )
}
