"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { useState } from "react"

export default function ProductosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [products] = useState([
    {
      id: 1,
      name: "Botella PET 500ml",
      code: "BOT-500",
      category: "Botellas",
      price: 0.45,
      stock: 500,
    },
    {
      id: 2,
      name: "Botella PET 1L",
      code: "BOT-1000",
      category: "Botellas",
      price: 0.65,
      stock: 300,
    },
    {
      id: 3,
      name: "Tapa Plástica",
      code: "TAP-001",
      category: "Accesorios",
      price: 0.05,
      stock: 1000,
    },
    {
      id: 4,
      name: "Película Strech",
      code: "PEL-500",
      category: "Empaques",
      price: 2.5,
      stock: 100,
    },
  ])

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-[hsl(228,14%,9%)]">
      <DashboardHeader />

      <main className="px-4 lg:px-6 py-6 pb-24 lg:pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-[hsl(0,0%,95%)]">Productos</h1>
            <button className="flex items-center gap-2 bg-[hsl(90,100%,50%)] text-[hsl(0,0%,5%)] px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
              <Plus className="h-5 w-5" />
              Nuevo Producto
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[hsl(90,100%,50%)]"
              />
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{product.code}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{product.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{product.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          product.stock > 100
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
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No se encontraron productos</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
