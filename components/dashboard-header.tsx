"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

import {
  FileText,
  CreditCard,
  ShoppingCart,
  Calculator,
  LogOut,
  ChevronDown,
  Menu,
  X,
  BarChart3,
  Settings,
  HelpCircle,
  Users,
  FolderOpen,
  ChevronRight,
} from "lucide-react"

/* ─────────────────────────────────────────────
   NAV DATA
───────────────────────────────────────────── */
const navItems = [
  { icon: FileText,     label: "Facturas",        section: "principal", href: "/" },
  { icon: ShoppingCart, label: "Compras",          section: "principal", href: "/compras" },
  { icon: BarChart3,    label: "Reportes",         section: "gestion",   href: "/reportes" },
  { icon: Users,        label: "Clientes",         section: "gestion",   href: "/clientes" },
  { icon: FolderOpen,   label: "Productos",        section: "gestion",   href: "/productos" },
  { icon: Calculator,   label: "Proveedores",      section: "gestion",   href: "/proveedores" },
  { icon: CreditCard,   label: "Usuarios",         section: "gestion",   href: "/usuarios" },
  { icon: Settings,     label: "Configuración",    section: "otros",     href: "/configuracion" },
  { icon: HelpCircle,   label: "Centro de Ayuda",  section: "otros",     href: "/ayuda" },
]

const SECTIONS = [
  { key: "principal", label: "Principal" },
  { key: "gestion",   label: "Gestión" },
  { key: "otros",     label: "Otros" },
]

// Bottom nav tabs (mobile only)
const mainTabs = [
  { icon: FileText,     label: "Facturas",  href: "/" },
  { icon: ShoppingCart, label: "Compras",   href: "/compras" },
  { icon: Users,        label: "Clientes",  href: "/clientes" },
  { icon: FolderOpen,   label: "Productos", href: "/productos" },
]

/* ─────────────────────────────────────────────
   SHARED HELPERS
───────────────────────────────────────────── */
function useIsActive() {
  const pathname = usePathname()
  return (href: string) =>
    pathname === href || (href !== "/" && pathname?.startsWith(href))
}

