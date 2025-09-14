"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { QuickQuestionnaire } from "@/components/Questionnaire/QuickQuestionnaire"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useLocalStorage } from "@/components/local-storage-provider"
import { Heart, Brain, Target } from "lucide-react"
import { motion } from "framer-motion"

export default function OnboardingPage() {
  const router = useRouter()
  const { data, updateData } = useLocalStorage()
  const [showWelcome, setShowWelcome] = useState(true)
  const [formData, setFormData] = useState({
    name: data?.onboarding?.userProfile?.name || "",
    email: data?.onboarding?.userProfile?.email || "",
  })

  const handleStartAssessment = () => {
    // Save basic profile info to temporary state
    // The actual profile will be saved when questionnaire completes
    setShowWelcome(false)
  }

  const handleQuestionnaireComplete = (results: any) => {
    // The questionnaire component handles saving the results
    // We can add any additional logic here if needed
    console.log("Questionnaire completed:", results)
  }

  const canProceed = formData.name.trim() !== "" && formData.email.trim() !== ""

  if (showWelcome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="border-0 shadow-xl bg-gradient-to-br from-background via-background to-muted/20">
            <CardContent className="p-8 space-y-6">
              {/* Welcome Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center space-y-4"
              >
                <div className="p-4 bg-primary/10 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                  <Heart className="h-10 w-10 text-primary" />
                </div>
                <h1 className="text-3xl font-bold text-balance">Welcome to MindfulU</h1>
                <p className="text-lg text-muted-foreground text-pretty max-w-md mx-auto">
                  Your personal wellness companion for student life. Let's get to know you better so we can provide
                  personalized support for your mental health journey.
                </p>
              </motion.div>

              {/* What we'll cover */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-muted/50 rounded-lg p-4 space-y-3"
              >
                <h3 className="font-medium flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <span>What we'll assess:</span>
                </h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-primary rounded-full"></div>
                    <span>Depression screening (PHQ-9) - 9 questions</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-primary rounded-full"></div>
                    <span>Anxiety screening (GAD-7) - 7 questions</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-primary rounded-full"></div>
                    <span>Stress assessment (PSS-10) - 10 questions</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-primary rounded-full"></div>
                    <span>Student-specific wellness questions</span>
                  </li>
                </ul>
              </motion.div>

              {/* Basic Info Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <h3 className="font-medium flex items-center space-x-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span>Let's start with some basic information:</span>
                </h3>
                <div className="grid gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Privacy Note */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-blue-50 border border-blue-200 rounded-lg p-3"
              >
                <p className="text-xs text-blue-700">
                  <strong>Privacy:</strong> Your responses are confidential and stored locally on your device. 
                  This assessment helps personalize your experience and is not a substitute for professional diagnosis.
                </p>
              </motion.div>

              {/* Start Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center pt-4"
              >
                <Button
                  onClick={handleStartAssessment}
                  disabled={!canProceed}
                  size="lg"
                  className="px-8 py-3 text-lg font-medium"
                >
                  Start Wellness Assessment
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  // Get persisted answers from localStorage
  const initialAnswers = data?.onboarding?.answers || {}
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <QuickQuestionnaire 
        onComplete={handleQuestionnaireComplete}
        initialData={{
          ...initialAnswers,
          student_name: formData.name,
          student_email: formData.email,
          student_university: ""
        }}
      />
    </div>
  )
}
