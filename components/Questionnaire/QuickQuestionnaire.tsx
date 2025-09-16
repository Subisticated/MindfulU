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
        // Map essential scores to clinical scale equivalents
        // PHQ-9 range is 0-27, our mood score is 0-3, so scale proportionally
        phq9Score: Math.round((calculatedScores.mood || 0) * 9), // Scale 0-3 to 0-27
        // GAD-7 range is 0-21, our anxiety score is 0-3, so scale proportionally  
        gad7Score: Math.round((calculatedScores.anxiety || 0) * 7), // Scale 0-3 to 0-21
        // PSS-10 range is 0-40, our stress score is 0-3, so scale proportionally
        pss10Score: Math.round((calculatedScores.stress || 0) * 13.33), // Scale 0-3 to 0-40
        overallWellnessScore: calculatedScores.overallWellnessScore,
        riskLevel: calculatedScores.riskLevel as 'excellent' | 'mild' | 'moderate' | 'challenging',
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
      case 'challenging': return 'text-amber-700'
      case 'moderate': return 'text-blue-600'
      case 'mild': return 'text-emerald-600'
      case 'excellent': return 'text-green-600'
      default: return 'text-green-600'
    }
  }

  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
      case 'challenging': return 'secondary'
      case 'moderate': return 'outline'
      case 'mild': return 'default'
      case 'excellent': return 'default'
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
        <Card className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 border-blue-200 shadow-lg">
          <CardHeader className="text-center">
            <motion.div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-green-100"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Thanks for Sharing!
            </CardTitle>
            <p className="text-gray-600 mt-2">
              We've created your wellness profile. This helps us personalize your experience.
            </p>
            <div className="flex items-center justify-center gap-2 mt-3 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Redirecting to dashboard in {redirectCountdown}s</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall Score */}
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex justify-center mb-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <Heart className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Your Wellness Check</h3>
              <div className="text-3xl font-bold text-blue-600 mb-2">{scores?.overallWellnessScore || 0}/100</div>
              <Badge variant={getRiskBadgeVariant(scores?.riskLevel || 'excellent')} className="mb-2">
                {scores?.riskDescription || 'Great wellness indicators'}
              </Badge>
              <p className="text-sm text-gray-600 mt-2">
                This gives us a starting point to support you better.
              </p>
            </div>

            {/* Key Insights - Simplified and supportive */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <h4 className="font-medium text-sm mb-2 text-gray-700">Mood</h4>
                <div className="text-lg font-semibold mb-1 text-purple-700">
                  {scores?.mood === 0 ? "Good" : scores?.mood === 1 ? "Okay" : scores?.mood === 2 ? "Challenging" : "Difficult"}
                </div>
                <div className="w-full bg-purple-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                    style={{width: `${100 - (scores?.mood || 0) * 33.33}%`}}
                  ></div>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-sm mb-2 text-gray-700">Anxiety</h4>
                <div className="text-lg font-semibold mb-1 text-green-700">
                  {scores?.anxiety === 0 ? "Calm" : scores?.anxiety === 1 ? "Some worry" : scores?.anxiety === 2 ? "Anxious" : "Very anxious"}
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                    style={{width: `${100 - (scores?.anxiety || 0) * 33.33}%`}}
                  ></div>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
                <h4 className="font-medium text-sm mb-2 text-gray-700">Stress</h4>
                <div className="text-lg font-semibold mb-1 text-orange-700">
                  {scores?.stress === 0 ? "Relaxed" : scores?.stress === 1 ? "Some stress" : scores?.stress === 2 ? "Stressed" : "Overwhelmed"}
                </div>
                <div className="w-full bg-orange-200 rounded-full h-2">
                  <div 
                    className="bg-orange-600 h-2 rounded-full transition-all duration-300" 
                    style={{width: `${100 - (scores?.stress || 0) * 33.33}%`}}
                  ></div>
                </div>
              </div>
            </div>

            {/* Supportive Recommendations */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg text-gray-800">Your Personal Suggestions</h3>
              <p className="text-sm text-gray-600 mb-4">
                Based on what you've shared, here are some gentle suggestions to support your wellbeing:
              </p>
              {recommendations.slice(0, 2).map((rec, index) => (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${
                  rec.type === 'supportive' ? 'border-l-blue-400 bg-blue-50' : 
                  rec.type === 'encouraging' ? 'border-l-green-400 bg-green-50' : 
                  rec.type === 'practical' ? 'border-l-purple-400 bg-purple-50' :
                  rec.type === 'positive' ? 'border-l-emerald-400 bg-emerald-50' :
                  'border-l-gray-400 bg-gray-50'
                }`}>
                  <div className="flex items-start gap-3">
                    <div>
                      {rec.type === 'supportive' && <Heart className="h-5 w-5 text-blue-600 mt-0.5" />}
                      {rec.type === 'encouraging' && <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />}
                      {rec.type === 'practical' && <Info className="h-5 w-5 text-purple-600 mt-0.5" />}
                      {rec.type === 'positive' && <Heart className="h-5 w-5 text-emerald-600 mt-0.5" />}
                      {rec.type === 'gentle' && <Info className="h-5 w-5 text-gray-600 mt-0.5" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm mb-1 text-gray-800">{rec.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {rec.actions.slice(0, 3).map((action: string, i: number) => (
                          <span key={i} className="text-xs px-2 py-1 bg-white bg-opacity-80 rounded-full border text-gray-700">
                            {action}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Next Steps */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Your Wellness Journey Starts Now
              </h3>
              <p className="text-blue-700 text-sm mb-3">
                This was just a quick check-in to get you started. Your dashboard has tools and resources 
                personalized for you, and you can take a more detailed assessment anytime you'd like.
              </p>
              <div className="flex gap-2">
                <Button 
                  onClick={() => router.push("/dashboard")} 
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Explore Your Dashboard
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
      <div className="mb-6 flex justify-center">
        <div className="w-full max-w-2xl h-[650px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentQuestionIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="h-full w-full"
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
        </div>
      </div>

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
