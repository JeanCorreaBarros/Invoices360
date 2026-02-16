"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { PlcLoader } from "@/components/plc-loader"
import { Plus, Search, Edit, Power, ChevronLeft, ChevronRight, Package, AlertTriangle, CheckCircle, XCircle, X, Tag, DollarSign, Layers } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogFooter, DialogClose, DialogTrigger,
} from "@/components/ui/dialog"
import toast from "react-hot-toast"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"


/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
interface Product {
  id: string
  name: string
  sku: string
  type: string
  description: string | null
  price: number
  stock: number
  active: boolean
  createdAt: string
  updatedAt: string
}

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function fmt(n: number) {
  return n.toLocaleString("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function normalize(str: string) {
  return str.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase()
}

function StockBadge({ stock }: { stock: number }) {
  if (stock > 100)
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700"><CheckCircle size={11} />{stock} uds</span>
  if (stock > 0)
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700"><AlertTriangle size={11} />{stock} uds</span>
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700"><XCircle size={11} />Sin stock</span>
}

function StatusBadge({ active }: { active: boolean }) {
  return active
    ? <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">Activo</span>
    : <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">Inactivo</span>
}

/* ─────────────────────────────────────────────
   FORM FIELDS SHARED
───────────────────────────────────────────── */
const fieldClass = "w-full h-11 border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"

/* ─────────────────────────────────────────────
   CREATE MODAL
───────────────────────────────────────────── */
function ProductCreateModal({ onProductCreated }: { onProductCreated: () => void }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: "", sku: "", price: "", stock: "" })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://plasticoslc.com/api/"
      const token = sessionStorage.getItem("token")
      const res = await fetch(`${apiBase}products`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: form.name, sku: form.sku, price: Number(form.price), stock: Number(form.stock) }),
      })
      if (!res.ok) throw new Error("No se pudo crear el producto")
      toast.success("Producto creado exitosamente")
      onProductCreated()
      setForm({ name: "", sku: "", price: "", stock: "" })
      setOpen(false)
    } catch (err: any) {
      toast.error(err.message || "Error al crear producto")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 bg-[hsl(209,79%,27%)] hover:bg-[hsl(209,79%,22%)] active:scale-95 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md shadow-blue-900/20">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nuevo Producto</span>
          <span className="sm:hidden">Nuevo</span>
        </button>
      </DialogTrigger>
      <DialogContent className="bg-white w-[calc(100%-1.5rem)] sm:max-w-xl max-h-[94dvh] overflow-hidden rounded-3xl p-0 border-none shadow-2xl flex flex-col">
        <div className="px-6 py-5 bg-[hsl(209,79%,27%,0.02)] border-b border-gray-100 flex items-center justify-between">
          <div>
            <DialogTitle className="text-xl font-black text-[hsl(209,79%,27%)]">Nuevo Producto</DialogTitle>
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Gestión de catálogo</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-8 scrollbar-hide">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-1.5">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Nombre del Producto</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Package size={18} />
                  </div>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[hsl(209,79%,27%)] transition-all outline-none text-sm font-medium"
                    placeholder="Ej: Camiseta básica negra"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">SKU / Referencia</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Tag size={18} />
                  </div>
                  <input
                    name="sku"
                    value={form.sku}
                    onChange={handleChange}
                    required
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[hsl(209,79%,27%)] transition-all outline-none text-sm font-medium"
                    placeholder="TSH-001"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Precio de Venta</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[hsl(209,79%,27%)] font-bold">
                    $
                  </div>
                  <input
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={handleChange}
                    required
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[hsl(209,79%,27%)] transition-all outline-none text-sm font-bold text-gray-900"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Stock Inicial</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Layers size={18} />
                  </div>
                  <input
                    name="stock"
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={handleChange}
                    required
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[hsl(209,79%,27%)] transition-all outline-none text-sm font-medium"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50/80 backdrop-blur-md border-t border-gray-100 flex flex-col-reverse sm:flex-row gap-3">
            <DialogClose asChild>
              <button
                type="button"
                className="flex-1 h-12 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
              >
                Cancelar
              </button>
            </DialogClose>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] h-12 bg-[hsl(209,79%,27%)] hover:bg-[hsl(209,79%,32%)] text-white font-black rounded-xl transition-all shadow-lg shadow-blue-900/10 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Creando producto..." : "Crear Producto"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

