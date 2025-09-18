"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Globe, ChevronDown } from "lucide-react"

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'ks', name: 'کٲشُر', flag: '🏔️' }, // Kashmiri
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
  { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
  { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'or', name: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { code: 'as', name: 'অসমীয়া', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
]

// RTL languages
const rtlLanguages = ['ur', 'ks']

export function LanguageSelector() {
  const [currentLocale, setCurrentLocale] = useState('en')
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load saved language from localStorage
    const savedLocale = localStorage.getItem('preferred-locale') || 'en'
    setCurrentLocale(savedLocale)
    
    // Apply RTL/LTR to document
    const isRTL = rtlLanguages.includes(savedLocale)
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    document.documentElement.lang = savedLocale
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLanguageChange = (languageCode: string) => {
    console.log('Changing language to:', languageCode)
    
    // Save to localStorage
    localStorage.setItem('preferred-locale', languageCode)
    setCurrentLocale(languageCode)
    
    // Apply RTL/LTR
    const isRTL = rtlLanguages.includes(languageCode)
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    document.documentElement.lang = languageCode
    
    setIsOpen(false)
    
    // Dispatch custom event for translation provider
    window.dispatchEvent(new CustomEvent('languageChange', { 
      detail: { language: languageCode } 
    }))
    
    // Reload page to apply changes completely
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }

  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0]

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        size="sm"
        className="gap-2 min-w-[120px] justify-between"
        onClick={() => {
          console.log('Button clicked, current isOpen:', isOpen)
          setIsOpen(!isOpen)
        }}
      >
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLanguage.flag}</span>
          <span className="hidden md:inline">{currentLanguage.name}</span>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full px-3 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors ${
                currentLocale === language.code ? 'bg-blue-50 dark:bg-blue-900/30' : ''
              }`}
            >
              <span className="text-lg">{language.flag}</span>
              <span className="font-medium">{language.name}</span>
              {currentLocale === language.code && (
                <span className="ml-auto text-sm text-blue-600 dark:text-blue-400">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default LanguageSelector
