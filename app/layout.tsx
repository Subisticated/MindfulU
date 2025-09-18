import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Suspense } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { MongooseProvider } from "@/components/mongoose-provider"
import { TranslationProvider } from "@/components/translation-provider"
import { OnboardingCheck } from "@/components/onboarding-check"
import AuthProvider from "@/components/auth-provider"
import { UserFlowProvider } from "@/components/user-flow-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MindfulU - Student Wellness Companion",
  description:
    "Your personal wellness companion for student life. Track moods, journal thoughts, and discover mental health tools.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <TranslationProvider>
            <ThemeProvider defaultTheme="light" storageKey="mindfulU-theme">
              <MongooseProvider>
                <UserFlowProvider>
                  <OnboardingCheck>
                    {/* <CriticalResourcePreloader /> */}
                    <Suspense fallback={null}>{children}</Suspense>
                  </OnboardingCheck>
                </UserFlowProvider>
              </MongooseProvider>
            </ThemeProvider>
          </TranslationProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
