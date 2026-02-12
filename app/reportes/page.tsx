"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, PieChart, BarChart3, TrendingUp, RefreshCw, FileSpreadsheet } from "lucide-react"

import { DashboardHeader } from "@/components/dashboard-header"

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
  endpoint?: string
}

interface Reporte {
  id: number
  nombre: string
  descripcion: string
  icon: any
  descargas: DescargarOpciones[]
}

const reportes: Reporte[] = [
  {
    id: 1, nombre: "Resumen General de Votación", descripcion: "Estadísticas generales de participación electoral", icon: PieChart, descargas: [
      { tipo: "PDF", label: "Descargar PDF", endpoint: "/reports/dashboard/exportpdfgeneral?formato=oficio" },
      { tipo: "Excel", label: "Descargar Excel", endpoint: "/reports/dashboard/exportexcelgeneral" },
      { tipo: "ZIP", label: "Descargar ZIP", endpoint: "/reports/dashboard/exportzipgeneral?formato=oficio" }
    ]
  },
  {
    id: 2, nombre: "Registro por Puestos", descripcion: "Detalle de votantes por cada puesto de votación", icon: BarChart3, descargas: [
      { tipo: "PDF", label: "Descargar PDF", endpoint: "/reports/dashboard/exportpdfporpuesto?formato=oficio" },
      { tipo: "Excel", label: "Descargar Excel", endpoint: "/reports/dashboard/exportexcelporpuesto" },
      { tipo: "ZIP", label: "Descargar ZIP", endpoint: "/reports/dashboard/exportzipporpuesto?formato=oficio" }
    ]
  },
  {
    id: 3, nombre: "Registro por Lider", descripcion: "Listado completo de votantes registrados", icon: FileText, descargas: [
      { tipo: "PDF", label: "Descargar PDF", endpoint: "/reports/dashboard/exportpdf?formato=oficio" },
      { tipo: "Excel", label: "Descargar Excel", endpoint: "/reports/dashboard/exportexcel" },
      { tipo: "ZIP", label: "Descargar ZIP", endpoint: "/reports/dashboard/exportzippdf?formato=oficio" }
    ]
  },
  {
    id: 4, nombre: "Registro por Programa", descripcion: "Listado completo de votantes registrados", icon: FileText, descargas: [
      { tipo: "PDF", label: "Descargar PDF", endpoint: "/reports/dashboard/exportpdfporprograma?formato=oficio" },
      { tipo: "Excel", label: "Descargar Excel", endpoint: "/reports/dashboard/exportexcelporprograma" },
      { tipo: "ZIP", label: "Descargar ZIP", endpoint: "/reports/dashboard/exportzipporprograma?formato=oficio" }
    ]
  },
  {
    id: 5, nombre: "Registro por Documentos", descripcion: "Listado completo de votantes registrados", icon: FileText, descargas: [
      { tipo: "PDF", label: "Descargar PDF", endpoint: "/reports/dashboard/exportpdfcedulas?formato=oficio&modo=cedulas_puesto" },
      { tipo: "Excel", label: "Descargar Excel", endpoint: "/reports/dashboard/exportexcelcedulas?formato=oficio&modo=cedulas_puesto" },
      { tipo: "ZIP", label: "Descargar ZIP", endpoint: "/reports/dashboard/exportzippdfcedulas?formato=oficio&modo=cedulas_puesto" }
    ]
  },
  {
    id: 6, nombre: "Registro por Documentos Duplicados", descripcion: "Listado completo de votantes registrados", icon: FileText, descargas: [
      { tipo: "PDF", label: "Descargar PDF", endpoint: "/reports/dashboard/exportpdfcedulasduplicadas?formato=oficio&modo=cedulas_puesto" },
      /*{ tipo: "Excel", label: "Descargar Excel", endpoint: "/reports/dashboard/exportexcelduplicados" },
      { tipo: "ZIP", label: "Descargar ZIP", endpoint: "/reports/dashboard/exportzipduplicados?formato=oficio" }*/
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

  const handleDescargar = async (reporteId: number, tipo: string, endpoint?: string) => {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem('pspvote_token')

      if (!token) {
        setError("No autorizado. Por favor inicia sesión nuevamente.")
        return
      }

      if (!endpoint) {
        setError("Endpoint no configurado para este reporte.")
        return
      }

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
      const fullUrl = `${apiBaseUrl}${endpoint}`

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
    <div className="min-h-screen bg-white">
      <DashboardHeader />


      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 id="reportes-titulo" className="text-lg font-semibold text-foreground">Generar Reportes</h2>
            <p className="text-sm text-muted-foreground">Descarga reportes y estadísticas del sistema</p>
          </div>
          <div className="flex items-center gap-3">
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
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Actualizando..." : "Actualizar"}
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className=" hidden grid-cols-1 md:grid-cols-2 gap-4 mb-6"
          id="estadisticas-cards"
        >
          {[
            { label: "Total Registros", value: estadisticas.totalRegistros, color: "bg-blue-50" },
            { label: "Verificados", value: estadisticas.verificados, color: "bg-green-50" },
            { label: "Pendientes", value: estadisticas.pendientes, color: "bg-yellow-50" },
            { label: "Rechazados", value: estadisticas.rechazados, color: "bg-red-50" },
          ].map((stat, index) => (
            <Card key={index} className={`border-border ${stat.color}`}>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          id="reportes-list"
        >
          {loading ? (
            <>
              <ReportCardSkeleton />
              <ReportCardSkeleton />
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
                id="reporte-card"
              >
                <Card className="border-border hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <reporte.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{reporte.nombre}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{reporte.descripcion}</p>
                        <div className="flex items-center gap-3 mt-4 flex-wrap">
                          {reporte.descargas.map((descarga, idx) => (
                            <Button
                              key={idx}
                              size="sm"
                              className={`gap-2 text-white ${descarga.tipo === "PDF"
                                ? "bg-red-600 hover:bg-red-700"
                                : descarga.tipo === "Excel"
                                  ? "bg-green-600 hover:bg-green-700"
                                  : "bg-violet-600 hover:bg-violet-700"
                                }`}
                              onClick={() => handleDescargar(reporte.id, descarga.tipo, descarga.endpoint)}
                              disabled={loading}
                            >
                              {descarga.tipo === "PDF" ? (
                                <Download className="w-4 h-4" />
                              ) : descarga.tipo === "Excel" ? (
                                <FileSpreadsheet className="w-4 h-4" />
                              ) : (
                                <Download className="w-4 h-4" />
                              )}
                              {descarga.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 hidden"
        >
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Estadísticas Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {loading ? (
                  <EstadisticasSkeleton />
                ) : (
                  [
                    { label: "Total Registros", value: estadisticas.totalRegistros.toLocaleString(), color: "text-primary" },
                    { label: "Verificados", value: estadisticas.verificados.toLocaleString(), color: "text-accent" },
                    { label: "Pendientes", value: estadisticas.pendientes.toLocaleString(), color: "text-chart-3" },
                    { label: "Rechazados", value: estadisticas.rechazados.toLocaleString(), color: "text-destructive" },
                  ].map((stat, index) => (
                    <div key={index} className="text-center p-4 rounded-lg bg-muted/50">
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                      <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
