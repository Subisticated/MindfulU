import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bot, Sparkles } from "lucide-react"
import { useTranslation } from "@/components/translation-provider"

export function AIAssistantCard() {
  const { t } = useTranslation()
  
  return (
    <Card className="hover:shadow-md transition-shadow border-dashed">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-muted-foreground" />
          {t("dashboard.ai_assistant.title")}
          <span className="ml-auto text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">{t("coming_soon")}</span>
        </CardTitle>
        <CardDescription>{t("dashboard.ai_assistant.description")}</CardDescription>
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
          {t("dashboard.ai_assistant.chat_now")}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          We're working on bringing you intelligent mood insights and personalized wellness guidance.
        </p>
      </CardContent>
    </Card>
  )
}
