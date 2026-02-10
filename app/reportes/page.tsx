"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { Download, Calendar } from "lucide-react"
import { useState } from "react"

export default function ReportesPage() {
  const [dateRange, setDateRange] = useState("month")

  const stats = [
    {
      label: "Ingresos Totales",
      value: "$45,230.50",
      change: "+12.5%",
      positive: true,
    },
    {
      label: "Facturas Emitidas",
      value: "128",
      change: "+8 este mes",
      positive: true,
    },
    {
      label: "Clientes Activos",
      value: "32",
      change: "+4 nuevos",
      positive: true,
    },
    {
      label: "Pagos Pendientes",
      value: "$8,450.00",
      change: "-15%",
      positive: false,
    },
  ]

  return (
    <div className="min-h-screen bg-[hsl(228,14%,9%)]">
      <DashboardHeader />

      <main className="px-4 lg:px-6 py-6 pb-24 lg:pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-[hsl(0,0%,95%)]">Reportes</h1>
            <button className="flex items-center gap-2 bg-[hsl(90,100%,50%)] text-[hsl(0,0%,5%)] px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
              <Download className="h-5 w-5" />
              Exportar
            </button>
          </div>

          {/* Date Range Selector */}
          <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
            <div className="flex items-center gap-4 flex-wrap">
              <Calendar className="h-5 w-5 text-gray-600" />
              <div className="flex gap-2">
                {["week", "month", "quarter", "year"].map((range) => (
                  <button
                    key={range}
                    onClick={() => setDateRange(range)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      dateRange === range
                        ? "bg-[hsl(90,100%,50%)] text-[hsl(0,0%,5%)]"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {range === "week"
                      ? "Esta Semana"
                      : range === "month"
                        ? "Este Mes"
                        : range === "quarter"
                          ? "Este Trimestre"
                          : "Este Año"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-lg p-6 shadow-sm">
                <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <p className={`text-sm ${stat.positive ? "text-green-600" : "text-orange-600"}`}>
                  {stat.change}
                </p>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid gap-6 lg:grid-cols-2 mb-8">
            {/* Sales Chart */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Ventas por Mes</h2>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Gráfico de ventas</p>
              </div>
            </div>

            {/* Clients Chart */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Clientes</h2>
              <div className="space-y-3">
                {[
                  { name: "Distribuidora ABC", amount: "$8,500" },
                  { name: "Tienda XYZ", amount: "$7,200" },
                  { name: "Empresa DEF", amount: "$6,800" },
                  { name: "Negocios GHI", amount: "$5,400" },
                  { name: "Otros", amount: "$17,330.50" },
                ].map((client, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-gray-700">{client.name}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[hsl(90,100%,50%)]"
                          style={{ width: `${100 - (idx + 1) * 15}%` }}
                        />
                      </div>
                      <span className="text-gray-900 font-medium">{client.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Productos Más Vendidos</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 font-medium text-gray-700">Producto</th>
                    <th className="text-right py-3 font-medium text-gray-700">Unidades</th>
                    <th className="text-right py-3 font-medium text-gray-700">Ingresos</th>
                    <th className="text-right py-3 font-medium text-gray-700">% Total</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Botella PET 500ml", units: 1250, revenue: "$562.50", percent: 28 },
                    { name: "Botella PET 1L", units: 850, revenue: "$552.50", percent: 19 },
                    { name: "Película Strech", units: 320, revenue: "$800", percent: 18 },
                    { name: "Tapa Plástica", units: 2150, revenue: "$107.50", percent: 15 },
                    { name: "Otros", units: 480, revenue: "$1,208", percent: 20 },
                  ].map((product, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 text-gray-900">{product.name}</td>
                      <td className="text-right py-3 text-gray-700">{product.units}</td>
                      <td className="text-right py-3 text-gray-900 font-medium">{product.revenue}</td>
                      <td className="text-right py-3">
                        <span className="text-[hsl(90,100%,50%)] font-medium">{product.percent}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
