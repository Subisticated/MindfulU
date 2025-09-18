"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LayoutDashboard, Bot, Settings, Heart, BookOpen, Activity, Calendar, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { useRoutePreloader } from "@/lib/route-preloader"

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

// Sidebar content component for reuse
function SidebarContent({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname()
  const { preloadRoute } = useRoutePreloader()

  const handleMouseEnter = (href: string) => {
    // Preload route on hover with small delay
    setTimeout(() => preloadRoute(href), 100)
  }

  return (
    <div className="flex h-full w-full flex-col bg-sidebar">
      {/* Header */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center space-x-2" onClick={onItemClick}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <Heart className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <span className="font-bold text-lg text-sidebar-foreground">MindfulU</span>
        </Link>
      </div>

      {/* Navigation */}
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
              <Link 
                href={item.href} 
                onClick={onItemClick}
                onMouseEnter={() => handleMouseEnter(item.href)}
                onFocus={() => handleMouseEnter(item.href)}
              >
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

// Mobile menu button component
export function MobileMenuButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50 bg-background/95 backdrop-blur-sm border shadow-lg hover:bg-accent"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent onItemClick={() => setIsOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  )
}

export function Sidebar() {
  return (
    <div className="hidden md:flex h-full w-64 flex-col bg-sidebar border-r">
      <SidebarContent />
    </div>
  )
}
