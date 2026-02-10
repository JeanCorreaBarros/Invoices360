"use client"

import { DashboardHeader } from "@/components/dashboard-header"

export default function CobrosPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader />
      <main className="flex-1 p-4 lg:p-6 pb-24 lg:pb-6 flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl lg:text-3xl font-bold text-[hsl(0,0%,95%)] font-sans">Cobros</h1>
        </div>

        <p className="text-muted-foreground">Aquí irán las vistas y herramientas de cobros.</p>
      </main>
    </div>
  )
}
