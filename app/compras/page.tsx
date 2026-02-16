"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { useState, useEffect, useRef } from "react"
import { Plus, Trash2, X, Edit2, Search, ChevronLeft, ChevronRight, User, Hash, Phone, Mail, MapPin, Box, DollarSign, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import toast from "react-hot-toast"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { motion, AnimatePresence } from "framer-motion"

interface Product {
  id: string
  name: string
  sku: string
  price: number
  stock: number
}

interface Supplier {
  id: string
  name: string
  nit: string
  email: string
  phone: string
  address: string
  active: boolean
}

interface PurchaseItem {
  productId: string
  productName: string
  quantity: number | string
  cost: number | string
}

interface PurchaseDetail {
  id: number
  purchaseId: number
  productId: string
  quantity: string | number
  cost: string | number
  total: string | number
  product?: {
    id: string
    name: string
    sku: string
    price: number
  }
}

interface Purchase {
  id: string | number
  supplierName: string
  supplierNit: string
  invoiceNumber: string
  items?: PurchaseItem[]
  details?: PurchaseDetail[]
  subtotal: string | number
  tax: string | number
  total: string | number
  status: string
  createdAt: string
  date?: string
}

interface CreateModalState {
  supplierId: string
  supplierName: string
  supplierNit: string
  invoiceNumber: string
  items: PurchaseItem[]
  selectedProduct: string
  selectedProductCost: number
  quantity: number
}

// Componente de tarjeta para mobile
function PurchaseCard({ purchase, onEdit }: { purchase: Purchase; onEdit: (purchase: Purchase) => void }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{purchase.supplierName}</h3>
          <p className="text-sm text-gray-500 mt-1">NIT: {purchase.supplierNit}</p>
        </div>
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
          {purchase.invoiceNumber}
        </span>
      </div>

      <div className="space-y-2">
        <div>
          <p className="text-xs text-gray-500">Productos</p>
          <div className="space-y-1 mt-1">
            {(purchase.items || purchase.details || []).slice(0, 3).map((item: any, idx: number) => (
              <p key={idx} className="text-sm text-gray-900">
                {item.productName || item.product?.name} x{item.quantity}
              </p>
            ))}
            {(purchase.items || purchase.details || []).length > 3 && (
              <p className="text-xs text-gray-500">
                +{(purchase.items || purchase.details || []).length - 3} más
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-gray-500">Total</p>
            <p className="font-semibold text-gray-900">${Number(purchase.total).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Fecha</p>
            <p className="text-sm text-gray-900">
              {new Date(purchase.createdAt || purchase.date).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t">
        <button
          onClick={() => onEdit(purchase)}
          className="w-full flex items-center justify-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors text-blue-600 border border-blue-200"
        >
          <Edit2 className="h-4 w-4" />
          <span className="text-sm font-medium">Editar</span>
        </button>
      </div>
    </div>
  )
}

// ─── Formulario de proveedor compartido ───────────────────────────────────────
function SupplierSearch({
  searchTerm,
  setSearchTerm,
  selectedSupplier,
  filteredSuppliers,
  showDropdown,
  setShowDropdown,
  dropdownRef,
  onSelect,
  onClear,
}: {
  searchTerm: string
  setSearchTerm: (v: string) => void
  selectedSupplier: Supplier | null
  filteredSuppliers: Supplier[]
  showDropdown: boolean
  setShowDropdown: (v: boolean) => void
  dropdownRef: React.RefObject<HTMLDivElement>
  onSelect: (s: Supplier) => void
  onClear: () => void
}) {
  return (
    <div className="relative space-y-2" ref={dropdownRef}>
      <label className="block text-sm font-semibold text-[hsl(228,5%,25%)]">Proveedor</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <User className="h-4 w-4" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm && setShowDropdown(filteredSuppliers.length > 0)}
          className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-sm focus:ring-2 focus:ring-[hsl(209,79%,27%)] focus:border-transparent transition-all outline-none"
          placeholder="Buscar proveedor por nombre o NIT..."
          required
        />
        {selectedSupplier && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors p-1"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {showDropdown && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-2xl max-h-60 overflow-y-auto"
        >
          {filteredSuppliers.map((supplier) => (
            <button
              key={supplier.id}
              type="button"
              onClick={() => onSelect(supplier)}
              className="w-full px-4 py-3 text-left hover:bg-[hsl(209,79%,27%,0.05)] transition-colors border-b border-gray-50 last:border-b-0"
            >
              <div className="font-semibold text-[hsl(228,5%,15%)] text-sm">{supplier.name}</div>
              <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                <Hash className="h-3 w-3" /> {supplier.nit}
              </div>
            </button>
          ))}
        </motion.div>
      )}

      {selectedSupplier && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-[hsl(209,79%,27%,0.03)] border border-[hsl(209,79%,27%,0.1)] rounded-xl space-y-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="flex items-center gap-2 text-gray-600">
              <Hash className="h-3.5 w-3.5 text-[hsl(209,79%,27%)]" />
              <span><span className="font-semibold text-gray-900">NIT:</span> {selectedSupplier.nit}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="h-3.5 w-3.5 text-[hsl(209,79%,27%)]" />
              <span><span className="font-semibold text-gray-900">Tel:</span> {selectedSupplier.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="h-3.5 w-3.5 text-[hsl(209,79%,27%)]" />
              <span><span className="font-semibold text-gray-900">Email:</span> {selectedSupplier.email}</span>
            </div>
            <div className="flex items-start gap-2 text-gray-600 sm:col-span-2">
              <MapPin className="h-3.5 w-3.5 text-[hsl(209,79%,27%)] mt-0.5 shink-0" />
              <span><span className="font-semibold text-gray-900">Dirección:</span> {selectedSupplier.address}</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// ─── Sección de productos compartida ─────────────────────────────────────────
function ProductsSection({
  products,
  form,
  setForm,
  onAddItem,
  onRemoveItem,
  onProductSelect,
}: {
  products: Product[]
  form: CreateModalState
  setForm: (f: CreateModalState) => void
  onAddItem: () => void
  onRemoveItem: (i: number) => void
  onProductSelect: (id: string) => void
}) {
  return (
    <div className="space-y-4">
      <div className="border border-gray-100 rounded-2xl p-4 sm:p-5 bg-gray-50/50 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Box className="h-4 w-4 text-[hsl(209,79%,27%)]" />
          <h3 className="font-bold text-sm text-[hsl(228,5%,20%)] uppercase tracking-wider">Productos de la Compra</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 ml-1">Seleccionar Producto</label>
            <div className="relative">
              <select
                value={form.selectedProduct}
                onChange={(e) => onProductSelect(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[hsl(209,79%,27%)] outline-none appearance-none transition-all"
              >
                <option value="">Buscar producto...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.sku})
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ChevronRight className="h-4 w-4 rotate-90" />
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 ml-1">Cantidad</label>
            <input
              type="number"
              min="1"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[hsl(209,79%,27%)] outline-none transition-all"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 ml-1">Costo Unit.</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.selectedProductCost}
                onChange={(e) => setForm({ ...form, selectedProductCost: Number(e.target.value) })}
                className="w-full bg-white border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-sm focus:ring-2 focus:ring-[hsl(209,79%,27%)] outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <Button
          type="button"
          onClick={onAddItem}
          className="w-full h-12 bg-[hsl(209,79%,27%)] hover:bg-[hsl(209,79%,35%)] text-white font-semibold rounded-xl transition-all shadow-md active:scale-[0.98]"
        >
          <Plus className="h-5 w-5 mr-2" />
          Agregar a la lista
        </Button>
      </div>

      {/* Lista de Items */}
      <AnimatePresence mode="popLayout">
        {form.items.length > 0 && (
          <div className="space-y-3 mt-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Items Agregados ({form.items.length})</span>
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block border border-gray-100 rounded-2xl overflow-hidden shadow-sm bg-white">
              <table className="w-full text-sm">
                <thead className="bg-gray-50/50">
                  <tr className="text-gray-500 border-b border-gray-100">
                    <th className="px-5 py-4 text-left font-bold text-[11px] uppercase tracking-wider">Producto</th>
                    <th className="px-5 py-4 text-center font-bold text-[11px] uppercase tracking-wider">Cant.</th>
                    <th className="px-5 py-4 text-center font-bold text-[11px] uppercase tracking-wider">Costo</th>
                    <th className="px-5 py-4 text-end font-bold text-[11px] uppercase tracking-wider">Subtotal</th>
                    <th className="px-5 py-4 text-center w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {form.items.map((item, idx) => (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="group transition-colors hover:bg-[hsl(209,79%,27%,0.02)]"
                    >
                      <td className="px-5 py-4 font-medium text-gray-800">{item.productName}</td>
                      <td className="px-5 py-4 text-center text-gray-600">{item.quantity}</td>
                      <td className="px-5 py-4 text-center text-gray-600">${Number(item.cost).toFixed(2)}</td>
                      <td className="px-5 py-4 text-end font-bold text-[hsl(209,79%,20%)]">
                        ${(Number(item.quantity) * Number(item.cost)).toFixed(2)}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => onRemoveItem(idx)}
                          className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white h-8 w-8 rounded-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden space-y-3">
              {form.items.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm relative overflow-hidden group"
                >
                  <div className="flex justify-between items-start pr-8">
                    <div className="space-y-1">
                      <p className="font-bold text-gray-900 leading-tight">{item.productName}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>Cant: <span className="font-semibold text-gray-700">{item.quantity}</span></span>
                        <span>Costo: <span className="font-semibold text-gray-700">${Number(item.cost).toFixed(2)}</span></span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Subtotal</p>
                      <p className="font-black text-[hsl(209,79%,27%)] text-base">${(Number(item.quantity) * Number(item.cost)).toFixed(2)}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveItem(idx)}
                    className="absolute right-3 top-3 bg-red-50 text-red-500 h-8 w-8 rounded-xl flex items-center justify-center active:scale-95"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Total Footer */}
            <div className="pt-2 flex justify-end">
              <div className="flex items-center gap-3 bg-[hsl(209,79%,27%,0.05)] px-5 py-3 rounded-2xl border border-[hsl(209,79%,27%,0.1)]">
                <span className="text-sm font-bold text-gray-500">Total Compra:</span>
                <span className="text-xl font-black text-[hsl(209,79%,27%)]">
                  ${form.items.reduce((acc, item) => acc + (Number(item.quantity) * Number(item.cost)), 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Modal Crear ──────────────────────────────────────────────────────────────
function CreatePurchaseModal({ isOpen, onClose, onPurchaseCreated }: {
  isOpen: boolean
  onClose: () => void
  onPurchaseCreated: () => void
}) {
  const [products, setProducts] = useState<Product[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<CreateModalState>({
    supplierId: "",
    supplierName: "",
    supplierNit: "",
    invoiceNumber: "",
    items: [],
    selectedProduct: "",
    selectedProductCost: 0,
    quantity: 1,
  })
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://plasticoslc.com/api"

  useEffect(() => {
    if (!isOpen) return
    const token = sessionStorage.getItem("token")
    const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    fetch(`${apiBase}/products`, { headers }).then(r => r.ok && r.json()).then(d => d && setProducts(d)).catch(console.error)
    fetch(`${apiBase}/suppliers`, { headers }).then(r => r.ok && r.json()).then(d => d && setSuppliers(d.filter((s: Supplier) => s.active))).catch(console.error)
  }, [isOpen, apiBase])

  useEffect(() => {
    if (!searchTerm.trim()) { setFilteredSuppliers([]); setShowDropdown(false); return }
    const filtered = suppliers.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.nit.includes(searchTerm))
    setFilteredSuppliers(filtered)
    setShowDropdown(filtered.length > 0)
  }, [searchTerm, suppliers])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setShowDropdown(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelectSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier)
    setSearchTerm(supplier.name)
    setShowDropdown(false)
    setForm({ ...form, supplierId: supplier.id, supplierName: supplier.name, supplierNit: supplier.nit })
  }

  const handleClearSelection = () => {
    setSelectedSupplier(null)
    setSearchTerm('')
    setForm({ ...form, supplierId: '', supplierName: '', supplierNit: '' })
  }

  const handleAddItem = () => {
    if (!form.selectedProduct) { toast.error("Selecciona un producto"); return }
    if (form.quantity <= 0) { toast.error("La cantidad debe ser mayor a 0"); return }
    const product = products.find(p => p.id === form.selectedProduct)
    if (!product) return
    setForm({ ...form, items: [...form.items, { productId: form.selectedProduct, productName: product.name, quantity: form.quantity, cost: form.selectedProductCost }], selectedProduct: "", selectedProductCost: 0, quantity: 1 })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.supplierId || !form.supplierName || !form.supplierNit || !form.invoiceNumber) { toast.error("Completa todos los campos del proveedor"); return }
    if (form.items.length === 0) { toast.error("Agrega al menos un producto"); return }
    setLoading(true)
    try {
      const token = sessionStorage.getItem("token")
      const res = await fetch(`${apiBase}/purchases`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ supplierId: form.supplierId, supplierName: form.supplierName, supplierNit: form.supplierNit, invoiceNumber: form.invoiceNumber, items: form.items }),
      })
      if (!res.ok) throw new Error("Error al crear compra")
      toast.success("Compra creada exitosamente")
      onPurchaseCreated()
      onClose()
      setForm({ supplierId: "", supplierName: "", supplierNit: "", invoiceNumber: "", items: [], selectedProduct: "", selectedProductCost: 0, quantity: 1 })
      setSelectedSupplier(null)
      setSearchTerm('')
    } catch (err: any) {
      toast.error(err.message || "Error al crear compra")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white w-[calc(100%-1.5rem)] sm:max-w-3xl max-h-[94dvh] overflow-hidden rounded-3xl p-0 border-none shadow-2xl flex flex-col">
        {/* Header con gradiente sutil */}
        <div className="px-6 py-5 bg-[hsl(209,79%,27%,0.02)] border-b border-gray-100 flex items-center justify-between">
          <div>
            <DialogTitle className="text-xl font-black text-[hsl(209,79%,27%)]">Nueva Compra</DialogTitle>
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Registro de inventario</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 scrollbar-hide">
          <form id="create-purchase-form" onSubmit={handleSubmit} className="space-y-8">
            {/* Sección 1: Datos del Proveedor y Factura */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-6 w-1 bg-[hsl(209,79%,27%)] rounded-full" />
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Información General</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SupplierSearch
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  selectedSupplier={selectedSupplier}
                  filteredSuppliers={filteredSuppliers}
                  showDropdown={showDropdown}
                  setShowDropdown={setShowDropdown}
                  dropdownRef={dropdownRef}
                  onSelect={handleSelectSupplier}
                  onClear={handleClearSelection}
                />

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[hsl(228,5%,25%)]">Número de Factura</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <FileText className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      value={form.invoiceNumber}
                      onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-[hsl(209,79%,27%)] outline-none transition-all"
                      placeholder="Ej: F-10234"
                      required
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Sección 2: Productos */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-6 w-1 bg-[hsl(209,79%,27%)] rounded-full" />
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Detalle de Productos</h4>
              </div>

              <ProductsSection
                products={products}
                form={form}
                setForm={setForm}
                onAddItem={handleAddItem}
                onRemoveItem={(i) => setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) })}
                onProductSelect={(id) => {
                  const product = products.find(p => p.id === id)
                  setForm({ ...form, selectedProduct: id, selectedProductCost: product?.price || 0 })
                }}
              />
            </section>
          </form>
        </div>

        {/* Footer sticky con botones premium */}
        <div className="px-6 py-4 bg-gray-50/80 backdrop-blur-md border-t border-gray-100 flex flex-col-reverse sm:flex-row justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="w-full sm:w-auto h-12 text-gray-500 hover:text-gray-700 hover:bg-gray-100 font-semibold rounded-2xl"
          >
            Cancelar
          </Button>
          <Button
            form="create-purchase-form"
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto h-12 bg-[hsl(209,79%,27%)] hover:bg-[hsl(209,79%,15%)] text-white font-bold rounded-2xl px-8 shadow-lg shadow-[hsl(209,79%,27%,0.2)] transition-all active:scale-95"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Procesando...</span>
              </div>
            ) : "Guardar Compra"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Modal Editar ─────────────────────────────────────────────────────────────
function EditPurchaseModal({ isOpen, purchase, onClose, onPurchaseUpdated }: {
  isOpen: boolean
  purchase: Purchase | null
  onClose: () => void
  onPurchaseUpdated: () => void
}) {
  const [products, setProducts] = useState<Product[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<CreateModalState>({
    supplierId: "", supplierName: "", supplierNit: "", invoiceNumber: "",
    items: [], selectedProduct: "", selectedProductCost: 0, quantity: 1,
  })
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://plasticoslc.com/api"

  useEffect(() => {
    if (isOpen && purchase) {
      setForm({
        supplierId: "",
        supplierName: purchase.supplierName,
        supplierNit: purchase.supplierNit,
        invoiceNumber: purchase.invoiceNumber,
        items: purchase.items || purchase.details?.map((d: PurchaseDetail) => ({
          productId: d.productId,
          productName: d.product?.name || '',
          quantity: Number(d.quantity),
          cost: Number(d.cost),
        })) || [],
        selectedProduct: "", selectedProductCost: 0, quantity: 1,
      })
      setSearchTerm(purchase.supplierName)
    }
  }, [isOpen, purchase])

  useEffect(() => {
    if (!isOpen) return
    const token = sessionStorage.getItem("token")
    const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    fetch(`${apiBase}/products`, { headers }).then(r => r.ok && r.json()).then(d => d && setProducts(d)).catch(console.error)
    fetch(`${apiBase}/suppliers`, { headers }).then(r => r.ok && r.json()).then(d => d && setSuppliers(d.filter((s: Supplier) => s.active))).catch(console.error)
  }, [isOpen, apiBase])

  useEffect(() => {
    if (!searchTerm.trim()) { setFilteredSuppliers([]); setShowDropdown(false); return }
    const filtered = suppliers.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.nit.includes(searchTerm))
    setFilteredSuppliers(filtered)
    setShowDropdown(filtered.length > 0)
  }, [searchTerm, suppliers])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setShowDropdown(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelectSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier)
    setSearchTerm(supplier.name)
    setShowDropdown(false)
    setForm({ ...form, supplierId: supplier.id, supplierName: supplier.name, supplierNit: supplier.nit })
  }

  const handleClearSelection = () => {
    setSelectedSupplier(null)
    setSearchTerm('')
    setForm({ ...form, supplierId: '', supplierName: '', supplierNit: '' })
  }

  const handleAddItem = () => {
    if (!form.selectedProduct) { toast.error("Selecciona un producto"); return }
    if (form.quantity <= 0) { toast.error("La cantidad debe ser mayor a 0"); return }
    const product = products.find(p => p.id === form.selectedProduct)
    if (!product) return
    setForm({ ...form, items: [...form.items, { productId: form.selectedProduct, productName: product.name, quantity: form.quantity, cost: form.selectedProductCost }], selectedProduct: "", selectedProductCost: 0, quantity: 1 })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!purchase) return
    if (!form.supplierName || !form.supplierNit || !form.invoiceNumber) { toast.error("Completa todos los campos del proveedor"); return }
    if (form.items.length === 0) { toast.error("Agrega al menos un producto"); return }
    setLoading(true)
    try {
      const token = sessionStorage.getItem("token")
      const res = await fetch(`${apiBase}/purchases/${purchase.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ supplierId: form.supplierId || undefined, supplierName: form.supplierName, supplierNit: form.supplierNit, invoiceNumber: form.invoiceNumber, items: form.items }),
      })
      if (!res.ok) throw new Error("Error al actualizar compra")
      toast.success("Compra actualizada con éxito")
      onPurchaseUpdated()
      onClose()
    } catch (err: any) {
      toast.error(err.message || "Error al actualizar compra")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white w-[calc(100%-1.5rem)] sm:max-w-3xl max-h-[94dvh] overflow-hidden rounded-3xl p-0 border-none shadow-2xl flex flex-col">
        {/* Header con estilo diferenciado para Edición */}
        <div className="px-6 py-5 bg-[hsl(209,79%,27%,0.05)] border-b border-gray-100 flex items-center justify-between">
          <div>
            <DialogTitle className="text-xl font-black text-[hsl(209,79%,20%)]">Editar Compra</DialogTitle>
            <p className="text-[11px] text-[hsl(209,79%,40%)] font-bold uppercase tracking-widest mt-0.5">ID: {purchase?.id}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 scrollbar-hide">
          <form id="edit-purchase-form" onSubmit={handleSubmit} className="space-y-8">
            <section className="space-y-6">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-6 w-1 bg-[hsl(209,79%,27%)] rounded-full" />
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Información General</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SupplierSearch
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  selectedSupplier={selectedSupplier}
                  filteredSuppliers={filteredSuppliers}
                  showDropdown={showDropdown}
                  setShowDropdown={setShowDropdown}
                  dropdownRef={dropdownRef}
                  onSelect={handleSelectSupplier}
                  onClear={handleClearSelection}
                />

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[hsl(228,5%,25%)]">Número de Factura</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <FileText className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      value={form.invoiceNumber}
                      onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-[hsl(209,79%,27%)] outline-none transition-all"
                      required
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-6 w-1 bg-[hsl(209,79%,27%)] rounded-full" />
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Detalle de Productos</h4>
              </div>

              <ProductsSection
                products={products}
                form={form}
                setForm={setForm}
                onAddItem={handleAddItem}
                onRemoveItem={(i) => setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) })}
                onProductSelect={(id) => {
                  const product = products.find(p => p.id === id)
                  setForm({ ...form, selectedProduct: id, selectedProductCost: product?.price || 0 })
                }}
              />
            </section>
          </form>
        </div>

        <div className="px-6 py-4 bg-gray-50/80 backdrop-blur-md border-t border-gray-100 flex flex-col-reverse sm:flex-row justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose} className="h-12 text-gray-500 hover:bg-gray-100 font-semibold rounded-2xl px-6">
            Cancelar
          </Button>
          <Button
            form="edit-purchase-form"
            type="submit"
            disabled={loading}
            className="h-12 bg-[hsl(209,79%,27%)] hover:bg-[hsl(209,79%,15%)] text-white font-bold rounded-2xl px-8 shadow-lg transition-all active:scale-95"
          >
            {loading ? "Actualizando..." : "Guardar Cambios"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function ComprasPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://plasticoslc.com/api"

  const normalizeText = (text: string) =>
    text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  const fetchPurchases = async () => {
    setLoading(true)
    try {
      const token = sessionStorage.getItem("token")
      const res = await fetch(`${apiBase}/purchases`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      })
      if (res.ok) {
        const data = await res.json()
        const purchasesData = Array.isArray(data) ? data : data.data || []
        setPurchases(purchasesData.map((purchase: any) => ({
          ...purchase,
          items: (purchase.details || []).map((detail: PurchaseDetail) => ({
            productId: detail.productId,
            productName: detail.product?.name || '',
            quantity: Number(detail.quantity),
            cost: Number(detail.cost),
          })),
        })))
      }
    } catch (err) {
      toast.error("Error al cargar compras")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPurchases() }, [])
  useEffect(() => { setCurrentPage(1) }, [searchTerm])

  const filteredPurchases = purchases.filter((purchase) => {
    const s = normalizeText(searchTerm)
    return (
      normalizeText(purchase.supplierName).includes(s) ||
      normalizeText(purchase.supplierNit).includes(s) ||
      normalizeText(purchase.invoiceNumber).includes(s) ||
      (purchase.items || purchase.details || []).some((item: any) =>
        normalizeText(item.productName || item.product?.name || '').includes(s)
      )
    )
  })

  const totalPages = Math.ceil(filteredPurchases.length / itemsPerPage)
  const paginatedPurchases = filteredPurchases.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const getPageNumbers = () => {
    const pages: Array<number | string> = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) pages.push(i)
      pages.push("ellipsis-end"); pages.push(totalPages)
    } else if (currentPage >= totalPages - 2) {
      pages.push(1); pages.push("ellipsis-start")
      for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1); pages.push("ellipsis-start")
      pages.push(currentPage - 1); pages.push(currentPage); pages.push(currentPage + 1)
      pages.push("ellipsis-end"); pages.push(totalPages)
    }
    return pages
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <DashboardHeader />
      <main className="flex-1 p-4 lg:p-6 pb-24 lg:pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold">Compras</h1>
            <Button onClick={() => setIsModalOpen(true)} className="bg-blue-700 hover:bg-blue-800 text-white flex items-center gap-2 w-full sm:w-auto">
              <Plus className="h-5 w-5" />
              <span className="hidden sm:inline">Nueva Compra</span>
              <span className="sm:hidden">Nueva</span>
            </Button>
          </div>

          <div className="bg-white p-4 rounded-lg mb-6">
            <div className="relative rounded-lg w-full">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por proveedor, NIT, factura o producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full shadow-lg bg-white pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12"><p className="text-gray-500">Cargando compras...</p></div>
          ) : purchases.length === 0 ? (
            <div className="text-center py-12"><p className="text-gray-500">No hay compras registradas</p></div>
          ) : filteredPurchases.length === 0 ? (
            <div className="text-center py-12"><p className="text-gray-500">No se encontraron compras que coincidan con la búsqueda</p></div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block bg-white rounded-lg shadow-xl overflow-hidden mb-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Proveedor</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Factura</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Productos</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Total</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Fecha</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {paginatedPurchases.map((purchase) => (
                        <tr key={purchase.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <p className="font-medium text-gray-900">{purchase.supplierName}</p>
                            <p className="text-sm text-gray-500">{purchase.supplierNit}</p>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">{purchase.invoiceNumber}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            <div className="space-y-1">
                              {(purchase.items || purchase.details || []).map((item: any, idx: number) => (
                                <p key={idx}>{item.productName || item.product?.name} x{item.quantity}</p>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-900">${Number(purchase.total).toFixed(2)}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(purchase.createdAt || purchase.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <button onClick={() => { setSelectedPurchase(purchase); setIsEditModalOpen(true) }} className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium">
                              <Edit2 className="h-4 w-4" />Editar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3 mb-6">
                {paginatedPurchases.map((purchase) => (
                  <PurchaseCard key={purchase.id} purchase={purchase} onEdit={(p) => { setSelectedPurchase(p); setIsEditModalOpen(true) }} />
                ))}
              </div>

              {/* Paginación */}
              {filteredPurchases.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-600 text-center sm:text-left">
                      Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, filteredPurchases.length)} de {filteredPurchases.length} compras
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <div className="flex items-center gap-1">
                        {getPageNumbers().map((pageNum) =>
                          typeof pageNum === "string" ? (
                            <span key={pageNum} className="px-2 py-2 text-gray-500">...</span>
                          ) : (
                            <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={`min-w-[40px] px-3 py-2 rounded-lg font-medium transition-colors ${currentPage === pageNum ? "bg-blue-600 text-white" : "hover:bg-gray-100 text-gray-700"}`}>
                              {pageNum}
                            </button>
                          )
                        )}
                      </div>
                      <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <MobileBottomNav />
      <CreatePurchaseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onPurchaseCreated={fetchPurchases} />
      <EditPurchaseModal
        isOpen={isEditModalOpen}
        purchase={selectedPurchase}
        onClose={() => { setIsEditModalOpen(false); setSelectedPurchase(null) }}
        onPurchaseUpdated={fetchPurchases}
      />
    </div>
  )
}