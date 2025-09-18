"use client"

import { ReactNode } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"

interface EnhancedCardProps {
  title: string
  description?: string
  icon?: LucideIcon
  children: ReactNode
  className?: string
  gradient?: boolean
  hover?: boolean
  onClick?: () => void
}

export function EnhancedCard({ 
  title, 
  description, 
  icon: Icon, 
  children, 
  className = "",
  gradient = false,
  hover = true,
  onClick
}: EnhancedCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : {}}
      transition={{ duration: 0.2 }}
      className={className}
      onClick={onClick}
    >
      <Card className={`
        bg-background/60 backdrop-blur-sm border-2 border-border/50 
        hover:border-primary/30 hover:shadow-lg transition-all duration-300
        ${onClick ? 'cursor-pointer hover:bg-background/80' : ''} 
        ${gradient ? 'bg-gradient-to-br from-background/70 via-primary/5 to-primary/8' : ''}
      `}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg lg:text-xl">
            {Icon && (
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }} 
                transition={{ duration: 0.2 }}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"
              >
                <Icon className="h-5 w-5 text-primary" />
              </motion.div>
            )}
            <span className="font-semibold tracking-tight">{title}</span>
          </CardTitle>
          {description && (
            <CardDescription className="text-base leading-relaxed">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  )
}
