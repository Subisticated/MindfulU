"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, LogOut } from "lucide-react"
import { useMongoose } from "@/components/mongoose-provider"
import { useState } from "react"

export function LogoutCard() {
  const { logout, data } = useMongoose()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  
  const handleLogout = async () => {
    setIsLoggingOut(true)
    await new Promise(resolve => setTimeout(resolve, 1000)) // Small delay for UX
    logout()
  }

  const userName = data?.name || "User"
  
  return (
    <Card className="border-destructive/20 w-full">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left side - Title and Description */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <CardTitle className="text-destructive text-lg">
                Account Management
              </CardTitle>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">
                Currently logged in as: <span className="text-primary">{userName}</span>
              </p>
              <CardDescription className="text-sm">
                Logging out will clear all your assessment data, preferences, and progress. 
                You'll need to complete the questionnaire again to access personalized features.
              </CardDescription>
            </div>
          </div>

          {/* Right side - Action Button */}
          <div className="lg:flex-shrink-0">
            <Button 
              variant="destructive" 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full lg:w-auto lg:min-w-[200px]"
              size="lg"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {isLoggingOut ? "Logging out..." : "Clear Data & Logout"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
