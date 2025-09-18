"use client"

import { useState } from "react"
import { PageLayout } from "@/components/page-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useMongoose } from "@/components/mongoose-provider"
import { useTranslation } from "@/components/translation-provider"
import { BookOpen, Plus, Search, Calendar, Heart, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { LazyWrapper, LazyJournalModal } from "@/lib/lazy-components"

const moodColors = {
  amazing: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  good: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  neutral: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  low: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  sad: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  anxious: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
}

export default function JournalPage() {
  const { data, deleteJournalEntry } = useMongoose()
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<"all" | "recent" | "favorites">("all")

  const allEntries = data?.journalEntries || []
  
  // Get recent entries (last 7 days)
  const recentEntries = allEntries.filter(entry => {
    const entryDate = new Date(entry.createdAt)
    const daysDiff = (Date.now() - entryDate.getTime()) / (1000 * 60 * 60 * 24)
    return daysDiff <= 7
  })

  // Get favorite entries (for now, we'll simulate with longer entries)
  const favoriteEntries = allEntries.filter(entry => 
    (entry.content?.length || 0) > 200 // Simulate favorites as longer, more detailed entries
  )

  const getDisplayEntries = () => {
    switch (activeTab) {
      case "recent":
        return recentEntries
      case "favorites":
        return favoriteEntries
      default:
        return allEntries
    }
  }

  const filteredEntries = getDisplayEntries().filter(
    (entry) =>
      (entry.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (entry.content?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (entry.tags || []).some((tag) => tag?.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleDeleteEntry = async (id: string) => {
    if (confirm("Are you sure you want to delete this journal entry?")) {
      try {
        await deleteJournalEntry(id)
        console.log('Journal entry deleted successfully')
      } catch (error) {
        console.error('Error deleting journal entry:', error)
      }
    }
  }

  return (
    <PageLayout
      title={t("journal")}
      description="Reflect on your thoughts, feelings, and experiences. Your personal space for growth and mindfulness."
      icon={<BookOpen className="h-8 w-8 md:h-10 md:w-10 text-primary" />}
      actions={
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2 w-full sm:w-auto h-12 px-6 text-base font-medium">
            <Plus className="h-5 w-5" />
            New Entry
          </Button>
        </motion.div>
      }
      fullWidth={true}
    >
      {/* Search and Stats Bar - Enhanced for better UX */}
      <motion.div 
        className="grid gap-4 lg:gap-6 grid-cols-1 lg:grid-cols-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {/* Search Bar - Takes more space on larger screens */}
        <div className="lg:col-span-3">
          <div className="relative bg-background/30 backdrop-blur-sm border-2 border-border/50 rounded-xl p-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
            <Input
              placeholder="Search your journal entries by title, content, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 h-12 text-base bg-transparent border-0 focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>
        
        {/* Stats Card - Enhanced visual appeal */}
        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Card className="p-4 lg:p-6 bg-gradient-to-br from-primary/5 via-primary/8 to-primary/10 backdrop-blur-sm border-2 border-primary/20 hover:border-primary/30 hover:shadow-lg transition-all">
            <div className="text-center space-y-1">
              <motion.div 
                className="text-3xl lg:text-4xl font-bold text-primary"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              >
                {(data?.journalEntries || []).length}
              </motion.div>
              <div className="text-sm lg:text-base text-muted-foreground font-medium">Total Entries</div>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="bg-background/50 backdrop-blur-sm border-2 border-border/50 rounded-xl p-1 overflow-hidden">
          <div className="flex gap-1">
            {[
              { id: "all", label: "All Entries", shortLabel: "All", icon: BookOpen, count: allEntries.length },
              { id: "recent", label: "Recent", shortLabel: "Recent", icon: Calendar, count: recentEntries.length },
              { id: "favorites", label: "Favorites", shortLabel: "Favs", icon: Heart, count: favoriteEntries.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "all" | "recent" | "favorites")}
                className={`flex-1 flex items-center justify-center gap-1 px-2 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 min-w-0 ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <tab.icon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="hidden md:inline truncate">{tab.label}</span>
                <span className="md:hidden truncate text-xs">{tab.shortLabel}</span>
                <Badge 
                  variant={activeTab === tab.id ? "secondary" : "outline"} 
                  className="ml-0.5 sm:ml-1 text-xs px-1 py-0 h-4 min-w-[1rem] flex-shrink-0"
                >
                  {tab.count}
                </Badge>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

          {/* Journal Entries - Enhanced Data Panel */}
          <motion.div 
            className="bg-background/30 backdrop-blur-sm border-2 border-border/50 rounded-xl p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {filteredEntries.length === 0 ? (
              <Card className="p-8 bg-background/50 backdrop-blur-sm border-2 border-dashed border-border/50">
                <div className="text-center space-y-4">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto" />
                  <div>
                    <h3 className="text-lg font-medium">
                      {getDisplayEntries().length === 0 ? (
                        activeTab === "recent" ? "No Recent Entries" :
                        activeTab === "favorites" ? "No Favorite Entries" :
                        "Start Your Journal Journey"
                      ) : "No entries found"}
                    </h3>
                    <p className="text-muted-foreground">
                      {getDisplayEntries().length === 0 ? (
                        activeTab === "recent" ? "You haven't written any entries in the last 7 days." :
                        activeTab === "favorites" ? "You don't have any favorite entries yet." :
                        "Begin documenting your thoughts and feelings. Your first entry is just a click away."
                      ) : "Try adjusting your search terms to find what you're looking for."}
                    </p>
                  </div>
                  {getDisplayEntries().length === 0 && activeTab === "all" && (
                    <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Write Your First Entry
                    </Button>
                  )}
                </div>
              </Card>
            ) : (
              <AnimatePresence>
                {filteredEntries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ y: -2 }}
                  >
                    <Card className="bg-background/60 backdrop-blur-sm border-2 border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 hover:bg-background/80">
                      <CardHeader className="pb-3">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                          <div className="space-y-1 flex-1">
                            <CardTitle className="text-lg">
                              <Link href={`/journal/${entry.id}`} className="hover:text-primary transition-colors">
                                {entry.title}
                              </Link>
                            </CardTitle>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              {new Date(entry.createdAt).toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {entry.mood && (
                              <Badge
                                variant="secondary"
                                className={`${moodColors[entry.mood as keyof typeof moodColors]} gap-1`}
                              >
                                <Heart className="h-3 w-3" />
                                {entry.mood}
                              </Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteEntry(entry.id)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground line-clamp-3 mb-3">{entry.content}</p>
                        {(entry.tags || []).length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {(entry.tags || []).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </motion.div>

          <LazyWrapper fallback={null}>
            <LazyJournalModal open={isModalOpen} onOpenChange={setIsModalOpen} />
          </LazyWrapper>
    </PageLayout>
  )
}
