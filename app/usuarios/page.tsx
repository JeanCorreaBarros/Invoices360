"use client"

import { useEffect, useMemo, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://plasticoslc.com/api"

export default function UsuariosPage() {
  const [users, setUsers] = useState<any[]>([])
  const [roles, setRoles] = useState<any[]>([])
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

  const itemsPerPage = 5

  // -------- Normalizador para búsqueda con tildes ----------
  const normalize = (text: string) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")

  // -------- Obtener usuarios ----------
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
      }
    } catch (err) {
      console.error("Error fetching users:", err)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  // -------- Obtener roles ----------
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

  // -------- Filtro de búsqueda ----------
  const filteredUsers = useMemo(() => {
    if (!Array.isArray(users)) return []

    const term = normalize(search)
    return users.filter(
      (u) =>
        normalize(u.name || "").includes(term) ||
        normalize(u.email || "").includes(term)
    )
  }, [users, search])

  // -------- Paginación ----------
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // -------- Crear o editar usuario ----------
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)

    const body = {
      name: form.name,
      email: form.email,
      password: form.password,
      roleIds: [form.roleId],
    }

    try {
      const token = sessionStorage.getItem("token")

      const url =
        isEdit && selectedUserId
          ? `${API_BASE}/users/${selectedUserId}`
          : `${API_BASE}/users`

      const method = isEdit ? "PUT" : "POST"

      await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      setIsModalOpen(false)
      setForm({ name: "", email: "", password: "", roleId: "" })
      fetchUsers()
    } catch (error) {
      console.error("Error guardando usuario:", error)
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

  const openEdit = (user: any) => {
    setIsEdit(true)
    setSelectedUserId(user.id)
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      roleId: user.roles?.[0]?.id || "",
    })
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader />

      <main className="flex-1 p-6 max-w-6xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Usuarios</h1>
          <button
            onClick={openCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Crear usuario
          </button>
        </div>

        {/* Buscador */}
        <input
          type="text"
          placeholder="Buscar usuario..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded"
        />

        {/* Tabla */}
        <div className="border rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Nombre</th>
                <th className="p-3">Email</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="p-6 text-center">
                    Cargando...
                  </td>
                </tr>
              ) : paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-6 text-center text-gray-500">
                    Sin usuarios para mostrar
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">
                      <button
                        onClick={() => openEdit(user)}
                        className="text-blue-600"
                      >
                        ✏️ Editar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded ${
                  currentPage === i + 1 ? "bg-blue-600 text-white" : ""
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded w-full max-w-md space-y-4"
          >
            <h2 className="text-lg font-bold">
              {isEdit ? "Editar usuario" : "Crear usuario"}
            </h2>

            <input
              type="text"
              placeholder="Nombre"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="w-full p-2 border rounded"
              required={!isEdit}
            />

            <select
              value={form.roleId}
              onChange={(e) =>
                setForm({ ...form, roleId: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Seleccionar rol</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
