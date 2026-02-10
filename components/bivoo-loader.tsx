"use client"

import React from "react"

export function BivooLoader() {
  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="h-8 w-8 rounded-full border-4 border-[hsl(90,100%,50%)] border-t-transparent animate-spin" />
    </div>
  )
}
