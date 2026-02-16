"use client";

import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import {
  PlusIcon,
  SearchIcon,
  EyeIcon,
  EditIcon,
  Power,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardHeader } from "@/components/dashboard-header";

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

// ─── Shared field component ───────────────────────────────────────────────────
function Field({ label, value, id, onChange, readOnly = false, type = "text" }: {
  label: string; value: string; id?: string; type?: string;
  onChange?: (v: string) => void; readOnly?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</Label>
      <Input
        id={id} type={type} value={value} readOnly={readOnly}
        onChange={e => onChange?.(e.target.value)}
        className={`h-11 text-base rounded-lg border-gray-200 ${readOnly ? "bg-gray-50 cursor-not-allowed text-gray-600" : "focus:ring-2 focus:ring-blue-500 focus:border-transparent"}`}
      />
    </div>
  );
}

// ─── Client Card (mobile) ─────────────────────────────────────────────────────
function ClientCard({ cliente, onView, onEdit, onToggle }: {
  cliente: Client;
  onView: () => void; onEdit: () => void; onToggle: () => void;
}) {
  const initials = cliente.name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-3"
    >
      {/* Top row */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-950 flex items-center justify-center shrink-0">
          <span className="text-white text-sm font-bold">{initials || "?"}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate text-sm">{cliente.name}</p>
          <p className="text-xs text-gray-500 truncate">NIT: {cliente.nit}</p>
        </div>
        <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${cliente.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
          {cliente.active ? "Activo" : "Inactivo"}
        </span>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        <div>
          <span className="text-gray-400">Correo</span>
          <p className="text-gray-700 truncate">{cliente.email || "—"}</p>
        </div>
        <div>
          <span className="text-gray-400">Teléfono</span>
          <p className="text-gray-700">{cliente.phone || "—"}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-gray-100">
        <button onClick={onView} className="flex flex-col items-center gap-1 py-2 rounded-xl hover:bg-blue-50 transition-colors text-blue-600">
          <EyeIcon className="h-4 w-4" />
          <span className="text-[10px] font-medium">Ver</span>
        </button>
        <button onClick={onEdit} className="flex flex-col items-center gap-1 py-2 rounded-xl hover:bg-amber-50 transition-colors text-amber-600">
          <EditIcon className="h-4 w-4" />
          <span className="text-[10px] font-medium">Editar</span>
        </button>
        <button onClick={onToggle} className={`flex flex-col items-center gap-1 py-2 rounded-xl transition-colors ${cliente.active ? "hover:bg-red-50 text-green-600 hover:text-red-500" : "hover:bg-green-50 text-gray-400 hover:text-green-600"}`}>
          <Power className="h-4 w-4" />
          <span className="text-[10px] font-medium">{cliente.active ? "Desact." : "Activar"}</span>
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [selectedCliente, setSelectedCliente] = useState<Client | null>(null);
  const [isNewClientOpen, setIsNewClientOpen] = useState(false);
  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [isDeleteClientOpen, setIsDeleteClientOpen] = useState(false);
  const [isViewClientOpen, setIsViewClientOpen] = useState(false);
  const [isLoadingEditData, setIsLoadingEditData] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const emptyClient = { name: "", nit: "", email: "", phone: "", address: "" };
  const [newClient, setNewClient] = useState(emptyClient);
  const [editClient, setEditClient] = useState(emptyClient);

  const getToken = () => { try { return sessionStorage.getItem("token") } catch { return null } };
  const normalizeText = (t: string) => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const filteredClients = clients.filter(c => {
    const s = normalizeText(searchTerm);
    return [c.name, c.nit, c.email, c.phone].some(f => normalizeText(f ?? "").includes(s));
  });

  const totalPages = Math.max(1, Math.ceil(filteredClients.length / itemsPerPage));
  const paginatedClientes = filteredClients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetch(`${apiBase}/customers`, {
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (!res.ok) return;
      const data = await res.json();
      const arr: any[] = Array.isArray(data) ? data : data?.data ?? [];
      setClients(arr.map(c => ({ id: c.id, name: c.name ?? "", nit: c.nit ?? "", email: c.email ?? "", phone: c.phone ?? "", address: c.address ?? "", active: c.active ?? true, createdAt: c.createdAt, updatedAt: c.updatedAt })));
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  };

  useEffect(() => { fetchClients() }, []);

  const handleCreateClient = async () => {
    try {
      const token = getToken();
      const res = await fetch(`${apiBase}/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(newClient),
      });
      if (!res.ok) { toast.error("Error al crear cliente"); return; }
      await fetchClients();
      setIsNewClientOpen(false);
      setNewClient(emptyClient);
      setCurrentPage(1);
      toast.success("Cliente creado exitosamente");
    } catch { toast.error("Error al crear cliente") }
  };

  const openEditModal = async (client: Client) => {
    setSelectedCliente(client);
    setIsLoadingEditData(true);
    try {
      const token = getToken();
      const res = await fetch(`${apiBase}/customers/${client.id}`, {
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (!res.ok) { toast.error("Error al cargar datos"); return; }
      const data = await res.json();
      setEditClient({ name: data.name ?? "", nit: data.nit ?? "", email: data.email ?? "", phone: data.phone ?? "", address: data.address ?? "" });
    } catch { toast.error("Error al cargar datos") }
    finally { setIsLoadingEditData(false); setIsEditClientOpen(true) }
  };

  const handleEditClient = async () => {
    if (!selectedCliente) return;
    try {
      const token = getToken();
      const res = await fetch(`${apiBase}/customers/${selectedCliente.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(editClient),
      });
      if (!res.ok) { toast.error("Error al actualizar"); return; }
      await fetchClients();
      setIsEditClientOpen(false);
      toast.success("Cliente actualizado");
    } catch { toast.error("Error al actualizar") }
  };

  const handleEliminar = async () => {
    if (!selectedCliente) return;
    try {
      const token = getToken();
      const res = await fetch(`${apiBase}/customers/${selectedCliente.id}`, {
        method: "DELETE",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (!res.ok) { toast.error("Error al eliminar"); return; }
      await fetchClients();
      setIsDeleteClientOpen(false);
      setSelectedCliente(null);
      toast.success("Cliente eliminado");
    } catch { toast.error("Error al eliminar") }
  };

  const handleToggleClientStatus = async (cliente: Client) => {
    try {
      const token = getToken();
      const endpoint = cliente.active ? "deactivate" : "activate";
      const res = await fetch(`${apiBase}/customers/${cliente.id}/${endpoint}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (!res.ok) { toast.error("Error al cambiar estado"); return; }
      await fetchClients();
      toast.success(`Cliente ${cliente.active ? "desactivado" : "activado"}`);
    } catch { toast.error("Error al cambiar estado") }
  };

  const formatDate = (iso?: string) => iso ? new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Toaster position="top-right" />
      <DashboardHeader />

      <main className="flex-1 p-4 md:p-6 lg:p-8 pb-24 lg:pb-8">
        <div className="max-w-6xl mx-auto space-y-5">

          {/* ── Page header ── */}
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Clientes</h1>
            <Button
              onClick={() => setIsNewClientOpen(true)}
              className="h-10 bg-blue-950 hover:bg-blue-800 text-white flex items-center gap-2 text-sm px-4 rounded-xl"
            >
              <PlusIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Nuevo Cliente</span>
              <span className="sm:hidden">Nuevo</span>
            </Button>
          </div>

          {/* ── Search ── */}
          <div className="relative">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar por nombre, NIT, email o teléfono..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full h-11 bg-white pl-10 pr-4 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            />
          </div>

          {/* ── Content ── */}
          {loading ? (
            <div className="py-16 text-center text-gray-400 text-sm">Cargando clientes...</div>
          ) : filteredClients.length === 0 ? (
            <div className="py-16 text-center">
              <UserCircle2 className="h-12 w-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">{searchTerm ? "Sin resultados para tu búsqueda" : "No hay clientes registrados"}</p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {["Nombre", "NIT", "Correo", "Teléfono", "Estado", "Acciones"].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paginatedClientes.map(cliente => (
                      <motion.tr key={cliente.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4 text-sm font-medium text-gray-900">{cliente.name}</td>
                        <td className="px-5 py-4 text-sm text-gray-500">{cliente.nit}</td>
                        <td className="px-5 py-4 text-sm text-gray-500">{cliente.email}</td>
                        <td className="px-5 py-4 text-sm text-gray-500">{cliente.phone}</td>
                        <td className="px-5 py-4">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${cliente.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                            {cliente.active ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 rounded-lg" onClick={() => { setSelectedCliente(cliente); setIsViewClientOpen(true); }}>
                              <EyeIcon className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-amber-600 hover:bg-amber-50 rounded-lg" onClick={() => openEditModal(cliente)}>
                              <EditIcon className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className={`rounded-lg ${cliente.active ? "text-green-600 hover:bg-red-50 hover:text-red-500" : "text-gray-400 hover:bg-green-50 hover:text-green-600"}`} onClick={() => handleToggleClientStatus(cliente)}>
                              <Power className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-3">
                {paginatedClientes.map(cliente => (
                  <ClientCard
                    key={cliente.id}
                    cliente={cliente}
                    onView={() => { setSelectedCliente(cliente); setIsViewClientOpen(true); }}
                    onEdit={() => openEditModal(cliente)}
                    onToggle={() => handleToggleClientStatus(cliente)}
                  />
                ))}
              </div>

              {/* Pagination */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-gray-500 text-center sm:text-left">
                  Mostrando {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredClients.length)} de {filteredClients.length} clientes
                </p>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors">
                    <ChevronLeftIcon className="h-4 w-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button key={page} onClick={() => setCurrentPage(page)}
                      className={`min-w-[32px] h-8 px-2 rounded-lg text-sm font-medium transition-colors ${currentPage === page ? "bg-blue-950 text-white" : "hover:bg-gray-100 text-gray-600"}`}>
                      {page}
                    </button>
                  ))}
                  <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors">
                    <ChevronRightIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
       <MobileBottomNav />

      {/* ── Create Modal ── */}
      <Dialog open={isNewClientOpen} onOpenChange={setIsNewClientOpen}>
        <DialogContent className="bg-white w-[calc(100%-2rem)] sm:max-w-lg max-h-[92dvh] overflow-y-auto rounded-2xl p-5 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Nuevo Cliente</DialogTitle>
            <p className="text-sm text-gray-500">Completa los datos para registrar un nuevo cliente.</p>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <Field label="Nombre" id="name" value={newClient.name} onChange={v => setNewClient({ ...newClient, name: v })} />
            <Field label="NIT" id="nit" value={newClient.nit} onChange={v => setNewClient({ ...newClient, nit: v })} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Email" id="email" type="email" value={newClient.email} onChange={v => setNewClient({ ...newClient, email: v })} />
              <Field label="Teléfono" id="phone" value={newClient.phone} onChange={v => setNewClient({ ...newClient, phone: v })} />
            </div>
            <Field label="Dirección" id="address" value={newClient.address ?? ""} onChange={v => setNewClient({ ...newClient, address: v })} />
          </div>
          <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
            <Button variant="outline" onClick={() => { setIsNewClientOpen(false); setNewClient(emptyClient); }} className="w-full sm:w-auto h-11">Cancelar</Button>
            <Button onClick={handleCreateClient} className="w-full sm:w-auto h-11 bg-blue-950 hover:bg-blue-800 text-white">Crear Cliente</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Edit Modal ── */}
      <Dialog open={isEditClientOpen} onOpenChange={setIsEditClientOpen}>
        <DialogContent className="bg-white w-[calc(100%-2rem)] sm:max-w-lg max-h-[92dvh] overflow-y-auto rounded-2xl p-5 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Editar Cliente</DialogTitle>
            <p className="text-sm text-gray-500">Actualiza los datos del cliente.</p>
          </DialogHeader>
          {isLoadingEditData ? (
            <div className="py-10 text-center text-gray-400 text-sm">Cargando datos...</div>
          ) : (
            <div className="grid gap-4 py-2">
              <Field label="Nombre" id="edit_name" value={editClient.name} onChange={v => setEditClient({ ...editClient, name: v })} />
              <Field label="NIT" id="edit_nit" value={editClient.nit} onChange={v => setEditClient({ ...editClient, nit: v })} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Email" id="edit_email" type="email" value={editClient.email} onChange={v => setEditClient({ ...editClient, email: v })} />
                <Field label="Teléfono" id="edit_phone" value={editClient.phone} onChange={v => setEditClient({ ...editClient, phone: v })} />
              </div>
              <Field label="Dirección" id="edit_address" value={editClient.address ?? ""} onChange={v => setEditClient({ ...editClient, address: v })} />
            </div>
          )}
          <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
            <Button variant="outline" onClick={() => setIsEditClientOpen(false)} className="w-full sm:w-auto h-11">Cancelar</Button>
            <Button onClick={handleEditClient} disabled={isLoadingEditData} className="w-full sm:w-auto h-11 bg-blue-800 hover:bg-blue-900 text-white">Guardar Cambios</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Delete Modal ── */}
      <Dialog open={isDeleteClientOpen} onOpenChange={setIsDeleteClientOpen}>
        <DialogContent className="bg-white w-[calc(100%-2rem)] sm:max-w-sm rounded-2xl p-5 sm:p-6 text-center">
          <div className="flex flex-col items-center gap-3 py-2">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
              <TrashIcon className="h-7 w-7 text-red-600" />
            </div>
            <h2 className="text-base font-bold text-gray-900">¿Eliminar cliente?</h2>
            <p className="text-sm text-gray-500">Esta acción no se puede deshacer. Se eliminará permanentemente a <span className="font-semibold text-gray-700">{selectedCliente?.name}</span>.</p>
          </div>
          <div className="flex flex-col-reverse sm:flex-row gap-2 mt-2">
            <Button variant="outline" onClick={() => setIsDeleteClientOpen(false)} className="w-full sm:w-auto h-11">Cancelar</Button>
            <Button variant="destructive" onClick={handleEliminar} className="w-full sm:w-auto h-11">Eliminar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── View Modal ── */}
      <Dialog open={isViewClientOpen} onOpenChange={setIsViewClientOpen}>
        <DialogContent className="bg-white w-[calc(100%-2rem)] sm:max-w-lg max-h-[92dvh] overflow-y-auto rounded-2xl p-5 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Detalle del Cliente</DialogTitle>
          </DialogHeader>
          {selectedCliente ? (
            <div className="space-y-4 py-2">
              {/* Avatar + name banner */}
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-blue-950 flex items-center justify-center shrink-0">
                  <span className="text-white text-sm font-bold">
                    {selectedCliente.name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{selectedCliente.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${selectedCliente.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {selectedCliente.active ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>

              <div className="grid gap-3">
                <Field label="NIT" value={selectedCliente.nit} readOnly />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Correo Electrónico" value={selectedCliente.email} readOnly />
                  <Field label="Teléfono" value={selectedCliente.phone} readOnly />
                </div>
                <Field label="Dirección" value={selectedCliente.address || "—"} readOnly />
                {selectedCliente.createdAt && (
                  <Field label="Fecha de Creación" value={formatDate(selectedCliente.createdAt)} readOnly />
                )}
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-400 py-8 text-sm">No hay cliente seleccionado.</p>
          )}
          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={() => setIsViewClientOpen(false)} className="w-full sm:w-auto h-11">Cerrar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}