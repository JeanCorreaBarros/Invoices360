"use client"

import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import toast from "react-hot-toast"
import { DashboardHeader } from "@/components/dashboard-header"
import { AuthGuard } from "@/components/auth-guard"
import { ModuleLayout } from "@/components/module-layout"
import { motion } from "framer-motion"
import { SaveIcon, PlusIcon, TrashIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)

    const handleChange = () => setIsMobile(mediaQuery.matches)

    handleChange()
    mediaQuery.addEventListener("change", handleChange)

    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [breakpoint])

  return isMobile
}

export default function ConfiguracionPage() {
  const [consecutivo, setConsecutivo] = useState(1)
  const [prefijo, setPrefijo] = useState("BIVOO-")
  const [impuestos, setImpuestos] = useState([
    { id: 1, nombre: "IVA", porcentaje: 19, activo: true },
    { id: 2, nombre: "Retención en la fuente", porcentaje: 4, activo: true },
    { id: 3, nombre: "ICA", porcentaje: 0.69, activo: false },
  ])
  const [formasPago, setFormasPago] = useState([
    { id: 1, nombre: "Efectivo", activo: true },
    { id: 2, nombre: "Tarjeta de crédito", activo: true },
    { id: 3, nombre: "Tarjeta débito", activo: true },
    { id: 4, nombre: "Transferencia bancaria", activo: true },
    { id: 5, nombre: "Cheque", activo: false },
  ])
  const [terminosCondiciones, setTerminosCondiciones] = useState(
    "Esta factura se emite en todos sus efectos a una letra de cambio de conformidad con el Art. 774 del Código de comercio. Autorizo que en caso de incumplimiento de esta obligación sea reportada a las centrales de riesgo.",
  )

  // Estados para datos de empresa
  const [empresaData, setEmpresaData] = useState({
    businessName: "",
    tradeName: "",
    nit: "",
    dv: "",
    legalRepresentative: "",
    legalRepId: "",
    taxRegime: "",
    taxResponsibility: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    department: "",
    primaryColor: "#1D4ED8",
  })
  const [empresaId, setEmpresaId] = useState<string | null>(null)
  const [logo, setLogo] = useState<string | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [isSavingCompany, setIsSavingCompany] = useState(false)
  const [isLoadingCompany, setIsLoadingCompany] = useState(true)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)

  // Cargar datos de empresa al montar el componente
  useEffect(() => {
    const cargarDatosEmpresa = async () => {
      try {
        setIsLoadingCompany(true)
        const token = sessionStorage.getItem("token")

        const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://plasticoslc.com/api/";
        const apiUrl = `${apiBase}companies`
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Authorization": token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        })

        if (response.ok) {
          const result = await response.json()
          if (result.ok && result.data && result.data.length > 0) {
            const companyData = result.data[0]
            setEmpresaId(companyData.id || null)
            setLogo(getLogoUrl(companyData.logo) || null)
            setEmpresaData({
              businessName: companyData.businessName || "",
              tradeName: companyData.tradeName || "",
              nit: companyData.nit || "",
              dv: companyData.dv || "",
              legalRepresentative: companyData.legalRepresentative || "",
              legalRepId: companyData.legalRepId || "",
              taxRegime: companyData.taxRegime || "",
              taxResponsibility: companyData.taxResponsibility || "",
              email: companyData.email || "",
              phone: companyData.phone || "",
              address: companyData.address || "",
              city: companyData.city || "",
              department: companyData.department || "",
              primaryColor: companyData.primaryColor || "#1D4ED8",
            })
          }
        }
      } catch (err) {
        console.error("Error al cargar datos de empresa:", err)
      } finally {
        setIsLoadingCompany(false)
      }
    }

    cargarDatosEmpresa()
  }, [])

  // Animaciones con Framer Motion
  // Animaciones con Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
      },
    },
  }

  // Función para agregar un nuevo impuesto
  const agregarImpuesto = () => {
    const nuevoId = impuestos.length > 0 ? Math.max(...impuestos.map((i) => i.id)) + 1 : 1
    setImpuestos([...impuestos, { id: nuevoId, nombre: "Nuevo impuesto", porcentaje: 0, activo: true }])
  }

  // Función para eliminar un impuesto
  const eliminarImpuesto = (id: number) => {
    setImpuestos(impuestos.filter((impuesto) => impuesto.id !== id))
  }

  // Función para actualizar un impuesto
  const actualizarImpuesto = (id: number, campo: string, valor: any) => {
    setImpuestos(impuestos.map((impuesto) => (impuesto.id === id ? { ...impuesto, [campo]: valor } : impuesto)))
  }

  // Función para agregar una nueva forma de pago
  const agregarFormaPago = () => {
    const nuevoId = formasPago.length > 0 ? Math.max(...formasPago.map((f) => f.id)) + 1 : 1
    setFormasPago([...formasPago, { id: nuevoId, nombre: "Nueva forma de pago", activo: true }])
  }

  // Función para eliminar una forma de pago
  const eliminarFormaPago = (id: number) => {
    setFormasPago(formasPago.filter((forma) => forma.id !== id))
  }

  // Función para actualizar una forma de pago
  const actualizarFormaPago = (id: number, campo: string, valor: any) => {
    setFormasPago(formasPago.map((forma) => (forma.id === id ? { ...forma, [campo]: valor } : forma)))
  }

  // Función para seleccionar logo y crear preview
  const handleLogoSelect = (file: File) => {
    setLogoFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setLogoPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Función para subir logo
  const subirLogo = async () => {
    try {
      if (!logoFile) {
        toast.error("Selecciona un archivo primero")
        return
      }

      if (!empresaId) {
        toast.error("Primero debes guardar la empresa")
        return
      }

      setIsUploadingLogo(true)
      const token = sessionStorage.getItem("token")

      if (!token) {
        toast.error("Token de autenticación no encontrado")
        return
      }

      const formData = new FormData()
      formData.append("logo", logoFile)

      const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://plasticoslc.com/api/"
      const apiUrl = `${apiBase}companies/${empresaId}/logo`

      const response = await fetch(apiUrl, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Error al subir el logo")
      }

      const result = await response.json()
      setLogo(getLogoUrl(result.data?.logo) || null)
      setLogoFile(null)
      setLogoPreview(null)
      toast.success("Logo subido correctamente")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al subir el logo")
    } finally {
      setIsUploadingLogo(false)
    }
  }

  // Función para cancelar selección
  const cancelarLogoSelect = () => {
    setLogoFile(null)
    setLogoPreview(null)
  }

  // Función para construir URL completa del logo
  const getLogoUrl = (logoPath: string | null): string | null => {
    if (!logoPath) return null
    if (logoPath.startsWith('http')) return logoPath
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://plasticoslc.com/api/"
    const baseUrl = apiBase.replace('/api/', '')
    return `${baseUrl}${logoPath}`
  }

  // Función para guardar datos de empresa
  const guardarDatosEmpresa = async () => {
    try {
      setIsSavingCompany(true)
      const token = sessionStorage.getItem("token")

      if (!token) {
        toast.error("Token de autenticación no encontrado")
        return
      }

      const isUpdate = empresaId !== null
      const method = isUpdate ? "PUT" : "POST"
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://plasticoslc.com/api/";
      const apiUrl = isUpdate
        ? `${apiBase}companies/${empresaId}`
        : `${apiBase}companies`

      const response = await fetch(apiUrl, {
        method: method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(empresaData),
      })

      if (!response.ok) {
        throw new Error(isUpdate ? "Error al actualizar datos de empresa" : "Error al guardar datos de empresa")
      }

      toast.success(isUpdate ? "Datos de empresa actualizados correctamente" : "Datos de empresa guardados correctamente")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setIsSavingCompany(false)
    }
  }

  const isMobile = useIsMobile()
  const logoInputRef = useRef<HTMLInputElement>(null)
  if (isMobile === null) return null // evita parpadeos / hydration

  if (!isMobile) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-9">
          <div className="flex min-h-screen ">
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
                  </TabsList>

                  <TabsContent value="info-general">
                    <motion.div >
                      <Card className="shadow-xl ">
                        <CardHeader>
                          <CardTitle>Información General</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {empresaId && (
                            <div className="space-y-2">
                              <Label>Logo de la Empresa</Label>
                              {logoPreview ? (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center gap-4">
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
                                    onChange={(e) => {
                                      const file = e.target.files?.[0]
                                      if (file) handleLogoSelect(file)
                                    }}
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
                          <div className="space-y-2">
                            <Label htmlFor="business-name">Razón Social</Label>
                            <Input
                              id="business-name"
                              value={empresaData.businessName}
                              onChange={(e) => setEmpresaData({ ...empresaData, businessName: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="trade-name">Nombre Comercial</Label>
                            <Input
                              id="trade-name"
                              value={empresaData.tradeName}
                              onChange={(e) => setEmpresaData({ ...empresaData, tradeName: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="nit">NIT</Label>
                            <Input
                              id="nit"
                              value={empresaData.nit}
                              onChange={(e) => setEmpresaData({ ...empresaData, nit: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="dv">Dígito de Verificación</Label>
                            <Input
                              id="dv"
                              value={empresaData.dv}
                              onChange={(e) => setEmpresaData({ ...empresaData, dv: e.target.value })}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="legal">
                    <motion.div  >
                      <Card className="shadow-xl ">
                        <CardHeader>
                          <CardTitle>Representante Legal</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="legal-rep">Nombre Representante Legal</Label>
                            <Input
                              id="legal-rep"
                              value={empresaData.legalRepresentative}
                              onChange={(e) => setEmpresaData({ ...empresaData, legalRepresentative: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="legal-rep-id">Cédula Representante Legal</Label>
                            <Input
                              id="legal-rep-id"
                              value={empresaData.legalRepId}
                              onChange={(e) => setEmpresaData({ ...empresaData, legalRepId: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="tax-regime">Régimen Tributario</Label>
                            <Input
                              id="tax-regime"
                              value={empresaData.taxRegime}
                              onChange={(e) => setEmpresaData({ ...empresaData, taxRegime: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="tax-resp">Responsabilidad Tributaria</Label>
                            <Input
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
                    <motion.div >
                      <Card className="shadow-xl ">
                        <CardHeader>
                          <CardTitle>Contacto</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={empresaData.email}
                              onChange={(e) => setEmpresaData({ ...empresaData, email: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Teléfono</Label>
                            <Input
                              id="phone"
                              value={empresaData.phone}
                              onChange={(e) => setEmpresaData({ ...empresaData, phone: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="address">Dirección</Label>
                            <Input
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
                    <motion.div >
                      <Card className="shadow-xl ">
                        <CardHeader>
                          <CardTitle>Ubicación</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="city">Ciudad</Label>
                            <Input
                              id="city"
                              value={empresaData.city}
                              onChange={(e) => setEmpresaData({ ...empresaData, city: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="department">Departamento</Label>
                            <Input
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
                                className="w-12 h-10 p-1"
                              />
                              <Input
                                value={empresaData.primaryColor}
                                onChange={(e) => setEmpresaData({ ...empresaData, primaryColor: e.target.value })}
                                className="flex-1"
                              />
                            </div>
                          </div>
                          <Button
                            onClick={guardarDatosEmpresa}
                            disabled={isSavingCompany}
                            className="w-full hidden bg-purple-600 hover:bg-purple-700 hover:scale-95 text-white mt-4"
                          >
                            <SaveIcon className="mr-2 h-4 w-4" />
                            {isSavingCompany ? "Guardando..." : "Guardar Datos de Empresa"}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>
                </Tabs>
              </motion.main>
            </div>
          </div>
        </main>
      </div>

    )
  }

  if (isMobile) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-9">
          <div className="flex min-h-screen">
            <div className="flex flex-col flex-1 overflow-hidden">
              <motion.main
                className="flex-1 overflow-y-auto"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                {/* HEADER */}
                <motion.div
                  className="
                  mb-6
                  flex flex-col gap-4
                  sm:flex-row sm:items-center sm:justify-between
                "
                  variants={itemVariants}
                >
                  <h1 className="text-xl sm:text-2xl font-bold">
                    Configuración
                  </h1>

                  <Button
                    onClick={guardarDatosEmpresa}
                    disabled={isLoadingCompany || isSavingCompany}
                    className="
                    w-full sm:w-auto
                    bg-purple-600 hover:bg-purple-700 text-white
                  "
                  >
                    <SaveIcon className="mr-2 h-4 w-4" />
                    {empresaId ? "Actualizar empresa" : "Guardar empresa"}
                  </Button>
                </motion.div>

                {/* TABS */}
                <Tabs defaultValue="info-general" className="w-full">
                  <TabsList
                    className="
                    mb-6
                    flex gap-2
                    overflow-x-auto sm:overflow-visible
                  "
                  >
                    <TabsTrigger value="info-general" className="whitespace-nowrap">
                      Información General
                    </TabsTrigger>
                    <TabsTrigger value="legal" className="whitespace-nowrap">
                      Representante Legal
                    </TabsTrigger>
                    <TabsTrigger value="contacto" className="whitespace-nowrap">
                      Contacto
                    </TabsTrigger>
                    <TabsTrigger value="ubicacion" className="whitespace-nowrap">
                      Ubicación
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="info-general">
                    <Card>
                      <CardHeader>
                        <CardTitle>Información General</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {empresaId && (
                          <div className="space-y-2">
                            <Label>Logo de la Empresa</Label>
                            {logoPreview ? (
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center gap-3">
                                <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                  <img src={logoPreview} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                                <p className="text-sm text-gray-600 text-center">Preview del logo a subir</p>
                                <div className="flex gap-2 w-full">
                                  <Button
                                    type="button"
                                    onClick={subirLogo}
                                    disabled={isUploadingLogo}
                                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white h-11"
                                  >
                                    {isUploadingLogo ? "Subiendo..." : "Confirmar Subida"}
                                  </Button>
                                  <Button
                                    type="button"
                                    onClick={cancelarLogoSelect}
                                    disabled={isUploadingLogo}
                                    variant="outline"
                                    className="flex-1 h-11"
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
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) handleLogoSelect(file)
                                  }}
                                  className="hidden"
                                />
                                {logo ? (
                                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center gap-3 hover:border-purple-500 transition-colors">
                                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                      <img src={logo} alt="Logo" className="w-full h-full object-cover" />
                                    </div>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={() => logoInputRef.current?.click()}
                                      className="w-full h-11"
                                    >
                                      Cambiar Logo
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center gap-2 hover:border-purple-500 transition-colors">
                                    <p className="text-gray-500 font-medium text-center">Utilizar mi logo</p>
                                    <Button
                                      type="button"
                                      className="mt-2 h-10"
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
                        <div className="space-y-2">
                          <Label htmlFor="business-name-m">Razón Social</Label>
                          <Input
                            id="business-name-m"
                            className="h-11"
                            value={empresaData.businessName}
                            onChange={(e) => setEmpresaData({ ...empresaData, businessName: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="trade-name-m">Nombre Comercial</Label>
                          <Input
                            id="trade-name-m"
                            className="h-11"
                            value={empresaData.tradeName}
                            onChange={(e) => setEmpresaData({ ...empresaData, tradeName: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nit-m">NIT</Label>
                          <Input
                            id="nit-m"
                            className="h-11"
                            value={empresaData.nit}
                            onChange={(e) => setEmpresaData({ ...empresaData, nit: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dv-m">Dígito de Verificación</Label>
                          <Input
                            id="dv-m"
                            className="h-11"
                            value={empresaData.dv}
                            onChange={(e) => setEmpresaData({ ...empresaData, dv: e.target.value })}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="legal">
                    <Card>
                      <CardHeader>
                        <CardTitle>Representante Legal</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="legal-rep-m">Nombre Representante Legal</Label>
                          <Input
                            id="legal-rep-m"
                            className="h-11"
                            value={empresaData.legalRepresentative}
                            onChange={(e) => setEmpresaData({ ...empresaData, legalRepresentative: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="legal-rep-id-m">Cédula Representante Legal</Label>
                          <Input
                            id="legal-rep-id-m"
                            className="h-11"
                            value={empresaData.legalRepId}
                            onChange={(e) => setEmpresaData({ ...empresaData, legalRepId: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tax-regime-m">Régimen Tributario</Label>
                          <Input
                            id="tax-regime-m"
                            className="h-11"
                            value={empresaData.taxRegime}
                            onChange={(e) => setEmpresaData({ ...empresaData, taxRegime: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tax-resp-m">Responsabilidad Tributaria</Label>
                          <Input
                            id="tax-resp-m"
                            className="h-11"
                            value={empresaData.taxResponsibility}
                            onChange={(e) => setEmpresaData({ ...empresaData, taxResponsibility: e.target.value })}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="contacto">
                    <Card>
                      <CardHeader>
                        <CardTitle>Contacto</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email-m">Email</Label>
                          <Input
                            id="email-m"
                            className="h-11"
                            type="email"
                            value={empresaData.email}
                            onChange={(e) => setEmpresaData({ ...empresaData, email: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone-m">Teléfono</Label>
                          <Input
                            id="phone-m"
                            className="h-11"
                            value={empresaData.phone}
                            onChange={(e) => setEmpresaData({ ...empresaData, phone: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address-m">Dirección</Label>
                          <Input
                            id="address-m"
                            className="h-11"
                            value={empresaData.address}
                            onChange={(e) => setEmpresaData({ ...empresaData, address: e.target.value })}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="ubicacion">
                    <Card>
                      <CardHeader>
                        <CardTitle>Ubicación</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="city-m">Ciudad</Label>
                          <Input
                            id="city-m"
                            className="h-11"
                            value={empresaData.city}
                            onChange={(e) => setEmpresaData({ ...empresaData, city: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="department-m">Departamento</Label>
                          <Input
                            id="department-m"
                            className="h-11"
                            value={empresaData.department}
                            onChange={(e) => setEmpresaData({ ...empresaData, department: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="primary-color-m">Color Primario</Label>
                          <div className="flex gap-2">
                            <Input
                              id="primary-color-m"
                              type="color"
                              value={empresaData.primaryColor}
                              onChange={(e) => setEmpresaData({ ...empresaData, primaryColor: e.target.value })}
                              className="w-12 h-10 p-1"
                            />
                            <Input
                              value={empresaData.primaryColor}
                              onChange={(e) => setEmpresaData({ ...empresaData, primaryColor: e.target.value })}
                              className="flex-1"
                            />
                          </div>
                        </div>
                        <Button
                          onClick={guardarDatosEmpresa}
                          disabled={isSavingCompany}
                          className="w-full bg-purple-600 hidden hover:bg-purple-700 hover:scale-95 text-white mt-4"
                        >
                          <SaveIcon className="mr-2 h-4 w-4" />
                          {isSavingCompany ? "Guardando..." : "Guardar Datos de Empresa"}
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </motion.main>
            </div>
          </div>
        </main>
      </div>

    )
  }
}
