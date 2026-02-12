"use client"

import dynamic from "next/dynamic"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DashboardHeader } from "@/components/dashboard-header"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpenIcon, HeadphonesIcon, MessageSquareIcon, SearchIcon } from 'lucide-react'
import Link from "next/link"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"



export default function SoportePage() {

  const [open, setOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<any>(null)

  const handleOpenModal = (ticket: any) => {
    setSelectedTicket(ticket)
    setOpen(true)
  }

  const tickets = [
    {
      id: "#12345",
      subject: "Problema con la facturación electrónica y errores en los totales",
      date: "18/03/2023",
      status: "En proceso",
      statusColor: "yellow",
    },
    {
      id: "#12340",
      subject: "Error al crear cita en el calendario principal",
      date: "15/03/2023",
      status: "Resuelto",
      statusColor: "green",
    },
    {
      id: "#12335",
      subject: "Solicitud de nueva funcionalidad para reportes avanzados",
      date: "10/03/2023",
      status: "Abierto",
      statusColor: "blue",
    },
  ]

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <DashboardHeader />
      <main className="flex-1 overflow-y-auto p-9 ">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Centro de Ayuda</h1>
          <p className="text-gray-500 mb-8">
            Centro de ayuda de PLC, impulsado por by power Bivoo.
          </p>


          <div className="bg-white shadow-xl rounded-xl p-8 shadow-sm mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full -mt-20 -mr-20 opacity-50"></div>
            <div className="relative z-10">
              <h2 className="text-xl font-bold mb-4">¿Cómo podemos ayudarte hoy?</h2>
              <div className="relative max-w-xl">
                <Input
                  placeholder="Buscar en la base de conocimientos..."
                  className="pl-10 py-6"
                />
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Button className="absolute right-1 top-1/2 transform -translate-y-1/2">
                  Buscar
                </Button>
              </div>
            </div>
          </div>

          <div className="hidden grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <BookOpenIcon className="h-5 w-5 text-blue-500" />
                  Base de Conocimientos
                </CardTitle>
                <CardDescription>Artículos y tutoriales</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="text-blue-600 hover:underline">Primeros pasos con Bivoo</a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:underline">Configuración de la agenda</a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:underline">Gestión de inventario</a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:underline">Facturación electrónica</a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:underline">Reportes y estadísticas</a>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Ver todos los artículos</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquareIcon className="h-5 w-5 text-green-500" />
                  Chat en Vivo
                </CardTitle>
                <CardDescription>Habla con un agente</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-500 mb-4">
                  Nuestros agentes están disponibles para ayudarte en tiempo real con cualquier duda o problema.
                </p>
                <div className="flex items-center gap-2 text-sm text-green-600 mb-4">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Agentes disponibles
                </div>
                <p className="text-xs text-gray-500">
                  Horario de atención: Lunes a Viernes, 8:00 AM - 6:00 PM
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Iniciar Chat</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <HeadphonesIcon className="h-5 w-5 text-purple-500" />
                  Soporte Telefónico
                </CardTitle>
                <CardDescription>Llámanos directamente</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-500 mb-4">
                  Si prefieres hablar con un agente por teléfono, puedes llamarnos a nuestras líneas de atención.
                </p>
                <div className="text-lg font-medium mb-2">+57 (1) 123 4567</div>
                <p className="text-xs text-gray-500">
                  Horario de atención: Lunes a Viernes, 8:00 AM - 6:00 PM
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Solicitar Llamada</Button>
              </CardFooter>
            </Card>
          </div>

          <Tabs defaultValue="tickets" className="bg-white rounded-xl shadow-sm">
            <TabsList className="w-full border-b rounded-none p-0">
              <TabsTrigger value="tickets" className="flex-1 rounded-none py-3">Mis Tickets</TabsTrigger>
              <TabsTrigger value="nuevo" className="flex-1 rounded-none py-3">Nuevo Ticket</TabsTrigger>
              <TabsTrigger value="faq" className="flex-1 hidden md:block rounded-none py-3">Preguntas Frecuentes</TabsTrigger>
            </TabsList>

            <TabsContent value="tickets" className="p-6">
              <div className="overflow-x-auto shadow-lg">
                <table className="w-full ">
                  <thead>
                    <tr className="text-left text-sm text-gray-500 border-b">
                      <th className="pb-3 font-medium">Ticket ID</th>
                      <th className="pb-3 font-medium">Asunto</th>
                      <th className="pb-3 font-medium">Fecha</th>
                      <th className="pb-3 font-medium">Estado</th>
                      <th className="pb-3 font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <TooltipProvider>
                      {tickets.map((ticket) => (
                        <tr key={ticket.id} className="border-b last:border-b-0  cursor-pointer">
                          <td className="py-3 text-purple-600 pr-5">{ticket.id}</td>

                          {/* Asunto con truncado + tooltip */}
                          <td className="py-3 max-w-[100px] md:max-w-[280px]">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <p className="truncate cursor-help">
                                  {ticket.subject}
                                </p>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-sm">
                                {ticket.subject}
                              </TooltipContent>
                            </Tooltip>
                          </td>

                          <td className="py-3">{ticket.date}</td>

                          <td className="py-3 px-5 max-w-[150px]">
                            <span
                              className={`px-2 py-1 rounded-full text-xs
                                                                    ${ticket.statusColor === "yellow"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : ticket.statusColor === "green"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                            >
                              {ticket.status}
                            </span>
                          </td>

                          <td className="py-3">
                            <button
                              onClick={() => handleOpenModal(ticket)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              Ver detalles
                            </button>
                          </td>
                        </tr>
                      ))}
                    </TooltipProvider>
                  </tbody>

                </table>
              </div>
            </TabsContent>

            <TabsContent value="nuevo" className="p-6">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-lg font-medium mb-4">Crear Nuevo Ticket de Soporte</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="ticket-asunto" className="text-sm font-medium">Asunto</label>
                    <Input id="ticket-asunto" placeholder="Describe brevemente tu problema" />
                  </div>

                  <div className="space-y-2 w-full">
                    <label htmlFor="ticket-tipo" className="text-sm font-medium">Tipo de Problema</label>
                    <Select>
                      <SelectTrigger id="ticket-tipo" className="w-full">
                        <SelectValue placeholder="Seleccionar tipo de problema" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tecnico">Problema Técnico</SelectItem>
                        <SelectItem value="facturacion">Problema de Facturación</SelectItem>
                        <SelectItem value="cuenta">Problema con mi Cuenta</SelectItem>
                        <SelectItem value="sugerencia">Sugerencia</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="ticket-prioridad" className="text-sm font-medium">Prioridad</label>
                    <Select>
                      <SelectTrigger id="ticket-prioridad" className="w-full">
                        <SelectValue placeholder="Seleccionar prioridad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baja">Baja</SelectItem>
                        <SelectItem value="media">Media</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="critica">Crítica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="ticket-descripcion" className="text-sm font-medium">Descripción</label>
                    <Textarea
                      id="ticket-descripcion"
                      placeholder="Describe detalladamente el problema que estás experimentando"
                      rows={6}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="ticket-adjunto" className="text-sm font-medium">Adjuntar Archivos (opcional)</label>
                    <div className="border-2 border-dashed rounded-md p-4 text-center">
                      <p className="text-sm text-gray-500 mb-2">Arrastra y suelta archivos aquí o haz clic para seleccionar</p>
                      <Button variant="outline" size="sm">Seleccionar Archivos</Button>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button>Enviar Ticket</Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="faq" className="p-6">
              <div className="max-w-3xl mx-auto">
                <h3 className="text-lg font-medium mb-4">Preguntas Frecuentes</h3>

                <div className="space-y-4">
                  <div className="border rounded-md p-4">
                    <h4 className="font-medium mb-2">¿Cómo puedo restablecer mi contraseña?</h4>
                    <p className="text-sm text-gray-600">
                      Para restablecer tu contraseña, haz clic en "¿Olvidaste tu contraseña?" en la pantalla de inicio de sesión.
                      Recibirás un correo electrónico con instrucciones para crear una nueva contraseña.
                    </p>
                  </div>

                  <div className="border rounded-md p-4">
                    <h4 className="font-medium mb-2">¿Cómo puedo agregar un nuevo usuario al sistema?</h4>
                    <p className="text-sm text-gray-600">
                      Para agregar un nuevo usuario, ve a Configuración {'>'} Usuarios {'>'} Nuevo Usuario. Completa la información
                      requerida y asigna los permisos correspondientes. El nuevo usuario recibirá un correo electrónico
                      con instrucciones para acceder al sistema.
                    </p>
                  </div>

                  <div className="border rounded-md p-4">
                    <h4 className="font-medium mb-2">¿Cómo puedo configurar las notificaciones por correo electrónico?</h4>
                    <p className="text-sm text-gray-600">
                      Para configurar las notificaciones, ve a Configuración {'>'} Notificaciones. Allí podrás personalizar
                      qué notificaciones deseas recibir y a través de qué canales (correo electrónico, SMS, etc.).
                    </p>
                  </div>

                  <div className="border rounded-md p-4">
                    <h4 className="font-medium mb-2">¿Cómo puedo exportar mis reportes a Excel?</h4>
                    <p className="text-sm text-gray-600">
                      En cualquier reporte, busca el botón "Exportar" o el ícono de descarga en la esquina superior derecha.
                      Selecciona "Excel" como formato de exportación y el archivo se descargará automáticamente.
                    </p>
                  </div>

                  <div className="border rounded-md p-4">
                    <h4 className="font-medium mb-2">¿Cómo puedo configurar mi impresora para imprimir facturas?</h4>
                    <p className="text-sm text-gray-600">
                      Ve a Configuración {'>'} Facturación {'>'} Impresión. Allí podrás seleccionar tu impresora predeterminada
                      y configurar el formato de impresión para tus facturas y otros documentos.
                    </p>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500 mb-2">¿No encuentras respuesta a tu pregunta?</p>
                  {/*<Button variant="outline">Ver todas las preguntas frecuentes</Button>*/}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg bg-white">
          {selectedTicket && (
            <>
              <DialogHeader>
                <DialogTitle>Detalles del Ticket</DialogTitle>
                <DialogDescription>
                  Información completa del ticket seleccionado
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Ticket ID</span>
                  <span className="font-medium">{selectedTicket.id}</span>
                </div>

                <div>
                  <span className="text-gray-500 block mb-1">Asunto</span>
                  <p className="font-medium">{selectedTicket.subject}</p>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Fecha</span>
                  <span>{selectedTicket.date}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Estado</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs
                ${selectedTicket.statusColor === "yellow"
                        ? "bg-yellow-100 text-yellow-800"
                        : selectedTicket.statusColor === "green"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                  >
                    {selectedTicket.status}
                  </span>
                </div>

                {/* Placeholder para descripción real */}
                <div>
                  <span className="text-gray-500 block mb-1">Descripción</span>
                  <p className="text-gray-600">
                    Aquí puedes mostrar la descripción completa del ticket cuando venga desde el backend.
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

    </div>

  )
}
