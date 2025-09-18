"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { QuestionCard } from "./QuestionCard"
import { ProgressBar } from "./ProgressBar"
import { questionSets, calculateScores, generateRecommendations } from "./questionData"
import { useMongoose } from "@/components/mongoose-provider"
import { ChevronLeft, ChevronRight, CheckCircle, AlertTriangle, Info, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuestionnaireProps {
  onComplete?: (results: any) => void;
  className?: string;
  initialData?: Record<string, any>;
};
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

export function Questionnaire({ onComplete, className = "", initialData = {} }: QuestionnaireProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const { completeOnboarding, updateData, data } = useMongoose()
  // ...existing state declarations...
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>(initialData)
  const [direction, setDirection] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [scores, setScores] = useState<any>(null)
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [redirectCountdown, setRedirectCountdown] = useState(0)
  const [hasRedirected, setHasRedirected] = useState(false) // Prevent multiple redirects

  // Handle countdown and redirect when questionnaire is complete
  useEffect(() => {
    if (isComplete && redirectCountdown > 0 && !hasRedirected) {
      const countdown = setInterval(() => {
        setRedirectCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdown)
            if (!hasRedirected && typeof window !== 'undefined' && window.location.pathname !== '/dashboard') {
              setHasRedirected(true)
              console.log('Auto-redirecting to dashboard...')
              router.push("/dashboard")
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
      
      return () => clearInterval(countdown)
    }
  }, [isComplete, redirectCountdown, router, hasRedirected])



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
  
  // Flatten all questions from all sets
  const allQuestions = [
    ...questionSets.phq9.questions.map(q => ({ ...q, section: 'phq9', sectionTitle: questionSets.phq9.name, sectionDescription: questionSets.phq9.description })),
    ...questionSets.gad7.questions.map(q => ({ ...q, section: 'gad7', sectionTitle: questionSets.gad7.name, sectionDescription: questionSets.gad7.description })),
    ...questionSets.pss10.questions.map(q => ({ ...q, section: 'pss10', sectionTitle: questionSets.pss10.name, sectionDescription: questionSets.pss10.description })),
    ...questionSets.studentAddons.questions.map(q => ({ ...q, section: 'studentAddons', sectionTitle: questionSets.studentAddons.name, sectionDescription: questionSets.studentAddons.description }))
  ]


  const currentQuestion = allQuestions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === allQuestions.length - 1
  const canGoBack = currentQuestionIndex > 0
  const hasAnswer = currentQuestion && answers[currentQuestion.id] !== undefined && answers[currentQuestion.id] !== ""
  const isOptional = currentQuestion && 'optional' in currentQuestion ? currentQuestion.optional : false

  // Helper function to determine the most severe risk level
  const getMostSevereLevel = (levels: any[]): 'minimal' | 'mild' | 'moderate' | 'severe' => {
    const severityOrder = ['minimal', 'mild', 'moderate', 'moderate-severe', 'severe']
    let mostSevere = 'minimal'
    
    levels.forEach(level => {
      if (level && level.severity) {
        const currentIndex = severityOrder.indexOf(level.severity)
        const mostSevereIndex = severityOrder.indexOf(mostSevere)
        if (currentIndex > mostSevereIndex) {
          mostSevere = level.severity === 'moderate-severe' ? 'severe' : level.severity
        }
      }
    })
    
    return mostSevere as 'minimal' | 'mild' | 'moderate' | 'severe'
  }

  const handleAnswerChange = (value: any) => {
    if (!currentQuestion) return
    
      setAnswers(prev => {
        const updated = { ...prev, [currentQuestion.id]: value }
    // Persist answers immediately
    // updateData({ answers: updated }) // Temporarily disabled
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
      // Calculate scores
      const calculatedScores = calculateScores(answers)
      setScores(calculatedScores)
      
      // Generate recommendations
      const recs = generateRecommendations(calculatedScores, answers)
      setRecommendations(recs)
      
      // Extract user profile from student questions
      const userProfile = {
        id: `user_${Date.now()}`,
        name: answers['student_name'] || session?.user?.name || 'Student',
        email: answers['student_email'] || session?.user?.email || '',
        university: answers['student_university'] || '',
        completedAt: new Date().toISOString()
      }

      // Create assessment data with proper typing
      const assessmentData = {
        phq9Score: calculatedScores.phq9 || 0,
        gad7Score: calculatedScores.gad7 || 0,
        pss10Score: calculatedScores.pss10 || 0,
        overallWellnessScore: Math.round(100 - ((calculatedScores.phq9 || 0) + (calculatedScores.gad7 || 0) + (calculatedScores.pss10 || 0)) / 3),
        riskLevel: getMostSevereLevel([calculatedScores.phq9Level, calculatedScores.gad7Level, calculatedScores.pss10Level]),
        completedAt: new Date().toISOString()
      }

      // Save to local storage
      completeOnboarding({
        userProfile,
        assessmentData,
        answers
      })
      
      // Save to database if user is authenticated
      if (session?.user) {
        try {
          const response = await fetch('/api/assessments', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              phq9Score: assessmentData.phq9Score,
              gad7Score: assessmentData.gad7Score,
              pss10Score: assessmentData.pss10Score,
              overallWellnessScore: assessmentData.overallWellnessScore,
              riskLevel: assessmentData.riskLevel,
              answers: JSON.stringify(answers),
              recommendations: JSON.stringify(recs)
            })
          })

          if (response.ok) {
            console.log('Assessment saved to database successfully')
          } else {
            console.error('Failed to save assessment to database')
          }
        } catch (error) {
          console.error('Error saving assessment to database:', error)
          // Don't let database errors stop the flow - local storage is already saved
        }
      }
      
      // Mark as complete and start countdown
      setIsComplete(true)
      setRedirectCountdown(5) // Give more time to see results
      
      if (onComplete) {
        onComplete({
          answers,
          scores: calculatedScores,
          recommendations: recs
        })
      }
    } catch (error) {
      console.error('Error completing questionnaire:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleContinueToDashboard = () => {
    console.log('Manual redirect to dashboard triggered')
    setRedirectCountdown(0) // Stop any automatic countdown
    router.push("/dashboard")
  }

  const getScoreColor = (level: any) => {
    if (!level) return "bg-gray-100 text-gray-800"
    switch (level.severity) {
      case "minimal":
      case "low":
        return "bg-green-100 text-green-800"
      case "mild":
      case "moderate":
        return "bg-yellow-100 text-yellow-800"
      case "moderate-severe":
      case "high":
        return "bg-orange-100 text-orange-800"
      case "severe":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case "urgent":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "important":
        return <Info className="h-4 w-4 text-orange-500" />
      case "helpful":
        return <Heart className="h-4 w-4 text-blue-500" />
      default:
        return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  if (isComplete) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={cn("max-w-4xl mx-auto p-6 space-y-8", className)}
      >
        {/* Completion Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold">Assessment Complete!</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Thank you for completing the wellness assessment. This information will help us personalize your experience and provide tailored recommendations for your mental health journey.
          </p>
        </motion.div>

        {/* Score Summary */}
        {scores && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-6">Your Assessment Results</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {scores.phq9Level && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Depression Screening (PHQ-9)</h4>
                      <Badge className={getScoreColor(scores.phq9Level)}>
                        {scores.phq9Level.level} ({scores.phq9}/27)
                      </Badge>
                    </div>
                  )}
                  
                  {scores.gad7Level && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Anxiety Screening (GAD-7)</h4>
                      <Badge className={getScoreColor(scores.gad7Level)}>
                        {scores.gad7Level.level} ({scores.gad7}/21)
                      </Badge>
                    </div>
                  )}
                  
                  {scores.pss10Level && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Stress Level (PSS-10)</h4>
                      <Badge className={getScoreColor(scores.pss10Level)}>
                        {scores.pss10Level.level} ({scores.pss10}/40)
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-6">Personalized Recommendations</h3>
                <div className="space-y-4">
                  {recommendations.map((rec, index) => (
                    <Alert key={index} className="border-l-4 border-l-primary">
                      <div className="flex items-start space-x-3">
                        {getRecommendationIcon(rec.type)}
                        <div className="flex-1">
                          <h4 className="font-medium">{rec.title}</h4>
                          <AlertDescription className="mt-1">
                            {rec.description}
                          </AlertDescription>
                          {rec.actions && rec.actions.length > 0 && (
                            <div className="mt-3 space-y-1">
                              <p className="text-sm font-medium">Suggested actions:</p>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                {rec.actions.map((action: string, actionIndex: number) => (
                                  <li key={actionIndex} className="flex items-center space-x-2">
                                    <div className="w-1 h-1 bg-primary rounded-full"></div>
                                    <span>{action}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center space-y-4"
        >
          {redirectCountdown > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700">
                Redirecting to your personalized dashboard in {redirectCountdown} seconds...
              </p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleContinueToDashboard}
              size="lg"
              className="px-8 py-3 text-lg font-medium"
            >
              Continue to Dashboard
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            {redirectCountdown > 0 && (
              <Button
                onClick={() => setRedirectCountdown(0)}
                variant="outline"
                size="lg"
                className="px-6 py-3"
              >
                Cancel Auto-Redirect
              </Button>
            )}
          </div>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn("max-w-full sm:max-w-3xl mx-auto p-2 sm:p-4 md:p-6", className)}
    >
      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 sm:mb-6 md:mb-8"
      >
        <ProgressBar
          current={currentQuestionIndex + 1}
          total={allQuestions.length}
          animated={true}
        />
      </motion.div>

      {/* Question Card */}
      <div className="mb-4 sm:mb-6 md:mb-8">
        {currentQuestion && (
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentQuestionIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
            >
              <QuestionCard
                question={currentQuestion as any}
                value={answers[currentQuestion.id]}
                onChange={handleAnswerChange}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={allQuestions.length}
                sectionTitle={
                  currentQuestionIndex === 0 || 
                  currentQuestion.section !== allQuestions[currentQuestionIndex - 1]?.section 
                    ? currentQuestion.sectionTitle 
                    : undefined
                }
                sectionDescription={
                  currentQuestionIndex === 0 || 
                  currentQuestion.section !== allQuestions[currentQuestionIndex - 1]?.section 
                    ? currentQuestion.sectionDescription 
                    : undefined
                }
              />
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-between items-center gap-2 sm:gap-4 flex-wrap"
      >
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={!canGoBack}
          className="flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base px-3 sm:px-4"
        >
          <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          <span>Previous</span>
        </Button>

        <div className="text-xs sm:text-sm text-muted-foreground text-center min-w-0 flex-shrink">
          {currentQuestionIndex + 1} of {allQuestions.length}
        </div>

        <Button
          onClick={handleNext}
          disabled={isLoading || (!hasAnswer && !isOptional)}
          className="flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base px-3 sm:px-4"
        >
          <span>{isLastQuestion ? "Complete" : "Next"}</span>
          {isLoading ? (
            <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
          )}
        </Button>
      </motion.div>
    </motion.div>
  )
}
