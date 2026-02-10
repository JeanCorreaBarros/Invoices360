"use client"

import React from "react"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  // Simple passthrough guard stub — in future add auth checks
  return <>{children}</>
}
