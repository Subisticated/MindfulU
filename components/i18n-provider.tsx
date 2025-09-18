"use client"

import { appWithTranslation } from 'next-i18next'
import { useTranslation } from 'next-i18next'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

interface I18nProviderProps {
  children: React.ReactNode
}

export function I18nProvider({ children }: I18nProviderProps) {
  const router = useRouter()
  const { i18n } = useTranslation()

  useEffect(() => {
    // Set document direction for RTL languages
    const rtlLanguages = ['ur', 'ks'] // Urdu and Kashmiri (when written in Arabic script)
    const isRTL = rtlLanguages.includes(router.locale || 'en')
    
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    document.documentElement.lang = router.locale || 'en'
  }, [router.locale])

  return <>{children}</>
}

export default I18nProvider