/* ─────────────────────────────────────────────
   DESKTOP SIDEBAR
───────────────────────────────────────────── */
function DesktopSidebar({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const isActive = useIsActive()

  const navigate = (href: string) => {
    onClose()
    router.push(href)
  }

  const handleLogout = () => {
    onClose()
    logout()
    router.push("/")
  }

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U"

  return (
    <AnimatePresence>
      {open && (
        <div className="hidden lg:flex fixed inset-0 z-50">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed left-0 top-0 bottom-0 w-72 flex flex-col z-50"
            style={{ background: "hsl(228,16%,8%)" }}
            role="navigation"
            aria-label="Menú completo"
          >
            {/* Header */}
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
                onClick={onClose}
                className="p-1.5 rounded-lg text-[hsl(228,5%,45%)] hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Cerrar menú"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Nav sections */}
            <div className="flex-1 overflow-y-auto py-3 px-2 space-y-5">
              {SECTIONS.map((section) => {
                const items = navItems.filter((i) => i.section === section.key)
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
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 text-left w-full ${
                              active
                                ? "bg-[hsl(209,79%,35%,0.15)] text-[hsl(209,79%,65%)] font-semibold"
                                : "text-[hsl(228,5%,60%)] hover:text-white hover:bg-white/5"
                            }`}
                          >
                            <item.icon
                              className={`h-[18px] w-[18px] shrink-0 ${active ? "stroke-[2.5]" : ""}`}
                            />
                            <span className="flex-1">{item.label}</span>
                            {active && (
                              <div className="w-1.5 h-1.5 rounded-full bg-[hsl(209,79%,55%)] shrink-0" />
                            )}
                          </motion.button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* User footer */}
            <div className="p-3 border-t border-white/5 space-y-1.5">
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5">
                <div className="w-9 h-9 rounded-full bg-[hsl(209,79%,35%,0.2)] flex items-center justify-center shrink-0">
                  <span className="text-[hsl(209,79%,65%)] text-sm font-bold">
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
              <button
                type="button"
                onClick={handleLogout}
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
  )
}

/* ─────────────────────────────────────────────
   DASHBOARD HEADER  (desktop sticky top bar)
───────────────────────────────────────────── */
export function DashboardHeader() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isActive = useIsActive()

  const handleNavigation = (href: string) => router.push(href)
  const handleLogout = () => { logout(); router.push("/") }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-white">
        <div className="flex items-center justify-between px-4 lg:px-6 h-14">

          {/* Left: hamburger + logo + nav */}
          <div className="flex items-center gap-4">
            {/* Hamburger — desktop only */}
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
              aria-label="Abrir menú"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[hsl(209,79%,27%)] hidden sm:flex items-center justify-center">
                <span className="text-white font-bold text-xs">PLC</span>
              </div>
              <span className="text-[hsl(209,79%,27%)] font-bold text-sm font-sans">
                PlásticosLC
              </span>
            </div>

            {/* Desktop inline nav */}
            <nav className="hidden lg:flex items-center gap-1 ml-4" aria-label="Navegación principal">
              {navItems
                .filter((item) => item.section === "principal")
                .map((item) => {
                  const active = isActive(item.href)
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => handleNavigation(item.href)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                        active
                          ? "bg-[hsl(209,79%,35%)] text-white shadow-sm"
                          : "text-gray-500 hover:text-white hover:bg-[hsl(209,79%,35%)]"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  )
                })}
            </nav>
          </div>

          {/* Right: user chip + logout — desktop only */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[hsl(209,79%,35%)]">
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                <span className="text-[hsl(209,79%,27%)] text-xs font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
              <span className="text-sm text-white font-medium">{user?.name || "Usuario"}</span>
              <ChevronDown className="h-3 w-3 text-white/70" />
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 active:scale-95 transition-all text-sm"
              aria-label="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </header>

      <DesktopSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  )
}

/* ─────────────────────────────────────────────
   MOBILE BOTTOM NAV
───────────────────────────────────────────── */
export function MobileBottomNav() {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const isActive = useIsActive()

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [sidebarOpen])

  const navigate = (href: string) => {
    setSidebarOpen(false)
    router.push(href)
  }

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U"

  return (
    <>
      {/* Bottom bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-label="Navegación principal móvil"
      >
        <div className="absolute inset-0 bg-[hsl(228,14%,7%,0.96)] backdrop-blur-xl border-t border-white/5" />

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
                {active && (
                  <motion.div
                    layoutId="mobile-nav-pill"
                    className="absolute inset-x-1.5 top-1.5 h-10 rounded-2xl bg-[hsl(209,79%,35%,0.18)]"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
                <tab.icon
                  className={`relative h-5 w-5 transition-all duration-200 ${
                    active ? "text-[hsl(209,79%,65%)] stroke-[2.5]" : "text-[hsl(228,5%,45%)]"
                  }`}
                />
                <span
                  className={`relative text-[10px] transition-all duration-200 ${
                    active ? "text-[hsl(209,79%,65%)] font-semibold" : "text-[hsl(228,5%,45%)] font-normal"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            )
          })}

          {/* More */}
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

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />

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
              {/* Header */}
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
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Nav */}
              <div className="flex-1 overflow-y-auto py-3 px-2 space-y-5">
                {SECTIONS.map((section) => {
                  const items = navItems.filter((i) => i.section === section.key)
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
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 text-left w-full ${
                                active
                                  ? "bg-[hsl(209,79%,35%,0.15)] text-[hsl(209,79%,65%)] font-semibold"
                                  : "text-[hsl(228,5%,60%)] hover:text-white hover:bg-white/5"
                              }`}
                            >
                              <item.icon className={`h-[18px] w-[18px] shrink-0 ${active ? "stroke-[2.5]" : ""}`} />
                              <span className="flex-1">{item.label}</span>
                              {active && (
                                <div className="w-1.5 h-1.5 rounded-full bg-[hsl(209,79%,55%)] shrink-0" />
                              )}
                            </motion.button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-white/5 space-y-1.5">
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5">
                  <div className="w-9 h-9 rounded-full bg-[hsl(209,79%,35%,0.2)] flex items-center justify-center shrink-0">
                    <span className="text-[hsl(209,79%,65%)] text-sm font-bold">{userInitial}</span>
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-sm text-white font-semibold truncate leading-tight">
                      {user?.name || "Usuario"}
                    </span>
                    <span className="text-[11px] text-[hsl(228,5%,45%)]">{user?.role || "Rol"}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[hsl(228,5%,35%)] shrink-0" />
                </div>
                <button
                  type="button"
                  onClick={() => { setSidebarOpen(false); logout(); router.push("/") }}
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