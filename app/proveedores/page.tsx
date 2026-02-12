"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { useState, useEffect } from "react"
import { Plus, Edit, ChevronLeft, ChevronRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import toast from "react-hot-toast"

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
      <DialogContent className="bg-white max-w-md">
        <DialogHeader>
          <DialogTitle>Nuevo Proveedor</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">NIT</label>
            <input
              type="text"
              value={form.nit}
              onChange={(e) => setForm({ ...form, nit: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Teléfono</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Dirección</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-700 hover:bg-blue-800 text-white">
              {loading ? "Creando..." : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function EditSupplierModal({ isOpen, supplier, onClose, onSupplierUpdated }: { isOpen: boolean; supplier: Supplier | null; onClose: () => void; onSupplierUpdated: () => void }) {
  const [loading, setLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(false)
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
      <DialogContent className="bg-white max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Proveedor</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">NIT</label>
            <input
              type="text"
              value={form.nit}
              onChange={(e) => setForm({ ...form, nit: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Teléfono</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Dirección</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-700 hover:bg-blue-800 text-white">
              {loading ? "Actualizando..." : "Actualizar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
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

  // Resetear página al buscar
  useEffect(() => {
    setPage(1)
  }, [searchTerm])

  // Función para normalizar texto (quita tildes y pasa a minúsculas)
  function normalize(str: string) {
    return str.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase()
  }

  // Filtrar proveedores basados en búsqueda
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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <DashboardHeader />
      <main className="flex-1 p-4 lg:p-6 pb-24 lg:pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Proveedores</h1>
            <Button onClick={() => setIsCreateModalOpen(true)} className="bg-blue-700 hover:bg-blue-800 text-white flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Nuevo Proveedor
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
              <div className="bg-white shadow-xl p-4 rounded-lg mb-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="relative rounded-lg w-full">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Buscar proveedor..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-white pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-bivoo-purple focus:outline-none text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>

              {filteredSuppliers.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No hay proveedores que coincidan con tu búsqueda</p>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Nombre</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">NIT</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Teléfono</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Dirección</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Estado</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {paginatedSuppliers.map((supplier) => (
                        <tr key={supplier.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium">{supplier.name}</td>
                          <td className="px-6 py-4 text-sm">{supplier.nit}</td>
                          <td className="px-6 py-4 text-sm">{supplier.email}</td>
                          <td className="px-6 py-4 text-sm">{supplier.phone}</td>
                          <td className="px-6 py-4 text-sm">{supplier.address}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${supplier.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                              {supplier.active ? "Activo" : "Inactivo"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <button
                              onClick={() => handleEditClick(supplier)}
                              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
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
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-gray-500">
                    Mostrando {(page - 1) * ITEMS_PER_PAGE + 1} a {Math.min(page * ITEMS_PER_PAGE, filteredSuppliers.length)} de {filteredSuppliers.length} proveedores
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="flex items-center gap-1"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Anterior
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <Button
                          key={p}
                          variant={page === p ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPage(p)}
                        >
                          {p}
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="flex items-center gap-1"
                    >
                      Siguiente
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <CreateSupplierModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSupplierCreated={fetchSuppliers} />
      <EditSupplierModal isOpen={isEditModalOpen} supplier={selectedSupplier} onClose={() => setIsEditModalOpen(false)} onSupplierUpdated={fetchSuppliers} />
    </div>
  )
}
