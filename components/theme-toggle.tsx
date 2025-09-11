"use client"

import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <Button variant="outline" size="sm" onClick={toggleTheme} className="w-full justify-start gap-2 bg-transparent">
      {theme === "dark" ? (
        <>
          <Sun className="h-4 w-4" />
          Switch to Light Mode
        </>
      ) : (
        <>
          <Moon className="h-4 w-4" />
          Switch to Dark Mode
        </>
      )}
    </Button>
  )
}
