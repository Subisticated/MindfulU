import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bot, Sparkles } from "lucide-react"

export function AIAssistantCard() {
  return (
    <Card className="hover:shadow-md transition-shadow border-dashed">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-muted-foreground" />
          AI Mood Coach
          <span className="ml-auto text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">Coming Soon</span>
        </CardTitle>
        <CardDescription>Get personalized insights and recommendations based on your mood patterns</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center p-6 bg-muted/30 rounded-lg border-dashed border-2">
          <div className="text-center space-y-2">
            <Sparkles className="h-8 w-8 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">
              AI-powered mood coaching and personalized wellness recommendations
            </p>
          </div>
        </div>

        <Button disabled className="w-full" variant="secondary">
          <Bot className="h-4 w-4 mr-2" />
          Chat with AI Coach
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          We're working on bringing you intelligent mood insights and personalized wellness guidance.
        </p>
      </CardContent>
    </Card>
  )
}
