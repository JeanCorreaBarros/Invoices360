"use client"

import { useState, useEffect, useRef } from "react"
import toast from "react-hot-toast"
import { DashboardHeader } from "@/components/dashboard-header"
import { motion, AnimatePresence } from "framer-motion"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import {
  SaveIcon,
  PlusIcon,
  Building2,
  UserCheck,
  Phone,
  MapPin,
  FileText,
  ChevronRight,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Upload,
  Camera,
  Palette,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null)
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const handle = () => setIsMobile(mq.matches)
    handle()
    mq.addEventListener("change", handle)
    return () => mq.removeEventListener("change", handle)
  }, [breakpoint])
  return isMobile
}

interface Resolution {
  id: number
  prefix: string
  currentNumber: number
  fromNumber: number
  toNumber: number
  active: boolean
  createdAt: string
  companyId: number | null
}

type TabId = "info-general" | "legal" | "contacto" | "ubicacion" | "resoluciones"

const MOBILE_TABS: { id: TabId; label: string; icon: React.ReactNode; short: string }[] = [
  { id: "info-general", icon: <Building2 size={18} />, label: "Información General", short: "Info" },
  { id: "legal",        icon: <UserCheck size={18} />, label: "Representante Legal",  short: "Legal" },
  { id: "contacto",     icon: <Phone size={18} />,     label: "Contacto",             short: "Contacto" },
  { id: "ubicacion",    icon: <MapPin size={18} />,    label: "Ubicación",            short: "Ubicación" },
  { id: "resoluciones", icon: <FileText size={18} />,  label: "Resoluciones",         short: "Resoluc." },
]

