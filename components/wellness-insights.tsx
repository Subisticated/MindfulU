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
    // PHQ-9 scale - more supportive language
    if (score <= 4) return { level: 'Great', color: 'text-emerald-700', bgColor: 'bg-emerald-100', description: 'You\'re doing well' }
    if (score <= 9) return { level: 'Good', color: 'text-blue-700', bgColor: 'bg-blue-100', description: 'Some areas to watch' }
    if (score <= 14) return { level: 'Challenging', color: 'text-amber-700', bgColor: 'bg-amber-100', description: 'Let\'s work on this together' }
    return { level: 'Difficult', color: 'text-orange-700', bgColor: 'bg-orange-100', description: 'Support is available' }
  } else if (type === 'anxiety') {
    // GAD-7 scale - supportive language
    if (score <= 4) return { level: 'Calm', color: 'text-emerald-700', bgColor: 'bg-emerald-100', description: 'Feeling relaxed' }
    if (score <= 9) return { level: 'Some worry', color: 'text-blue-700', bgColor: 'bg-blue-100', description: 'Normal concerns' }
    if (score <= 14) return { level: 'Anxious', color: 'text-amber-700', bgColor: 'bg-amber-100', description: 'Manageable with support' }
    return { level: 'Very anxious', color: 'text-orange-700', bgColor: 'bg-orange-100', description: 'Help is here for you' }
  } else {
    // PSS-10 scale - supportive language
    if (score <= 13) return { level: 'Relaxed', color: 'text-emerald-700', bgColor: 'bg-emerald-100', description: 'Managing well' }
    if (score <= 26) return { level: 'Some stress', color: 'text-amber-700', bgColor: 'bg-amber-100', description: 'Normal student stress' }
    return { level: 'Stressed', color: 'text-orange-700', bgColor: 'bg-orange-100', description: 'Let\'s find relief' }
  }
}

