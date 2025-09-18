"use client"

import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"

export function DebugInfo() {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  if (process.env.NODE_ENV !== 'development') return null

  return (
    <div className="fixed top-0 right-0 bg-black text-white p-2 text-xs z-50 max-w-xs">
      <div>Path: {pathname}</div>
      <div>Status: {status}</div>
      <div>User: {session?.user?.email || 'None'}</div>
    </div>
  )
}
