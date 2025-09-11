"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Bot, Settings, Heart, BookOpen, Activity, Calendar } from "lucide-react"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Journal",
    href: "/journal",
    icon: BookOpen,
  },
  {
    title: "Wellness Tools",
    href: "/meditation",
    icon: Activity,
  },
  {
    title: "Book Counseling",
    href: "/booking",
    icon: Calendar,
  },
  {
    title: "AI Assistant",
    href: "/ai-assistant",
    icon: Bot,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar border-r">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <Heart className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <span className="font-bold text-lg text-sidebar-foreground">MindfulU</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {sidebarItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href === "/meditation" && (pathname === "/breathing" || pathname === "/focus-timer")) ||
            (item.href === "/journal" && pathname.startsWith("/journal"))
          const Icon = item.icon

          return (
            <Button
              key={item.href}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-10",
                isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
              )}
              asChild
            >
              <Link href={item.href}>
                <Icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            </Button>
          )
        })}
      </nav>
    </div>
  )
}
