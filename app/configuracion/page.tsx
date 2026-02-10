"use client"

import { DashboardHeader } from "@/components/dashboard-header"

export default function ConfiguracionPage() {
  return (
    <div className="min-h-screen bg-[hsl(228,14%,9%)]">
      <DashboardHeader />
      
      <main className="px-4 lg:px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-[hsl(0,0%,95%)] mb-8">Configuración</h1>
          
          <div className="grid gap-6">
            {/* General Settings */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Configuración General</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de la Empresa
                  </label>
                  <input
                    type="text"
                    placeholder="PlasticosLC"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(90,100%,50%)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email de Contacto
                  </label>
                  <input
                    type="email"
                    placeholder="contacto@plasticoslc.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(90,100%,50%)]"
                  />
                </div>
              </div>
            </div>

            {/* Invoice Settings */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Configuración de Facturas</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prefijo de Factura
                  </label>
                  <input
                    type="text"
                    placeholder="FAC"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(90,100%,50%)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Próximo Número de Factura
                  </label>
                  <input
                    type="number"
                    placeholder="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(90,100%,50%)]"
                  />
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Preferencias</h2>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span className="ml-3 text-gray-700">Enviar recordatorios de pagos pendientes</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded" />
                  <span className="ml-3 text-gray-700">Requerir firma en facturas</span>
                </label>
              </div>
            </div>

            <button className="bg-[hsl(90,100%,50%)] text-[hsl(0,0%,5%)] px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity w-fit">
              Guardar Cambios
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
