"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { useLocalStorage } from "@/components/local-storage-provider"
import { 
  Brain, 
  Heart, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  TrendingUp,
  Calendar,
  Target,
  Users,
  Moon,
  BookOpen,
  Activity,
  Smile
} from "lucide-react"
import { motion } from "framer-motion"

const severityColors = {
  minimal: "bg-green-100 text-green-800",
  low: "bg-green-100 text-green-800", 
  mild: "bg-yellow-100 text-yellow-800",
  moderate: "bg-orange-100 text-orange-800",
  "moderate-severe": "bg-red-100 text-red-800",
  high: "bg-red-100 text-red-800",
  severe: "bg-red-200 text-red-900"
}

const getRecommendationIcon = (type: string) => {
  switch (type) {
    case "urgent": return <AlertTriangle className="h-4 w-4 text-red-500" />
    case "important": return <Info className="h-4 w-4 text-orange-500" />
    case "helpful": return <Heart className="h-4 w-4 text-blue-500" />
    default: return <Info className="h-4 w-4 text-gray-500" />
  }
}

const getWellnessIcon = (area: string) => {
  switch (area) {
    case "depression": return <Brain className="h-5 w-5" />
    case "anxiety": return <Zap className="h-5 w-5" />
    case "stress": return <Activity className="h-5 w-5" />
    case "sleep": return <Moon className="h-5 w-5" />
    case "social": return <Users className="h-5 w-5" />
    case "academic": return <BookOpen className="h-5 w-5" />
    default: return <Heart className="h-5 w-5" />
  }
}

export function WellnessInsights() {
  const { data } = useLocalStorage()
  const assessmentData = data?.onboarding?.assessmentData

  if (!assessmentData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Wellness Insights
          </CardTitle>
          <CardDescription>Complete your wellness assessment to see personalized insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No assessment data available</p>
            <Button className="mt-4" onClick={() => window.location.href = "/onboarding"}>
              Take Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const completionDate = completedAt ? new Date(completedAt).toLocaleDateString() : "Recently"
  
  const overallWellnessScore = () => {
    const totalScore = (scores.phq9 || 0) + (scores.gad7 || 0) + (scores.pss10 || 0) * 0.5
    const maxScore = 27 + 21 + 20 // Max possible combined score (adjusted for PSS-10)
    return Math.max(0, 100 - Math.round((totalScore / maxScore) * 100))
  }

  const wellnessLevel = () => {
    const score = overallWellnessScore()
    if (score >= 80) return { level: "Excellent", color: "text-green-600", bgColor: "bg-green-50" }
    if (score >= 65) return { level: "Good", color: "text-blue-600", bgColor: "bg-blue-50" }
    if (score >= 50) return { level: "Fair", color: "text-yellow-600", bgColor: "bg-yellow-50" }
    if (score >= 35) return { level: "Concerning", color: "text-orange-600", bgColor: "bg-orange-50" }
    return { level: "Needs Attention", color: "text-red-600", bgColor: "bg-red-50" }
  }

  const wellness = wellnessLevel()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Overall Wellness Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Your Wellness Overview
          </CardTitle>
          <CardDescription>Based on your assessment completed on {completionDate}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className={`rounded-lg p-6 ${wellness.bgColor}`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold">Overall Wellness</h3>
                <p className={`text-lg font-semibold ${wellness.color}`}>{wellness.level}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{overallWellnessScore()}%</div>
                <p className="text-sm text-muted-foreground">Wellness Score</p>
              </div>
            </div>
            <Progress value={overallWellnessScore()} className="h-3" />
          </div>

          {/* Detailed Scores */}
          <div className="grid md:grid-cols-3 gap-4">
            {scores.phq9Level && (
              <div className="text-center p-4 rounded-lg border">
                <Brain className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <h4 className="font-medium text-sm">Depression</h4>
                <Badge className={severityColors[scores.phq9Level.severity as keyof typeof severityColors] || severityColors.minimal}>
                  {scores.phq9Level.level}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">{scores.phq9}/27</p>
              </div>
            )}
            
            {scores.gad7Level && (
              <div className="text-center p-4 rounded-lg border">
                <Zap className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
                <h4 className="font-medium text-sm">Anxiety</h4>
                <Badge className={severityColors[scores.gad7Level.severity as keyof typeof severityColors] || severityColors.minimal}>
                  {scores.gad7Level.level}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">{scores.gad7}/21</p>
              </div>
            )}
            
            {scores.pss10Level && (
              <div className="text-center p-4 rounded-lg border">
                <Activity className="h-6 w-6 mx-auto mb-2 text-red-600" />
                <h4 className="font-medium text-sm">Stress</h4>
                <Badge className={severityColors[scores.pss10Level.severity as keyof typeof severityColors] || severityColors.minimal}>
                  {scores.pss10Level.level}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">{scores.pss10}/40</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Personalized Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Personalized Recommendations
            </CardTitle>
            <CardDescription>Based on your assessment results, here are tailored suggestions for you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Alert className="border-l-4 border-l-primary">
                  <div className="flex items-start space-x-3">
                    {getRecommendationIcon(rec.type)}
                    <div className="flex-1">
                      <h4 className="font-medium">{rec.title}</h4>
                      <AlertDescription className="mt-1">
                        {rec.description}
                      </AlertDescription>
                      {rec.actions && rec.actions.length > 0 && (
                        <div className="mt-3 space-y-1">
                          <p className="text-sm font-medium">Recommended actions:</p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {rec.actions.map((action: string, actionIndex: number) => (
                              <li key={actionIndex} className="flex items-center space-x-2">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                <span>{action}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </Alert>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smile className="h-5 w-5 text-primary" />
            Quick Wellness Actions
          </CardTitle>
          <CardDescription>Take immediate steps to support your mental health</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2" onClick={() => window.location.href = "/breathing"}>
              <Activity className="h-6 w-6" />
              <span className="text-xs">Breathing Exercise</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2" onClick={() => window.location.href = "/meditation"}>
              <Brain className="h-6 w-6" />
              <span className="text-xs">Meditation</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2" onClick={() => window.location.href = "/journal"}>
              <BookOpen className="h-6 w-6" />
              <span className="text-xs">Journal Entry</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2" onClick={() => window.location.href = "/focus-timer"}>
              <Target className="h-6 w-6" />
              <span className="text-xs">Focus Timer</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Retake Assessment */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Update Your Assessment</h4>
              <p className="text-sm text-muted-foreground">Retake the wellness assessment to track your progress</p>
            </div>
            <Button variant="outline" onClick={() => window.location.href = "/onboarding"}>
              <Calendar className="h-4 w-4 mr-2" />
              Retake Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
