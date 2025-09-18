"use client"

import { lazy } from 'react'

// Heavy animation components that can be lazy loaded
export const LazyMotionComponents = {
  // Framer Motion complex animations
  HeavyAnimation: lazy(() => import('framer-motion').then(mod => ({ 
    default: mod.motion.div 
  }))),
  
  // Placeholder for future heavy components
  LazyChart: lazy(() => Promise.resolve({ 
    default: () => <div>Chart component placeholder</div> 
  })),
}

// Animation presets for common use cases
export const animationPresets = {
  // Lightweight animations for immediate use
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.2 }
  },
  
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  },
  
  // More complex animations that should be lazy loaded
  complexStagger: {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }
}

// Conditional animation wrapper
export const ConditionalAnimation = ({ 
  children, 
  enableAnimation = true,
  preset = 'fadeIn',
  ...props 
}: {
  children: React.ReactNode
  enableAnimation?: boolean
  preset?: keyof typeof animationPresets
} & any) => {
  if (!enableAnimation) {
    return <div {...props}>{children}</div>
  }
  
  // For now, return basic div - can be enhanced with dynamic imports
  return (
    <div 
      style={{ 
        animation: preset === 'fadeIn' ? 'fadeIn 0.2s ease-in' : undefined 
      }}
      {...props}
    >
      {children}
    </div>
  )
}
