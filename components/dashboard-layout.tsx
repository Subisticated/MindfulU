"use client"

import { Sidebar, MobileMenuButton } from "@/components/sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      {/* Mobile menu button - only visible on mobile */}
      <MobileMenuButton />
      
      {/* Desktop sidebar - hidden on mobile */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile spacing */}
        <div className="pt-20 md:pt-0"> {/* Add top padding on mobile for the floating menu button */}
          {children}
        </div>
      </main>
    </div>
  )
}
