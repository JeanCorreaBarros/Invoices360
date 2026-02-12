"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { useState, useEffect } from "react"
import { Plus, Trash2, X, Edit2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import toast from "react-hot-toast"

interface Product {
  id: string
  name: string
  sku: string
  price: number
  stock: number
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
  supplierName: string
  supplierNit: string
  invoiceNumber: string
  items: PurchaseItem[]
  selectedProduct: string
  selectedProductCost: number
  quantity: number
}

function CreatePurchaseModal({ isOpen, onClose, onPurchaseCreated }: { isOpen: boolean; onClose: () => void; onPurchaseCreated: () => void }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<CreateModalState>({
    supplierName: "",
    supplierNit: "",
    invoiceNumber: "",
    items: [],
    selectedProduct: "",
    selectedProductCost: 0,
    quantity: 1,
  })
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://plasticoslc.com/api/";


  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = sessionStorage.getItem("token")

        const res = await fetch(`${apiBase}/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        if (res.ok) {
          const data = await res.json()
          setProducts(data)
        }
      } catch (err) {
        console.error("Error fetching products:", err)
      }
    }
    if (isOpen) {
      fetchProducts()
    }
  }, [isOpen])

  const handleAddItem = () => {
    if (!form.selectedProduct) {
      toast.error("Selecciona un producto")
      return
    }
    if (form.quantity <= 0) {
      toast.error("La cantidad debe ser mayor a 0")
      return
    }

    const product = products.find((p) => p.id === form.selectedProduct)
    if (!product) return

    const newItem: PurchaseItem = {
      productId: form.selectedProduct,
      productName: product.name,
      quantity: form.quantity,
      cost: form.selectedProductCost,
    }

    setForm({
      ...form,
      items: [...form.items, newItem],
      selectedProduct: "",
      selectedProductCost: 0,
      quantity: 1,
    })
  }

  const handleRemoveItem = (index: number) => {
    setForm({
      ...form,
      items: form.items.filter((_, i) => i !== index),
    })
  }

  const handleProductSelect = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    setForm({
      ...form,
      selectedProduct: productId,
      selectedProductCost: product?.price || 0,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.supplierName || !form.supplierNit || !form.invoiceNumber) {
      toast.error("Completa todos los campos del proveedor")
      return
    }
    if (form.items.length === 0) {
      toast.error("Agrega al menos un producto")
      return
    }

    setLoading(true)
    try {
      const token = sessionStorage.getItem("token")
      const res = await fetch(`${apiBase}/purchases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          supplierName: form.supplierName,
          supplierNit: form.supplierNit,
          invoiceNumber: form.invoiceNumber,
          items: form.items,
        }),
      })

      if (!res.ok) throw new Error("Error al crear compra")
      toast.success("Compra creada exitosamente")
      onPurchaseCreated()
      onClose()
      setForm({
        supplierName: "",
        supplierNit: "",
        invoiceNumber: "",
        items: [],
        selectedProduct: "",
        selectedProductCost: 0,
        quantity: 1,
      })
    } catch (err: any) {
      toast.error(err.message || "Error al crear compra")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva Compra</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Supplier Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre Proveedor</label>
              <input
                type="text"
                value={form.supplierName}
                onChange={(e) => setForm({ ...form, supplierName: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">NIT Proveedor</label>
              <input
                type="text"
                value={form.supplierNit}
                onChange={(e) => setForm({ ...form, supplierNit: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Número de Factura</label>
            <input
              type="text"
              value={form.invoiceNumber}
              onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          {/* Add Items Section */}
          <div className="border rounded p-4 bg-gray-50">
            <h3 className="font-semibold mb-3">Agregar Productos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-3">
              <div>
                <label className="block text-xs font-medium mb-1">Producto</label>
                <select
                  value={form.selectedProduct}
                  onChange={(e) => handleProductSelect(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm"
                >
                  <option value="">Seleccionar...</option>
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
                  className="w-full border rounded px-3 py-2 text-sm"
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
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  onClick={handleAddItem}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Agregar
                </Button>
              </div>
            </div>

            {/* Items List */}
            {form.items.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-2 py-1 text-left">Producto</th>
                      <th className="px-2 py-1 text-center">Cantidad</th>
                      <th className="px-2 py-1 text-center">Costo Unit.</th>
                      <th className="px-2 py-1 text-center">Subtotal</th>
                      <th className="px-2 py-1 text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.items.map((item, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-100">
                        <td className="px-2 py-1">{item.productName}</td>
                        <td className="px-2 py-1 text-center">{item.quantity}</td>
                        <td className="px-2 py-1 text-center">${item.cost.toFixed(2)}</td>
                        <td className="px-2 py-1 text-center">${(item.quantity * item.cost).toFixed(2)}</td>
                        <td className="px-2 py-1 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="text-red-600 hover:text-red-800"
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-700 hover:bg-blue-800 text-white">
              {loading ? "Creando..." : "Crear Compra"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function EditPurchaseModal({ isOpen, purchase, onClose, onPurchaseUpdated }: { isOpen: boolean; purchase: Purchase | null; onClose: () => void; onPurchaseUpdated: () => void }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<CreateModalState>({
    supplierName: "",
    supplierNit: "",
    invoiceNumber: "",
    items: [],
    selectedProduct: "",
    selectedProductCost: 0,
    quantity: 1,
  })
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://plasticoslc.com/api"

  // Cargar datos del modal cuando se abre
  useEffect(() => {
    if (isOpen && purchase) {
      setForm({
        supplierName: purchase.supplierName,
        supplierNit: purchase.supplierNit,
        invoiceNumber: purchase.invoiceNumber,
        items: purchase.items || purchase.details?.map((d: PurchaseDetail) => ({
          productId: d.productId,
          productName: d.product?.name || '',
          quantity: Number(d.quantity),
          cost: Number(d.cost),
        })) || [],
        selectedProduct: "",
        selectedProductCost: 0,
        quantity: 1,
      })
    }
  }, [isOpen, purchase])

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = sessionStorage.getItem("token")
        const res = await fetch(`${apiBase}/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        if (res.ok) {
          const data = await res.json()
          setProducts(data)
        }
      } catch (err) {
        console.error("Error fetching products:", err)
      }
    }
    if (isOpen) {
      fetchProducts()
    }
  }, [isOpen, apiBase])

  const handleAddItem = () => {
    if (!form.selectedProduct) {
      toast.error("Selecciona un producto")
      return
    }
    if (form.quantity <= 0) {
      toast.error("La cantidad debe ser mayor a 0")
      return
    }

    const product = products.find((p) => p.id === form.selectedProduct)
    if (!product) return

    const newItem: PurchaseItem = {
      productId: form.selectedProduct,
      productName: product.name,
      quantity: form.quantity,
      cost: form.selectedProductCost,
    }

    setForm({
      ...form,
      items: [...form.items, newItem],
      selectedProduct: "",
      selectedProductCost: 0,
      quantity: 1,
    })
  }

  const handleRemoveItem = (index: number) => {
    setForm({
      ...form,
      items: form.items.filter((_, i) => i !== index),
    })
  }

  const handleProductSelect = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    setForm({
      ...form,
      selectedProduct: productId,
      selectedProductCost: product?.price || 0,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!purchase) return

    if (!form.supplierName || !form.supplierNit || !form.invoiceNumber) {
      toast.error("Completa todos los campos del proveedor")
      return
    }
    if (form.items.length === 0) {
      toast.error("Agrega al menos un producto")
      return
    }

    setLoading(true)
    try {
      const token = sessionStorage.getItem("token")
      const res = await fetch(`${apiBase}/purchases/${purchase.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          supplierName: form.supplierName,
          supplierNit: form.supplierNit,
          invoiceNumber: form.invoiceNumber,
          items: form.items,
        }),
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
      <DialogContent className="bg-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Compra</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Supplier Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre Proveedor</label>
              <input
                type="text"
                value={form.supplierName}
                onChange={(e) => setForm({ ...form, supplierName: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">NIT Proveedor</label>
              <input
                type="text"
                value={form.supplierNit}
                onChange={(e) => setForm({ ...form, supplierNit: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Número de Factura</label>
            <input
              type="text"
              value={form.invoiceNumber}
              onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          {/* Add Items Section */}
          <div className="border rounded p-4 bg-gray-50">
            <h3 className="font-semibold mb-3">Productos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-3">
              <div>
                <label className="block text-xs font-medium mb-1">Producto</label>
                <select
                  value={form.selectedProduct}
                  onChange={(e) => handleProductSelect(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm"
                >
                  <option value="">Seleccionar...</option>
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
                  className="w-full border rounded px-3 py-2 text-sm"
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
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  onClick={handleAddItem}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Agregar
                </Button>
              </div>
            </div>

            {/* Items List */}
            {form.items.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-2 py-1 text-left">Producto</th>
                      <th className="px-2 py-1 text-center">Cantidad</th>
                      <th className="px-2 py-1 text-center">Costo Unit.</th>
                      <th className="px-2 py-1 text-center">Subtotal</th>
                      <th className="px-2 py-1 text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.items.map((item, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-100">
                        <td className="px-2 py-1">{item.productName}</td>
                        <td className="px-2 py-1 text-center">{item.quantity}</td>
                        <td className="px-2 py-1 text-center">${Number(item.cost).toFixed(2)}</td>
                        <td className="px-2 py-1 text-center">${(Number(item.quantity) * Number(item.cost)).toFixed(2)}</td>
                        <td className="px-2 py-1 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="text-red-600 hover:text-red-800"
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-700 hover:bg-blue-800 text-white">
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function ComprasPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://plasticoslc.com/api"

  // Función para normalizar texto (elimina acentos y convierte a minúsculas)
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Elimina los acentos
  }

  const fetchPurchases = async () => {
    setLoading(true)
    try {
      const token = sessionStorage.getItem("token")
      const res = await fetch(`${apiBase}/purchases`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      if (res.ok) {
        const data = await res.json()
        const purchasesData = Array.isArray(data) ? data : data.data || []
        
        // Transformar details a items para compatibilidad con la tabla
        const purchasesWithItems = purchasesData.map((purchase: any) => ({
          ...purchase,
          items: (purchase.details || []).map((detail: PurchaseDetail) => ({
            productId: detail.productId,
            productName: detail.product?.name || '',
            quantity: Number(detail.quantity),
            cost: Number(detail.cost),
          })),
        }))
        
        setPurchases(purchasesWithItems)
      }
    } catch (err) {
      console.error("Error fetching purchases:", err)
      toast.error("Error al cargar compras")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPurchases()
  }, [])

  const handleEditClick = (purchase: Purchase) => {
    setSelectedPurchase(purchase)
    setIsEditModalOpen(true)
  }

  // Filtrar compras según el término de búsqueda
  const filteredPurchases = purchases.filter((purchase) => {
    const searchNormalized = normalizeText(searchTerm)
    return (
      normalizeText(purchase.supplierName).includes(searchNormalized) ||
      normalizeText(purchase.supplierNit).includes(searchNormalized) ||
      normalizeText(purchase.invoiceNumber).includes(searchNormalized) ||
      (purchase.items || purchase.details || []).some((item: any) =>
        normalizeText(item.productName || item.product?.name || '').includes(searchNormalized)
      )
    )
  })

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <DashboardHeader />
      <main className="flex-1 p-4 lg:p-6 pb-24 lg:pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Compras</h1>
            <Button onClick={() => setIsModalOpen(true)} className="bg-blue-700 hover:bg-blue-800 text-white flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Nueva Compra
            </Button>
          </div>

          {/* Buscador */}
          <div className="mb-6 relative rounded-lg w-full">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por proveedor, NIT, factura o producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
            />
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Cargando compras...</p>
            </div>
          ) : purchases.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay compras registradas</p>
            </div>
          ) : filteredPurchases.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron compras que coincidan con la búsqueda</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Proveedor</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Factura</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Productos</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Total</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Fecha</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredPurchases.map((purchase) => (
                    <tr key={purchase.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium">{purchase.supplierName}</p>
                          <p className="text-sm text-gray-500">{purchase.supplierNit}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{purchase.invoiceNumber}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="space-y-1">
                          {(purchase.items || purchase.details || []).map((item: any, idx: number) => (
                            <p key={idx}>
                              {item.productName || item.product?.name} x{item.quantity}
                            </p>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium">
                        ${Number(purchase.total).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(purchase.createdAt || purchase.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleEditClick(purchase)}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                        >
                          <Edit2 className="h-4 w-4" />
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <CreatePurchaseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onPurchaseCreated={fetchPurchases} />
      <EditPurchaseModal 
        isOpen={isEditModalOpen} 
        purchase={selectedPurchase} 
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedPurchase(null)
        }} 
        onPurchaseUpdated={fetchPurchases} 
      />
    </div>
  )
}
