"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Camera, Upload, User, Palette, Check, Save } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ProfilePhotoSelectorProps {
  currentAvatar: string
  userName: string
  onAvatarChange: (avatar: string) => void
}

const characterAvatars = [
  { id: "student-1", src: "/placeholder-sm09s.png", name: "Alex" },
  { id: "student-2", src: "/placeholder-ba56o.png", name: "Sam" },
  { id: "student-3", src: "/placeholder-myptt.png", name: "Jordan" },
  { id: "student-4", src: "/placeholder-s9u9h.png", name: "Casey" },
  { id: "student-5", src: "/placeholder-1qc7r.png", name: "Riley" },
  { id: "student-6", src: "/placeholder-n5f2q.png", name: "Avery" },
  { id: "student-7", src: "/placeholder-i0zgc.png", name: "Morgan" },
  { id: "student-8", src: "/placeholder-m9whs.png", name: "Sage" },
]

export function ProfilePhotoSelector({ currentAvatar, userName, onAvatarChange }: ProfilePhotoSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState<"upload" | "characters">("upload")
  const [selectedCharacter, setSelectedCharacter] = useState(currentAvatar)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB")
        return
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setUploadedImage(result)
        setSelectedTab("upload")
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    if (selectedTab === "upload" && uploadedImage) {
      onAvatarChange(uploadedImage)
    } else if (selectedTab === "characters" && selectedCharacter) {
      onAvatarChange(selectedCharacter)
    }
    setIsOpen(false)
    setUploadedImage(null)
  }

  const handleCancel = () => {
    setIsOpen(false)
    setUploadedImage(null)
    setSelectedCharacter(currentAvatar)
  }

  return (
    <>
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={currentAvatar || "/placeholder.svg"} />
          <AvatarFallback className="text-lg">{userName.charAt(0)}</AvatarFallback>
        </Avatar>
        <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
          <Camera className="h-4 w-4 mr-2" />
          Change Photo
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Choose Your Profile Photo
            </DialogTitle>
            <DialogDescription>Upload your own photo or select a character avatar.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Tab Selection */}
            <div className="flex gap-2 p-1 bg-muted rounded-lg">
              <Button
                variant={selectedTab === "upload" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedTab("upload")}
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Photo
              </Button>
              <Button
                variant={selectedTab === "characters" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedTab("characters")}
                className="flex-1"
              >
                <Palette className="h-4 w-4 mr-2" />
                Character Avatars
              </Button>
            </div>

            <AnimatePresence mode="wait">
              {selectedTab === "upload" ? (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {uploadedImage ? (
                          <div className="text-center space-y-4">
                            <Avatar className="h-32 w-32 mx-auto">
                              <AvatarImage src={uploadedImage || "/placeholder.svg"} />
                              <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-2">
                              <Badge variant="secondary" className="gap-1">
                                <Check className="h-3 w-3" />
                                Photo uploaded successfully
                              </Badge>
                              <p className="text-sm text-muted-foreground">
                                Your new profile photo looks great! Click save to apply it.
                              </p>
                            </div>
                            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="gap-2">
                              <Upload className="h-4 w-4" />
                              Choose Different Photo
                            </Button>
                          </div>
                        ) : (
                          <div
                            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">Upload Your Photo</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              Click to browse or drag and drop your image here
                            </p>
                            <p className="text-xs text-muted-foreground">Supports JPG, PNG, GIF up to 5MB</p>
                          </div>
                        )}

                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="characters"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Character Avatars</CardTitle>
                      <DialogDescription>Choose from our collection of friendly character avatars.</DialogDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-4 gap-4">
                        {characterAvatars.map((avatar) => (
                          <motion.div
                            key={avatar.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`relative cursor-pointer rounded-lg p-2 border-2 transition-colors ${
                              selectedCharacter === avatar.src
                                ? "border-primary bg-primary/5"
                                : "border-muted hover:border-muted-foreground/50"
                            }`}
                            onClick={() => setSelectedCharacter(avatar.src)}
                          >
                            <Avatar className="h-16 w-16 mx-auto">
                              <AvatarImage src={avatar.src || "/placeholder.svg"} />
                              <AvatarFallback>{avatar.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <p className="text-xs text-center mt-2 font-medium">{avatar.name}</p>
                            {selectedCharacter === avatar.src && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full p-1"
                              >
                                <Check className="h-3 w-3" />
                              </motion.div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={selectedTab === "upload" ? !uploadedImage : !selectedCharacter}>
              <Save className="h-4 w-4 mr-2" />
              Save Photo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
