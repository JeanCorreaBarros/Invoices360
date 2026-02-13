"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, PieChart, BarChart3, TrendingUp, RefreshCw, FileSpreadsheet, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { DashboardHeader } from "@/components/dashboard-header"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
// Skeleton loader component for report cards
function ReportCardSkeleton() {
  return (
    <Card className="border-border">
      <CardHeader className="space-y-2">
        <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        <div className="h-4 bg-gray-100 rounded w-full animate-pulse"></div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-10 bg-gray-100 rounded animate-pulse"></div>
          <div className="h-10 bg-gray-100 rounded animate-pulse"></div>
          <div className="h-10 bg-gray-100 rounded animate-pulse"></div>
        </div>
      </CardContent>
    </Card>
  )
}

// Skeleton loader component for statistics
function EstadisticasSkeleton() {
  return (
    <>
      <div className="text-center">
        <div className="h-8 bg-gray-200 rounded w-12 mx-auto mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-100 rounded w-20 mx-auto animate-pulse"></div>
      </div>
      <div className="text-center">
        <div className="h-8 bg-gray-200 rounded w-12 mx-auto mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-100 rounded w-20 mx-auto animate-pulse"></div>
      </div>
      <div className="text-center">
        <div className="h-8 bg-gray-200 rounded w-12 mx-auto mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-100 rounded w-20 mx-auto animate-pulse"></div>
      </div>
      <div className="text-center">
        <div className="h-8 bg-gray-200 rounded w-12 mx-auto mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-100 rounded w-20 mx-auto animate-pulse"></div>
      </div>
    </>
  )
}

interface DescargarOpciones {
  tipo: "PDF" | "Excel" | "ZIP"
  label: string
  labelShort?: string
  endpoint?: string
}

interface Reporte {
  id: number
  nombre: string
  descripcion: string
  icon: any
  descargas: DescargarOpciones[]
  usarFechas?: boolean
}

const reportes: Reporte[] = [
  {
    id: 6,
    nombre: "Ventas",
    descripcion: "Listado completo de Ventas",
    icon: FileText,
    usarFechas: true,
    descargas: [
      { tipo: "PDF", label: "Descargar PDF", labelShort: "PDF", endpoint: "/reports-sales/export/pdf" },
      { tipo: "Excel", label: "Descargar Excel", labelShort: "Excel", endpoint: "/reports-sales/export/excel" },
      { tipo: "ZIP", label: "Descargar ZIP", labelShort: "ZIP", endpoint: "/reports-sales/export/zip" }
    ]
  },
]

interface Estadisticas {
  totalRegistros: number
  verificados: number
  pendientes: number
  rechazados: number
}

const defaultEstadisticas: Estadisticas = {
  totalRegistros: 12458,
  verificados: 8234,
  pendientes: 2124,
  rechazados: 100,
}

