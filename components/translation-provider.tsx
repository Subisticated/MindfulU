"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface TranslationContextType {
  locale: string
  setLocale: (locale: string) => void
  t: (key: string, namespace?: string, params?: Record<string, any>) => string
  isRTL: boolean
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

// Simple translation store
const translations: Record<string, Record<string, any>> = {}

// Load translation function
const loadTranslation = async (locale: string, namespace: string) => {
  if (!translations[locale]) {
    translations[locale] = {}
  }
  
  if (!translations[locale][namespace]) {
    try {
      const response = await fetch(`/locales/${locale}/${namespace}.json`)
      if (response.ok) {
        translations[locale][namespace] = await response.json()
      } else {
        // Fallback to English
        const fallbackResponse = await fetch(`/locales/en/${namespace}.json`)
        if (fallbackResponse.ok) {
          translations[locale][namespace] = await fallbackResponse.json()
        }
      }
    } catch (error) {
      console.error(`Failed to load translation for ${locale}/${namespace}:`, error)
      translations[locale][namespace] = {}
    }
  }
}

interface TranslationProviderProps {
  children: ReactNode
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const [locale, setLocaleState] = useState('en')
  const [isLoaded, setIsLoaded] = useState(true) // Set to true by default to not block UI

  console.log('TranslationProvider - Initializing with locale:', locale)

  useEffect(() => {
    console.log('TranslationProvider - useEffect running')
    // Load locale from localStorage or browser
    const savedLocale = localStorage.getItem('preferred-locale') || 
                       navigator.language.split('-')[0] || 'en'
    console.log('TranslationProvider - Saved locale:', savedLocale)
    setLocaleState(savedLocale)
    
    // Apply RTL/LTR based on locale
    const isRTL = ['ur', 'ks', 'ar', 'fa'].includes(savedLocale)
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    document.documentElement.lang = savedLocale
    
    // Load initial translations (but don't block UI)
    Promise.all([
      loadTranslation(savedLocale, 'common'),
      loadTranslation(savedLocale, 'dashboard')
    ]).then(() => {
      console.log('TranslationProvider - Translations loaded successfully')
      setIsLoaded(true) // Only set loaded to true after translations are loaded
    }).catch(err => {
      console.error('TranslationProvider - Error loading translations:', err)
      setIsLoaded(true) // Still set to true to not block UI
    })

    // Listen for language change events
    const handleLanguageChange = (event: CustomEvent) => {
      const newLocale = event.detail.language
      console.log('TranslationProvider - Language change event received:', newLocale)
      setLocaleState(newLocale)
    }

    window.addEventListener('languageChange', handleLanguageChange as EventListener)
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener)
    }
  }, [])

  useEffect(() => {
    // Set document direction for RTL languages
    const rtlLanguages = ['ur', 'ks', 'ar', 'fa']
    const isRTL = rtlLanguages.includes(locale)
    
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    document.documentElement.lang = locale
  }, [locale])

  const setLocale = async (newLocale: string) => {
    setLocaleState(newLocale)
    localStorage.setItem('preferred-locale', newLocale)
    
    // Preload common translations for the new locale
    await Promise.all([
      loadTranslation(newLocale, 'common'),
      loadTranslation(newLocale, 'dashboard')
    ])
  }

  const t = (key: string, namespace: string = 'common', params?: Record<string, any>): string => {
    if (!isLoaded) return key

    // Auto-detect namespace from key prefix
    let actualNamespace = namespace
    let actualKey = key
    
    if (key.startsWith('dashboard.')) {
      actualNamespace = 'dashboard'
      actualKey = key.substring(10) // Remove 'dashboard.' prefix
    }

    const keys = actualKey.split('.')
    let value = translations[locale]?.[actualNamespace]

    for (const k of keys) {
      value = value?.[k]
    }

    // Fallback to English if translation not found
    if (!value && locale !== 'en') {
      let fallbackValue = translations['en']?.[actualNamespace]
      for (const k of keys) {
        fallbackValue = fallbackValue?.[k]
      }
      value = fallbackValue
    }

    // Handle parameter interpolation
    if (typeof value === 'string' && params) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey] || match
      })
    }

    return value || key
  }

  const isRTL = ['ur', 'ks', 'ar', 'fa'].includes(locale)

  return (
    <TranslationContext.Provider value={{ locale, setLocale, t, isRTL }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation(namespace?: string) {
  const context = useContext(TranslationContext)
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider')
  }

  return {
    ...context,
    t: (key: string, params?: Record<string, any>) => context.t(key, namespace || 'common', params)
  }
}

export default useTranslation