export function WellnessInsights() {
  const { data, personalizedRecommendations } = useLocalStorage()
  const assessmentData = data?.onboarding?.assessmentData
  const userProfile = data?.onboarding?.userProfile
  
  if (!assessmentData) {
    return (
      <Card className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 border-blue-200 shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <Heart className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-gray-800">Start Your Wellness Journey</CardTitle>
          <CardDescription className="text-gray-600">
            Take a quick wellness check-in to get personalized insights and supportive recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/onboarding">Begin Your Check-in</Link>
          </Button>
          <p className="text-sm text-gray-500 mt-3">
            Takes just 2-3 minutes • Completely confidential
          </p>
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
        title: "Gentle Support Available",
        description: "You might find it helpful to talk with someone who understands student life.",
        action: "Find Support",
        href: "/resources/counseling",
        priority: "supportive",
        icon: Heart
      })
    }
    
    if (gad7Score >= 10) {
      recommendations.push({
        title: "Calm Your Mind",
        description: "Try our guided breathing exercises designed specifically for students.",
        action: "Start Breathing",
        href: "/meditation",
        priority: "helpful",
        icon: Activity
      })
    }
    
    if (pss10Score >= 20) {
      recommendations.push({
        title: "Stress Relief Tools",
        description: "Discover techniques that work for busy student schedules.",
        action: "Explore Tools",
        href: "/stress-management",
        priority: "helpful",
        icon: Target
      })
    }
    
    // Add encouraging wellness recommendations
    recommendations.push({
      title: "Daily Reflection",
      description: "A few minutes of journaling can make a big difference in how you feel.",
      action: "Start Writing",
      href: "/journal",
      priority: "encouraging",
      icon: BookOpen
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
      <Card className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 border-blue-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Heart className="h-5 w-5 text-blue-600" />
            Your Wellness Journey
          </CardTitle>
          <CardDescription className="text-gray-600">
            Hey {userProfile?.name}! Here's how you're doing since your check-in on {new Date(completedAt).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Score and Key Metrics - Horizontal Layout for Desktop */}
          <div className="grid gap-4 md:grid-cols-4">
            {/* Overall Wellness Score */}
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
              <div className="flex justify-center mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <Heart className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Your Wellness</h3>
              <div className="text-3xl font-bold text-blue-600 mb-2">{overallWellnessScore}/100</div>
              <Badge variant={riskLevel === 'challenging' ? 'secondary' : riskLevel === 'moderate' ? 'outline' : 'default'} className="mb-2">
                {riskLevel === 'excellent' ? 'Great wellness indicators' : 
                 riskLevel === 'mild' ? 'Overall doing well' :
                 riskLevel === 'moderate' ? 'Some areas need attention' :
                 'You may be facing some challenges'}
              </Badge>
              <p className="text-sm text-gray-600 mt-2">
                This gives us a snapshot of how you're doing
              </p>
            </div>

            {/* Depression Score */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                  <Brain className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Mood</span>
              </div>
              <div className="text-lg font-semibold mb-1 text-purple-700">
                {depressionInfo.level}
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                  style={{width: `${100 - (phq9Score / 27) * 100}%`}}
                ></div>
              </div>
              <p className="text-xs text-gray-600">{depressionInfo.description}</p>
            </div>

            {/* Anxiety Score */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                  <Zap className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Anxiety</span>
              </div>
              <div className="text-lg font-semibold mb-1 text-green-700">
                {anxietyInfo.level}
              </div>
              <div className="w-full bg-green-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                  style={{width: `${100 - (gad7Score / 21) * 100}%`}}
                ></div>
              </div>
              <p className="text-xs text-gray-600">{anxietyInfo.description}</p>
            </div>

            {/* Stress Score */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                  <Smile className="h-4 w-4 text-orange-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Stress</span>
              </div>
              <div className="text-lg font-semibold mb-1 text-orange-700">
                {stressInfo.level}
              </div>
              <div className="w-full bg-orange-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-orange-600 h-2 rounded-full transition-all duration-300" 
                  style={{width: `${100 - (pss10Score / 40) * 100}%`}}
                ></div>
              </div>
              <p className="text-xs text-gray-600">{stressInfo.description}</p>
            </div>
          </div>

          {/* Recommendations and Actions - Horizontal for Desktop */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Top Recommendations */}
            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-800">
                <Heart className="h-5 w-5 text-blue-600" />
                Your Personal Suggestions
              </h3>
              <div className="space-y-3">
                {recommendations.slice(0, 2).map((rec, index) => (
                  <div key={index} className={`p-4 rounded-lg border-l-4 ${
                    rec.priority === 'supportive' ? 'border-l-blue-400 bg-blue-50' : 
                    rec.priority === 'helpful' ? 'border-l-purple-400 bg-purple-50' : 
                    rec.priority === 'encouraging' ? 'border-l-green-400 bg-green-50' :
                    'border-l-gray-400 bg-gray-50'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {rec.icon && <rec.icon className="h-5 w-5 text-current opacity-70" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1 text-gray-800">{rec.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                        <Button size="sm" variant="outline" className="text-xs" asChild>
                          <Link href={rec.href}>{rec.action}</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-800">
                <Target className="h-5 w-5 text-purple-600" />
                Take Action Today
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                  <p className="text-sm text-blue-700 mb-3">
                    Regular check-ins help you track your progress and celebrate your growth.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <Button size="sm" variant="outline" className="text-xs border-blue-300 hover:bg-blue-100" asChild>
                      <Link href="/onboarding">Quick Check-in</Link>
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs border-blue-300 hover:bg-blue-100" asChild>
                      <Link href="/complete-assessment">Full Assessment</Link>
                    </Button>
                    <Button size="sm" className="text-xs bg-blue-600 hover:bg-blue-700" asChild>
                      <Link href="/ai-assistant">Chat with AI Buddy</Link>
                    </Button>
                  </div>
                </div>
                
                {/* Additional quick tools */}
                <div className="grid grid-cols-2 gap-3">
                  <Button size="sm" variant="outline" className="text-xs justify-start py-3 h-auto flex-col gap-1 border-purple-200 hover:bg-purple-50" asChild>
                    <Link href="/journal">
                      <BookOpen className="h-4 w-4 text-purple-600" />
                      <span>Write & Reflect</span>
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs justify-start py-3 h-auto flex-col gap-1 border-green-200 hover:bg-green-50" asChild>
                    <Link href="/meditation">
                      <Activity className="h-4 w-4 text-green-600" />
                      <span>Breathe & Relax</span>
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
