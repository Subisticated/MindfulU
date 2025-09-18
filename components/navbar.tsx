"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu, X, Heart, User, Settings, LogOut } from "lucide-react"
import { useTranslation } from "@/components/translation-provider"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session, status } = useSession()
  const { t } = useTranslation()
  const isLoggedIn = !!session
  const isLoading = status === "loading"

  // Show different navigation based on login status
  const getNavButton = () => {
    if (isLoggedIn) {
      return null // We'll use a dropdown menu for logged-in users
    } else {
      return {
        href: "/auth/signin",
        label: t("signin")
      }
    }
  }

  const navButton = getNavButton()

  // Navigation links - only show for logged-in users
  const navLinks = [
    { href: "/dashboard", label: t("dashboard") },
    { href: "/journal", label: t("journal") },
    { href: "/meditation", label: t("wellness") },
    { href: "/ai-assistant", label: t("ai_coach") },
  ]

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

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
          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
          ) : isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                    <AvatarFallback>
                      {session?.user?.name?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {session?.user?.name && (
                      <p className="font-medium">{session.user.name}</p>
                    )}
                    {session?.user?.email && (
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {session.user.email}
                      </p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    {t("settings")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  {t("sign_out")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/signin">{t("signin")}</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/signup">{t("signup")}</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="sr-only">{isOpen ? t("close") : t("menu")}</span>
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
            
            {isLoggedIn ? (
              <>
                <Link
                  href="/settings"
                  className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {t("settings")}
                </Link>
                <Button variant="outline" size="sm" className="w-full mt-4" onClick={handleSignOut}>
                  {t("sign_out")}
                </Button>
              </>
            ) : (
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/auth/signin" onClick={() => setIsOpen(false)}>{t("signin")}</Link>
                </Button>
                <Button size="sm" className="w-full" asChild>
                  <Link href="/auth/signup" onClick={() => setIsOpen(false)}>{t("signup")}</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
