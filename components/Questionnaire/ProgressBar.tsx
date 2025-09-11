"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ProgressBarProps {
  current: number
  total: number
  className?: string
  showLabel?: boolean
  animated?: boolean
}

export function ProgressBar({ 
  current, 
  total, 
  className = "",
  showLabel = true,
  animated = true 
}: ProgressBarProps) {
  const percentage = Math.min((current / total) * 100, 100)
  
  return (
    <div className={cn("w-full space-y-2", className)}>
      {showLabel && (
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>Progress</span>
          <span>{current} of {total}</span>
        </div>
      )}
      
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        {animated ? (
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ 
              duration: 0.5, 
              ease: "easeOut" 
            }}
          />
        ) : (
          <div
            className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        )}
      </div>
      
      {showLabel && (
        <div className="text-center">
          <motion.span
            key={percentage}
            initial={animated ? { opacity: 0, y: 5 } : {}}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-medium text-primary"
          >
            {Math.round(percentage)}% Complete
          </motion.span>
        </div>
      )}
    </div>
  )
}

// Alternative circular progress bar for compact spaces
export function CircularProgressBar({ 
  current, 
  total, 
  size = 60,
  strokeWidth = 4,
  className = "" 
}: ProgressBarProps & { size?: number; strokeWidth?: number }) {
  const percentage = Math.min((current / total) * 100, 100)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (percentage / 100) * circumference
  
  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted opacity-20"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-primary"
        />
      </svg>
      
      {/* Percentage text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          key={percentage}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-xs font-semibold text-primary"
        >
          {Math.round(percentage)}%
        </motion.span>
      </div>
    </div>
  )
}
