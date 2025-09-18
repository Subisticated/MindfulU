"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { 
  Bot, 
  Sparkles, 
  Brain, 
  Heart, 
  MessageCircle, 
  ArrowLeft,
  Zap,
  Shield,
  Users,
  Clock
} from "lucide-react"
import Link from "next/link"
import { PageLayout } from "@/components/page-layout"
import { EnhancedCard } from "@/components/enhanced-card"

const features = [
  {
    icon: Brain,
    title: "Smart Analysis",
    description: "AI-powered mood pattern recognition and personalized insights",
    status: "coming-soon"
  },
  {
    icon: Heart,
    title: "Emotional Support",
    description: "24/7 compassionate AI companion for mental wellness guidance",
    status: "coming-soon"
  },
  {
    icon: MessageCircle,
    title: "Interactive Chat",
    description: "Natural conversations with context-aware responses",
    status: "coming-soon"
  },
  {
    icon: Zap,
    title: "Quick Insights",
    description: "Instant wellness recommendations based on your current state",
    status: "coming-soon"
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your conversations remain private and secure",
    status: "coming-soon"
  },
  {
    icon: Users,
    title: "Community Learning",
    description: "AI learns from anonymized community patterns to help you better",
    status: "coming-soon"
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4
    }
  }
}

export default function AIAssistantPage() {
  return (
    <PageLayout
      title="AI Wellness Coach"
      description="Your intelligent companion for mental health support and personalized wellness guidance"
      icon={<Bot />}
      actions={
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      }
      fullWidth={true}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8 lg:space-y-12"
      >
        {/* Hero Section */}
        <motion.div variants={cardVariants} className="text-center max-w-4xl mx-auto">
          <div className="relative p-8 lg:p-12 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-2xl border border-primary/20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-4 right-4"
            >
              <Sparkles className="h-6 w-6 text-primary/40" />
            </motion.div>
            
            <Bot className="h-16 w-16 lg:h-20 lg:w-20 text-primary mx-auto mb-6" />
            
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              Meet Your AI Wellness Coach
            </h2>
            
            <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto">
              We're building an intelligent companion that will understand your emotions, 
              provide personalized guidance, and support your mental wellness journey 24/7.
            </p>
            
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <Clock className="h-4 w-4 mr-2" />
              Coming Soon
            </Badge>
          </div>
        </motion.div>

        {/* Features Grid - Building Block Layout */}
        <motion.div variants={cardVariants}>
          <h3 className="text-xl lg:text-2xl font-semibold mb-6 text-center">
            Upcoming Features
          </h3>
          
          <div className="grid gap-6 lg:gap-8 
                          grid-cols-1 
                          md:grid-cols-2 
                          xl:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                whileHover={{ scale: 1.02 }}
                className="h-full"
              >
                <EnhancedCard
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                  className="h-full border-dashed"
                >
                  <div className="pt-4">
                    <Badge variant="outline" className="text-xs">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Coming Soon
                    </Badge>
                  </div>
                </EnhancedCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div variants={cardVariants} className="text-center">
          <Card className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-muted/50 to-muted/30 border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Stay Tuned
              </CardTitle>
              <CardDescription>
                We're working hard to bring you the most advanced AI wellness companion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                While you wait, explore our current wellness tools and build healthy habits 
                that our AI will enhance with personalized insights.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/dashboard">
                  <Button className="w-full sm:w-auto">
                    Explore Current Tools
                  </Button>
                </Link>
                <Link href="/journal">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Start Journaling
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </PageLayout>
  )
}
