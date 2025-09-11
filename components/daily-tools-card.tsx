"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, Wind, Clock, Play } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export function DailyToolsCard() {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.1, rotate: 10 }} transition={{ duration: 0.2 }}>
              <Brain className="h-5 w-5 text-primary" />
            </motion.div>
            Daily Wellness Tools
          </CardTitle>
          <CardDescription>Quick tools to help you relax and focus</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link href="/meditation">
              <Button variant="outline" className="w-full justify-start gap-3 h-12 bg-transparent">
                <motion.div
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10"
                  whileHover={{ backgroundColor: "var(--primary)" }}
                  transition={{ duration: 0.2 }}
                >
                  <Brain className="h-4 w-4 text-primary" />
                </motion.div>
                <div className="text-left">
                  <div className="font-medium">Guided Meditation</div>
                  <div className="text-xs text-muted-foreground">5-15 min sessions</div>
                </div>
                <motion.div whileHover={{ scale: 1.2 }} transition={{ duration: 0.2 }}>
                  <Play className="h-4 w-4 ml-auto text-muted-foreground" />
                </motion.div>
              </Button>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link href="/breathing">
              <Button variant="outline" className="w-full justify-start gap-3 h-12 bg-transparent">
                <motion.div
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10"
                  whileHover={{ backgroundColor: "var(--primary)" }}
                  transition={{ duration: 0.2 }}
                >
                  <Wind className="h-4 w-4 text-primary" />
                </motion.div>
                <div className="text-left">
                  <div className="font-medium">Breathing Exercise</div>
                  <div className="text-xs text-muted-foreground">4-7-8 technique</div>
                </div>
                <motion.div whileHover={{ scale: 1.2 }} transition={{ duration: 0.2 }}>
                  <Play className="h-4 w-4 ml-auto text-muted-foreground" />
                </motion.div>
              </Button>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link href="/focus-timer">
              <Button variant="outline" className="w-full justify-start gap-3 h-12 bg-transparent">
                <motion.div
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10"
                  whileHover={{ backgroundColor: "var(--primary)" }}
                  transition={{ duration: 0.2 }}
                >
                  <Clock className="h-4 w-4 text-primary" />
                </motion.div>
                <div className="text-left">
                  <div className="font-medium">Focus Timer</div>
                  <div className="text-xs text-muted-foreground">Pomodoro technique</div>
                </div>
                <motion.div whileHover={{ scale: 1.2 }} transition={{ duration: 0.2 }}>
                  <Play className="h-4 w-4 ml-auto text-muted-foreground" />
                </motion.div>
              </Button>
            </Link>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
