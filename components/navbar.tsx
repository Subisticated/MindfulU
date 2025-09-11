"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Heart } from "lucide-react"
import { useLocalStorage } from "@/components/local-storage-provider"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { isLoggedIn } = useLocalStorage()

  // Show different navigation based on login status
  const getNavButton = () => {
    if (isLoggedIn) {
      return {
        href: "/settings",
        label: "Settings"
      }
    } else {
      return {
        href: "/onboarding",
        label: "Get Started"
      }
    }
  }

  const navButton = getNavButton()

  // Navigation links - only show for logged-in users
  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/journal", label: "Journal" },
    { href: "/meditation", label: "Wellness" },
    { href: "/ai-assistant", label: "AI Coach" },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href={isLoggedIn ? "/dashboard" : "/"} className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Heart className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">MindfulU</span>
        </Link>

        {/* Desktop Navigation - Only show if logged in */}
        {isLoggedIn && (
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Button size="sm" asChild>
            <Link href={navButton.href}>{navButton.label}</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container px-4 py-4 space-y-3">
            {isLoggedIn && navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Button size="sm" className="w-full mt-4" asChild>
              <Link href={navButton.href} onClick={() => setIsOpen(false)}>{navButton.label}</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}
