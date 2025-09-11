"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, BookOpen, Brain, Sparkles } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useLocalStorage } from "@/components/local-storage-provider"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      duration: 0.2,
    },
  },
}

export default function LandingPage() {
  const { data, isLoggedIn } = useLocalStorage()
  const router = useRouter()

  // Redirect logged-in users to dashboard
  useEffect(() => {
    if (isLoggedIn) {
      router.push('/dashboard')
    }
  }, [isLoggedIn, router])

  // Show loading or nothing while redirecting
  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20 mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Heart className="h-8 w-8 text-primary" />
          </motion.div>
          <p className="text-muted-foreground">Redirecting to your dashboard...</p>
        </div>
      </div>
    )
  }

  const getStartedPath = "/onboarding"

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <Navbar />

      {/* Hero Section */}
      <section className="container px-4 py-16 md:py-24">
        <motion.div
          className="mx-auto max-w-4xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="mb-8 flex justify-center" variants={itemVariants}>
            <motion.div
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Heart className="h-8 w-8 text-primary" />
            </motion.div>
          </motion.div>

          <motion.h1
            className="mb-6 text-4xl font-bold tracking-tight text-balance md:text-6xl"
            variants={itemVariants}
          >
            Your Personal Student
            <span className="text-primary"> Wellness Companion</span>
          </motion.h1>

          <motion.p
            className="mb-8 text-lg text-muted-foreground text-pretty md:text-xl max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Navigate student life with confidence. Track your mood, journal your thoughts, and discover tools for better
            mental wellness—all in one calming space.
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" variants={itemVariants}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" className="text-base" asChild>
                <Link href={getStartedPath}>Get Started Free</Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" size="lg" className="text-base bg-transparent" asChild>
                <Link href="/meditation">Try Wellness Tools</Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-4 text-3xl font-bold text-balance">Everything you need for mental wellness</h2>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              Simple, effective tools designed specifically for students to manage stress, track emotions, and build
              healthy habits.
            </p>
          </motion.div>

          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={cardVariants} whileHover="hover">
              <Link href="/dashboard">
                <Card className="h-full transition-shadow duration-300 cursor-pointer">
                  <CardHeader>
                    <motion.div
                      className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10"
                      whileHover={{ scale: 1.1, backgroundColor: "var(--primary)" }}
                      transition={{ duration: 0.2 }}
                    >
                      <Heart className="h-6 w-6 text-primary" />
                    </motion.div>
                    <CardTitle>Mood Tracking</CardTitle>
                    <CardDescription>
                      Monitor your emotional patterns and identify triggers with our intuitive mood tracker.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </motion.div>

            <motion.div variants={cardVariants} whileHover="hover">
              <Link href="/journal">
                <Card className="h-full transition-shadow duration-300 cursor-pointer">
                  <CardHeader>
                    <motion.div
                      className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10"
                      whileHover={{ scale: 1.1, backgroundColor: "var(--primary)" }}
                      transition={{ duration: 0.2 }}
                    >
                      <BookOpen className="h-6 w-6 text-primary" />
                    </motion.div>
                    <CardTitle>Daily Journaling</CardTitle>
                    <CardDescription>
                      Express your thoughts in a safe, private space designed to promote reflection and growth.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </motion.div>

            <motion.div variants={cardVariants} whileHover="hover">
              <Link href="/meditation">
                <Card className="h-full transition-shadow duration-300 cursor-pointer">
                  <CardHeader>
                    <motion.div
                      className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10"
                      whileHover={{ scale: 1.1, backgroundColor: "var(--primary)" }}
                      transition={{ duration: 0.2 }}
                    >
                      <Brain className="h-6 w-6 text-primary" />
                    </motion.div>
                    <CardTitle>Wellness Tools</CardTitle>
                    <CardDescription>
                      Access guided meditation, breathing exercises, and stress management techniques.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </motion.div>

            <motion.div variants={cardVariants} whileHover="hover" className="md:col-span-2 lg:col-span-1">
              <Link href="/ai-assistant">
                <Card className="h-full transition-shadow duration-300 cursor-pointer">
                  <CardHeader>
                    <motion.div
                      className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10"
                      whileHover={{ scale: 1.1, backgroundColor: "var(--primary)" }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sparkles className="h-6 w-6 text-primary" />
                    </motion.div>
                    <CardTitle className="flex items-center gap-2">AI Mood Coach</CardTitle>
                    <CardDescription>
                      Get personalized insights and recommendations based on your mood patterns and journal entries.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer
        className="border-t bg-muted/30"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="container px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Heart className="h-5 w-5 text-primary" />
              <span className="font-semibold">MindfulU</span>
            </motion.div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link href="/dashboard" className="hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link href="/journal" className="hover:text-foreground transition-colors">
                  Journal
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link href="/settings" className="hover:text-foreground transition-colors">
                  Settings
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}
