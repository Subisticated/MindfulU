"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Plus, Calendar, Heart } from "lucide-react"
import { motion } from "framer-motion"
import { useMongoose } from "@/components/mongoose-provider"
import { useTranslation } from "@/components/translation-provider"
import Link from "next/link"

const moodColors = {
  amazing: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  good: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  neutral: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  low: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  sad: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  anxious: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
}

interface DailyJournalCardProps {
  onOpenModal?: () => void
}

export function DailyJournalCard({ onOpenModal }: DailyJournalCardProps) {
  const { data } = useMongoose()
  const { t } = useTranslation()
  
  // Get the most recent journal entry
  const recentEntry = data?.journalEntries?.[0]
  const totalEntries = data?.journalEntries?.length || 0

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="bg-background/60 backdrop-blur-sm border-2 border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ duration: 0.2 }}>
              <BookOpen className="h-5 w-5 text-primary" />
            </motion.div>
            {t("dashboard.journal.title")}
          </CardTitle>
          <CardDescription>
            {t("dashboard.journal.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentEntry ? (
            <div className="space-y-3">
              {/* Recent Entry Preview */}
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-medium text-sm truncate flex-1">
                    {recentEntry.title}
                  </h4>
                  {recentEntry.mood && (
                    <Badge
                      variant="secondary"
                      className={`${moodColors[recentEntry.mood as keyof typeof moodColors]} text-xs`}
                    >
                      <Heart className="h-2 w-2 mr-1" />
                      {recentEntry.mood}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {recentEntry.content}
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {new Date(recentEntry.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t("dashboard.journal.recent_entries")}</span>
                <motion.span 
                  className="font-medium text-primary"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  {totalEntries}
                </motion.span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center p-6 bg-muted/50 rounded-lg">
              <div className="text-center space-y-2">
                <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ duration: 0.2 }}>
                  <BookOpen className="h-8 w-8 text-primary mx-auto" />
                </motion.div>
                <p className="text-sm text-muted-foreground">{t("dashboard.journal.no_entries")}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                onClick={onOpenModal} 
                className="w-full"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                {recentEntry ? "New Entry" : t("dashboard.journal.write_entry")}
              </Button>
            </motion.div>
            
            {recentEntry && (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link href="/journal" className="w-full">
                  <Button variant="outline" className="w-full" size="sm">
                    {t("dashboard.journal.view_all")}
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
