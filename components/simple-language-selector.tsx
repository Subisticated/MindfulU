"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'ks', name: 'کٲشُر', flag: '🏔️' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },
]

export function SimpleLanguageSelector() {
  const [currentLocale, setCurrentLocale] = useState('en')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const savedLocale = localStorage.getItem('preferred-locale') || 'en'
    setCurrentLocale(savedLocale)
  }, [])

  const handleLanguageChange = (languageCode: string) => {
    console.log('Changing language to:', languageCode)
    localStorage.setItem('preferred-locale', languageCode)
    setCurrentLocale(languageCode)
    
    // Apply RTL/LTR
    const isRTL = ['ur', 'ks'].includes(languageCode)
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    document.documentElement.lang = languageCode
    
    setIsOpen(false)
    window.location.reload()
  }

  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0]

  return (
    <div className="relative">
      <Button 
        variant="outline" 
        size="sm" 
        className="gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{currentLanguage.flag}</span>
        <span>{currentLanguage.name}</span>
        <span className="text-xs">▼</span>
      </Button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-3 ${
                currentLocale === language.code ? 'bg-blue-50' : ''
              }`}
            >
              <span className="text-lg">{language.flag}</span>
              <span className="font-medium">{language.name}</span>
              {currentLocale === language.code && (
                <span className="ml-auto text-sm text-gray-500">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