/* ─────────────────────────────────────────────
   EDIT MODAL
───────────────────────────────────────────── */
function ProductEditModal({ product, onClose, onProductUpdated }: {
  product: Product | null
  onClose: () => void
  onProductUpdated: () => void
}) {
  const [form, setForm] = useState({ name: "", sku: "", price: "", stock: "" })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (product)
      setForm({ name: product.name, sku: product.sku, price: String(product.price), stock: String(product.stock) })
  }, [product])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return
    setLoading(true)
    try {
      const token = sessionStorage.getItem("token")
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://plasticoslc.com/api/"
      const res = await fetch(`${apiBase}products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: form.name, sku: form.sku, price: Number(form.price), stock: Number(form.stock) }),
      })
      if (!res.ok) throw new Error("No se pudo actualizar el producto")
      toast.success("Producto actualizado exitosamente")
      onProductUpdated()
      onClose()
    } catch (err: any) {
      toast.error(err.message || "Error al actualizar producto")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={!!product} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white w-[calc(100%-1.5rem)] sm:max-w-xl max-h-[94dvh] overflow-hidden rounded-3xl p-0 border-none shadow-2xl flex flex-col">
        <div className="px-6 py-5 bg-[hsl(209,79%,27%,0.05)] border-b border-gray-100 flex items-center justify-between">
          <div>
            <DialogTitle className="text-xl font-black text-[hsl(209,79%,20%)]">Editar Producto</DialogTitle>
            <p className="text-[11px] text-[hsl(209,79%,40%)] font-bold uppercase tracking-widest mt-0.5">ID: {product?.id}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-8 scrollbar-hide">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-1.5">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Nombre del Producto</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Package size={18} />
                  </div>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[hsl(209,79%,27%)] transition-all outline-none text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">SKU / Referencia</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Tag size={18} />
                  </div>
                  <input
                    name="sku"
                    value={form.sku}
                    onChange={handleChange}
                    required
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[hsl(209,79%,27%)] transition-all outline-none text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Precio de Venta</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[hsl(209,79%,27%)] font-bold">
                    $
                  </div>
                  <input
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={handleChange}
                    required
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[hsl(209,79%,27%)] transition-all outline-none text-sm font-bold text-gray-900"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Stock Actual</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Layers size={18} />
                  </div>
                  <input
                    name="stock"
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={handleChange}
                    required
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[hsl(209,79%,27%)] transition-all outline-none text-sm font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50/80 backdrop-blur-md border-t border-gray-100 flex flex-col-reverse sm:flex-row gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-12 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] h-12 bg-[hsl(209,79%,20%)] hover:bg-[hsl(209,79%,25%)] text-white font-black rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Guardando cambios..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

/* ─────────────────────────────────────────────
   MOBILE CARD
───────────────────────────────────────────── */
function ProductCard({ product, onEdit, onToggleStatus, index }: {
  product: Product
  onEdit: (p: Product) => void
  onToggleStatus: (p: Product) => void
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.2 }}
      className="bg-white rounded-2xl shadow-sm border-0 overflow-hidden"
    >
      {/* color accent bar */}
      <div className={`h-1 ${product.active ? "bg-gradient-to-r from-blue-500 to-blue-600" : "bg-gray-200"}`} />

      <div className="p-4 space-y-3">
        {/* Top row */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-bold text-gray-900 text-sm leading-snug truncate">{product.name}</p>
            <p className="text-xs text-gray-400 mt-0.5 font-mono">{product.sku}</p>
          </div>
          <StatusBadge active={product.active} />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-50 rounded-xl p-2.5">
            <p className="text-xs text-gray-400 mb-0.5">Precio</p>
            <p className="text-sm font-bold text-gray-900">${fmt(product.price)}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-2.5">
            <p className="text-xs text-gray-400 mb-0.5">Stock</p>
            <StockBadge stock={product.stock} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 flex items-center justify-center gap-1.5 h-10 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 active:scale-95 text-xs font-semibold transition-all"
          >
            <Edit size={14} /> Editar
          </button>
          <button
            onClick={() => onToggleStatus(product)}
            className={`flex-1 flex items-center justify-center gap-1.5 h-10 rounded-xl text-xs font-semibold active:scale-95 transition-all ${product.active
              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            <Power size={14} />
            {product.active ? "Desactivar" : "Activar"}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   PAGINATION
───────────────────────────────────────────── */
function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  const pages: (number | string)[] = []
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else if (page <= 3) {
    pages.push(1, 2, 3, 4, "...", totalPages)
  } else if (page >= totalPages - 2) {
    pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
  } else {
    pages.push(1, "...", page - 1, page, page + 1, "...", totalPages)
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`e-${i}`} className="px-2 text-gray-400 text-sm">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p as number)}
            className={`min-w-[36px] h-9 px-2 rounded-xl text-sm font-semibold transition-colors ${page === p
              ? "bg-[hsl(209,79%,27%)] text-white shadow-sm"
              : "hover:bg-gray-100 text-gray-600"
              }`}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function ProductosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [page, setPage] = useState(1)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const ITEMS_PER_PAGE = 10

  const fetchProducts = async () => {
    setIsLoading(true)
    setError("")
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const token = sessionStorage.getItem("token")
      const response = await fetch(`${apiUrl}products`, {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error("Error al cargar productos")
      setProducts(await response.json())
    } catch (err) {
      setError("No se pudieron cargar los productos")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])
  useEffect(() => { setPage(1) }, [searchTerm])

  const filteredProducts = products.filter((p) => {
    const s = normalize(searchTerm)
    return normalize(p.name || "").includes(s) || normalize(p.sku || "").includes(s)
  })

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE))
  const paginatedProducts = filteredProducts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const handleToggleStatus = async (product: Product) => {
    const action = product.active ? "deactivate" : "activate"
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}products/${product.id}/${action}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      })
      if (!res.ok) throw new Error("No se pudo actualizar el estado")
      toast.success(product.active ? "Producto desactivado" : "Producto activado")
      fetchProducts()
    } catch (err: any) {
      toast.error(err.message || "Error al actualizar estado")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="px-4 lg:px-8 py-6 pb-24 lg:pb-8 max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {isLoading ? "Cargando…" : `${filteredProducts.length} producto${filteredProducts.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <ProductCreateModal onProductCreated={fetchProducts} />
        </div>

        {/* ── Search ── */}
        <div className="relative mb-5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o SKU…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 bg-white pl-10 pr-4 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-sm transition-all"
          />
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
            <XCircle size={16} /> {error}
          </div>
        )}

        {/* ── Loading ── */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <PlcLoader />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={searchTerm + page}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
            >
              {/* ════ DESKTOP TABLE ════ */}
              <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-hidden mb-5">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/80">
                      {["SKU", "Nombre", "Precio", "Stock", "Estado", "Acciones"].map((h) => (
                        <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paginatedProducts.map((product, idx) => (
                      <tr
                        key={product.id || `row-${idx}`}
                        className="hover:bg-blue-50/30 transition-colors group"
                      >
                        <td className="px-5 py-4 text-xs font-mono text-gray-500">{product.sku}</td>
                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                        </td>
                        <td className="px-5 py-4 text-sm font-bold text-gray-900">
                          ${fmt(typeof product.price === "number" ? product.price : 0)}
                        </td>
                        <td className="px-5 py-4">
                          <StockBadge stock={product.stock} />
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge active={product.active} />
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setEditingProduct(product)}
                              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(product)}
                              className={`p-2 rounded-lg transition-colors ${product.active
                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                }`}
                              title={product.active ? "Desactivar" : "Activar"}
                            >
                              <Power className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {paginatedProducts.length === 0 && (
                  <div className="py-16 text-center">
                    <Package size={40} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-400">No se encontraron productos</p>
                  </div>
                )}
              </div>

              {/* ════ MOBILE CARDS ════ */}
              <div className="md:hidden space-y-3 mb-5">
                {paginatedProducts.length === 0 ? (
                  <div className="py-16 text-center">
                    <Package size={40} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-400">No se encontraron productos</p>
                  </div>
                ) : (
                  paginatedProducts.map((product, i) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onEdit={setEditingProduct}
                      onToggleStatus={handleToggleStatus}
                      index={i}
                    />
                  ))
                )}
              </div>

              {/* ════ PAGINATION ════ */}
              {filteredProducts.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <p className="text-xs text-gray-400 order-2 sm:order-1">
                    Mostrando{" "}
                    <span className="font-semibold text-gray-700">
                      {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filteredProducts.length)}
                    </span>{" "}
                    de{" "}
                    <span className="font-semibold text-gray-700">{filteredProducts.length}</span>
                  </p>
                  <div className="order-1 sm:order-2">
                    <Pagination page={page} totalPages={totalPages} onChange={setPage} />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>
      <MobileBottomNav />
      <ProductEditModal
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
        onProductUpdated={fetchProducts}
      />
    </div>
  )
}