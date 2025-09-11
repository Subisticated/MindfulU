"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLocalStorage } from "@/components/local-storage-provider"
import { ArrowLeft, Calendar, Heart, Edit, Save, X } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

const moodColors = {
  amazing: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  good: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  neutral: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  low: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  sad: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  anxious: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
}

export default function JournalEntryPage() {
  const params = useParams()
  const router = useRouter()
  const { data, updateJournalEntry } = useLocalStorage()
  const [isEditing, setIsEditing] = useState(false)
  const [editedEntry, setEditedEntry] = useState({
    title: "",
    content: "",
    tags: [] as string[],
  })

  const entry = data.journals.find((j) => j.id === params.id)

  useEffect(() => {
    if (entry) {
      setEditedEntry({
        title: entry.title,
        content: entry.content,
        tags: entry.tags,
      })
    }
  }, [entry])

  if (!entry) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <Card className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Entry Not Found</h2>
            <p className="text-muted-foreground mb-4">The journal entry you're looking for doesn't exist.</p>
            <Link href="/journal">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Journal
              </Button>
            </Link>
          </Card>
        </main>
      </div>
    )
  }

  const handleSave = () => {
    updateJournalEntry(entry.id, editedEntry)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedEntry({
      title: entry.title,
      content: entry.content,
      tags: entry.tags,
    })
    setIsEditing(false)
  }

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
    setEditedEntry((prev) => ({ ...prev, tags }))
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="container p-6 space-y-6 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Link href="/journal">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Journal
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleCancel} className="gap-2 bg-transparent">
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} className="gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Entry
                </Button>
              )}
            </div>
          </div>

          {/* Entry Content */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card>
              <CardHeader>
                <div className="space-y-4">
                  {isEditing ? (
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={editedEntry.title}
                        onChange={(e) => setEditedEntry((prev) => ({ ...prev, title: e.target.value }))}
                        className="text-xl font-semibold"
                      />
                    </div>
                  ) : (
                    <CardTitle className="text-2xl">{entry.title}</CardTitle>
                  )}

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(entry.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    {entry.mood && (
                      <Badge
                        variant="secondary"
                        className={`${moodColors[entry.mood as keyof typeof moodColors]} gap-1`}
                      >
                        <Heart className="h-3 w-3" />
                        {entry.mood}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        value={editedEntry.content}
                        onChange={(e) => setEditedEntry((prev) => ({ ...prev, content: e.target.value }))}
                        className="min-h-[300px] resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        value={editedEntry.tags.join(", ")}
                        onChange={(e) => handleTagsChange(e.target.value)}
                        placeholder="wellness, reflection, gratitude"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <p className="whitespace-pre-wrap leading-relaxed">{entry.content}</p>
                    </div>
                    {entry.tags.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Tags</Label>
                        <div className="flex flex-wrap gap-2">
                          {entry.tags.map((tag) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
