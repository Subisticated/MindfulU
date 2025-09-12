"use client"

import { useState } from "react"
import { Sidebar, MobileMenuButton } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { JournalModal } from "@/components/journal-modal"
import { useLocalStorage } from "@/components/local-storage-provider"
import { BookOpen, Plus, Search, Calendar, Heart, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

const moodColors = {
  amazing: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  good: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  neutral: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  low: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  sad: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  anxious: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
}

export default function JournalPage() {
  const { data, deleteJournalEntry } = useLocalStorage()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredEntries = data.journals.filter(
    (entry) =>
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleDeleteEntry = (id: string) => {
    if (confirm("Are you sure you want to delete this journal entry?")) {
      deleteJournalEntry(id)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Menu Button */}
      <MobileMenuButton />
      
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0">
        <div className="container p-4 md:p-6 space-y-6 max-w-6xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-bold text-balance flex items-center gap-2">
                <BookOpen className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                My Journal
              </h1>
              <p className="text-muted-foreground text-pretty">
                Reflect on your thoughts, feelings, and experiences. Your personal space for growth.
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={() => setIsModalOpen(true)} className="gap-2 w-full md:w-auto">
                <Plus className="h-4 w-4" />
                New Entry
              </Button>
            </motion.div>
          </div>

          {/* Search and Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search your journal entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{data.journals.length}</div>
                <div className="text-sm text-muted-foreground">Total Entries</div>
              </div>
            </Card>
          </div>

          {/* Journal Entries */}
          <div className="space-y-4">
            {filteredEntries.length === 0 ? (
              <Card className="p-8">
                <div className="text-center space-y-4">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto" />
                  <div>
                    <h3 className="text-lg font-medium">
                      {data.journals.length === 0 ? "Start Your Journal Journey" : "No entries found"}
                    </h3>
                    <p className="text-muted-foreground">
                      {data.journals.length === 0
                        ? "Begin documenting your thoughts and feelings. Your first entry is just a click away."
                        : "Try adjusting your search terms to find what you're looking for."}
                    </p>
                  </div>
                  {data.journals.length === 0 && (
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
                    <Card className="hover:shadow-md transition-shadow">
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
                        {entry.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {entry.tags.map((tag) => (
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
          </div>

          <JournalModal open={isModalOpen} onOpenChange={setIsModalOpen} />
        </div>
      </main>
    </div>
  )
}
