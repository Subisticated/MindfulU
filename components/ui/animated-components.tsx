"use client"

import { motion, Variants } from "framer-motion"
import { ReactNode } from "react"
import { pageAnimations } from "@/lib/animations"

interface AnimatedWrapperProps {
  children: ReactNode
  variant?: keyof typeof pageAnimations
  className?: string
  delay?: number
  duration?: number
  once?: boolean
  customVariants?: Variants
}

export function AnimatedWrapper({
  children,
  variant = "itemVariants",
  className = "",
  delay = 0,
  duration,
  once = true,
  customVariants,
}: AnimatedWrapperProps) {
  const variants = customVariants || pageAnimations[variant]
  
  // Modify transition if duration or delay is provided
  const modifiedVariants = duration || delay ? {
    ...variants,
    visible: {
      ...variants.visible,
      transition: {
        ...(typeof variants.visible === 'object' && 'transition' in variants.visible 
          ? (variants.visible as any).transition 
          : {}),
        ...(duration && { duration }),
        ...(delay && { delay }),
      },
    },
  } : variants

  return (
    <motion.div
      variants={modifiedVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      viewport={{ once }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface AnimatedPageProps {
  children: ReactNode
  className?: string
  containerVariant?: keyof typeof pageAnimations
}

export function AnimatedPage({ 
  children, 
  className = "",
  containerVariant = "containerVariants" 
}: AnimatedPageProps) {
  return (
    <motion.div
      variants={pageAnimations[containerVariant]}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface AnimatedCardProps {
  children: ReactNode
  className?: string
  hoverEffect?: boolean
  delay?: number
  onClick?: () => void
}

export function AnimatedCard({ 
  children, 
  className = "",
  hoverEffect = true,
  delay = 0,
  onClick
}: AnimatedCardProps) {
  const modifiedVariants = delay ? {
    ...pageAnimations.cardVariants,
    visible: {
      ...pageAnimations.cardVariants.visible,
      transition: {
        ...(pageAnimations.cardVariants.visible as any).transition,
        delay,
      },
    },
  } : pageAnimations.cardVariants

  return (
    <motion.div
      variants={modifiedVariants}
      initial="hidden"
      animate="visible"
      whileHover={hoverEffect ? "hover" : undefined}
      whileTap={hoverEffect ? "tap" : undefined}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface AnimatedListProps {
  children: ReactNode
  className?: string
}

export function AnimatedList({ children, className = "" }: AnimatedListProps) {
  return (
    <motion.ul
      variants={pageAnimations.containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.ul>
  )
}

interface AnimatedListItemProps {
  children: ReactNode
  className?: string
}

export function AnimatedListItem({ children, className = "" }: AnimatedListItemProps) {
  return (
    <motion.li
      variants={pageAnimations.listItemVariants}
      whileHover="hover"
      className={className}
    >
      {children}
    </motion.li>
  )
}

interface AnimatedButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
  variant?: string
  size?: string
  [key: string]: any
}

export function AnimatedButton({ 
  children, 
  className = "", 
  onClick,
  disabled = false,
  ...props
}: AnimatedButtonProps) {
  return (
    <motion.button
      variants={pageAnimations.scaleVariants}
      initial="hidden"
      animate="visible"
      whileHover={!disabled ? "hover" : undefined}
      whileTap={!disabled ? "tap" : undefined}
      onClick={onClick}
      disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  )
}

interface AnimatedHeaderProps {
  children: ReactNode
  level?: 1 | 2 | 3 | 4 | 5 | 6
  className?: string
}

export function AnimatedHeader({ 
  children, 
  level = 1, 
  className = "" 
}: AnimatedHeaderProps) {
  const Component = motion[`h${level}` as keyof typeof motion] as any

  return (
    <Component
      variants={pageAnimations.headerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </Component>
  )
}
