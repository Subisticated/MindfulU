"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { QuestionCard } from "./QuestionCard"
import { ProgressBar } from "./ProgressBar"
import { quickAssessmentSets, calculateQuickScores, generateQuickRecommendations } from "./quickAssessmentData"
import { useLocalStorage } from "@/components/local-storage-provider"
import { ChevronLeft, ChevronRight, CheckCircle, AlertTriangle, Info, Heart, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuickQuestionnaireProps {
  onComplete?: (results: any) => void;
  className?: string;
  initialData?: Record<string, any>;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95
  })
}

export function QuickQuestionnaire({ onComplete, className = "", initialData = {} }: QuickQuestionnaireProps) {
  const router = useRouter()
  const { completeOnboarding, updateOnboarding, data } = useLocalStorage()
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>(data?.onboarding?.answers || initialData)
  const [direction, setDirection] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [scores, setScores] = useState<any>(null)
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [redirectCountdown, setRedirectCountdown] = useState(0)

  // Handle countdown and redirect when questionnaire is complete
  useEffect(() => {
    if (isComplete && redirectCountdown > 0) {
      const countdown = setInterval(() => {
        setRedirectCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdown)
            router.push("/dashboard")
            return 0
          }
          return prev - 1
        })
      }, 1000)
      
      return () => clearInterval(countdown)
    }
  }, [isComplete, redirectCountdown, router])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  }
  
  // Use the essential questions only
  const allQuestions = quickAssessmentSets.essentialCheck.questions.map(q => ({ 
    ...q, 
    section: 'essentialCheck', 
    sectionTitle: quickAssessmentSets.essentialCheck.name, 
    sectionDescription: quickAssessmentSets.essentialCheck.description 
  }))

  const currentQuestion = allQuestions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === allQuestions.length - 1
  const canGoBack = currentQuestionIndex > 0
  const hasAnswer = currentQuestion && answers[currentQuestion.id] !== undefined && answers[currentQuestion.id] !== ""
  const isOptional = currentQuestion && 'optional' in currentQuestion ? currentQuestion.optional : false

  const handleAnswerChange = (value: any) => {
    if (!currentQuestion) return
    
    setAnswers(prev => {
      const updated = { ...prev, [currentQuestion.id]: value }
      // Persist answers immediately
      updateOnboarding({ answers: updated })
      return updated
    })
  }

  const handleNext = async () => {
    if (!currentQuestion) return
    
    if (isLastQuestion && hasAnswer) {
      await handleComplete()
    } else if (hasAnswer || isOptional) {
      setDirection(1)
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (canGoBack) {
      setDirection(-1)
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    
    try {
      // Calculate scores using quick assessment
      const calculatedScores = calculateQuickScores(answers)
      const generatedRecommendations = generateQuickRecommendations(calculatedScores, answers)
      
      setScores(calculatedScores)
      setRecommendations(generatedRecommendations)
      
      // Complete onboarding with quick assessment data
      // Create user profile from initialData (which contains form data from onboarding)
      const userProfile = {
        name: initialData.student_name || '',
        email: initialData.student_email || '',
        university: initialData.student_university || '',
        dateOfBirth: '',
        completedAt: new Date().toISOString()
      }
      
      const assessmentData = {
        // Map essential scores to full format for compatibility
        phq9Score: Math.round((calculatedScores.mood || 0) * 27 / 3), // Scale to PHQ-9 range
        gad7Score: Math.round((calculatedScores.anxiety || 0) * 21 / 3), // Scale to GAD-7 range
        pss10Score: Math.round((calculatedScores.stress || 0) * 40 / 3), // Scale to PSS-10 range
        overallWellnessScore: calculatedScores.overallWellnessScore,
        riskLevel: calculatedScores.riskLevel as 'minimal' | 'mild' | 'moderate' | 'severe',
        completedAt: new Date().toISOString()
      }
      
      completeOnboarding(userProfile, assessmentData, answers)
      
      setIsComplete(true)
      setRedirectCountdown(5)
      
      if (onComplete) {
        onComplete({
          scores: calculatedScores,
          recommendations: generatedRecommendations,
          answers
        })
      }
    } catch (error) {
      console.error('Error completing quick assessment:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'severe': return 'text-red-600'
      case 'moderate': return 'text-orange-600'
      case 'mild': return 'text-yellow-600'
      default: return 'text-green-600'
    }
  }

  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
      case 'severe': return 'destructive'
      case 'moderate': return 'secondary'
      case 'mild': return 'outline'
      default: return 'default'
    }
  }

  if (isComplete) {
    return (
      <motion.div
        className={cn("max-w-4xl mx-auto p-6", className)}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
          <CardHeader className="text-center">
            <motion.div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="h-8 w-8 text-green-600" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-green-800">
              Quick Assessment Complete!
            </CardTitle>
            <p className="text-green-700 mt-2">
              Thank you for sharing. We've created your initial wellness profile.
            </p>
            <div className="flex items-center justify-center gap-2 mt-3 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Redirecting to dashboard in {redirectCountdown}s</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall Score */}
            <div className="text-center p-6 bg-white rounded-lg border">
              <div className="flex justify-center mb-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">Your Wellness Score</h3>
              <div className="text-4xl font-bold text-primary mb-2">{scores?.overallWellnessScore || 0}/100</div>
              <Badge variant={getRiskBadgeVariant(scores?.riskLevel || 'minimal')}>
                {scores?.riskLevel?.charAt(0).toUpperCase() + scores?.riskLevel?.slice(1)} Level
              </Badge>
            </div>

            {/* Key Insights */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 bg-white rounded-lg border">
                <h4 className="font-semibold text-sm mb-2">Mood</h4>
                <div className="text-2xl font-bold mb-1">{scores?.mood || 0}/3</div>
                <Badge className={`${scores?.moodLevel?.color || 'bg-green-100 text-green-800'} text-xs`}>
                  {scores?.moodLevel?.level || 'Good'}
                </Badge>
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <h4 className="font-semibold text-sm mb-2">Anxiety</h4>
                <div className="text-2xl font-bold mb-1">{scores?.anxiety || 0}/3</div>
                <Badge className={`${scores?.anxietyLevel?.color || 'bg-green-100 text-green-800'} text-xs`}>
                  {scores?.anxietyLevel?.level || 'Low'}
                </Badge>
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <h4 className="font-semibold text-sm mb-2">Stress</h4>
                <div className="text-2xl font-bold mb-1">{scores?.stress || 0}/3</div>
                <Badge className={`${scores?.stressLevel?.color || 'bg-green-100 text-green-800'} text-xs`}>
                  {scores?.stressLevel?.level || 'Low'}
                </Badge>
              </div>
            </div>

            {/* Quick Recommendations */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Your Quick Start Plan</h3>
              {recommendations.slice(0, 3).map((rec, index) => (
                <div key={index} className={`p-4 rounded-lg border ${
                  rec.type === 'urgent' ? 'border-red-200 bg-red-50' : 
                  rec.type === 'important' ? 'border-orange-200 bg-orange-50' : 
                  'border-green-200 bg-green-50'
                }`}>
                  <div className="flex items-start gap-3">
                    <div>
                      {rec.type === 'urgent' && <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />}
                      {rec.type === 'important' && <Info className="h-5 w-5 text-orange-600 mt-0.5" />}
                      {rec.type === 'helpful' && <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{rec.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {rec.actions.slice(0, 2).map((action: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {action}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">What's Next?</h3>
              <p className="text-blue-700 text-sm mb-3">
                This was a quick assessment to get you started. For a more detailed analysis, 
                you can take the complete assessment anytime from your dashboard.
              </p>
              <div className="flex gap-2">
                <Button 
                  onClick={() => router.push("/dashboard")} 
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Go to Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      className={cn("max-w-2xl mx-auto p-6", className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <Heart className="h-6 w-6 text-primary" />
        </motion.div>
        <h1 className="text-3xl font-bold mb-2">Quick Wellness Check</h1>
        <p className="text-muted-foreground">
          Just {allQuestions.length} questions to get you started (2-3 minutes)
        </p>
        <div className="flex items-center justify-center gap-2 mt-2 text-sm text-blue-600">
          <Clock className="h-4 w-4" />
          <span>You can take the complete assessment later from your dashboard</span>
        </div>
      </div>

      {/* Progress */}
      <ProgressBar 
        current={currentQuestionIndex + 1} 
        total={allQuestions.length}
        className="mb-6"
      />

      {/* Question Card */}
      <Card className="mb-6">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentQuestionIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {currentQuestion && (
              <QuestionCard
                question={currentQuestion as any}
                value={answers[currentQuestion.id]}
                onChange={handleAnswerChange}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={allQuestions.length}
                sectionTitle={currentQuestion.sectionTitle}
                sectionDescription={currentQuestion.sectionDescription}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={!canGoBack}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <span className="text-sm text-muted-foreground">
          {currentQuestionIndex + 1} of {allQuestions.length}
        </span>

        <Button
          onClick={handleNext}
          disabled={!hasAnswer && !isOptional}
          className="flex items-center gap-2"
        >
          {isLastQuestion ? (
            <>
              {isLoading ? 'Completing...' : 'Complete'}
              <CheckCircle className="h-4 w-4" />
            </>
          ) : (
            <>
              Next
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  )
}
