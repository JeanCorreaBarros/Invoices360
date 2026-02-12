"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { PlcLoader } from "@/components/plc-loader"

import { Plus, Search, Edit, Trash2, Power } from "lucide-react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog"
import toast from "react-hot-toast"

interface ProductCreateModalProps {
  onProductCreated: () => void
}

function ProductCreateModal({ onProductCreated }: ProductCreateModalProps) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: "", sku: "", price: "", stock: "" })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://plasticoslc.com/api/";
      const token = sessionStorage.getItem("token")
      const res = await fetch(`${apiBase}products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          sku: form.sku,
          price: Number(form.price),
          stock: Number(form.stock),
        }),
      })
      if (!res.ok) throw new Error("No se pudo crear el producto")
      const data = await res.json()
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
        <button className="flex items-center gap-2 bg-[hsl(209,79%,27%)] hover:scale-95 text-white px-4 py-2 rounded-lg font-medium transition-opacity">
          <Plus className="h-5 w-5" />
          Nuevo Producto
        </button>
      </DialogTrigger>
      <DialogContent className="bg-white ">
        <DialogHeader>
          <DialogTitle>Nuevo Producto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input name="name" value={form.name} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">SKU</label>
            <input name="sku" value={form.sku} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Precio</label>
            <input name="price" type="number" min="0" value={form.price} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock</label>
            <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <DialogFooter>
            <button type="submit" disabled={loading} className="bg-blue-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-800 disabled:opacity-50">
              {loading ? "Creando..." : "Crear"}
            </button>
            <DialogClose asChild>
              <button type="button" className="border px-4 py-2 rounded-lg font-medium">Cancelar</button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

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

interface ProductEditModalProps {
  product: Product | null
  onClose: () => void
  onProductUpdated: () => void
}

function ProductEditModal({ product, onClose, onProductUpdated }: ProductEditModalProps) {
  const [form, setForm] = useState({ name: "", sku: "", price: "", stock: "" })
  const [loading, setLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Cargar datos del producto cuando se abre el modal
  useEffect(() => {
    if (product) {
      // Pre-rellenar con los datos que ya tenemos del producto
      setForm({
        name: product.name,
        sku: product.sku,
        price: String(product.price),
        stock: String(product.stock),
      })
    }
  }, [product])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return
    setLoading(true)
    try {
      const token = sessionStorage.getItem("token")
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://plasticoslc.com/api/";
      const res = await fetch(`${apiBase}products/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          sku: form.sku,
          price: Number(form.price),
          stock: Number(form.stock),
        }),
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
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Editar Producto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input name="name" value={form.name} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">SKU</label>
            <input name="sku" value={form.sku} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Precio</label>
            <input name="price" type="number" min="0" value={form.price} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock</label>
            <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <DialogFooter>
            <button type="submit" disabled={loading} className="bg-blue-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-800 disabled:opacity-50">
              {loading ? "Actualizando..." : "Actualizar"}
            </button>
            <button type="button" onClick={onClose} className="border px-4 py-2 rounded-lg font-medium">
              Cancelar
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}



export default function ProductosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [page, setPage] = useState(1)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const ITEMS_PER_PAGE = 20

  // fetchProducts se define fuera del useEffect para poder reutilizarla
  const fetchProducts = async () => {
    setIsLoading(true)
    setError("")
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const token = sessionStorage.getItem("token")

      const response = await fetch(`${apiUrl}products`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Error al cargar productos")
      }

      const data = await response.json()
      setProducts(data)
    } catch (err) {
      console.error("Error fetching products:", err)
      setError("No se pudieron cargar los productos")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Resetear página al buscar
  useEffect(() => {
    setPage(1)
  }, [searchTerm])

  // Función para normalizar texto (quita tildes y pasa a minúsculas)
  function normalize(str: string) {
    return str.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase()
  }

  const filteredProducts = products.filter((product) => {
    const name = typeof product.name === "string" ? product.name : ""
    const sku = typeof product.sku === "string" ? product.sku : ""
    const search = normalize(searchTerm)
    return (
      normalize(name).includes(search) ||
      normalize(sku).includes(search)
    )
  })

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const paginatedProducts = filteredProducts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  return (
    <div className="min-h-screen bg-white">
      <DashboardHeader />

      <main className="px-4 lg:px-6 py-6 pb-24 lg:pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold ">Productos</h1>
            <ProductCreateModal onProductCreated={fetchProducts} />
          </div>

          {/* Search */}
          <div className="bg-white shadow-xl p-4 rounded-lg  mb-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative rounded-lg  w-full">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar producto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-bivoo-purple focus:outline-none text-sm sm:text-base"
                />
              </div>

            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-100 border border-red-300 text-red-800">
              {error}
            </div>
          )}

          {/* Loading */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <PlcLoader />
            </div>
          ) : (
            <>
              {/* Products Table */}
              <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                <div className={filteredProducts.length > 6 ? "max-h-[420px] overflow-y-auto" : undefined}>
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                          SKU
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                          Nombre
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                          Precio
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                          Stock
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedProducts.map((product, idx) => (
                        <tr key={product.id || `product-row-${idx}`} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">{product.sku}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{product.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">${typeof product.price === "number" ? product.price.toFixed(2) : "0.00"}</td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${product.stock > 100
                                ? "bg-green-100 text-green-800"
                                : product.stock > 0
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                                }`}
                            >
                              {product.stock} unidades
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${product.active
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                                }`}
                            >
                              {product.active ? "Activo" : "Inactivo"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setEditingProduct(product)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                              >
                                <Edit className="h-4 w-4" />
                              </button>

                              <button
                                className={`p-2 rounded-lg transition-colors ${product.active ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}
                                onClick={async () => {
                                  const action = product.active ? "deactivate" : "activate"
                                  try {
                                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}products/${product.id}/${action}`, {
                                      method: "PATCH",
                                      headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                                      },
                                    })
                                    if (!res.ok) throw new Error("No se pudo actualizar el estado")
                                    toast.success(product.active ? "Producto desactivado" : "Producto activado")
                                    fetchProducts()
                                  } catch (err: any) {
                                    toast.error(err.message || "Error al actualizar estado")
                                  }
                                }}
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
                </div>
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No se encontraron productos</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <ProductEditModal
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
        onProductUpdated={fetchProducts}
      />
    </div>
  )
}
