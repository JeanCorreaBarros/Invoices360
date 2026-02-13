"use client"

import React from "react"
import { AuthProvider } from "@/lib/auth-context"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { ThemeProvider } from "@/components/theme-provider"

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthProvider>
        {children}
       
      </AuthProvider>
    </ThemeProvider>
  )
}
