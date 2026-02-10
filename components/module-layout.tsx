"use client"

import React from "react"

export function ModuleLayout({ children, moduleType }: { children: React.ReactNode; moduleType?: string }) {
  return (
    <div className="min-h-screen bg-[hsl(228,14%,9%)] text-[hsl(0,0%,95%)]">
      <div className="max-w-[1400px] mx-auto w-full">{children}</div>
    </div>
  )
}
