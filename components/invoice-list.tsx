"use client"

import { useState } from "react"
import { invoices, type Invoice } from "@/lib/invoice-data"
import { InvoiceDetail } from "./invoice-detail"
import { Search, Filter, MoreVertical, ChevronDown, X } from "lucide-react"

type TabFilter = "all" | "draft" | "unpaid" | "paid"

export function InvoiceList() {
  const [activeTab, setActiveTab] = useState<TabFilter>("unpaid")
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(invoices[2])
  const [showDetail, setShowDetail] = useState(false)

  const filteredInvoices = invoices.filter((inv) => {
    switch (activeTab) {
      case "draft":
        return inv.status === "Draft"
      case "unpaid":
        return inv.status === "Unsent" || inv.status === "Viewed" || inv.status === "Overdue"
      case "paid":
        return inv.status === "Paid"
      default:
        return true
    }
  })

  const tabs: { key: TabFilter; label: string; count?: number }[] = [
    { key: "all", label: "Todas" },
    { key: "draft", label: "Borrador" },
    { key: "unpaid", label: "No Pagadas", count: filteredInvoices.length },
    { key: "paid", label: "Pagadas" },
  ]

  const handleSelectInvoice = (inv: Invoice) => {
    setSelectedInvoice(inv)
    setShowDetail(true)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Filters row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground font-sans">Filtros activos</span>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-[hsl(0,0%,80%)] hover:bg-[hsl(228,10%,24%)] transition-colors font-sans text-xs"
          >
            Clientes
            <ChevronDown className="h-3 w-3" />
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-[hsl(0,0%,80%)] hover:bg-[hsl(228,10%,24%)] transition-colors font-sans text-xs"
          >
            Estado
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-sans hidden sm:inline">Enero 2026</span>
          <span className="text-xs text-muted-foreground font-sans hidden sm:inline">-</span>
          <span className="text-xs text-muted-foreground font-sans hidden sm:inline">Febrero 2026</span>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-[hsl(0,0%,80%)] hover:bg-[hsl(228,10%,24%)] transition-colors font-sans text-xs"
          >
            <Filter className="h-3 w-3" />
            Filtrar
          </button>
          <button
            type="button"
            className="p-1.5 rounded-lg bg-secondary text-[hsl(0,0%,80%)] hover:bg-[hsl(228,10%,24%)] transition-colors"
            aria-label="Buscar"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-[hsl(228,14%,9%)] border border-border overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-sans transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? tab.key === "unpaid"
                  ? "bg-[hsl(90,100%,50%)] text-[hsl(0,0%,5%)] font-medium"
                  : "bg-secondary text-[hsl(0,0%,95%)] font-medium"
                : "text-muted-foreground hover:text-[hsl(0,0%,80%)]"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && activeTab === tab.key && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  tab.key === "unpaid"
                    ? "bg-[hsl(0,0%,5%,0.2)] text-[hsl(0,0%,5%)]"
                    : "bg-[hsl(228,10%,25%)] text-[hsl(0,0%,80%)]"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
        <div className="ml-auto flex items-center">
          <button type="button" className="p-1.5 text-muted-foreground hover:text-[hsl(0,0%,80%)] transition-colors" aria-label="Mas opciones">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Invoice list */}
        <div className="w-full lg:w-[400px] xl:w-[440px] flex flex-col gap-1 shrink-0">
          <h3 className="text-sm font-medium text-[hsl(0,0%,80%)] font-sans mb-2 px-1">
            {activeTab === "unpaid"
              ? "Facturas No Pagadas"
              : activeTab === "draft"
                ? "Borradores"
                : activeTab === "paid"
                  ? "Facturas Pagadas"
                  : "Todas las Facturas"}
          </h3>
          {filteredInvoices.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm font-sans">
              No hay facturas en esta categoria
            </div>
          ) : (
            filteredInvoices.map((inv) => (
              <button
                key={inv.id}
                type="button"
                onClick={() => handleSelectInvoice(inv)}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all text-left w-full ${
                  selectedInvoice?.id === inv.id
                    ? "bg-secondary ring-1 ring-[hsl(90,100%,50%,0.3)]"
                    : "hover:bg-[hsl(228,10%,16%)]"
                }`}
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-[hsl(228,10%,25%)] flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-[hsl(0,0%,80%)] font-sans">
                    {inv.customerAvatar}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[hsl(0,0%,90%)] font-sans">
                      # {inv.number}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-sans font-medium ${
                        inv.status === "Unsent"
                          ? "bg-[hsl(45,100%,50%,0.15)] text-[hsl(45,100%,60%)]"
                          : inv.status === "Viewed"
                            ? "bg-[hsl(200,60%,50%,0.15)] text-[hsl(200,60%,60%)]"
                            : inv.status === "Paid"
                              ? "bg-[hsl(90,100%,50%,0.15)] text-[hsl(90,100%,50%)]"
                              : inv.status === "Draft"
                                ? "bg-[hsl(228,10%,30%,0.5)] text-muted-foreground"
                                : "bg-[hsl(0,84%,60%,0.15)] text-[hsl(0,84%,60%)]"
                      }`}
                    >
                      {inv.status === "Unsent"
                        ? "No enviada"
                        : inv.status === "Viewed"
                          ? "Vista"
                          : inv.status === "Paid"
                            ? "Pagada"
                            : inv.status === "Draft"
                              ? "Borrador"
                              : "Vencida"}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground font-sans">{inv.daysAgo}</span>
                </div>

                {/* Amount */}
                <div className="text-right shrink-0">
                  <span className="text-sm font-semibold text-[hsl(0,0%,95%)] font-sans">
                    ${inv.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Invoice detail */}
        {selectedInvoice && (
          <>
            {/* Desktop detail */}
            <div className="hidden lg:block flex-1">
              <InvoiceDetail invoice={selectedInvoice} />
            </div>

            {/* Mobile detail overlay */}
            {showDetail && (
              <div className="fixed inset-0 z-[60] bg-background lg:hidden overflow-y-auto">
                <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-[hsl(228,14%,9%)] border-b border-border">
                  <h3 className="text-lg font-semibold text-[hsl(0,0%,95%)] font-sans">
                    Factura #{selectedInvoice.number}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowDetail(false)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-[hsl(0,0%,90%)] hover:bg-secondary transition-colors"
                    aria-label="Cerrar detalle"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-4 pb-24">
                  <InvoiceDetail invoice={selectedInvoice} />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
