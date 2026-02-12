"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  PlusIcon,
  SearchIcon,
  FilterIcon,
  EyeIcon,
  EditIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AuthGuard } from "@/components/auth-guard";
import { ModuleLayout } from "@/components/module-layout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { id } from "date-fns/locale";
import { DashboardHeader } from "@/components/dashboard-header"


type Client = {
  id: string;
  name: string;
  nit: string;
  email: string;
  phone: string;
  address?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

 const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://plasticoslc.com/api/";
const API_BASE = 'https://plasticoslc.com/api'

export default function ClientesPage() {
  // States
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  const [selectedCliente, setSelectedCliente] = useState<Client | null>(null);

  const [isNewClientOpen, setIsNewClientOpen] = useState(false);
  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [isDeleteClientOpen, setIsDeleteClientOpen] = useState(false);
  const [isViewClientOpen, setIsViewClientOpen] = useState(false);
  const [isLoadingEditData, setIsLoadingEditData] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Form states
  const emptyNewClient: Omit<Client, "id" | "createdAt" | "updatedAt" | "active"> = {
    name: "",
    nit: "",
    email: "",
    phone: "",
    address: "",
  };
  const [newClient, setNewClient] = useState<Omit<Client, "id" | "createdAt" | "updatedAt" | "active">>(emptyNewClient);
  const [editClient, setEditClient] = useState<Omit<Client, "id" | "createdAt" | "updatedAt" | "active">>(emptyNewClient);

  // Helpers
  const getToken = (): string | null => {
    try {
      return sessionStorage.getItem("token");
    } catch (err) {
      console.warn("sessionStorage unavailable", err);
      return null;
    }
  };

  // Normalize accents for search
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  // Filter clients based on search term
  const filteredClients = clients.filter(cliente => {
    const searchNormalized = normalizeText(searchTerm);
    return (
      normalizeText(cliente.name).includes(searchNormalized) ||
      normalizeText(cliente.nit).includes(searchNormalized) ||
      normalizeText(cliente.email).includes(searchNormalized) ||
      normalizeText(cliente.phone).includes(searchNormalized)
    );
  });

  // Calculate total pages based on filtered results
  const totalPages = Math.max(1, Math.ceil(filteredClients.length / itemsPerPage));



  // Fetch clients from API
  const fetchClients = async () => {
    setLoading(true);
    try {
      const token = getToken();

      const res = await fetch(`${apiBase}/customers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        console.error("Failed fetching clients", res.status, await res.text());
        setLoading(false);
        return;
      }

      const data = await res.json();
      const arr: any[] = Array.isArray(data) ? data : data?.data ?? [];

      const normalized: Client[] = arr.map((c: any) => ({
        id: c.id,
        name: c.name ?? "",
        nit: c.nit ?? "",
        email: c.email ?? "",
        phone: c.phone ?? "",
        address: c.address ?? "",
        active: c.active ?? true,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      }));

      setClients(normalized);
    } catch (err) {
      console.error("Error fetching clients:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pagination slice
  const paginatedClientes = filteredClients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Create client
  const handleCreateClient = async () => {
    try {
      const token = getToken();

      const payload = { ...newClient };

      const res = await fetch(`${apiBase}/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Create client failed:", res.status, text);
        alert("Error al crear cliente. Revisa la consola.");
        return;
      }

      // Refresh list
      await fetchClients();
      setIsNewClientOpen(false);
      setNewClient(emptyNewClient);
      setCurrentPage(1);
    } catch (err) {
      console.error("Error creating client:", err);
      alert("Error al crear cliente. Revisa la consola.");
    }
  };

  // Open edit modal and fetch client data by ID
  const openEditModal = async (client: Client) => {
    setSelectedCliente(client);
    setIsLoadingEditData(true);
    
    try {
      const token = getToken();
      
      const res = await fetch(`${apiBase}/customers/${client.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        console.error("Failed fetching client details", res.status, await res.text());
        alert("Error al cargar los datos del cliente");
        setIsLoadingEditData(false);
        return;
      }

      const data = await res.json();
      setEditClient({
        name: data.name ?? "",
        nit: data.nit ?? "",
        email: data.email ?? "",
        phone: data.phone ?? "",
        address: data.address ?? "",
      });
    } catch (err) {
      console.error("Error fetching client details:", err);
      alert("Error al cargar los datos del cliente");
    } finally {
      setIsLoadingEditData(false);
      setIsEditClientOpen(true);
    }
  };

  // Edit client (PUT)
  const handleEditClient = async () => {
    if (!selectedCliente) return alert("No hay cliente seleccionado");

    try {
      const token = getToken();
      const payload = { ...editClient };

      const res = await fetch(`${apiBase}/customers/${selectedCliente.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("Update failed", res.status, await res.text());
        alert("Error al actualizar cliente");
        return;
      }

      await fetchClients();
      setIsEditClientOpen(false);
      setSelectedCliente(null);
    } catch (err) {
      console.error("Error updating client:", err);
      alert("Error al actualizar cliente");
    }
  };

  // Delete client
  const handleEliminar = async () => {
    if (!selectedCliente) return;
    try {
      const token = getToken();
      const res = await fetch(`${apiBase}/customers/${selectedCliente.id}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) {
        console.error("Delete failed", res.status, await res.text());
        alert("Error al eliminar cliente");
        return;
      }
      await fetchClients();
      setIsDeleteClientOpen(false);
      setSelectedCliente(null);
    } catch (err) {
      console.error("Error deleting client:", err);
      alert("Error al eliminar cliente");
    }
  };

  // Open view modal and set selected
  const openViewModal = (client: Client) => {
    setSelectedCliente(client);
    setIsViewClientOpen(true);
  };

  // UI helpers
  const formatDateInputValue = (iso?: string) => {
    if (!iso) return "";
    return iso.split("T")[0];
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <DashboardHeader />
      <main className="flex-1 overflow-y-auto md:p-9">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Clientes</h1>

            <Button
              className="bg-blue-950 hover:bg-blue-800 text-white flex items-center justify-center gap-2 text-sm sm:text-base px-4 py-2"
              onClick={() => setIsNewClientOpen(true)}
            >
              <PlusIcon className="h-4 w-4" />
              <span>Nuevo Cliente</span>
            </Button>
          </div>

          {/* Search / filters */}
          <div className="bg-white shadow-xl p-4 rounded-lg  mb-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  placeholder="Buscar cliente por nombre, NIT, email o teléfono..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-white pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-bivoo-purple focus:outline-none text-sm sm:text-base"
                />
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>

              <div className="flex hidden flex-col sm:flex-row gap-2 w-full md:w-auto">
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-2 w-full sm:w-auto text-sm sm:text-base"
                >
                  <FilterIcon className="h-4 w-4" />
                  Filtrar
                </Button>

                <select
                  className="border bg-white rounded-lg px-3 py-2 text-sm sm:text-base w-full sm:w-auto focus:ring-2 focus:ring-bivoo-purple focus:outline-none"
                >
                  <option>Todos</option>
                  <option>Con correo</option>
                  <option>Sin correo</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table / Cards */}
          <div className="bg-white shadow-xl rounded-lg shadow-sm overflow-hidden mb-6">
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIT</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr><td colSpan={5} className="px-6 py-4 text-sm text-gray-500">Cargando clientes...</td></tr>
                  ) : paginatedClientes.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-4 text-sm text-gray-500">No hay clientes</td></tr>
                  ) : (
                    paginatedClientes.map(cliente => (
                      <motion.tr key={cliente.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cliente.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cliente.nit}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cliente.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cliente.phone}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800" onClick={() => openViewModal(cliente)}>
                              <EyeIcon className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-800" onClick={() => openEditModal(cliente)}>
                              <EditIcon className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800" onClick={() => { setSelectedCliente(cliente); setIsDeleteClientOpen(true); }}>
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden">
              <div className="divide-y divide-gray-200">
                {loading ? (
                  <div className="p-4 text-sm text-gray-500">Cargando clientes...</div>
                ) : paginatedClientes.length === 0 ? (
                  <div className="p-4 text-sm text-gray-500">No hay clientes</div>
                ) : (
                  paginatedClientes.map(cliente => (
                    <motion.div key={cliente.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="p-4 flex flex-col space-y-2 hover:bg-gray-50">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-semibold text-gray-900">{cliente.name}</h3>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-800" onClick={() => openViewModal(cliente)}>
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-amber-600 hover:text-amber-800" onClick={() => openEditModal(cliente)}>
                            <EditIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-800" onClick={() => { setSelectedCliente(cliente); setIsDeleteClientOpen(true); }}>
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500"><span className="font-semibold">NIT:</span> {cliente.nit}</p>
                      <p className="text-xs text-gray-500"><span className="font-semibold">Correo:</span> {cliente.email}</p>
                      <p className="text-xs text-gray-500"><span className="font-semibold">Teléfono:</span> {cliente.phone}</p>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Pagination */}
            <div className="px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between border-t gap-3">
              <div className="text-xs md:text-sm text-gray-500 text-center md:text-left">
                Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, filteredClients.length)} de {filteredClients.length} clientes
              </div>
              <div className="flex flex-wrap justify-center md:justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}><ChevronLeftIcon className="h-4 w-4" /></Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button key={page} variant={currentPage === page ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(page)}>{page}</Button>
                ))}
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}><ChevronRightIcon className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>

          {/* Create Client Modal */}
          <Dialog open={isNewClientOpen} onOpenChange={(open) => setIsNewClientOpen(open)}>
            <DialogContent className="w-[95vw] bg-white sm:max-w-[520px] max-h-[90vh] overflow-y-auto rounded-xl p-4 sm:p-6 shadow-lg">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl font-semibold text-center sm:text-left">Crear Nuevo Cliente</DialogTitle>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input id="name" value={newClient.name} onChange={e => setNewClient({ ...newClient, name: e.target.value })} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="nit">NIT</Label>
                  <Input id="nit" value={newClient.nit} onChange={e => setNewClient({ ...newClient, nit: e.target.value })} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={newClient.email} onChange={e => setNewClient({ ...newClient, email: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" value={newClient.phone} onChange={e => setNewClient({ ...newClient, phone: e.target.value })} />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input id="address" value={newClient.address} onChange={e => setNewClient({ ...newClient, address: e.target.value })} />
                </div>
              </div>

              <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
                <Button variant="outline" onClick={() => { setIsNewClientOpen(false); setNewClient(emptyNewClient); }} className="w-full sm:w-auto">Cancelar</Button>
                <Button onClick={handleCreateClient} className="w-full sm:w-auto bg-purple-500 hover:bg-purple-700 text-white">Guardar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Client Modal */}
          <Dialog open={isEditClientOpen} onOpenChange={(open) => setIsEditClientOpen(open)}>
            <DialogContent className="w-[90vw] bg-white sm:max-w-[520px] max-h-[85vh] overflow-y-auto rounded-2xl p-4 sm:p-6">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl font-bold text-center sm:text-left text-gray-800">Editar Cliente</DialogTitle>
                <p className="text-sm text-gray-500 text-center sm:text-left">Actualiza los datos del cliente y guarda los cambios.</p>
              </DialogHeader>

              {isLoadingEditData ? (
                <div className="py-8 text-center">
                  <p className="text-gray-500">Cargando datos del cliente...</p>
                </div>
              ) : (
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit_name">Nombre</Label>
                    <Input id="edit_name" value={editClient.name} onChange={e => setEditClient({ ...editClient, name: e.target.value })} />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="edit_nit">NIT</Label>
                    <Input id="edit_nit" value={editClient.nit} onChange={e => setEditClient({ ...editClient, nit: e.target.value })} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit_email">Email</Label>
                      <Input id="edit_email" type="email" value={editClient.email} onChange={e => setEditClient({ ...editClient, email: e.target.value })} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit_phone">Teléfono</Label>
                      <Input id="edit_phone" value={editClient.phone} onChange={e => setEditClient({ ...editClient, phone: e.target.value })} />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="edit_address">Dirección</Label>
                    <Input id="edit_address" value={editClient.address} onChange={e => setEditClient({ ...editClient, address: e.target.value })} />
                  </div>
                </div>
              )}

              <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
                <Button variant="outline" onClick={() => { setIsEditClientOpen(false); setEditClient(emptyNewClient); }} className="w-full sm:w-auto hover:bg-red-800">Cancelar</Button>
                <Button onClick={handleEditClient} disabled={isLoadingEditData} className="w-full sm:w-auto bg-blue-800 text-white">Guardar Cambios</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Modal */}
          <Dialog open={isDeleteClientOpen} onOpenChange={(open) => setIsDeleteClientOpen(open)}>
            <DialogContent className="w-[90vw] bg-white sm:max-w-md rounded-2xl p-4 sm:p-6 text-center">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl font-semibold">¿Eliminar cliente permanentemente?</DialogTitle>
              </DialogHeader>
              <div className="p-4 flex flex-col items-center">
                <TrashIcon className="h-12 w-12 text-red-600 mb-3" />
                <p className="mb-4 text-gray-600 text-sm sm:text-base">
                  Esta acción no se puede deshacer. ¿Estás seguro de eliminar a <span className="font-bold">{selectedCliente?.firstName} {selectedCliente?.lastName}</span>?
                </p>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto justify-center">
                  <Button variant="outline" className="w-full sm:w-auto" onClick={() => setIsDeleteClientOpen(false)}>Cancelar</Button>
                  <Button variant="destructive" className="w-full sm:w-auto" onClick={handleEliminar}>Eliminar</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* View Modal */}
          <Dialog open={isViewClientOpen} onOpenChange={(open) => setIsViewClientOpen(open)}>
            <DialogContent className="w-[90vw] bg-white sm:max-w-[520px] max-h-[85vh] overflow-y-auto rounded-2xl p-4 sm:p-6">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl font-semibold text-center sm:text-left">Información del Cliente</DialogTitle>
              </DialogHeader>

              {selectedCliente ? (
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Nombre</Label>
                    <Input value={selectedCliente.name} readOnly className="bg-gray-100 cursor-not-allowed" />
                  </div>

                  <div className="grid gap-2">
                    <Label>NIT</Label>
                    <Input value={selectedCliente.nit} readOnly className="bg-gray-100 cursor-not-allowed" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Correo Electrónico</Label>
                      <Input value={selectedCliente.email} readOnly className="bg-gray-100 cursor-not-allowed" />
                    </div>
                    <div className="grid gap-2">
                      <Label>Teléfono</Label>
                      <Input value={selectedCliente.phone} readOnly className="bg-gray-100 cursor-not-allowed" />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label>Dirección</Label>
                    <Input value={selectedCliente.address || ""} readOnly className="bg-gray-100 cursor-not-allowed" />
                  </div>

                  {selectedCliente.active !== undefined && (
                    <div className="grid gap-2">
                      <Label>Estado</Label>
                      <Input value={selectedCliente.active ? "Activo" : "Inactivo"} readOnly className="bg-gray-100 cursor-not-allowed" />
                    </div>
                  )}

                  {selectedCliente.createdAt && (
                    <div className="grid gap-2">
                      <Label>Creado</Label>
                      <Input value={formatDateInputValue(selectedCliente.createdAt)} readOnly className="bg-gray-100 cursor-not-allowed" />
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">No se ha seleccionado ningún cliente.</p>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsViewClientOpen(false)}>Cerrar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>
      </main>
    </div>

  );
}
