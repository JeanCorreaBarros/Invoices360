"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { useState, useEffect, useRef } from "react"
import { Plus, Trash2, X, Edit2, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import toast from "react-hot-toast"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"

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
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium mb-1">Nombre Proveedor</label>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm && setShowDropdown(filteredSuppliers.length > 0)}
          className="w-full border rounded-lg px-3 py-3 pr-10 text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Buscar por nombre o NIT..."
          required
        />
        {selectedSupplier && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-52 overflow-y-auto">
          {filteredSuppliers.map((supplier) => (
            <button
              key={supplier.id}
              type="button"
              onClick={() => onSelect(supplier)}
              className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b last:border-b-0"
            >
              <div className="font-medium text-sm">{supplier.name}</div>
              <div className="text-xs text-gray-500">NIT: {supplier.nit}</div>
            </button>
          ))}
        </div>
      )}

      {selectedSupplier && (
        <div className="mt-2 p-3 bg-gray-50 rounded-lg border text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div><span className="font-medium">NIT:</span> {selectedSupplier.nit}</div>
            <div><span className="font-medium">Teléfono:</span> {selectedSupplier.phone}</div>
            <div><span className="font-medium">Email:</span> {selectedSupplier.email}</div>
            <div className="sm:col-span-2"><span className="font-medium">Dirección:</span> {selectedSupplier.address}</div>
          </div>
        </div>
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
    <div className="border rounded-lg p-4 bg-gray-50">
      <h3 className="font-semibold mb-3 text-sm">Agregar Productos</h3>

      {/* En mobile: stack vertical. En sm+: 2 columnas + fila de botón */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium mb-1">Producto</label>
          <select
            value={form.selectedProduct}
            onChange={(e) => onProductSelect(e.target.value)}
            className="w-full border rounded-lg px-3 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
          >
            <option value="">Seleccionar producto...</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.sku})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">Cantidad</label>
          <input
            type="number"
            min="1"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
            className="w-full border rounded-lg px-3 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">Costo Unitario</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.selectedProductCost}
            onChange={(e) => setForm({ ...form, selectedProductCost: Number(e.target.value) })}
            className="w-full border rounded-lg px-3 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <Button
            type="button"
            onClick={onAddItem}
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white text-sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Agregar producto
          </Button>
        </div>
      </div>

      {/* Tabla de items — scroll horizontal en mobile */}
      {form.items.length > 0 && (
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-xs min-w-[400px]">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-2 py-2 text-left">Producto</th>
                <th className="px-2 py-2 text-center">Cant.</th>
                <th className="px-2 py-2 text-center">Costo</th>
                <th className="px-2 py-2 text-center">Subtotal</th>
                <th className="px-2 py-2 text-center"></th>
              </tr>
            </thead>
            <tbody>
              {form.items.map((item, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-100">
                  <td className="px-2 py-2 max-w-[140px] truncate">{item.productName}</td>
                  <td className="px-2 py-2 text-center">{item.quantity}</td>
                  <td className="px-2 py-2 text-center">${Number(item.cost).toFixed(2)}</td>
                  <td className="px-2 py-2 text-center">${(Number(item.quantity) * Number(item.cost)).toFixed(2)}</td>
                  <td className="px-2 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => onRemoveItem(idx)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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
      {/* FIX: w-full mx-4 en mobile, max-w-2xl en desktop. pb-safe para notch iOS */}
      <DialogContent className="bg-white w-[calc(100%-2rem)] sm:max-w-2xl max-h-[92dvh] overflow-y-auto rounded-xl p-4 sm:p-6">
        <DialogHeader className="mb-1">
          <DialogTitle className="text-lg">Nueva Compra</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div>
            <label className="block text-sm font-medium mb-1">Número de Factura</label>
            <input
              type="text"
              value={form.invoiceNumber}
              onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })}
              className="w-full border rounded-lg px-3 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
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

          {/* FIX: botones apilados en mobile, en fila en desktop */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto h-11">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto h-11 bg-blue-700 hover:bg-blue-800 text-white">
              {loading ? "Creando..." : "Crear Compra"}
            </Button>
          </div>
        </form>
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
      <DialogContent className="bg-white w-[calc(100%-2rem)] sm:max-w-2xl max-h-[92dvh] overflow-y-auto rounded-xl p-4 sm:p-6">
        <DialogHeader className="mb-1">
          <DialogTitle className="text-lg">Editar Compra</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div>
            <label className="block text-sm font-medium mb-1">Número de Factura</label>
            <input
              type="text"
              value={form.invoiceNumber}
              onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })}
              className="w-full border rounded-lg px-3 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
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

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto h-11">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto h-11 bg-blue-700 hover:bg-blue-800 text-white">
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
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