import { useContext } from 'react'
import { TranslationContext } from '@/components/translation-provider'

export function useTranslation(namespace?: string) {
  const context = useContext(TranslationContext)
  
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider')
  }

  const { locale, translations, setLocale } = context

  const t = (key: string, params?: Record<string, any>): string => {
    try {
      const keys = key.split('.')
      let value: any = translations
      
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k]
        } else {
          return key // Return key if translation not found
        }
      }
      
      if (typeof value === 'string' && params) {
        return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
          return params[paramKey] || match
        })
      }
      
      return typeof value === 'string' ? value : key
    } catch (error) {
      console.warn('Translation error for key:', key, error)
      return key
    }
  }

  const isRTL = () => {
    const rtlLanguages = ['ur', 'ks'] // Urdu and Kashmiri (Arabic script)
    return rtlLanguages.includes(locale)
  }

  return {
    t,
    i18n,
    ready,
    currentLanguage,
    isRTL: isRTL(),
    getLocalizedPath,
    changeLanguage: (lng: string) => {
      const { pathname, asPath, query } = router
      router.push({ pathname, query }, asPath, { locale: lng })
    }
  }
}

export default useTranslation
