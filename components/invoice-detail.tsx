"use client"

import { useState } from "react"
import type { Invoice } from "@/lib/invoice-data"
import { Edit3, Trash2, Send, ArrowUpRight, Loader2, MoreVertical, Download } from "lucide-react"
import { InvoiceEditDialog } from "./invoice-edit-dialog"
import { toast } from "react-hot-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface InvoiceDetailProps {
  invoice: Invoice
  onRefresh?: () => void
}

export function InvoiceDetail({ invoice, onRefresh }: InvoiceDetailProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState(invoice.status)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [showDownloadDialog, setShowDownloadDialog] = useState(false)

  const statusToApi = {
    "Draft": "DRAFT",
    "Sent": "SENT",
    "Unsent": "PENDING",
    "Partial": "PARTIAL",
    "Paid": "PAID",
    "Cancelled": "CANCELLED",
    "Overdue": "OVERDUE",
    "Viewed": "PENDING"
  }

  const statusConfig = {
    "Unsent": { label: "Pendiente", bg: "bg-yellow-100", text: "text-yellow-700" },
    "Viewed": { label: "Vista", bg: "bg-blue-100", text: "text-blue-700" },
    "Paid": { label: "Pagada", bg: "bg-green-100", text: "text-green-700" },
    "Draft": { label: "Borrador", bg: "bg-gray-200", text: "text-gray-700" },
    "Sent": { label: "Enviada", bg: "bg-emerald-100", text: "text-emerald-700" },
    "Partial": { label: "Pago Parcial", bg: "bg-orange-100", text: "text-orange-700" },
    "Cancelled": { label: "Anulada", bg: "bg-red-100", text: "text-red-700" },
    "Overdue": { label: "Vencida", bg: "bg-red-100", text: "text-red-700" }
  }

  const handleStatusChange = async (newStatus: Invoice['status']) => {
    setIsUpdatingStatus(true)
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://plasticoslc.com/api/"
      const token = sessionStorage.getItem("token")

      const response = await fetch(`${apiBase}invoices/${invoice.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: statusToApi[newStatus]
        })
      })

      if (response.ok) {
        setSelectedStatus(newStatus)
        toast.success('Estado actualizado exitosamente')
        onRefresh?.()
      } else {
        toast.error('Error al actualizar el estado')
      }
    } catch (error) {
      toast.error('Error de red al actualizar el estado')
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handleSendEmail = async () => {
    if (!invoice.email) {
      toast.error('El cliente no tiene un correo electrónico asociado')
      return
    }

    setIsSending(true)
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://plasticoslc.com/api/"
      const response = await fetch(`${apiBase}invoice-documents/${invoice.id}/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: invoice.email,
          style: "modern"
        })
      })
      const data = await response.json()
      if (data.ok) {
        toast.success(data.message || 'Factura enviada exitosamente')
      } else {
        toast.error(data.message || 'Error al enviar la factura')
      }
    } catch (error) {
      toast.error('Error de red')
    } finally {
      setIsSending(false)
    }
  }

  const downloadInvoice = async (style: 'classic' | 'dian') => {
    if (!invoice.id) {
      toast.error('No hay una factura para descargar')
      setShowDownloadDialog(false)
      return
    }

    setIsDownloading(true)
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://plasticoslc.com/api/";
      const token = sessionStorage.getItem("token")
      const endpoint = style === 'classic' ? 'invoice-documents' : 'invoice-documents'
      const res = await fetch(`${apiBase}${endpoint}/${invoice.id}/pdf${style !== 'classic' ? '?style=dian' : ''}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${await res.text()}`)
      }

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `invoice-${style}-${invoice.id}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success(`Factura descargada en estilo ${style}`)
    } catch (error) {
      console.error('Error downloading invoice:', error)
      toast.error('Error al descargar la factura')
    } finally {
      setIsDownloading(false)
      setShowDownloadDialog(false)
    }
  }

  const currentStatus = statusConfig[selectedStatus] || statusConfig["Overdue"]

  return (
    <div className="rounded-xl md:rounded-2xl border border-border bg-card shadow-sm">

      {/* Header */}
      <div className="p-4 md:p-5 pb-3 md:pb-4 border-b border-border bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl md:rounded-t-2xl">
        <div className="flex flex-col gap-3">

          {/* Primera fila: Número, Estado y Menú mobile */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg md:text-xl font-bold font-sans">#{invoice.number}</h2>
              <span className={`text-xs px-2.5 py-1 rounded-full font-sans font-medium ${currentStatus.bg} ${currentStatus.text}`}>
                {currentStatus.label}
              </span>
            </div>

            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 rounded-lg hover:bg-white/50 transition-colors">
                    <MoreVertical className="h-5 w-5 text-gray-600" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Editar factura
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSendEmail} disabled={isSending}>
                    {isSending
                      ? <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      : <Send className="h-4 w-4 mr-2" />
                    }
                    {isSending ? "Enviando..." : "Enviar por email"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowDownloadDialog(true)}>
                    <Download className="h-4 w-4 mr-2" />
                    Descargar PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Segunda fila: Cliente y Empresa */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-xs text-gray-600 font-sans mb-0.5 text-left">Cliente</span>
              <div className="flex items-center gap-1.5 justify-start">
                <div className="w-5 h-5 rounded-full bg-[hsl(226,79%,22%)] flex items-center justify-center shrink-0">
                  <span className="text-[9px] font-bold text-white font-sans">
                    {invoice.customerAvatar}
                  </span>
                </div>
                <span className="text-sm font-medium font-sans text-gray-900 truncate">
                  {invoice.customer}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-600 font-sans mb-0.5 text-right">Empresa</span>
              <span className="text-sm font-semibold font-sans text-gray-900 truncate text-right">
                {invoice.company}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 md:p-5">

        {/* Line items container with scroll */}
        <div className="flex flex-col gap-2 md:gap-3 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200">
          {invoice.lineItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 md:p-4 rounded-lg md:rounded-xl bg-gradient-to-r from-[#295582] to-[#1e4166] hover:shadow-md transition-all shrink-0"
            >
              <div className="flex items-center gap-2 mb-2 sm:mb-0">
                <span className="text-gray-300 text-xs font-sans">$</span>
                <span className="text-base md:text-lg font-bold text-white font-sans">
                  {item.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 text-gray-400" />
              </div>
              <span className="text-sm text-white/90 font-sans line-clamp-2 sm:line-clamp-1">
                {item.description}
              </span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-5 md:mt-6 pt-4 border-t border-border">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            <div className="flex justify-between sm:flex-col p-3 sm:p-0 bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none">
              <span className="text-xs text-gray-600 font-sans">Sub Total</span>
              <span className="text-sm md:text-base font-semibold text-gray-900 font-sans">
                ${invoice.subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between sm:flex-col p-3 sm:p-0 bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none">
              <span className="text-xs text-gray-600 font-sans">Total</span>
              <span className="text-sm md:text-base font-semibold text-gray-900 font-sans">
                ${invoice.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between sm:flex-col p-3 sm:p-0 bg-blue-50 sm:bg-transparent rounded-lg sm:rounded-none">
              <span className="text-xs text-blue-700 font-sans font-medium">Balance Pendiente</span>
              <span className="text-base md:text-lg font-bold text-blue-900 font-sans">
                ${invoice.balanceDue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Actions — solo desktop */}
        <div className="mt-5 md:mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEditDialogOpen(true)}
              className="p-2 rounded-lg text-gray-600 flex hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Editar factura"
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowDownloadDialog(true)}
              className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              aria-label="Descargar factura"
            >
              <Download className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleSendEmail}
              disabled={isSending}
              className={`p-2 rounded-lg  text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50 ${isSending ? 'px-3' : ''}`}
              aria-label="Enviar factura"
            >
              {isSending ? (
                <span className="flex items-center gap-1 text-xs">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando
                </span>
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
          <Select value={selectedStatus} onValueChange={handleStatusChange} disabled={isUpdatingStatus}>
            <SelectTrigger className="w-[180px] hidden md:flex bg-[hsl(209,83%,23%)] text-white border-none">
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Draft">Borrador</SelectItem>
              <SelectItem value="Sent">Enviada</SelectItem>
              <SelectItem value="Unsent">Pendiente</SelectItem>
              <SelectItem value="Partial">Pago Parcial</SelectItem>
              <SelectItem value="Paid">Pagada</SelectItem>
              <SelectItem value="Cancelled">Anulada</SelectItem>
              <SelectItem value="Overdue">Vencida</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Selector de estado — solo mobile */}
        <div className="mt-4 flex md:hidden">
          <label className="text-xs text-gray-600 hidden font-sans mb-1.5 ">Cambiar Estado</label>
          <Select value={selectedStatus} onValueChange={handleStatusChange} disabled={isUpdatingStatus}>
            <SelectTrigger className="w-full h-11 bg-[hsl(209,83%,23%)] text-white border-none">
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Draft">Borrador</SelectItem>
              <SelectItem value="Sent">Enviada</SelectItem>
              <SelectItem value="Unsent">Pendiente</SelectItem>
              <SelectItem value="Partial">Pago Parcial</SelectItem>
              <SelectItem value="Paid">Pagada</SelectItem>
              <SelectItem value="Cancelled">Anulada</SelectItem>
              <SelectItem value="Overdue">Vencida</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Edit Dialog */}
      <InvoiceEditDialog
        invoiceId={invoice.id}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={() => window.location.reload()}
      />

      {/* Download Dialog */}
      <Dialog open={showDownloadDialog} onOpenChange={setShowDownloadDialog}>
        <DialogContent className="bg-white z-[100]">
          <DialogHeader>
            <DialogTitle>Seleccionar estilo de descarga</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <p className="text-gray-600">¿En qué estilo deseas descargar la factura?</p>
            <div className="flex gap-4">
              <Button
                onClick={() => downloadInvoice('classic')}
                disabled={isDownloading}
                className="flex-1"
              >
                {isDownloading ? "Descargando..." : "Estilo Clásico"}
              </Button>
              <Button
                onClick={() => downloadInvoice('dian')}
                disabled={isDownloading}
                className="flex-1"
              >
                {isDownloading ? "Descargando..." : "Estilo DIAN"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}