export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState<TabId>("info-general")
  const [showNewResForm, setShowNewResForm] = useState(false)

  const [empresaData, setEmpresaData] = useState({
    businessName: "", tradeName: "", nit: "", dv: "",
    legalRepresentative: "", legalRepId: "", taxRegime: "",
    taxResponsibility: "", email: "", phone: "", address: "",
    city: "", department: "", primaryColor: "#1D4ED8",
  })
  const [empresaId, setEmpresaId] = useState<string | null>(null)
  const [logo, setLogo] = useState<string | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [isSavingCompany, setIsSavingCompany] = useState(false)
  const [isLoadingCompany, setIsLoadingCompany] = useState(true)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)

  const [resoluciones, setResoluciones] = useState<Resolution[]>([])
  const [isLoadingResoluciones, setIsLoadingResoluciones] = useState(false)
  const [isCreatingResolucion, setIsCreatingResolucion] = useState(false)
  const [nuevaResolucion, setNuevaResolucion] = useState({ prefix: "", fromNumber: 1, toNumber: 5000 })

  const logoInputRef = useRef<HTMLInputElement>(null)
  const isMobile = useIsMobile()

  const getLogoUrl = (p: string | null): string | null => {
    if (!p) return null
    if (p.startsWith("http")) return p
    const base = (process.env.NEXT_PUBLIC_API_URL || "https://plasticoslc.com/api/").replace("/api/", "")
    return `${base}${p}`
  }

  const cargarResoluciones = async () => {
    try {
      setIsLoadingResoluciones(true)
      const token = sessionStorage.getItem("token")
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://plasticoslc.com/api/"
      const res = await fetch(`${apiBase}resolutions`, {
        headers: { Authorization: token ? `Bearer ${token}` : "", "Content-Type": "application/json" },
      })
      if (res.ok) setResoluciones(await res.json())
      else toast.error("Error al cargar resoluciones")
    } catch { toast.error("Error al cargar resoluciones") }
    finally { setIsLoadingResoluciones(false) }
  }

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoadingCompany(true)
        const token = sessionStorage.getItem("token")
        const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://plasticoslc.com/api/"
        const res = await fetch(`${apiBase}companies`, {
          headers: { Authorization: token ? `Bearer ${token}` : "", "Content-Type": "application/json" },
        })
        if (res.ok) {
          const result = await res.json()
          if (result.ok && result.data?.length > 0) {
            const c = result.data[0]
            setEmpresaId(c.id || null)
            setLogo(getLogoUrl(c.logo) || null)
            setEmpresaData({
              businessName: c.businessName || "", tradeName: c.tradeName || "",
              nit: c.nit || "", dv: c.dv || "",
              legalRepresentative: c.legalRepresentative || "", legalRepId: c.legalRepId || "",
              taxRegime: c.taxRegime || "", taxResponsibility: c.taxResponsibility || "",
              email: c.email || "", phone: c.phone || "",
              address: c.address || "", city: c.city || "",
              department: c.department || "", primaryColor: c.primaryColor || "#1D4ED8",
            })
          }
        }
      } catch (e) { console.error(e) }
      finally { setIsLoadingCompany(false) }
    }
    load()
    cargarResoluciones()
  }, [])

  const crearResolucion = async () => {
    if (!nuevaResolucion.prefix.trim()) { toast.error("El prefijo es obligatorio"); return }
    if (nuevaResolucion.fromNumber >= nuevaResolucion.toNumber) { toast.error("El número final debe ser mayor al inicial"); return }
    try {
      setIsCreatingResolucion(true)
      const token = sessionStorage.getItem("token")
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://plasticoslc.com/api/"
      const res = await fetch(`${apiBase}resolutions`, {
        method: "POST",
        headers: { Authorization: token ? `Bearer ${token}` : "", "Content-Type": "application/json" },
        body: JSON.stringify(nuevaResolucion),
      })
      if (res.ok) {
        toast.success("Resolución creada correctamente")
        setNuevaResolucion({ prefix: "", fromNumber: 1, toNumber: 5000 })
        setShowNewResForm(false)
        await cargarResoluciones()
      } else toast.error("Error al crear resolución")
    } catch { toast.error("Error al crear resolución") }
    finally { setIsCreatingResolucion(false) }
  }

  const handleLogoSelect = (file: File) => {
    setLogoFile(file)
    const reader = new FileReader()
    reader.onload = (e) => setLogoPreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  const subirLogo = async () => {
    if (!logoFile || !empresaId) {
      toast.error(!logoFile ? "Selecciona un archivo primero" : "Guarda la empresa primero")
      return
    }
    try {
      setIsUploadingLogo(true)
      const token = sessionStorage.getItem("token")
      const fd = new FormData(); fd.append("logo", logoFile)
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://plasticoslc.com/api/"
      const res = await fetch(`${apiBase}companies/${empresaId}/logo`, {
        method: "PATCH", headers: { Authorization: `Bearer ${token}` }, body: fd,
      })
      if (!res.ok) throw new Error("Error al subir el logo")
      const result = await res.json()
      setLogo(getLogoUrl(result.data?.logo) || null)
      setLogoFile(null); setLogoPreview(null)
      toast.success("Logo subido correctamente")
    } catch (e) { toast.error(e instanceof Error ? e.message : "Error al subir el logo") }
    finally { setIsUploadingLogo(false) }
  }

  const cancelarLogoSelect = () => { setLogoFile(null); setLogoPreview(null) }

  const guardarDatosEmpresa = async () => {
    try {
      setIsSavingCompany(true)
      const token = sessionStorage.getItem("token")
      if (!token) { toast.error("Token no encontrado"); return }
      const isUpdate = empresaId !== null
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://plasticoslc.com/api/"
      const res = await fetch(isUpdate ? `${apiBase}companies/${empresaId}` : `${apiBase}companies`, {
        method: isUpdate ? "PUT" : "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(empresaData),
      })
      if (!res.ok) throw new Error(isUpdate ? "Error al actualizar" : "Error al guardar")
      toast.success(isUpdate ? "Datos de empresa actualizados correctamente" : "Datos de empresa guardados correctamente")
    } catch (e) { toast.error(e instanceof Error ? e.message : "Error desconocido") }
    finally { setIsSavingCompany(false) }
  }

  // Animaciones desktop
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 100 } },
  }

  if (isMobile === null) return null

  /* ═══════════════════════════════════════════
      DESKTOP — vista original sin cambios
  ═══════════════════════════════════════════ */
  if (!isMobile) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-9">
          <div className="flex min-h-screen">
            <div className="flex flex-col flex-1 overflow-hidden">
              <motion.main
                className="flex-1 overflow-y-auto p-9"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <motion.div className="flex items-center justify-between mb-6" variants={itemVariants}>
                  <h1 className="text-2xl font-bold">Configuración</h1>
                  <Button
                    onClick={guardarDatosEmpresa}
                    disabled={isLoadingCompany || isSavingCompany}
                    className="bg-blue-600 hover:bg-blue-700 hover:scale-95 text-white"
                  >
                    <SaveIcon className="mr-2 h-4 w-4" />
                    {empresaId ? "Actualizar empresa" : "Guardar empresa"}
                  </Button>
                </motion.div>

                <Tabs defaultValue="info-general" className="w-full">
                  <TabsList className="mb-6">
                    <TabsTrigger value="info-general">Información General</TabsTrigger>
                    <TabsTrigger value="legal">Representante Legal</TabsTrigger>
                    <TabsTrigger value="contacto">Contacto</TabsTrigger>
                    <TabsTrigger value="ubicacion">Ubicación</TabsTrigger>
                    <TabsTrigger value="resoluciones">Resoluciones</TabsTrigger>
                  </TabsList>

                  <TabsContent value="info-general">
                    <motion.div>
                      <Card className="shadow-xl">
                        <CardHeader>
                          <CardTitle>Información General</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2">
                            {empresaId && (
                              <div className="space-y-2">
                                <Label>Logo de la Empresa</Label>
                                {logoPreview ? (
                                  <div className="border-2 border-dashed bg-white border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center gap-4">
                                    <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                      <img src={logoPreview} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                    <p className="text-sm text-gray-600 text-center">Preview del logo a subir</p>
                                    <div className="flex gap-2 w-full">
                                      <Button
                                        type="button"
                                        onClick={subirLogo}
                                        disabled={isUploadingLogo}
                                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                                      >
                                        {isUploadingLogo ? "Subiendo..." : "Confirmar Subida"}
                                      </Button>
                                      <Button
                                        type="button"
                                        onClick={cancelarLogoSelect}
                                        disabled={isUploadingLogo}
                                        variant="outline"
                                        className="flex-1"
                                      >
                                        Cancelar
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <label className="block cursor-pointer">
                                    <input
                                      ref={logoInputRef}
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => { const f = e.target.files?.[0]; if (f) handleLogoSelect(f) }}
                                      className="hidden"
                                    />
                                    {logo ? (
                                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center gap-3 hover:border-purple-500 transition-colors">
                                        <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                          <img src={logo} alt="Logo" className="w-full h-full object-cover" />
                                        </div>
                                        <Button
                                          type="button"
                                          variant="outline"
                                          onClick={() => logoInputRef.current?.click()}
                                          className="w-full"
                                        >
                                          Cambiar Logo
                                        </Button>
                                      </div>
                                    ) : (
                                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center gap-2 hover:border-purple-500 transition-colors">
                                        <p className="text-gray-500 font-medium text-center">Utilizar mi logo</p>
                                        <Button
                                          type="button"
                                          className="mt-2"
                                          onClick={() => logoInputRef.current?.click()}
                                        >
                                          Subir Logo
                                        </Button>
                                      </div>
                                    )}
                                  </label>
                                )}
                              </div>
                            )}
                            <div className="grid grid-cols-1 mt-5 ml-3">
                              <div className="space-y-1">
                                <Label htmlFor="business-name">Razón Social</Label>
                                <Input
                                  className="bg-white"
                                  id="business-name"
                                  value={empresaData.businessName}
                                  onChange={(e) => setEmpresaData({ ...empresaData, businessName: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="trade-name">Nombre Comercial</Label>
                                <Input
                                  className="bg-white"
                                  id="trade-name"
                                  value={empresaData.tradeName}
                                  onChange={(e) => setEmpresaData({ ...empresaData, tradeName: e.target.value })}
                                />
                              </div>
                              <div className="grid grid-cols-2">
                                <div className="space-y-2">
                                  <Label htmlFor="nit">NIT</Label>
                                  <Input
                                    className="bg-white"
                                    id="nit"
                                    value={empresaData.nit}
                                    onChange={(e) => setEmpresaData({ ...empresaData, nit: e.target.value })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="dv">Dígito de Verificación</Label>
                                  <Input
                                    className="bg-white"
                                    id="dv"
                                    value={empresaData.dv}
                                    onChange={(e) => setEmpresaData({ ...empresaData, dv: e.target.value })}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="legal">
                    <motion.div>
                      <Card className="shadow-xl">
                        <CardHeader>
                          <CardTitle>Representante Legal</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="legal-rep">Nombre Representante Legal</Label>
                            <Input
                              className="bg-white"
                              id="legal-rep"
                              value={empresaData.legalRepresentative}
                              onChange={(e) => setEmpresaData({ ...empresaData, legalRepresentative: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="legal-rep-id">Cédula Representante Legal</Label>
                            <Input
                              className="bg-white"
                              id="legal-rep-id"
                              value={empresaData.legalRepId}
                              onChange={(e) => setEmpresaData({ ...empresaData, legalRepId: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="tax-regime">Régimen Tributario</Label>
                            <Input
                              className="bg-white"
                              id="tax-regime"
                              value={empresaData.taxRegime}
                              onChange={(e) => setEmpresaData({ ...empresaData, taxRegime: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="tax-resp">Responsabilidad Tributaria</Label>
                            <Input
                              className="bg-white"
                              id="tax-resp"
                              value={empresaData.taxResponsibility}
                              onChange={(e) => setEmpresaData({ ...empresaData, taxResponsibility: e.target.value })}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="contacto">
                    <motion.div>
                      <Card className="shadow-xl">
                        <CardHeader>
                          <CardTitle>Contacto</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              className="bg-white"
                              id="email"
                              type="email"
                              value={empresaData.email}
                              onChange={(e) => setEmpresaData({ ...empresaData, email: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Teléfono</Label>
                            <Input
                              className="bg-white"
                              id="phone"
                              value={empresaData.phone}
                              onChange={(e) => setEmpresaData({ ...empresaData, phone: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="address">Dirección</Label>
                            <Input
                              className="bg-white"
                              id="address"
                              value={empresaData.address}
                              onChange={(e) => setEmpresaData({ ...empresaData, address: e.target.value })}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="ubicacion">
                    <motion.div>
                      <Card className="shadow-xl">
                        <CardHeader>
                          <CardTitle>Ubicación</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="city">Ciudad</Label>
                            <Input
                              className="bg-white"
                              id="city"
                              value={empresaData.city}
                              onChange={(e) => setEmpresaData({ ...empresaData, city: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="department">Departamento</Label>
                            <Input
                              className="bg-white"
                              id="department"
                              value={empresaData.department}
                              onChange={(e) => setEmpresaData({ ...empresaData, department: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="primary-color">Color Primario</Label>
                            <div className="flex gap-2">
                              <Input
                                id="primary-color"
                                type="color"
                                value={empresaData.primaryColor}
                                onChange={(e) => setEmpresaData({ ...empresaData, primaryColor: e.target.value })}
                                className="w-12 h-10 p-1 bg-white"
                              />
                              <Input
                                value={empresaData.primaryColor}
                                onChange={(e) => setEmpresaData({ ...empresaData, primaryColor: e.target.value })}
                                className="flex-1 bg-white"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="resoluciones">
                    <motion.div>
                      <Card className="shadow-xl">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle>Resoluciones de Facturación</CardTitle>
                            <Button
                              onClick={cargarResoluciones}
                              disabled={isLoadingResoluciones}
                              variant="outline"
                            >
                              {isLoadingResoluciones ? "Cargando..." : "Actualizar"}
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <h3 className="font-semibold mb-4">Nueva Resolución</h3>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="nuevo-prefijo">Prefijo</Label>
                                <Input
                                  id="nuevo-prefijo"
                                  className="bg-white"
                                  placeholder="Ej: FV"
                                  value={nuevaResolucion.prefix}
                                  onChange={(e) => setNuevaResolucion({ ...nuevaResolucion, prefix: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="nuevo-desde">Desde número</Label>
                                <Input
                                  id="nuevo-desde"
                                  className="bg-white"
                                  type="number"
                                  value={nuevaResolucion.fromNumber}
                                  onChange={(e) => setNuevaResolucion({ ...nuevaResolucion, fromNumber: parseInt(e.target.value) || 1 })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="nuevo-hasta">Hasta número</Label>
                                <Input
                                  id="nuevo-hasta"
                                  className="bg-white"
                                  type="number"
                                  value={nuevaResolucion.toNumber}
                                  onChange={(e) => setNuevaResolucion({ ...nuevaResolucion, toNumber: parseInt(e.target.value) || 5000 })}
                                />
                              </div>
                            </div>
                            <Button
                              onClick={crearResolucion}
                              disabled={isCreatingResolucion}
                              className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white"
                            >
                              <PlusIcon className="mr-2 h-4 w-4" />
                              {isCreatingResolucion ? "Creando..." : "Crear Resolución"}
                            </Button>
                          </div>

                          <div className="space-y-3">
                            <h3 className="font-semibold">Resoluciones Existentes</h3>
                            {isLoadingResoluciones ? (
                              <div className="text-center py-8 text-gray-500">Cargando resoluciones...</div>
                            ) : resoluciones.length === 0 ? (
                              <div className="text-center py-8 text-gray-500">
                                No hay resoluciones creadas. Crea tu primera resolución arriba.
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {resoluciones.map((resolucion) => (
                                  <div
                                    key={resolucion.id}
                                    className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex-1 grid grid-cols-4 gap-4">
                                        <div>
                                          <p className="text-xs text-gray-500">Prefijo</p>
                                          <p className="font-semibold">{resolucion.prefix}</p>
                                        </div>
                                        <div>
                                          <p className="text-xs text-gray-500">Rango</p>
                                          <p className="font-medium">{resolucion.fromNumber} - {resolucion.toNumber}</p>
                                        </div>
                                        <div>
                                          <p className="text-xs text-gray-500">Consecutivo Actual</p>
                                          <p className="font-medium">{resolucion.currentNumber}</p>
                                        </div>
                                        <div>
                                          <p className="text-xs text-gray-500">Estado</p>
                                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${resolucion.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                                            {resolucion.active ? "Activa" : "Inactiva"}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>
                </Tabs>
              </motion.main>
            </div>
          </div>
        </main>
         <MobileBottomNav />
      </div>
    )
  }

  /* ═══════════════════════════════════════════
      MOBILE — UI mejorada
  ═══════════════════════════════════════════ */
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <DashboardHeader />

      {/* ── Sticky top bar ── */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm px-4 py-3 flex items-center justify-between">
        <h1 className="text-base font-bold text-gray-900 tracking-tight">Configuración</h1>
        <Button
          onClick={guardarDatosEmpresa}
          disabled={isLoadingCompany || isSavingCompany}
          size="sm"
          className="bg-violet-600 hover:bg-violet-700 active:scale-95 text-white text-xs h-9 px-3 rounded-xl shadow-md shadow-violet-200 transition-all"
        >
          <SaveIcon className="mr-1.5 h-3.5 w-3.5" />
          {isSavingCompany ? "Guardando…" : empresaId ? "Actualizar" : "Guardar"}
        </Button>
      </div>

      {/* ── Tab bar ── */}
      <div className="sticky top-[57px] z-10 bg-white border-b border-gray-100">
        <div className="flex overflow-x-auto scrollbar-hide px-2 py-1 gap-1">
          {MOBILE_TABS.map((tab) => {
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap
                  transition-all duration-200 flex-shrink-0
                  ${active
                    ? "bg-violet-600 text-white shadow-md shadow-violet-200"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  }
                `}
              >
                <span className={active ? "text-white" : "text-gray-400"}>{tab.icon}</span>
                {tab.short}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Tab content ── */}
      <main className="flex-1 overflow-y-auto px-4 py-5 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {/* ── INFO GENERAL ── */}
            {activeTab === "info-general" && (
              <div className="space-y-4">
                {empresaId && (
                  <Card className="overflow-hidden rounded-2xl border-0 shadow-sm">
                    <CardContent className="p-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Logo</p>
                      <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleLogoSelect(f) }}
                      />
                      {logoPreview ? (
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                            <img src={logoPreview} alt="preview" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex flex-col gap-2 flex-1">
                            <p className="text-xs text-gray-500">¿Confirmar esta imagen?</p>
                            <Button
                              onClick={subirLogo}
                              disabled={isUploadingLogo}
                              size="sm"
                              className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl h-9 text-xs w-full"
                            >
                              <Upload size={13} className="mr-1.5" />
                              {isUploadingLogo ? "Subiendo…" : "Confirmar"}
                            </Button>
                            <Button
                              onClick={cancelarLogoSelect}
                              disabled={isUploadingLogo}
                              size="sm"
                              variant="outline"
                              className="rounded-xl h-9 text-xs w-full"
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4">
                          <div
                            onClick={() => logoInputRef.current?.click()}
                            className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-violet-400 transition-colors flex-shrink-0"
                          >
                            {logo
                              ? <img src={logo} alt="logo" className="w-full h-full object-cover" />
                              : <Camera size={22} className="text-gray-400" />
                            }
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{logo ? "Logo actual" : "Sin logo"}</p>
                            <p className="text-xs text-gray-500 mt-0.5 mb-2">{logo ? "Toca para cambiar" : "Sube el logo de tu empresa"}</p>
                            <Button
                              onClick={() => logoInputRef.current?.click()}
                              size="sm"
                              variant="outline"
                              className="rounded-xl h-8 text-xs border-violet-300 text-violet-700 hover:bg-violet-50"
                            >
                              <Upload size={12} className="mr-1.5" />{logo ? "Cambiar" : "Subir Logo"}
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                <Card className="rounded-2xl border-0 shadow-sm">
                  <CardContent className="p-4 space-y-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Datos de empresa</p>
                    <MobileField label="Razón Social">
                      <Input
                        className="h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white text-sm"
                        value={empresaData.businessName}
                        onChange={(e) => setEmpresaData({ ...empresaData, businessName: e.target.value })}
                        placeholder="Nombre legal de la empresa"
                      />
                    </MobileField>
                    <MobileField label="Nombre Comercial">
                      <Input
                        className="h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white text-sm"
                        value={empresaData.tradeName}
                        onChange={(e) => setEmpresaData({ ...empresaData, tradeName: e.target.value })}
                        placeholder="Nombre comercial"
                      />
                    </MobileField>
                    <div className="grid grid-cols-2 gap-3">
                      <MobileField label="NIT">
                        <Input
                          className="h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white text-sm"
                          value={empresaData.nit}
                          onChange={(e) => setEmpresaData({ ...empresaData, nit: e.target.value })}
                          placeholder="000000000"
                        />
                      </MobileField>
                      <MobileField label="Dígito verif.">
                        <Input
                          className="h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white text-sm"
                          value={empresaData.dv}
                          onChange={(e) => setEmpresaData({ ...empresaData, dv: e.target.value })}
                          placeholder="0"
                        />
                      </MobileField>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* ── LEGAL ── */}
            {activeTab === "legal" && (
              <Card className="rounded-2xl border-0 shadow-sm">
                <CardContent className="p-4 space-y-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Representante Legal</p>
                  <MobileField label="Nombre">
                    <Input
                      className="h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white text-sm"
                      value={empresaData.legalRepresentative}
                      onChange={(e) => setEmpresaData({ ...empresaData, legalRepresentative: e.target.value })}
                      placeholder="Nombre completo"
                    />
                  </MobileField>
                  <MobileField label="Cédula">
                    <Input
                      className="h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white text-sm"
                      value={empresaData.legalRepId}
                      onChange={(e) => setEmpresaData({ ...empresaData, legalRepId: e.target.value })}
                      placeholder="Número de cédula"
                    />
                  </MobileField>
                  <MobileField label="Régimen Tributario">
                    <Input
                      className="h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white text-sm"
                      value={empresaData.taxRegime}
                      onChange={(e) => setEmpresaData({ ...empresaData, taxRegime: e.target.value })}
                      placeholder="Régimen tributario"
                    />
                  </MobileField>
                  <MobileField label="Responsabilidad Tributaria">
                    <Input
                      className="h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white text-sm"
                      value={empresaData.taxResponsibility}
                      onChange={(e) => setEmpresaData({ ...empresaData, taxResponsibility: e.target.value })}
                      placeholder="Responsabilidad"
                    />
                  </MobileField>
                </CardContent>
              </Card>
            )}

            {/* ── CONTACTO ── */}
            {activeTab === "contacto" && (
              <Card className="rounded-2xl border-0 shadow-sm">
                <CardContent className="p-4 space-y-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Datos de Contacto</p>
                  <MobileField label="Email">
                    <Input
                      type="email"
                      className="h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white text-sm"
                      value={empresaData.email}
                      onChange={(e) => setEmpresaData({ ...empresaData, email: e.target.value })}
                      placeholder="correo@empresa.com"
                    />
                  </MobileField>
                  <MobileField label="Teléfono">
                    <Input
                      className="h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white text-sm"
                      value={empresaData.phone}
                      onChange={(e) => setEmpresaData({ ...empresaData, phone: e.target.value })}
                      placeholder="+57 300 000 0000"
                    />
                  </MobileField>
                  <MobileField label="Dirección">
                    <Input
                      className="h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white text-sm"
                      value={empresaData.address}
                      onChange={(e) => setEmpresaData({ ...empresaData, address: e.target.value })}
                      placeholder="Calle, carrera, número..."
                    />
                  </MobileField>
                </CardContent>
              </Card>
            )}

            {/* ── UBICACIÓN ── */}
            {activeTab === "ubicacion" && (
              <Card className="rounded-2xl border-0 shadow-sm">
                <CardContent className="p-4 space-y-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Ubicación</p>
                  <MobileField label="Ciudad">
                    <Input
                      className="h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white text-sm"
                      value={empresaData.city}
                      onChange={(e) => setEmpresaData({ ...empresaData, city: e.target.value })}
                      placeholder="Ciudad"
                    />
                  </MobileField>
                  <MobileField label="Departamento">
                    <Input
                      className="h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white text-sm"
                      value={empresaData.department}
                      onChange={(e) => setEmpresaData({ ...empresaData, department: e.target.value })}
                      placeholder="Departamento"
                    />
                  </MobileField>
                  <MobileField label="Color Primario">
                    <div className="flex items-center gap-3">
                      <div className="relative flex-shrink-0">
                        <input
                          type="color"
                          value={empresaData.primaryColor}
                          onChange={(e) => setEmpresaData({ ...empresaData, primaryColor: e.target.value })}
                          className="w-11 h-11 rounded-xl border border-gray-200 cursor-pointer p-0.5 bg-white"
                        />
                        <Palette size={14} className="absolute bottom-1 right-1 text-white pointer-events-none drop-shadow-sm" />
                      </div>
                      <Input
                        value={empresaData.primaryColor}
                        onChange={(e) => setEmpresaData({ ...empresaData, primaryColor: e.target.value })}
                        className="h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white text-sm font-mono flex-1"
                        placeholder="#1D4ED8"
                      />
                    </div>
                    <div
                      className="h-2.5 rounded-full mt-2 transition-all duration-300"
                      style={{ backgroundColor: empresaData.primaryColor }}
                    />
                  </MobileField>
                </CardContent>
              </Card>
            )}

            {/* ── RESOLUCIONES ── */}
            {activeTab === "resoluciones" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {resoluciones.length} resolución{resoluciones.length !== 1 ? "es" : ""}
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={cargarResoluciones}
                      disabled={isLoadingResoluciones}
                      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-violet-600 transition-colors"
                    >
                      <RefreshCw size={13} className={isLoadingResoluciones ? "animate-spin" : ""} />
                      Actualizar
                    </button>
                    <button
                      onClick={() => setShowNewResForm(!showNewResForm)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-violet-600 hover:text-violet-800 transition-colors"
                    >
                      <PlusIcon size={14} />
                      Nueva
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {showNewResForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden"
                    >
                      <Card className="rounded-2xl border border-violet-200 bg-violet-50/50 shadow-sm">
                        <CardContent className="p-4 space-y-3">
                          <p className="text-xs font-bold text-violet-700 uppercase tracking-wider">Nueva Resolución</p>
                          <MobileField label="Prefijo">
                            <Input
                              className="h-11 rounded-xl border-violet-200 bg-white text-sm"
                              placeholder="Ej: FV"
                              value={nuevaResolucion.prefix}
                              onChange={(e) => setNuevaResolucion({ ...nuevaResolucion, prefix: e.target.value })}
                            />
                          </MobileField>
                          <div className="grid grid-cols-2 gap-3">
                            <MobileField label="Desde">
                              <Input
                                type="number"
                                className="h-11 rounded-xl border-violet-200 bg-white text-sm"
                                value={nuevaResolucion.fromNumber}
                                onChange={(e) => setNuevaResolucion({ ...nuevaResolucion, fromNumber: parseInt(e.target.value) || 1 })}
                              />
                            </MobileField>
                            <MobileField label="Hasta">
                              <Input
                                type="number"
                                className="h-11 rounded-xl border-violet-200 bg-white text-sm"
                                value={nuevaResolucion.toNumber}
                                onChange={(e) => setNuevaResolucion({ ...nuevaResolucion, toNumber: parseInt(e.target.value) || 5000 })}
                              />
                            </MobileField>
                          </div>
                          <div className="flex gap-2 pt-1">
                            <Button
                              onClick={crearResolucion}
                              disabled={isCreatingResolucion}
                              className="flex-1 bg-violet-600 hover:bg-violet-700 text-white rounded-xl h-11 text-sm shadow-md shadow-violet-200"
                            >
                              <PlusIcon size={15} className="mr-1.5" />
                              {isCreatingResolucion ? "Creando…" : "Crear"}
                            </Button>
                            <Button
                              onClick={() => setShowNewResForm(false)}
                              variant="outline"
                              className="rounded-xl h-11 text-sm border-violet-200"
                            >
                              Cancelar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>

                {isLoadingResoluciones ? (
                  <div className="py-12 text-center">
                    <RefreshCw size={28} className="animate-spin text-violet-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Cargando resoluciones…</p>
                  </div>
                ) : resoluciones.length === 0 ? (
                  <div className="py-12 text-center">
                    <FileText size={36} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-500">Sin resoluciones</p>
                    <p className="text-xs text-gray-400 mt-1">Crea tu primera resolución arriba</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {resoluciones.map((r, i) => (
                      <motion.div
                        key={r.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Card className="rounded-2xl border-0 shadow-sm overflow-hidden">
                          <CardContent className="p-0">
                            <div className={`h-1 ${r.active ? "bg-gradient-to-r from-emerald-400 to-emerald-500" : "bg-gray-200"}`} />
                            <div className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-base font-bold text-gray-900">{r.prefix}</span>
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${r.active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
                                    {r.active ? <><CheckCircle2 size={11} /> Activa</> : <><XCircle size={11} /> Inactiva</>}
                                  </span>
                                </div>
                                <ChevronRight size={16} className="text-gray-300" />
                              </div>
                              <div className="grid grid-cols-3 gap-3">
                                <StatBox label="Rango" value={`${r.fromNumber}–${r.toNumber}`} />
                                <StatBox label="Consecutivo" value={String(r.currentNumber)} highlight />
                                <StatBox label="Disponibles" value={String(r.toNumber - r.currentNumber + 1)} />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
 <MobileBottomNav />
      <div className="h-6 bg-gray-50" />
    </div>
  )
}

/* ─── Helpers ─────────────────────────────────────────────── */
function MobileField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-gray-600">{label}</Label>
      {children}
    </div>
  )
}

function StatBox({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl p-2.5 text-center ${highlight ? "bg-violet-50" : "bg-gray-50"}`}>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className={`text-sm font-bold ${highlight ? "text-violet-700" : "text-gray-800"}`}>{value}</p>
    </div>
  )
}