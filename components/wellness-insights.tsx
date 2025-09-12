"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
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
import { useLocalStorage } from "@/components/local-storage-provider"
import Link from "next/link"

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0
  },
}

interface ScoreDisplayProps {
  label: string
  score: number
  maxScore: number
  color: string
  icon: React.ElementType
}

function ScoreDisplay({ label, score, maxScore, color, icon: Icon }: ScoreDisplayProps) {
  const percentage = (score / maxScore) * 100
  
  return (
    <div className="flex items-center gap-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium">{label}</span>
          <span className="text-sm text-muted-foreground">{score}/{maxScore}</span>
        </div>
        <Progress value={percentage} className="h-2" />
      </div>
    </div>
  )
}

function getSeverityInfo(score: number, type: 'depression' | 'anxiety' | 'stress') {
  if (type === 'depression') {
    // PHQ-9 scale
    if (score <= 4) return { level: 'Minimal', color: 'text-green-600', bgColor: 'bg-green-500/10' }
    if (score <= 9) return { level: 'Mild', color: 'text-yellow-600', bgColor: 'bg-yellow-500/10' }
    if (score <= 14) return { level: 'Moderate', color: 'text-orange-600', bgColor: 'bg-orange-500/10' }
    return { level: 'Severe', color: 'text-red-600', bgColor: 'bg-red-500/10' }
  } else if (type === 'anxiety') {
    // GAD-7 scale
    if (score <= 4) return { level: 'Minimal', color: 'text-green-600', bgColor: 'bg-green-500/10' }
    if (score <= 9) return { level: 'Mild', color: 'text-yellow-600', bgColor: 'bg-yellow-500/10' }
    if (score <= 14) return { level: 'Moderate', color: 'text-orange-600', bgColor: 'bg-orange-500/10' }
    return { level: 'Severe', color: 'text-red-600', bgColor: 'bg-red-500/10' }
  } else {
    // PSS-10 scale
    if (score <= 13) return { level: 'Low', color: 'text-green-600', bgColor: 'bg-green-500/10' }
    if (score <= 26) return { level: 'Moderate', color: 'text-yellow-600', bgColor: 'bg-yellow-500/10' }
    return { level: 'High', color: 'text-red-600', bgColor: 'bg-red-500/10' }
  }
}

