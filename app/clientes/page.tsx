"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { Plus, Search, Edit, Trash2, Mail, Phone } from "lucide-react"
import { useState } from "react"

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [clients] = useState([
    {
      id: 1,
      name: "Juan Pérez",
      email: "juan@example.com",
      phone: "+34 612 345 678",
      company: "Distribuidora ABC",
      nit: "DNI-12345678",
      city: "Madrid",
    },
    {
      id: 2,
      name: "María García",
      email: "maria@example.com",
      phone: "+34 623 456 789",
      company: "Tienda XYZ",
      nit: "DNI-87654321",
      city: "Barcelona",
    },
    {
      id: 3,
      name: "Carlos López",
      email: "carlos@example.com",
      phone: "+34 634 567 890",
      company: "Empresa DEF",
      nit: "DNI-11223344",
      city: "Valencia",
    },
    {
      id: 4,
      name: "Ana Martínez",
      email: "ana@example.com",
      phone: "+34 645 678 901",
      company: "Negocios GHI",
      nit: "DNI-55667788",
      city: "Sevilla",
    },
  ])

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.nit.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-[hsl(228,14%,9%)]">
      <DashboardHeader />

      <main className="px-4 lg:px-6 py-6 pb-24 lg:pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-[hsl(0,0%,95%)]">Clientes</h1>
            <button className="flex items-center gap-2 bg-[hsl(90,100%,50%)] text-[hsl(0,0%,5%)] px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
              <Plus className="h-5 w-5" />
              Nuevo Cliente
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[hsl(90,100%,50%)]"
              />
            </div>
          </div>

          {/* Clients Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredClients.map((client) => (
              <div key={client.id} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
                    <p className="text-sm text-gray-600">{client.company}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <a href={`mailto:${client.email}`} className="text-sm text-[hsl(90,100%,50%)] hover:underline">
                      {client.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <a href={`tel:${client.phone}`} className="text-sm text-gray-700">
                      {client.phone}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">NIT/DNI</p>
                    <p className="text-sm text-gray-900 font-medium">{client.nit}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Ciudad</p>
                    <p className="text-sm text-gray-900">{client.city}</p>
                  </div>
                </div>

                <button className="w-full mt-4 py-2 border border-[hsl(90,100%,50%)] text-[hsl(90,100%,50%)] rounded-lg font-medium hover:bg-[hsl(90,100%,50%,0.1)] transition-colors">
                  Ver Facturas
                </button>
              </div>
            ))}
          </div>

          {filteredClients.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No se encontraron clientes</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
