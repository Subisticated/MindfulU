"use client"

import { useState, useEffect } from "react"
import { PageLayout } from "@/components/page-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ThemeToggle } from "@/components/theme-toggle"
import { LogoutCard } from "@/components/logout-card"
import { User, Bell, Palette, Bot, Save, Sparkles, Settings } from "lucide-react"
import { useMongoose } from "@/components/mongoose-provider"

interface Preferences {
  theme: string
  notifications: boolean
  privacy: string
}

export default function SettingsPage() {
  const { data } = useMongoose()
  const [profile, setProfile] = useState({ 
    name: data?.name || '', 
    email: data?.email || '', 
    university: data?.university || ''
  })
  const [preferences, setPreferences] = useState<Preferences>({ 
    theme: 'system', 
    notifications: true, 
    privacy: 'private' 
  })
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
    // Note: preferences are handled locally for now since they're not in the UserData interface
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
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Settings - Takes 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Profile Information
              </CardTitle>
              <CardDescription>Update your personal information and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                  placeholder="Enter your email address"
                />
              </div>
              <div>
                <Label htmlFor="university">University/Institution</Label>
                <Input
                  id="university"
                  type="text"
                  value={profile.university}
                  onChange={(e) => handleProfileChange('university', e.target.value)}
                  placeholder="Enter your university or institution"
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Manage how and when you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive reminders and updates</p>
                  </div>
                  <Switch
                    checked={preferences.notifications}
                    onCheckedChange={(checked) => setPreferences((prev: Preferences) => ({ ...prev, notifications: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Privacy Mode</Label>
                    <p className="text-sm text-muted-foreground">Keep your data private and anonymous</p>
                  </div>
                  <Switch
                    checked={preferences.privacy === 'private'}
                    onCheckedChange={(checked) => setPreferences((prev: Preferences) => ({ ...prev, privacy: checked ? 'private' : 'anonymous' }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Takes 1/3 width */}
        <div className="lg:col-span-1 space-y-6">
          {/* Theme Preferences */}
          <Card>
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
          <Card className="border-dashed">
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
        </div>
      </div>

      {/* Account Management - Full width at bottom */}
      <div className="mt-6">
        <LogoutCard />
      </div>
    </PageLayout>
  )
}
