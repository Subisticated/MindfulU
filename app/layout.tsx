import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { LocalStorageProvider } from "@/components/local-storage-provider"
import { OnboardingCheck } from "@/components/onboarding-check"
import "./globals.css"

export const metadata: Metadata = {
  title: "MindfulU - Student Wellness Companion",
  description:
    "Your personal wellness companion for student life. Track moods, journal thoughts, and discover mental health tools.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <ThemeProvider defaultTheme="light" storageKey="mindfulU-theme">
          <LocalStorageProvider>
            <OnboardingCheck>
              <Suspense fallback={null}>{children}</Suspense>
            </OnboardingCheck>
          </LocalStorageProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