export function WellnessInsights() {
  const { data, personalizedRecommendations } = useLocalStorage()
  const assessmentData = data?.onboarding?.assessmentData
  const userProfile = data?.onboarding?.userProfile
  
  if (!assessmentData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wellness Insights</CardTitle>
          <CardDescription>Complete your assessment to see personalized insights</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/onboarding">Take Assessment</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const {
    phq9Score,
    gad7Score,
    pss10Score,
    overallWellnessScore,
    riskLevel,
    completedAt
  } = assessmentData

  const depressionInfo = getSeverityInfo(phq9Score, 'depression')
  const anxietyInfo = getSeverityInfo(gad7Score, 'anxiety')
  const stressInfo = getSeverityInfo(pss10Score, 'stress')

  // Generate specific recommendations based on scores
  const getRecommendations = () => {
    const recommendations = []
    
    if (phq9Score >= 10) {
      recommendations.push({
        title: "Consider Professional Support",
        description: "Your depression screening suggests you might benefit from speaking with a counselor.",
        action: "Find Counseling",
        href: "/resources/counseling",
        priority: "high"
      })
    }
    
    if (gad7Score >= 10) {
      recommendations.push({
        title: "Anxiety Management Tools",
        description: "Try our guided breathing exercises and relaxation techniques.",
        action: "Start Relaxation",
        href: "/meditation",
        priority: "medium"
      })
    }
    
    if (pss10Score >= 20) {
      recommendations.push({
        title: "Stress Reduction Strategies",
        description: "Learn effective techniques to manage academic and personal stress.",
        action: "Explore Tools",
        href: "/stress-management",
        priority: "medium"
      })
    }
    
    // Add general wellness recommendations
    recommendations.push({
      title: "Daily Journaling",
      description: "Regular reflection can help improve emotional awareness and processing.",
      action: "Start Writing",
      href: "/journal",
      priority: "low"
    })

    return recommendations
  }

  const recommendations = getRecommendations()

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Your Wellness Insights
          </CardTitle>
          <CardDescription>
            Welcome {userProfile?.name}! Based on your assessment completed on {new Date(completedAt).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Score and Key Metrics - Horizontal Layout for Desktop */}
          <div className="grid gap-4 md:grid-cols-4">
            {/* Overall Wellness Score */}
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
              <div className="flex justify-center mb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-bold mb-1">Overall Score</h3>
              <div className="text-2xl font-bold text-primary mb-1">{overallWellnessScore}/100</div>
              <Badge variant={riskLevel === 'severe' ? 'destructive' : riskLevel === 'moderate' ? 'secondary' : 'default'} className="text-xs">
                {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk
              </Badge>
            </div>

            {/* Depression Score */}
            <div className="p-4 rounded-lg bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10">
                  <Brain className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium">Depression</span>
              </div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg font-bold">{phq9Score}/27</span>
                <Badge className={`${depressionInfo.bgColor} ${depressionInfo.color} text-xs`}>
                  {depressionInfo.level}
                </Badge>
              </div>
              <Progress value={(phq9Score / 27) * 100} className="h-1.5" />
            </div>

            {/* Anxiety Score */}
            <div className="p-4 rounded-lg bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/10">
                  <Zap className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-sm font-medium">Anxiety</span>
              </div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg font-bold">{gad7Score}/21</span>
                <Badge className={`${anxietyInfo.bgColor} ${anxietyInfo.color} text-xs`}>
                  {anxietyInfo.level}
                </Badge>
              </div>
              <Progress value={(gad7Score / 21) * 100} className="h-1.5" />
            </div>

            {/* Stress Score */}
            <div className="p-4 rounded-lg bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/10">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                </div>
                <span className="text-sm font-medium">Stress</span>
              </div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg font-bold">{pss10Score}/40</span>
                <Badge className={`${stressInfo.bgColor} ${stressInfo.color} text-xs`}>
                  {stressInfo.level}
                </Badge>
              </div>
              <Progress value={(pss10Score / 40) * 100} className="h-1.5" />
            </div>
          </div>

          {/* Recommendations and Actions - Horizontal for Desktop */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Top Recommendations */}
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Priority Actions
              </h3>
              <div className="space-y-2">
                {recommendations.slice(0, 2).map((rec, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${
                    rec.priority === 'high' ? 'border-red-200 bg-red-50' : 
                    rec.priority === 'medium' ? 'border-orange-200 bg-orange-50' : 
                    'border-green-200 bg-green-50'
                  }`}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {rec.priority === 'high' && <AlertTriangle className="h-3 w-3 text-red-600" />}
                          {rec.priority === 'medium' && <Calendar className="h-3 w-3 text-orange-600" />}
                          {rec.priority === 'low' && <CheckCircle className="h-3 w-3 text-green-600" />}
                          <h4 className="font-semibold text-sm">{rec.title}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground">{rec.description}</p>
                      </div>
                      <Button size="sm" variant="outline" className="text-xs px-2 py-1" asChild>
                        <Link href={rec.href}>{rec.action}</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-muted/50 border-l-4 border-primary">
                  <p className="text-sm text-muted-foreground mb-2">
                    Track your progress by retaking the assessment in 2-4 weeks.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <Button size="sm" variant="outline" className="text-xs" asChild>
                      <Link href="/onboarding">Retake Assessment</Link>
                    </Button>
                    <Button size="sm" className="text-xs" asChild>
                      <Link href="/ai-assistant">Get AI Guidance</Link>
                    </Button>
                  </div>
                </div>
                
                {/* Additional quick tools */}
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="outline" className="text-xs justify-start" asChild>
                    <Link href="/journal">
                      <BookOpen className="h-3 w-3 mr-1" />
                      Journal
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs justify-start" asChild>
                    <Link href="/meditation">
                      <Activity className="h-3 w-3 mr-1" />
                      Meditate
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
