"use client"

import { DashboardHeader } from "./dashboard-header"
import { SummaryCards } from "./summary-cards"
import { InvoiceList } from "./invoice-list"
// MobileBottomNav is provided globally by the app layout
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

export function Dashboard() {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader />
      <main className="flex-1 p-4 lg:p-6 pb-24 lg:pb-6 flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
        {/* Page title */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl lg:text-3xl font-bold text-[hsl(0,0%,95%)] font-sans">Facturas</h1>
          <button
            type="button"
            onClick={() => router.push("/facturacion/nueva")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[hsl(90,100%,50%)] text-[hsl(0,0%,5%)] text-sm font-semibold font-sans hover:bg-[hsl(90,100%,45%)] transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Crear factura</span>
            <span className="sm:hidden">Nueva</span>
          </button>
        </div>

        {/* Summary cards */}
        <SummaryCards />

        {/* Invoice list with detail */}
        <InvoiceList />
      </main>

      {/* Mobile bottom navigation is provided by layout */}
    </div>
  )
}
