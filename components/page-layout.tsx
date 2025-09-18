"use client"

import { ReactNode } from "react"
import { Sidebar, MobileMenuButton } from "@/components/sidebar"
import { motion } from "framer-motion"

interface PageLayoutProps {
  children: ReactNode
  title?: string
  description?: string
  icon?: ReactNode
  actions?: ReactNode
  className?: string
  fullWidth?: boolean // New prop for full-width layouts
}

export function PageLayout({ 
  children, 
  title, 
  description, 
  icon, 
  actions, 
  className = "",
  fullWidth = false
}: PageLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Mobile Menu Button */}
      <MobileMenuButton />
      
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0 min-h-screen">
        <motion.div
          className={`
            ${fullWidth ? 'w-full px-4 md:px-6 lg:px-8' : 'container'} 
            py-4 md:py-6 lg:py-8 space-y-6 
            ${fullWidth ? '' : 'max-w-7xl mx-auto'}
            ${className}
          `}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          {(title || description || actions) && (
            <motion.div 
              className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="space-y-3">
                {title && (
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance flex items-center gap-3 tracking-tight">
                    {icon}
                    <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                      {title}
                    </span>
                  </h1>
                )}
                {description && (
                  <p className="text-muted-foreground text-lg md:text-xl max-w-3xl leading-relaxed">
                    {description}
                  </p>
                )}
              </div>
              {actions && (
                <div className="flex flex-col sm:flex-row gap-3 lg:gap-2">
                  {actions}
                </div>
              )}
            </motion.div>
          )}
          
          {/* Page Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {children}
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
