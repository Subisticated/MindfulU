"use client"

import { useState, useEffect } from "react"
import { PageLayout } from "@/components/page-layout"
import { EnhancedCard } from "@/components/enhanced-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSelector } from "@/components/language-selector"
import { useTranslation } from "@/components/translation-provider"
import { LogoutCard } from "@/components/logout-card"
import { User, Bell, Palette, Bot, Save, Sparkles, Settings, Languages } from "lucide-react"
import { useMongoose } from "@/components/mongoose-provider"
import { AnimatedPage, AnimatedCard, AnimatedButton, AnimatedWrapper } from "@/components/ui/animated-components"

interface Preferences {
  theme: string
  notifications: boolean
  emailUpdates: boolean
  privacy: string
}

export default function SettingsPage() {
  const { data } = useMongoose()
  const { t } = useTranslation()
  const [profile, setProfile] = useState({ 
    name: data?.name || '', 
    email: data?.email || '', 
    university: data?.university || ''
  })
  const [preferences, setPreferences] = useState<Preferences>({ 
    theme: 'system', 
    notifications: true, 
    emailUpdates: false,
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
      description="Manage your account preferences and customize your wellness experience to fit your needs."
      icon={<Settings className="h-8 w-8 md:h-10 md:w-10 text-primary" />}
      actions={
        <AnimatedButton 
          onClick={handleSave} 
          className="gap-2 h-12 px-6 text-base font-medium"
        >
          {isSaved ? <Sparkles className="h-5 w-5" /> : <Save className="h-5 w-5" />}
          {isSaved ? "Saved!" : "Save Changes"}
        </AnimatedButton>
      }
      fullWidth={true}
    >
      <AnimatedPage>
        <div className="grid gap-6 lg:gap-8 xl:gap-10 grid-cols-1 xl:grid-cols-3">
          {/* Main Settings - Takes 2/3 width on larger screens */}
          <div className="xl:col-span-2 space-y-6 lg:space-y-8">
            {/* Profile Information */}
            <AnimatedWrapper variant="slideInLeft">
              <EnhancedCard
                title="Profile Information"
                description="Update your personal information and preferences."
                icon={User}
                gradient={true}
              >
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-base font-medium">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={profile.name}
                      onChange={(e) => handleProfileChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      className="mt-2 h-12 text-base"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-base font-medium">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      placeholder="Enter your email address"
                      className="mt-2 h-12 text-base"
                    />
                  </div>
                  <div>
                    <Label htmlFor="university" className="text-base font-medium">University/Institution</Label>
                    <Input
                      id="university"
                      type="text"
                      value={profile.university}
                      onChange={(e) => handleProfileChange('university', e.target.value)}
                      placeholder="Enter your university or institution"
                      className="mt-2 h-12 text-base"
                    />
                  </div>
                </div>
              </EnhancedCard>
            </AnimatedWrapper>

            {/* Notification Preferences */}
            <AnimatedWrapper variant="slideInLeft" delay={0.1}>
              <EnhancedCard
                title="Notification Preferences"
                description="Manage how and when you receive notifications."
                icon={Bell}
              >
                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-medium">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground mb-3">Receive reminders and updates</p>
                    <Switch
                      checked={preferences.notifications}
                      onCheckedChange={(checked) => setPreferences((prev: Preferences) => ({ ...prev, notifications: checked }))}
                    />
                  </div>
                  <div>
                    <Label className="text-base font-medium">Email Updates</Label>
                    <p className="text-sm text-muted-foreground mb-3">Get weekly wellness insights and tips</p>
                    <Switch
                      checked={preferences.emailUpdates}
                      onCheckedChange={(checked) => setPreferences((prev: Preferences) => ({ ...prev, emailUpdates: checked }))}
                    />
                  </div>
                  <div>
                    <Label className="text-base font-medium">Privacy Mode</Label>
                    <p className="text-sm text-muted-foreground mb-3">Keep your data private and anonymous</p>
                    <Switch
                      checked={preferences.privacy === 'private'}
                      onCheckedChange={(checked) => setPreferences((prev: Preferences) => ({ ...prev, privacy: checked ? 'private' : 'anonymous' }))}
                    />
                  </div>
                </div>
              </EnhancedCard>
            </AnimatedWrapper>
          </div>

          {/* Sidebar - Takes 1/3 width on larger screens */}
          <div className="xl:col-span-1 space-y-6 lg:space-y-8">
            {/* Theme Preferences */}
            <AnimatedWrapper variant="slideInRight">
              <EnhancedCard
                title="Appearance"
                description="Customize how the app looks and feels."
                icon={Palette}
              >
                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-medium">Theme</Label>
                    <p className="text-sm text-muted-foreground mb-3">Choose between light and dark mode</p>
                    <ThemeToggle />
                  </div>
                  
                  <div className="border-t pt-6">
                    <Label className="text-base font-medium">{t('language') || 'Language'}</Label>
                    <p className="text-sm text-muted-foreground mb-3">Select your preferred language / अपनी पसंदीदा भाषा चुनें / آپ کی پسندیدہ زبان منتخب کریں</p>
                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm font-medium mb-2">Translation Test:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div>Welcome: {t('welcome') || 'Welcome!'}</div>
                          <div>Settings: {t('settings') || 'Settings'}</div>
                          <div>Dashboard: {t('dashboard') || 'Dashboard'}</div>
                          <div>Language: {t('language') || 'Language'}</div>
                          <div>Help: {t('help') || 'Help'}</div>
                          <div>Support: {t('support') || 'Support'}</div>
                        </div>
                      </div>
                      <LanguageSelector />
                      <div className="text-xs text-muted-foreground">
                        <p>💡 Tip: After selecting a language, the page will reload to apply changes.</p>
                        <p>🌐 Special support for right-to-left languages like Kashmiri (کٲشُر) and Urdu (اردو)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </EnhancedCard>
            </AnimatedWrapper>

            {/* AI Customization Placeholder */}
            <AnimatedWrapper variant="slideInRight" delay={0.1}>
              <EnhancedCard
                title="AI Personalization"
                description="Customize your AI mood coach's personality and focus areas."
                icon={Bot}
                className="border-dashed"
              >
                <div className="relative">
                  <div className="absolute top-2 right-2">
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                      Coming Soon
                    </span>
                  </div>
                  <div className="flex items-center justify-center p-8 bg-muted/30 rounded-lg border-dashed border-2">
                    <div className="text-center space-y-3">
                      <Sparkles className="h-10 w-10 text-muted-foreground mx-auto" />
                      <p className="text-sm text-muted-foreground max-w-xs">
                        Personalize your AI assistant's tone, focus areas, and coaching style
                      </p>
                    </div>
                  </div>
                </div>
              </EnhancedCard>
            </AnimatedWrapper>
          </div>
        </div>

        {/* Account Management - Full width at bottom */}
        <AnimatedWrapper variant="itemVariants" delay={0.2} className="mt-6">
          <LogoutCard />
        </AnimatedWrapper>
      </AnimatedPage>
    </PageLayout>
  )
}
