"use client"

import { useState, useEffect } from "react"
import { type Invoice } from "@/lib/invoice-data"
import { InvoiceDetail } from "./invoice-detail"
import { Search, Filter, MoreVertical, ChevronDown, X } from "lucide-react"

type TabFilter = "all" | "draft" | "unpaid" | "paid"

export function InvoiceList() {
  const [activeTab, setActiveTab] = useState<TabFilter>("unpaid")
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [showDetail, setShowDetail] = useState(false)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [limit] = useState(5)
  const [total, setTotal] = useState(0)

  // Fetch invoices from API
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true)
        const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://plasticoslc.com/api/"
        const token = sessionStorage.getItem("token")
        
        if (!token) {
          setError("Token de autenticación no encontrado")
          setLoading(false)
          return
        }

        const res = await fetch(`${apiBase}invoices?page=${page}&limit=${limit}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        })
        if (!res.ok) throw new Error("Error al cargar facturas")
        const data = await res.json()

        // Map API data to Invoice format
        const mappedInvoices: Invoice[] = (data?.data || []).map((inv: any) => {
          const initials = inv.orderReceiverName
            ? inv.orderReceiverName.split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)
            : "UN"

          return {
            id: String(inv.id),
            number: `${inv.orderPrefix}-${String(inv.orderId).padStart(3, "0")}`,
            company: "Plásticos LC",
            customer: inv.orderReceiverName || "N/A",
            customerAvatar: initials,
            status: "Unsent" as const,
            amount: Number(inv.orderTotalAfterTax || 0),
            daysAgo: inv.orderDate ? `hace ${Math.floor((Date.now() - new Date(inv.orderDate).getTime()) / (1000 * 60 * 60 * 24))} dias` : "N/A",
            lineItems: (inv.details || []).map((detail: any) => ({
              description: detail.itemName || detail.product?.name || "Sin nombre",
              amount: Number(detail.orderItemPrice || 0),
            })),
            subtotal: Number(inv.orderSubtotalBeforeTax || 0),
            total: Number(inv.orderTotalAfterTax || 0),
            balanceDue: Number(inv.orderTotalAmountDue || inv.orderTotalAfterTax || 0),
          }
        })

        setInvoices(mappedInvoices)
        setTotal(data?.total || 0)
        if (mappedInvoices.length > 0 && !selectedInvoice) {
          setSelectedInvoice(mappedInvoices[0])
        }
      } catch (err) {
        console.error("Error fetching invoices:", err)
        setError("No se pudieron cargar las facturas")
      } finally {
        setLoading(false)
      }
    }

    fetchInvoices()
  }, [page, limit])

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
      <div className="hidden flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
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
      <div className="flex items-center gap-1 p-1 rounded-xl bg-[hsl(209,83%,23%)] border border-border overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-sans transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? tab.key === "unpaid"
                  ? "bg-[hsl(0,0%,100%)] text-[hsl(0,0%,5%)] font-medium"
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
        <div className="ml-auto hidden items-center">
          <button type="button" className="p-1.5 text-muted-foreground hover:text-[hsl(0,0%,80%)] transition-colors" aria-label="Mas opciones">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Invoice list */}
        <div className="w-full lg:w-[400px] xl:w-[440px] flex flex-col gap-1 shrink-0">
          <h3 className="text-sm font-medium text-[hsl(209,83%,23%)] font-sans mb-2 px-1">
            {activeTab === "unpaid"
              ? "Facturas No Pagadas"
              : activeTab === "draft"
                ? "Borradores"
                : activeTab === "paid"
                  ? "Facturas Pagadas"
                  : "Todas las Facturas"}
          </h3>
          {loading ? (
            <div className="p-8 text-center text-[hsl(209,83%,23%)] text-sm font-sans">Cargando facturas...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500 text-sm font-sans">{error}</div>
          ) : filteredInvoices.length === 0 ? (
            <div className="p-8 text-center text-[hsl(209,83%,23%)] text-sm font-sans">
              No hay facturas en esta categoria
            </div>
          ) : (
            filteredInvoices.map((inv) => (
              <button
                key={inv.id}
                type="button"
                onClick={() => handleSelectInvoice(inv)}
                className={`flex items-center gap-3 hover:scale-95 p-3 rounded-xl transition-all text-left w-full ${
                  selectedInvoice?.id === inv.id
                    ? "bg-[hsl(209,83%,23%)] ring-1 ring-[hsl(90,100%,50%,0.3)] text-[hsl(0,0%,95%)]"
                    : "text-[hsl(222,15%,10%)] hover:bg-[hsl(209,83%,23%)] hover:text-[hsl(0,0%,95%)]"
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
                  <div className="flex items-center  gap-2">
                    <span className="text-sm font-medium text-[hsl(0,0%,48%)] font-sans">
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
                  <span className="text-xs text-[hsl(0,0%,48%)] font-sans">{inv.daysAgo}</span>
                </div>

                {/* Amount */}
                <div className="text-right shrink-0">
                  <span className="text-sm font-semibold font-sans">
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
              <div className="fixed inset-0 z-[60] bg-white lg:hidden overflow-y-auto">
                <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-[hsl(230,74%,17%)] border-b border-border">
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
