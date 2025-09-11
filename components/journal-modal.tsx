"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Save } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useLocalStorage } from "@/components/local-storage-provider"

interface JournalModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const moods = [
  { value: "amazing", label: "Amazing", emoji: "😄" },
  { value: "good", label: "Good", emoji: "😊" },
  { value: "neutral", label: "Neutral", emoji: "😐" },
  { value: "low", label: "Low", emoji: "😔" },
  { value: "sad", label: "Sad", emoji: "😢" },
  { value: "anxious", label: "Anxious", emoji: "😰" },
]

export function JournalModal({ open, onOpenChange }: JournalModalProps) {
  const { addJournalEntry } = useLocalStorage()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [mood, setMood] = useState("")
  const [tags, setTags] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return

    setIsSaving(true)

    const entry = {
      title: title.trim(),
      content: content.trim(),
      mood,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      date: new Date().toISOString(),
    }

    addJournalEntry(entry)

    // Reset form
    setTitle("")
    setContent("")
    setMood("")
    setTags("")
    setIsSaving(false)
    onOpenChange(false)
  }

  const handleClose = () => {
    setTitle("")
    setContent("")
    setMood("")
    setTags("")
    onOpenChange(false)
  }

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={handleClose}>
          <DialogContent className="sm:max-w-[600px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                    <Calendar className="h-5 w-5 text-primary" />
                  </motion.div>
                  New Journal Entry
                </DialogTitle>
                <DialogDescription>{today}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="entry-title">Title</Label>
                  <Input
                    id="entry-title"
                    placeholder="Give your entry a title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mood-select">Current Mood</Label>
                    <Select value={mood} onValueChange={setMood}>
                      <SelectTrigger>
                        <SelectValue placeholder="How are you feeling?" />
                      </SelectTrigger>
                      <SelectContent>
                        {moods.map((moodOption) => (
                          <SelectItem key={moodOption.value} value={moodOption.value}>
                            <div className="flex items-center gap-2">
                              <span>{moodOption.emoji}</span>
                              <span>{moodOption.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags-input">Tags (optional)</Label>
                    <Input
                      id="tags-input"
                      placeholder="wellness, reflection, gratitude"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="journal-content">What's on your mind?</Label>
                  <motion.div whileFocus={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
                    <Textarea
                      id="journal-content"
                      placeholder="Write about your thoughts, feelings, experiences, or anything on your mind..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-[200px] resize-none"
                    />
                  </motion.div>
                </div>
              </div>

              <DialogFooter>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button onClick={handleSave} disabled={!title.trim() || !content.trim() || isSaving}>
                    <AnimatePresence mode="wait">
                      {isSaving ? (
                        <motion.div
                          key="saving"
                          className="flex items-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <motion.div
                            className="h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          />
                          Saving...
                        </motion.div>
                      ) : (
                        <motion.div
                          key="save"
                          className="flex items-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Entry
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
