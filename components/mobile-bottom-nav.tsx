"use client"

import { useAuth } from "@/lib/auth-context"
import {
  FileText,
  CreditCard,
  RotateCcw,
  ShoppingCart,
  Calculator,
  LogOut,
  X,
  BarChart3,
  Settings,
  HelpCircle,
  Users,
  FolderOpen,
  Menu,
  ChevronRight,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

/* ─────────────────────────────────────────────
   NAV DATA
───────────────────────────────────────────── */
const mainTabs = [
  { icon: FileText, label: "Facturas", href: "/" },
  { icon: ShoppingCart, label: "Compras", href: "/compras" },
  { icon: Users, label: "Clientes", href: "/clientes" },
  { icon: FolderOpen, label: "Productos", href: "/productos" },
]

const allNavItems = [
  { icon: FileText, label: "Facturas", section: "principal", href: "/" },
  { icon: ShoppingCart, label: "Compras", section: "principal", href: "/compras" },
  { icon: BarChart3, label: "Reportes", section: "gestion", href: "/reportes" },
  { icon: Users, label: "Clientes", section: "gestion", href: "/clientes" },
  { icon: FolderOpen, label: "Productos", section: "gestion", href: "/productos" },
  { icon: Calculator, label: "Proveedores", section: "gestion", href: "/proveedores" },
  { icon: CreditCard, label: "Usuarios", section: "gestion", href: "/usuarios" },
  { icon: Settings, label: "Configuración", section: "otros", href: "/configuracion" },
  { icon: HelpCircle, label: "Ayuda", section: "otros", href: "/ayuda" },
]

const SECTIONS = [
  { key: "principal", label: "Principal" },
  { key: "gestion", label: "Gestión" },
  { key: "otros", label: "Otros" },
]

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
export function MobileBottomNav() {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [sidebarOpen])

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname?.startsWith(href))

  const navigate = (href: string) => {
    setSidebarOpen(false)
    router.push(href)
  }

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U"

  return (
    <>
      {/* ══════════════════════════════════════
          BOTTOM NAV BAR
      ══════════════════════════════════════ */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-label="Navegación principal móvil"
      >
        {/* Frosted glass background */}
        <div className="absolute inset-0 bg-[hsl(228,14%,7%,0.95)] backdrop-blur-xl border-t border-white/5" />

        <div className="relative flex items-center justify-around h-16 px-1">
          {mainTabs.map((tab) => {
            const active = isActive(tab.href)
            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => navigate(tab.href)}
                className="relative flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-all duration-200"
                aria-current={active ? "page" : undefined}
              >
                {/* Active pill background - Institutional Blue with subtle opacity */}
                {active && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-x-2 top-2 bottom-2 rounded-xl bg-[hsl(209,79%,27%,0.08)]"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}

                <tab.icon
                  className={`relative h-5 w-5 transition-all duration-200 ${active
                      ? "text-[hsl(209,79%,27%)] stroke-[2.5]"
                      : "text-[hsl(228,5%,45%)]"
                    }`}
                />
                <span
                  className={`relative text-[10px] transition-all duration-200 ${active
                      ? "text-[hsl(209,79%,27%)] font-semibold"
                      : "text-[hsl(228,5%,45%)] font-normal"
                    }`}
                >
                  {tab.label}
                </span>
              </button>
            )
          })}

          {/* More button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-[hsl(228,5%,45%)] hover:text-[hsl(228,5%,65%)] transition-colors"
            aria-label="Ver más opciones"
          >
            <Menu className="h-5 w-5" />
            <span className="text-[10px] font-normal">Más</span>
          </button>
        </div>
      </nav>

      {/* ══════════════════════════════════════
          SIDEBAR OVERLAY
      ══════════════════════════════════════ */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar panel */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="absolute left-0 top-0 bottom-0 w-[280px] flex flex-col"
              style={{ background: "hsl(228,16%,8%)" }}
              role="navigation"
              aria-label="Menú completo"
            >
              {/* ── Header ── */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[hsl(209,79%,27%)] flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">PLC</span>
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm leading-tight">PlásticosLC</p>
                    <p className="text-[hsl(228,5%,45%)] text-[10px]">Facturación</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-[hsl(228,5%,45%)] hover:text-white hover:bg-white/5 transition-colors"
                  aria-label="Cerrar menú"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* ── Nav sections ── */}
              <div className="flex-1 overflow-y-auto py-3 px-2 space-y-5">
                {SECTIONS.map((section) => {
                  const items = allNavItems.filter((i) => i.section === section.key)
                  return (
                    <div key={section.key}>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[hsl(228,5%,35%)] px-3 mb-1.5">
                        {section.label}
                      </p>
                      <div className="flex flex-col gap-0.5">
                        {items.map((item, idx) => {
                          const active = isActive(item.href)
                          return (
                            <motion.button
                              key={item.label}
                              type="button"
                              onClick={() => navigate(item.href)}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.03 + 0.05 }}
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 text-left w-full ${active
                                  ? "bg-[hsl(209,79%,27%,0.12)] text-[hsl(209,79%,35%)] font-semibold"
                                  : "text-[hsl(228,5%,60%)] hover:text-white hover:bg-white/5"
                                }`}
                            >
                              <item.icon
                                className={`h-[18px] w-[18px] shrink-0 ${active ? "stroke-[2.5]" : ""}`}
                              />
                              <span className="flex-1">{item.label}</span>
                              {active && (
                                <div className="w-1 h-3 rounded-full bg-[hsl(209,79%,27%)] shrink-0" />
                              )}
                            </motion.button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* ── User footer ── */}
              <div className="p-3 border-t border-white/5 space-y-1.5">
                {/* User info row */}
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5">
                  <div className="w-9 h-9 rounded-full bg-[hsl(209,79%,27%,0.15)] flex items-center justify-center shrink-0">
                    <span className="text-[hsl(209,79%,27%)] text-sm font-bold">
                      {userInitial}
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-sm text-white font-semibold truncate leading-tight">
                      {user?.name || "Usuario"}
                    </span>
                    <span className="text-[11px] text-[hsl(228,5%,45%)]">
                      {user?.role || "Rol"}
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[hsl(228,5%,35%)] shrink-0" />
                </div>

                {/* Logout */}
                <button
                  type="button"
                  onClick={() => { setSidebarOpen(false); logout() }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-[hsl(0,65%,60%)] hover:bg-[hsl(0,84%,60%,0.08)] transition-colors"
                >
                  <LogOut className="h-[18px] w-[18px] shrink-0" />
                  Cerrar sesión
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}