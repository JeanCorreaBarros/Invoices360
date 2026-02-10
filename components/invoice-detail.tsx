"use client"

import type { Invoice } from "@/lib/invoice-data"
import { Edit3, Trash2, Send, ArrowUpRight } from "lucide-react"

interface InvoiceDetailProps {
  invoice: Invoice
}

export function InvoiceDetail({ invoice }: InvoiceDetailProps) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="p-5 pb-4 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-sans">Detalle factura</span>
            </div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-[hsl(0,0%,95%)] font-sans">#{invoice.number}</h2>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-sans font-medium ${
                  invoice.status === "Unsent"
                    ? "bg-[hsl(45,100%,50%,0.15)] text-[hsl(45,100%,60%)]"
                    : invoice.status === "Viewed"
                      ? "bg-[hsl(200,60%,50%,0.15)] text-[hsl(200,60%,60%)]"
                      : invoice.status === "Paid"
                        ? "bg-[hsl(90,100%,50%,0.15)] text-[hsl(90,100%,50%)]"
                        : invoice.status === "Draft"
                          ? "bg-[hsl(228,10%,30%,0.5)] text-muted-foreground"
                          : "bg-[hsl(0,84%,60%,0.15)] text-[hsl(0,84%,60%)]"
                }`}
              >
                {invoice.status === "Unsent"
                  ? "No enviada"
                  : invoice.status === "Viewed"
                    ? "Vista"
                    : invoice.status === "Paid"
                      ? "Pagada"
                      : invoice.status === "Draft"
                        ? "Borrador"
                        : "Vencida"}
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-sans">Empresa</span>
              <span className="text-sm font-semibold text-[hsl(0,0%,95%)] font-sans flex items-center gap-1.5">
                {invoice.company}
              </span>
            </div>
            <div className="flex flex-col items-start sm:items-end">
              <span className="text-xs text-muted-foreground font-sans">Cliente</span>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[hsl(228,10%,25%)] flex items-center justify-center">
                  <span className="text-[10px] font-bold text-[hsl(0,0%,80%)] font-sans">
                    {invoice.customerAvatar}
                  </span>
                </div>
                <span className="text-sm font-medium text-[hsl(0,0%,90%)] font-sans">
                  {invoice.customer}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Line items */}
      <div className="p-5">
        <div className="flex flex-col gap-3">
          {invoice.lineItems.map((item) => (
            <div
              key={item.description}
              className="flex items-center justify-between p-4 rounded-xl bg-secondary"
            >
              <div className="flex items-center gap-2">
                <span className="text-[hsl(0,0%,55%)] text-xs font-sans">$</span>
                <span className="text-sm font-semibold text-[hsl(0,0%,95%)] font-sans">
                  {item.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <span className="text-sm text-muted-foreground font-sans">{item.description}</span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-sans">Sub Total</span>
              <span className="text-sm font-semibold text-[hsl(0,0%,95%)] font-sans">
                {invoice.subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-sans">Total</span>
              <span className="text-sm font-semibold text-[hsl(0,0%,95%)] font-sans">
                {invoice.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-sans">Balance Pendiente</span>
              <span className="text-sm font-bold text-[hsl(0,0%,95%)] font-sans">
                {invoice.balanceDue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-2 rounded-lg text-muted-foreground hover:text-[hsl(0,0%,90%)] hover:bg-secondary transition-colors"
              aria-label="Editar factura"
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="p-2 rounded-lg text-muted-foreground hover:text-[hsl(0,84%,60%)] hover:bg-[hsl(0,84%,60%,0.1)] transition-colors"
              aria-label="Eliminar factura"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="p-2 rounded-lg text-muted-foreground hover:text-[hsl(200,60%,60%)] hover:bg-[hsl(200,60%,60%,0.1)] transition-colors"
              aria-label="Enviar factura"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <button
            type="button"
            className="px-5 py-2.5 rounded-lg bg-[hsl(90,100%,50%)] text-[hsl(0,0%,5%)] text-sm font-semibold font-sans hover:bg-[hsl(90,100%,45%)] transition-colors"
          >
            Pagar ahora
          </button>
        </div>
      </div>
    </div>
  )
}
