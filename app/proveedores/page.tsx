"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { useState, useEffect } from "react"
import { Plus, Edit, ChevronLeft, ChevronRight, Search, User, ShieldCheck, Mail, Phone, MapPin, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import toast from "react-hot-toast"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"

interface Supplier {
  id: string
  name: string
  nit: string
  email: string
  phone: string
  address: string
  active: boolean
  createdAt: string
  updatedAt: string
}

interface CreateModalState {
  name: string
  nit: string
  email: string
  phone: string
  address: string
}

const ITEMS_PER_PAGE = 10
const API_BASE = "https://plasticoslc.com/api"

function CreateSupplierModal({ isOpen, onClose, onSupplierCreated }: { isOpen: boolean; onClose: () => void; onSupplierCreated: () => void }) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<CreateModalState>({
    name: "",
    nit: "",
    email: "",
    phone: "",
    address: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.nit || !form.email || !form.phone || !form.address) {
      toast.error("Completa todos los campos")
      return
    }

    setLoading(true)
    try {
      const token = sessionStorage.getItem("token")
      const res = await fetch(`${API_BASE}/suppliers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error("Error al crear proveedor")
      toast.success("Proveedor creado exitosamente")
      onSupplierCreated()
      onClose()
      setForm({ name: "", nit: "", email: "", phone: "", address: "" })
    } catch (err: any) {
      toast.error(err.message || "Error al crear proveedor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white w-[calc(100%-1.5rem)] sm:max-w-xl max-h-[94dvh] overflow-hidden rounded-3xl p-0 border-none shadow-2xl flex flex-col">
        <div className="px-6 py-5 bg-[hsl(209,79%,27%,0.02)] border-b border-gray-100 flex items-center justify-between">
          <div>
            <DialogTitle className="text-xl font-black text-[hsl(209,79%,27%)]">Nuevo Proveedor</DialogTitle>
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Gestión de suministros</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scrollbar-hide">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2 space-y-1.5">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Nombre / Razón Social</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[hsl(209,79%,27%)] transition-all outline-none text-sm font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">NIT</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <ShieldCheck size={18} />
                  </div>
                  <input
                    type="text"
                    value={form.nit}
                    onChange={(e) => setForm({ ...form, nit: e.target.value })}
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[hsl(209,79%,27%)] transition-all outline-none text-sm font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Teléfono</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Phone size={18} />
                  </div>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[hsl(209,79%,27%)] transition-all outline-none text-sm font-medium"
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Email</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[hsl(209,79%,27%)] transition-all outline-none text-sm font-medium"
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Dirección</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <MapPin size={18} />
                  </div>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[hsl(209,79%,27%)] transition-all outline-none text-sm font-medium"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50/80 backdrop-blur-md border-t border-gray-100 flex flex-col-reverse sm:flex-row gap-3">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1 h-12 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-[2] h-12 bg-[hsl(209,79%,27%)] hover:bg-[hsl(209,79%,32%)] text-white font-black rounded-xl transition-all shadow-lg active:scale-[0.98]">
              {loading ? "Creando..." : "Crear Proveedor"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function EditSupplierModal({ isOpen, supplier, onClose, onSupplierUpdated }: { isOpen: boolean; supplier: Supplier | null; onClose: () => void; onSupplierUpdated: () => void }) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<CreateModalState>({
    name: "",
    nit: "",
    email: "",
    phone: "",
    address: "",
  })

  useEffect(() => {
    if (supplier) {
      setForm({
        name: supplier.name,
        nit: supplier.nit,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address,
      })
    }
  }, [supplier])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supplier) return
    if (!form.name || !form.nit || !form.email || !form.phone || !form.address) {
      toast.error("Completa todos los campos")
      return
    }

    setLoading(true)
    try {
      const token = sessionStorage.getItem("token")
      const res = await fetch(`${API_BASE}/suppliers/${supplier.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error("Error al actualizar proveedor")
      toast.success("Proveedor actualizado exitosamente")
      onSupplierUpdated()
      onClose()
    } catch (err: any) {
      toast.error(err.message || "Error al actualizar proveedor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white w-[calc(100%-1.5rem)] sm:max-w-xl max-h-[94dvh] overflow-hidden rounded-3xl p-0 border-none shadow-2xl flex flex-col">
        <div className="px-6 py-5 bg-[hsl(209,79%,27%,0.05)] border-b border-gray-100 flex items-center justify-between">
          <div>
            <DialogTitle className="text-xl font-black text-[hsl(209,79%,20%)]">Editar Proveedor</DialogTitle>
            <p className="text-[11px] text-[hsl(209,79%,40%)] font-bold uppercase tracking-widest mt-0.5">ID: {supplier?.id}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scrollbar-hide">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2 space-y-1.5">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Nombre / Razón Social</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[hsl(209,79%,27%)] transition-all outline-none text-sm font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">NIT</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <ShieldCheck size={18} />
                  </div>
                  <input
                    type="text"
                    value={form.nit}
                    onChange={(e) => setForm({ ...form, nit: e.target.value })}
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[hsl(209,79%,27%)] transition-all outline-none text-sm font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Teléfono</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Phone size={18} />
                  </div>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[hsl(209,79%,27%)] transition-all outline-none text-sm font-medium"
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Email</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[hsl(209,79%,27%)] transition-all outline-none text-sm font-medium"
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Dirección</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <MapPin size={18} />
                  </div>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[hsl(209,79%,27%)] transition-all outline-none text-sm font-medium"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50/80 backdrop-blur-md border-t border-gray-100 flex flex-col-reverse sm:flex-row gap-3">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1 h-12 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-[2] h-12 bg-[hsl(209,79%,20%)] hover:bg-[hsl(209,79%,25%)] text-white font-black rounded-xl transition-all shadow-lg active:scale-[0.98]">
              {loading ? "Actualizando..." : "Actualizar Proveedor"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Componente de tarjeta para mobile
function SupplierCard({ supplier, onEdit }: { supplier: Supplier; onEdit: (supplier: Supplier) => void }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{supplier.name}</h3>
          <p className="text-sm text-gray-500 mt-1">NIT: {supplier.nit}</p>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${supplier.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
            }`}
        >
          {supplier.active ? "Activo" : "Inactivo"}
        </span>
      </div>

      <div className="space-y-2">
        <div>
          <p className="text-xs text-gray-500">Email</p>
          <p className="text-sm text-gray-900">{supplier.email}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Teléfono</p>
          <p className="text-sm text-gray-900">{supplier.phone}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Dirección</p>
          <p className="text-sm text-gray-900">{supplier.address}</p>
        </div>
      </div>

      <div className="pt-2 border-t">
        <button
          onClick={() => onEdit(supplier)}
          className="w-full flex items-center justify-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors text-blue-600 border border-blue-200"
        >
          <Edit className="h-4 w-4" />
          <span className="text-sm font-medium">Editar</span>
        </button>
      </div>
    </div>
  )
}

export default function ProveedoresPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchSuppliers = async () => {
    setLoading(true)
    try {
      const token = sessionStorage.getItem("token")
      const res = await fetch(`${API_BASE}/suppliers`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      if (res.ok) {
        const data = await res.json()
        setSuppliers(Array.isArray(data) ? data : data.data || [])
      }
    } catch (err) {
      console.error("Error fetching suppliers:", err)
      toast.error("Error al cargar proveedores")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSuppliers()
  }, [])

  useEffect(() => {
    setPage(1)
  }, [searchTerm])

  function normalize(str: string) {
    return str.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase()
  }

  const filteredSuppliers = suppliers.filter((supplier) => {
    const search = normalize(searchTerm)
    return (
      normalize(supplier.name).includes(search) ||
      normalize(supplier.nit).includes(search) ||
      normalize(supplier.email).includes(search) ||
      normalize(supplier.phone).includes(search) ||
      normalize(supplier.address).includes(search)
    )
  })

  const totalPages = Math.ceil(filteredSuppliers.length / ITEMS_PER_PAGE)
  const paginatedSuppliers = filteredSuppliers.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const handleEditClick = (supplier: Supplier) => {
    setSelectedSupplier(supplier)
    setIsEditModalOpen(true)
  }

  // Generar números de página para mostrar
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i)
        pages.push("...")
        pages.push(totalPages)
      } else if (page >= totalPages - 2) {
        pages.push(1)
        pages.push("...")
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
      } else {
        pages.push(1)
        pages.push("...")
        pages.push(page - 1)
        pages.push(page)
        pages.push(page + 1)
        pages.push("...")
        pages.push(totalPages)
      }
    }

    return pages
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <DashboardHeader />
      <main className="flex-1 p-4 lg:p-6 pb-24 lg:pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold">Proveedores</h1>
            <Button onClick={() => setIsCreateModalOpen(true)} className="bg-blue-700 hover:bg-blue-800 text-white flex items-center gap-2 w-full sm:w-auto">
              <Plus className="h-5 w-5" />
              <span className="hidden sm:inline">Nuevo Proveedor</span>
              <span className="sm:hidden">Nuevo</span>
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Cargando proveedores...</p>
            </div>
          ) : suppliers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay proveedores registrados</p>
            </div>
          ) : (
            <>
              {/* Search */}
              <div className="bg-white p-4 rounded-lg mb-6">
                <div className="relative rounded-lg w-full">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar proveedor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full shadow-lg bg-white pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
                  />
                </div>
              </div>

              {filteredSuppliers.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No hay proveedores que coincidan con tu búsqueda</p>
                </div>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden md:block bg-white rounded-lg shadow-xl overflow-hidden mb-6">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nombre</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">NIT</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Teléfono</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Dirección</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Estado</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {paginatedSuppliers.map((supplier) => (
                            <tr key={supplier.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 font-medium text-gray-900">{supplier.name}</td>
                              <td className="px-6 py-4 text-sm text-gray-700">{supplier.nit}</td>
                              <td className="px-6 py-4 text-sm text-gray-700">{supplier.email}</td>
                              <td className="px-6 py-4 text-sm text-gray-700">{supplier.phone}</td>
                              <td className="px-6 py-4 text-sm text-gray-700">{supplier.address}</td>
                              <td className="px-6 py-4 text-sm">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${supplier.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                    }`}
                                >
                                  {supplier.active ? "Activo" : "Inactivo"}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <button
                                  onClick={() => handleEditClick(supplier)}
                                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
                                >
                                  <Edit className="h-4 w-4" />
                                  Editar
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
                    {paginatedSuppliers.map((supplier) => (
                      <SupplierCard key={supplier.id} supplier={supplier} onEdit={handleEditClick} />
                    ))}
                  </div>

                  {/* Paginación */}
                  {filteredSuppliers.length > 0 && (
                    <div className="bg-white rounded-lg shadow-lg p-4">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-gray-600 text-center sm:text-left">
                          Mostrando {(page - 1) * ITEMS_PER_PAGE + 1} a{" "}
                          {Math.min(page * ITEMS_PER_PAGE, filteredSuppliers.length)} de {filteredSuppliers.length} proveedores
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                            className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>

                          <div className="flex items-center gap-1">
                            {getPageNumbers().map((pageNum, idx) =>
                              pageNum === "..." ? (
                                <span key={`ellipsis-${idx}`} className="px-3 py-2 text-gray-500">
                                  ...
                                </span>
                              ) : (
                                <button
                                  key={pageNum}
                                  onClick={() => setPage(pageNum as number)}
                                  className={`min-w-[40px] px-3 py-2 rounded-lg font-medium transition-colors ${page === pageNum ? "bg-blue-600 text-white" : "hover:bg-gray-100 text-gray-700"
                                    }`}
                                >
                                  {pageNum}
                                </button>
                              )
                            )}
                          </div>

                          <button
                            onClick={() => setPage(page + 1)}
                            disabled={page === totalPages}
                            className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </main>
      <MobileBottomNav />
      <CreateSupplierModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSupplierCreated={fetchSuppliers} />
      <EditSupplierModal isOpen={isEditModalOpen} supplier={selectedSupplier} onClose={() => setIsEditModalOpen(false)} onSupplierUpdated={fetchSuppliers} />
    </div>
  )
}