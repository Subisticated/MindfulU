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
import { useMongoose } from "@/components/mongoose-provider"
import Link from "next/link"

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
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
  const { data, personalizedRecommendations } = useMongoose()
  const assessmentData = data?.assessments?.[0] // Get latest assessment
  const userProfile = data // User profile is now directly in data
  
  if (!assessmentData) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Wellness Insights
          </CardTitle>
          <CardDescription>Complete your assessment to see personalized insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="mb-4 mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <p className="text-muted-foreground mb-4">
              Take your wellness assessment to unlock personalized insights and recommendations.
            </p>
            <Button asChild>
              <Link href="/onboarding">Take Assessment</Link>
            </Button>
          </div>
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
      <Card className="w-full">
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
          {/* Horizontal layout for better space utilization */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Overall Wellness Score - Compact */}
            <div className="lg:col-span-1">
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 h-full flex flex-col justify-center">
                <div className="flex justify-center mb-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-1">Overall Wellness</h3>
                <div className="text-3xl font-bold text-primary mb-1">{overallWellnessScore}/100</div>
                <Badge variant={riskLevel === 'severe' ? 'destructive' : riskLevel === 'moderate' ? 'secondary' : 'default'} className="text-xs">
                  {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk
                </Badge>
              </div>
            </div>

            {/* Assessment Breakdown - Two columns */}
            <div className="lg:col-span-2">
              <h3 className="font-semibold text-lg mb-4">Assessment Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <ScoreDisplay
                    label="Depression (PHQ-9)"
                    score={phq9Score}
                    maxScore={27}
                    color="bg-blue-500/10 text-blue-600"
                    icon={Brain}
                  />
                  <Badge className={`${depressionInfo.bgColor} ${depressionInfo.color} text-xs`}>
                    {depressionInfo.level}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <ScoreDisplay
                    label="Anxiety (GAD-7)"
                    score={gad7Score}
                    maxScore={21}
                    color="bg-purple-500/10 text-purple-600"
                    icon={Zap}
                  />
                  <Badge className={`${anxietyInfo.bgColor} ${anxietyInfo.color} text-xs`}>
                    {anxietyInfo.level}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <ScoreDisplay
                    label="Stress (PSS-10)"
                    score={pss10Score}
                    maxScore={40}
                    color="bg-orange-500/10 text-orange-600"
                    icon={AlertTriangle}
                  />
                  <Badge className={`${stressInfo.bgColor} ${stressInfo.color} text-xs`}>
                    {stressInfo.level}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Personalized Recommendations - Horizontal layout */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Personalized Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {recommendations.map((rec, index) => (
                <div key={index} className={`p-3 rounded-lg border ${
                  rec.priority === 'high' ? 'border-red-200 bg-red-50' : 
                  rec.priority === 'medium' ? 'border-orange-200 bg-orange-50' : 
                  'border-green-200 bg-green-50'
                }`}>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {rec.priority === 'high' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                      {rec.priority === 'medium' && <Calendar className="h-4 w-4 text-orange-600" />}
                      {rec.priority === 'low' && <CheckCircle className="h-4 w-4 text-green-600" />}
                      <h4 className="font-semibold text-sm">{rec.title}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{rec.description}</p>
                    <Button size="sm" variant="outline" className="w-full text-xs" asChild>
                      <Link href={rec.href}>{rec.action}</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps - Compact */}
          <div className="p-3 rounded-lg bg-muted/50 border-l-4 border-primary">
            <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Next Steps
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Consider retaking this assessment in 2-4 weeks to track your progress and adjust your wellness strategy.
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" asChild>
                <Link href="/onboarding">Retake Assessment</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/ai-assistant">Get AI Guidance</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