export default function ReportesPage() {
  const [estadisticas, setEstadisticas] = useState<Estadisticas>(defaultEstadisticas)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Estados para las fechas
  const [fechaDesde, setFechaDesde] = useState<string>(() => {
    const hoy = new Date()
    const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
    return primerDiaMes.toISOString().split('T')[0]
  })
  
  const [fechaHasta, setFechaHasta] = useState<string>(() => {
    const hoy = new Date()
    return hoy.toISOString().split('T')[0]
  })

  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        setLoading(true)
        setError(null)
        // Descomenta cuando el endpoint esté listo
        // const data = await reportesApi.getResumen()
        // setEstadisticas(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar estadísticas')
        setEstadisticas(defaultEstadisticas)
      } finally {
        setLoading(false)
      }
    }

    fetchEstadisticas()
  }, [])

  const handleDescargar = async (reporteId: number, tipo: string, endpoint?: string, usarFechas?: boolean) => {
    try {
      setLoading(true)
      setError(null)

      const token = sessionStorage.getItem("token")

      if (!token) {
        setError("No autorizado. Por favor inicia sesión nuevamente.")
        return
      }

      if (!endpoint) {
        setError("Endpoint no configurado para este reporte.")
        return
      }

      // Validar fechas si el reporte las usa
      if (usarFechas) {
        if (!fechaDesde || !fechaHasta) {
          setError("Por favor selecciona ambas fechas")
          return
        }
        
        if (new Date(fechaDesde) > new Date(fechaHasta)) {
          setError("La fecha inicial no puede ser mayor a la fecha final")
          return
        }
      }

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://plasticoslc.com/api"
      
      // Construir la URL con los parámetros de fecha si aplica
      let fullUrl = `${apiBaseUrl}${endpoint}`
      if (usarFechas) {
        fullUrl += `?from=${fechaDesde}&to=${fechaHasta}`
      }

      console.log(`Consumiendo endpoint: ${fullUrl}`)

      const response = await fetch(fullUrl, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`)
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url

      let fileExtension = 'bin'
      if (tipo === "PDF") fileExtension = 'pdf'
      else if (tipo === "Excel") fileExtension = 'xlsx'
      else if (tipo === "ZIP") fileExtension = 'zip'

      const fileName = `reporte_${reporteId}_${new Date().toLocaleDateString("es-ES").replace(/\//g, "-")}.${fileExtension}`

      a.download = fileName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      console.log(`Reporte descargado: ${fileName}`)

    } catch (err) {
      setError(err instanceof Error ? err.message : `Error al descargar ${tipo}`)
      console.error("Error al descargar:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-6">
      <DashboardHeader />

      <div className="p-4 md:p-6">
        {/* Header Section - Optimizado para mobile */}
        <div className="mb-4 md:mb-6">
          <div className="flex flex-col gap-3 mb-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground">Reportes</h2>
              <p className="text-sm text-muted-foreground mt-1">Descarga reportes y estadísticas</p>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                setLoading(true)
                try {
                  await new Promise((resolve) => setTimeout(resolve, 1000))
                  setEstadisticas(defaultEstadisticas)
                  console.log("Estadísticas actualizadas")
                } catch (err) {
                  setError("Error al actualizar estadísticas")
                } finally {
                  setLoading(false)
                }
              }}
              disabled={loading}
              className="gap-2 w-full md:w-auto"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span>{loading ? "Actualizando..." : "Actualizar"}</span>
            </Button>
          </div>
        </div>

        {/* Filtro de Fechas - MINIMALISTA */}
        <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-gray-600" />
            <span className="text-xs font-medium text-gray-700">Periodo</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              className="bg-white h-9 text-xs"
            />
            <Input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              className="bg-white h-9 text-xs"
            />
          </div>
        </div>

        {/* Error Message - Optimizado para mobile */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-800 p-3 md:p-4 rounded-lg mb-4 md:mb-6 text-sm"
          >
            <p className="font-medium">⚠️ Error</p>
            <p className="mt-1">{error}</p>
          </motion.div>
        )}

        {/* Reportes List - Optimizado para mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3 md:space-y-0 md:grid md:grid-cols-2 md:gap-4"
        >
          {loading ? (
            <>
              <ReportCardSkeleton />
              <ReportCardSkeleton />
            </>
          ) : (
            reportes.map((reporte, index) => (
              <motion.div
                key={reporte.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-border hover:shadow-lg transition-all duration-200">
                  <CardContent className="p-4">
                    {/* Header del Reporte */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0 shadow-md">
                        <reporte.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-foreground text-base md:text-lg leading-tight">
                          {reporte.nombre}
                        </h3>
                        <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-2">
                          {reporte.descripcion}
                        </p>
                      </div>
                    </div>
                    
                    {/* Indicador de Rango de Fechas - Compacto */}
                    {reporte.usarFechas && (
                      <div className="mb-3 px-2 py-1.5 bg-blue-50 rounded border border-blue-200 flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-blue-600 shrink-0" />
                        <p className="text-xs text-blue-700 truncate">
                          {new Date(fechaDesde).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })} - {new Date(fechaHasta).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                        </p>
                      </div>
                    )}

                    {/* Botones de Descarga - Grid en Mobile */}
                    <div className="grid grid-cols-3 gap-2">
                      {reporte.descargas.map((descarga, idx) => (
                        <Button
                          key={idx}
                          size="sm"
                          className={`gap-1.5 text-white shadow-sm transition-all hover:scale-105 h-auto py-2.5 ${
                            descarga.tipo === "PDF"
                              ? "bg-red-600 hover:bg-red-700 active:bg-red-800"
                              : descarga.tipo === "Excel"
                              ? "bg-green-600 hover:bg-green-700 active:bg-green-800"
                              : "bg-violet-600 hover:bg-violet-700 active:bg-violet-800"
                          }`}
                          onClick={() => handleDescargar(reporte.id, descarga.tipo, descarga.endpoint, reporte.usarFechas)}
                          disabled={loading}
                        >
                          <div className="flex flex-col items-center gap-1 w-full">
                            {descarga.tipo === "PDF" ? (
                              <Download className="w-4 h-4" />
                            ) : descarga.tipo === "Excel" ? (
                              <FileSpreadsheet className="w-4 h-4" />
                            ) : (
                              <Download className="w-4 h-4" />
                            )}
                            <span className="text-xs font-semibold leading-none">
                              {descarga.labelShort || descarga.tipo}
                            </span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Estadísticas - Hidden como en el original */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="hidden grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6"
        >
          {[
            { label: "Total Registros", value: estadisticas.totalRegistros, color: "bg-blue-50" },
            { label: "Verificados", value: estadisticas.verificados, color: "bg-green-50" },
            { label: "Pendientes", value: estadisticas.pendientes, color: "bg-yellow-50" },
            { label: "Rechazados", value: estadisticas.rechazados, color: "bg-red-50" },
          ].map((stat, index) => (
            <Card key={index} className={`border-border ${stat.color}`}>
              <CardContent className="p-3 md:p-5">
                <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-xl md:text-2xl font-bold text-foreground mt-1 md:mt-2">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Estadísticas Rápidas - Hidden como en el original */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 md:mt-8 hidden"
        >
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground text-base md:text-lg">Estadísticas Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {loading ? (
                  <EstadisticasSkeleton />
                ) : (
                  [
                    { label: "Total Registros", value: estadisticas.totalRegistros.toLocaleString(), color: "text-primary" },
                    { label: "Verificados", value: estadisticas.verificados.toLocaleString(), color: "text-accent" },
                    { label: "Pendientes", value: estadisticas.pendientes.toLocaleString(), color: "text-chart-3" },
                    { label: "Rechazados", value: estadisticas.rechazados.toLocaleString(), color: "text-destructive" },
                  ].map((stat, index) => (
                    <div key={index} className="text-center p-3 md:p-4 rounded-lg bg-muted/50">
                      <p className={`text-xl md:text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                      <p className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
       <MobileBottomNav />
    </div>
  )
}