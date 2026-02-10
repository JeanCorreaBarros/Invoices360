"use client"

import React from "react"
import { AuthProvider } from "@/lib/auth-context"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <MobileBottomNav />
    </AuthProvider>
  )
}
