"use client"

import { useEffect, useMemo, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Plus, Edit, Search, ChevronLeft, ChevronRight, User, Mail, Shield, Key, UserCog, UserCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import toast from "react-hot-toast"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"


const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://plasticoslc.com/api"

interface Role {
  id: string
  name: string
  description: string
}

interface UserRole {
  userId: string
  roleId: string
  role: Role
}

interface User {
  id: string
  name: string
  email: string
  roles?: UserRole[]
  createdAt: string
  updatedAt: string
  active: boolean
}

interface SimpleRole {
  id: string
  name: string
}

// Componente de tarjeta para mobile
function UserCard({ user, onEdit }: { user: User; onEdit: (user: User) => void }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{user.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{user.email}</p>
        </div>
      </div>

      {user.roles && user.roles.length > 0 && (
        <div>
          <p className="text-xs text-gray-500">Rol</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {user.roles.map((userRole) => (
              <span
                key={`${user.id}-${userRole.roleId}`}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
              >
                {userRole.role.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="pt-2 border-t">
        <button
          onClick={() => onEdit(user)}
          className="w-full flex items-center justify-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors text-blue-600 border border-blue-200"
        >
          <Edit className="h-4 w-4" />
          <span className="text-sm font-medium">Editar</span>
        </button>
      </div>
    </div>
  )
}

export default function UsuariosPage() {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<SimpleRole[]>([])
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    roleId: "",
  })

  const itemsPerPage = 10

  // Normalizador para búsqueda con tildes
  const normalize = (text: string) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")

  // Obtener usuarios
  const fetchUsers = async () => {
    setLoading(true)
    try {
      const token = sessionStorage.getItem("token")

      const res = await fetch(`${API_BASE}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (res.ok) {
        const data = await res.json()
        setUsers(Array.isArray(data) ? data : data.data || [])
      } else {
        setUsers([])
        toast.error("Error al cargar usuarios")
      }
    } catch (err) {
      console.error("Error fetching users:", err)
      setUsers([])
      toast.error("Error al cargar usuarios")
    } finally {
      setLoading(false)
    }
  }

  // Obtener roles
  const fetchRoles = async () => {
    try {
      const token = sessionStorage.getItem("token")

      const res = await fetch(`${API_BASE}/roles`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (res.ok) {
        const data = await res.json()
        setRoles(Array.isArray(data) ? data : data.data || [])
      } else {
        setRoles([])
      }
    } catch (err) {
      console.error("Error fetching roles:", err)
      setRoles([])
    }
  }

  useEffect(() => {
    fetchUsers()
    fetchRoles()
  }, [])

  // Resetear página al buscar
  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  // Filtro de búsqueda
  const filteredUsers = useMemo(() => {
    if (!Array.isArray(users)) return []

    const term = normalize(search)
    return users.filter(
      (u) =>
        normalize(u.name || "").includes(term) ||
        normalize(u.email || "").includes(term)
    )
  }, [users, search])

  // Paginación
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Crear o editar usuario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.name || !form.email || !form.roleId) {
      toast.error("Completa todos los campos obligatorios")
      return
    }

    if (!isEdit && !form.password) {
      toast.error("La contraseña es obligatoria")
      return
    }

    setLoading(true)

    const body: any = {
      name: form.name,
      email: form.email,
      roleIds: [form.roleId],
    }

    if (form.password) {
      body.password = form.password
    }

    try {
      const token = sessionStorage.getItem("token")

      const url =
        isEdit && selectedUserId
          ? `${API_BASE}/users/${selectedUserId}`
          : `${API_BASE}/users`

      const method = isEdit ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error("Error al guardar usuario")

      toast.success(isEdit ? "Usuario actualizado exitosamente" : "Usuario creado exitosamente")
      setIsModalOpen(false)
      setForm({ name: "", email: "", password: "", roleId: "" })
      fetchUsers()
    } catch (error) {
      console.error("Error guardando usuario:", error)
      toast.error("Error al guardar usuario")
    } finally {
      setLoading(false)
    }
  }

  const openCreate = () => {
    setIsEdit(false)
    setSelectedUserId(null)
    setForm({ name: "", email: "", password: "", roleId: "" })
    setIsModalOpen(true)
  }

  const openEdit = (user: User) => {
    setIsEdit(true)
    setSelectedUserId(user.id)
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      roleId: user.roles?.[0]?.roleId || "",
    })
    setIsModalOpen(true)
  }

  // Generar números de página
  const getPageNumbers = () => {
    const pages: Array<number | string> = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i)
        pages.push("ellipsis-end")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push("ellipsis-start")
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
      } else {
        pages.push(1)
        pages.push("ellipsis-start")
        pages.push(currentPage - 1)
        pages.push(currentPage)
        pages.push(currentPage + 1)
        pages.push("ellipsis-end")
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
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold">Usuarios</h1>
            <Button
              onClick={openCreate}
              className="bg-blue-700 hover:bg-blue-800 text-white flex items-center gap-2 w-full sm:w-auto"
            >
              <Plus className="h-5 w-5" />
              <span className="hidden sm:inline">Crear usuario</span>
              <span className="sm:hidden">Nuevo</span>
            </Button>
          </div>

          {/* Buscador */}
          <div className="bg-white p-4 rounded-lg mb-6">
            <div className="relative rounded-lg w-full">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar usuario..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full shadow-lg bg-white pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Cargando usuarios...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {search ? "No hay usuarios que coincidan con tu búsqueda" : "No hay usuarios registrados"}
              </p>
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
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Roles</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {paginatedUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex flex-wrap gap-1">
                              {user.roles?.map((userRole) => (
                                <span
                                  key={`${user.id}-${userRole.roleId}`}
                                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                                >
                                  {userRole.role.name}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <button
                              onClick={() => openEdit(user)}
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
                {paginatedUsers.map((user) => (
                  <UserCard key={user.id} user={user} onEdit={openEdit} />
                ))}
              </div>

              {/* Paginación */}
              {filteredUsers.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-600 text-center sm:text-left">
                      Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
                      {Math.min(currentPage * itemsPerPage, filteredUsers.length)} de {filteredUsers.length} usuarios
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>

                      <div className="flex items-center gap-1">
                        {getPageNumbers().map((pageNum, idx) =>
                          typeof pageNum === "string" ? (
                            <span key={pageNum} className="px-3 py-2 text-gray-500">
                              ...
                            </span>
                          ) : (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`min-w-[40px] px-3 py-2 rounded-lg font-medium transition-colors ${currentPage === pageNum ? "bg-blue-600 text-white" : "hover:bg-gray-100 text-gray-700"
                                }`}
                            >
                              {pageNum}
                            </button>
                          )
                        )}
                      </div>

                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
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
        </div>
      </main>
      <MobileBottomNav />
      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-white w-[calc(100%-1.5rem)] sm:max-w-xl max-h-[94dvh] overflow-hidden rounded-3xl p-0 border-none shadow-2xl flex flex-col">
          <div className={`px-6 py-5 ${isEdit ? 'bg-[hsl(209,79%,27%,0.05)]' : 'bg-[hsl(209,79%,27%,0.02)]'} border-b border-gray-100 flex items-center justify-between`}>
            <div>
              <DialogTitle className={`text-xl font-black ${isEdit ? 'text-[hsl(209,79%,20%)]' : 'text-[hsl(209,79%,27%)]'}`}>
                {isEdit ? "Editar Usuario" : "Nuevo Usuario"}
              </DialogTitle>
              <p className={`text-[11px] font-bold uppercase tracking-widest mt-0.5 ${isEdit ? 'text-[hsl(209,79%,40%)]' : 'text-gray-400'}`}>
                {isEdit ? `ID: ${selectedUserId?.split('-')[0]}...` : "Control de acceso y roles"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scrollbar-hide">
              {isEdit && (
                <div className="flex items-center gap-4 p-5 bg-[hsl(209,79%,27%,0.02)] rounded-2xl border border-[hsl(209,79%,27%,0.08)]">
                  <div className="w-14 h-14 rounded-full bg-[hsl(209,79%,27%)] flex items-center justify-center shrink-0 shadow-lg shadow-blue-900/10">
                    <UserCog className="text-white" size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 leading-tight truncate max-w-[200px]">{form.email}</h4>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-0.5">Perfil de usuario</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Nombre Completo</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[hsl(209,79%,27%)] transition-all outline-none text-sm font-medium"
                      placeholder="Juan Pérez"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Email / Usuario</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[hsl(209,79%,27%)] transition-all outline-none text-sm font-medium"
                      placeholder="juan@empresa.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                    {isEdit ? "Contraseña (Opcional)" : "Contraseña"}
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                      <Key size={18} />
                    </div>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[hsl(209,79%,27%)] transition-all outline-none text-sm font-medium"
                      placeholder="••••••••"
                      required={!isEdit}
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Rol Asignado</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                      <Shield size={18} />
                    </div>
                    <select
                      value={form.roleId}
                      onChange={(e) => setForm({ ...form, roleId: e.target.value })}
                      className="w-full h-12 pl-11 pr-10 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[hsl(209,79%,27%)] transition-all outline-none text-sm font-bold appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23a0aec0%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right:1rem_center] bg-no-repeat"
                      required
                    >
                      <option value="" disabled>Seleccionar un rol...</option>
                      {roles.map((r) => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50/80 backdrop-blur-md border-t border-gray-100 flex flex-col-reverse sm:flex-row gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 h-12 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className={`flex-[2] h-12 text-white font-black rounded-xl transition-all shadow-lg active:scale-[0.98] ${isEdit ? 'bg-[hsl(209,79%,20%)] hover:bg-[hsl(209,79%,25%)]' : 'bg-[hsl(209,79%,27%)] hover:bg-[hsl(209,79%,32%)]'
                  }`}
              >
                {loading ? "Procesando..." : isEdit ? "Guardar Cambios" : "Crear Usuario"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}