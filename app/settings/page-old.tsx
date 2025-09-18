"use client"

import { useState, useEffect } from "react"
import { PageLayout } from "@/components/page-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import { LogoutCard } from "@/components/logout-card"
import { User, Bell, Palette, Bot, Save, Sparkles, Settings } from "lucide-react"
import { useMongoose } from "@/components/mongoose-provider"

export default function SettingsPage() {
  const { data, updateData, logout } = useMongoose()
  const [profile, setProfile] = useState({ 
    name: data?.name || '', 
    email: data?.email || '', 
    university: data?.university || ''
  })
  const [preferences, setPreferences] = useState<{
    theme: string;
    notifications: boolean;
    privacy: string;
  }>({ theme: 'system', notifications: true, privacy: 'private' })
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    setProfile({ 
      name: data?.name || '', 
      email: data?.email || '', 
      university: data?.university || ''
    })
  }, [data?.name, data?.email, data?.university])

  const handleProfileChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    // Update the user data with new profile info only
    if (data) {
      updateData({
        ...data,
        ...profile
      })
    }
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  return (
    <PageLayout
      title="Settings"
      description="Manage your account preferences and application settings"
      icon={<Settings className="h-6 w-6 md:h-8 md:w-8 text-primary" />}
      actions={
        <Button 
          onClick={handleSave} 
          className="gap-2"
          variant={isSaved ? "secondary" : "default"}
        >
          {isSaved ? <Sparkles className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {isSaved ? "Saved!" : "Save Changes"}
        </Button>
      }
    >

      <main className="flex-1 overflow-auto">
        <div className="container p-6 space-y-6 max-w-7xl h-full flex flex-col">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-balance">Settings</h1>
            <p className="text-muted-foreground text-pretty">
              Manage your account preferences and customize your wellness experience.
            </p>
          </div>

          {/* Main Content Grid - Takes most of the space */}
          <div className="flex-1 grid gap-6 lg:grid-cols-4 xl:grid-cols-5">
            {/* Profile Section - Takes 2/3 width */}
            <div className="lg:col-span-3 xl:col-span-3 space-y-6">
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>Update your personal information and profile settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Photo - Coming Soon */}
                  <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{profile.name || "Student"}</h3>
                      <p className="text-sm text-muted-foreground">Profile photo coming soon</p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => handleProfileChange("name", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => handleProfileChange("email", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="university">University</Label>
                      <Input
                        id="university"
                        placeholder="Enter your university"
                        value={profile.university || ""}
                        onChange={(e) => handleProfileChange("university", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>Choose what reminders and updates you'd like to receive.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Enable Notifications</Label>
                        <p className="text-sm text-muted-foreground">Get reminders for wellness activities</p>
                      </div>
                      <Switch
                        checked={preferences.notifications || false}
                        onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, notifications: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Privacy Mode</Label>
                        <p className="text-sm text-muted-foreground">Keep your data private and anonymous</p>
                      </div>
                      <Switch
                        checked={preferences.privacy === 'private'}
                        onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, privacy: checked ? 'private' : 'anonymous' }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar - Takes 1/3 width */}
            <div className="lg:col-span-1 xl:col-span-2 space-y-6">
              {/* Theme Preferences */}
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-primary" />
                    Appearance
                  </CardTitle>
                  <CardDescription>Customize how the app looks and feels.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Theme</Label>
                      <p className="text-xs text-muted-foreground mb-3">Choose between light and dark mode</p>
                      <ThemeToggle />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Customization Placeholder */}
              <Card className="border-dashed h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-muted-foreground" />
                    AI Personalization
                    <span className="ml-auto text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                      Coming Soon
                    </span>
                  </CardTitle>
                  <CardDescription>Customize your AI mood coach's personality and focus areas.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center p-6 bg-muted/30 rounded-lg border-dashed border-2">
                    <div className="text-center space-y-2">
                      <Sparkles className="h-8 w-8 text-muted-foreground mx-auto" />
                      <p className="text-sm text-muted-foreground">
                        Personalize your AI assistant's tone, focus areas, and coaching style
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Save Button */}
              <Button onClick={handleSave} disabled={isSaved} className="w-full">
                {isSaved ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Settings Saved!
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Account Management - Full width at bottom */}
          <div className="mt-6">
            <LogoutCard />
          </div>
        </div>
      </main>
    </PageLayout>
  )
}
