"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, Wind, Clock, Play } from "lucide-react"
import { motion } from "framer-motion"
import { useTranslation } from "@/components/translation-provider"
import Link from "next/link"

export function DailyToolsCard() {
  const { t } = useTranslation()
  
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="bg-background/60 backdrop-blur-sm border-2 border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.1, rotate: 10 }} transition={{ duration: 0.2 }}>
              <Brain className="h-5 w-5 text-primary" />
            </motion.div>
            {t("dashboard.wellness_tools.title")}
          </CardTitle>
          <CardDescription>{t("dashboard.wellness_tools.description")}</CardDescription>
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
                  <div className="font-medium">{t("dashboard.wellness_tools.meditation")}</div>
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
                  <div className="font-medium">{t("dashboard.wellness_tools.breathing_exercise")}</div>
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
                  <div className="font-medium">{t("dashboard.wellness_tools.focus_timer")}</div>
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
