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
} from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

const mainTabs = [
  { icon: FileText, label: "Facturas", href: "/" },
  { icon: Calculator, label: "Estimados", href: "/estimados" },
  { icon: CreditCard, label: "Pagos", href: "/pagos" },
  { icon: RotateCcw, label: "Recurrentes", href: "/recurrentes" },
]

const allNavItems = [
  { icon: FileText, label: "Facturas", active: true, section: "principal", href: "/" },
  { icon: Calculator, label: "Estimados", active: false, section: "principal", href: "/estimados" },
  { icon: CreditCard, label: "Pagos", active: false, section: "principal", href: "/pagos" },
  { icon: RotateCcw, label: "Recurrentes", active: false, section: "principal", href: "/recurrentes" },
  { icon: ShoppingCart, label: "Cobros", active: false, section: "principal", href: "/cobros" },
  // Gestion section: añadimos Inventarios, Compras, Ventas
  { icon: BarChart3, label: "Reportes", active: false, section: "gestion", href: "/reportes" },
  { icon: Users, label: "Clientes", active: false, section: "gestion", href: "/clientes" },
  { icon: FolderOpen, label: "Productos", active: false, section: "gestion", href: "/productos" },
  { icon: FolderOpen, label: "Inventarios", active: false, section: "gestion", href: "/inventarios" },
  { icon: ShoppingCart, label: "Compras", active: false, section: "gestion", href: "/compras" },
  { icon: FileText, label: "Ventas", active: false, section: "gestion", href: "/ventas" },
  { icon: Settings, label: "Configuracion", active: false, section: "otros", href: "/configuracion" },
  { icon: HelpCircle, label: "Ayuda", active: false, section: "otros", href: "/ayuda" },
]

export function MobileBottomNav() {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Lock body scroll when sidebar open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [sidebarOpen])

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-[hsl(228,14%,9%)] border-t border-border"
        aria-label="Navegacion principal movil"
      >
        <div className="flex items-center justify-around h-16 px-2 pb-[env(safe-area-inset-bottom)]">
          {mainTabs.map((tab) => {
            const isActive = pathname === tab.href || (tab.href !== "/" && pathname?.startsWith(tab.href))

            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => tab.href && router.push(tab.href)}
                className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
                  isActive ? "text-[hsl(90,100%,50%)]" : "text-[hsl(228,5%,50%)]"
                }`}
              >
                <tab.icon className={`h-5 w-5 ${isActive ? "stroke-[2.5]" : ""}`} />
                <span className={`text-[10px] font-sans ${isActive ? "font-semibold" : "font-normal"}`}>
                  {tab.label}
                </span>
                {isActive && (
                  <div className="absolute bottom-[calc(env(safe-area-inset-bottom)+2px)] w-6 h-0.5 rounded-full bg-[hsl(90,100%,50%)]" />
                )}
              </button>
            )
          })}

          {/* Hamburger / More button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-[hsl(228,5%,50%)] transition-colors"
            aria-label="Ver mas opciones"
          >
            <Menu className="h-5 w-5" />
            <span className="text-[10px] font-sans font-normal">Mas</span>
          </button>
        </div>
      </nav>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[hsl(0,0%,0%,0.6)] backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setSidebarOpen(false)
            }}
            role="button"
            tabIndex={0}
            aria-label="Cerrar menu"
          />

          {/* Sidebar panel */}
          <aside
            className="absolute left-0 top-0 bottom-0 w-72 bg-[hsl(228,14%,9%)] border-r border-border flex flex-col animate-in slide-in-from-left duration-300"
            role="navigation"
            aria-label="Menu completo"
          >
            {/* Sidebar header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[hsl(90,100%,50%)] flex items-center justify-center">
                  <span className="text-[hsl(0,0%,5%)] font-bold text-sm font-sans">P</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[hsl(0,0%,95%)] font-semibold text-sm font-sans">
                    PlasticosLC
                  </span>
                  <span className="text-[10px] text-muted-foreground font-sans">Facturacion</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg text-muted-foreground hover:text-[hsl(0,0%,90%)] hover:bg-secondary transition-colors"
                aria-label="Cerrar menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation sections */}
            <div className="flex-1 overflow-y-auto py-3 px-3">
              {/* Principal */}
              <div className="mb-4">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans px-3 mb-2 block">
                  Principal
                </span>
                <div className="flex flex-col gap-0.5">
                  {allNavItems
                    .filter((item) => item.section === "principal")
                    .map((item) => {
                      const isActive =
                        pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))

                      return (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => {
                            setSidebarOpen(false)
                            if (item.href) router.push(item.href)
                          }}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-sans transition-colors ${
                            isActive
                              ? "bg-[hsl(90,100%,50%,0.12)] text-[hsl(90,100%,50%)] font-medium"
                              : "text-[hsl(0,0%,70%)] hover:text-[hsl(0,0%,90%)] hover:bg-secondary"
                          }`}
                        >
                          <item.icon className={`h-[18px] w-[18px] ${isActive ? "stroke-[2.5]" : ""}`} />
                          {item.label}
                          {isActive && (
                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[hsl(90,100%,50%)]" />
                          )}
                        </button>
                      )
                    })}
                </div>
              </div>

              {/* Gestion */}
              <div className="mb-4">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans px-3 mb-2 block">
                  Gestion
                </span>
                <div className="flex flex-col gap-0.5">
                  {allNavItems
                    .filter((item) => item.section === "gestion")
                    .map((item) => {
                      const isActive =
                        pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))

                      return (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => {
                            setSidebarOpen(false)
                            if (item.href) router.push(item.href)
                          }}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-sans transition-colors ${
                            isActive
                              ? "bg-[hsl(90,100%,50%,0.12)] text-[hsl(90,100%,50%)] font-medium"
                              : "text-[hsl(0,0%,70%)] hover:text-[hsl(0,0%,90%)] hover:bg-secondary"
                          }`}
                        >
                          <item.icon className={`h-[18px] w-[18px] ${isActive ? "stroke-[2.5]" : ""}`} />
                          {item.label}
                        </button>
                      )
                    })}
                </div>
              </div>

              {/* Otros */}
              <div className="mb-4">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans px-3 mb-2 block">
                  Otros
                </span>
                <div className="flex flex-col gap-0.5">
                  {allNavItems
                    .filter((item) => item.section === "otros")
                    .map((item) => {
                      const isActive =
                        pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))

                      return (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => {
                            setSidebarOpen(false)
                            if (item.href) router.push(item.href)
                          }}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-sans transition-colors ${
                            isActive
                              ? "bg-[hsl(90,100%,50%,0.12)] text-[hsl(90,100%,50%)] font-medium"
                              : "text-[hsl(0,0%,70%)] hover:text-[hsl(0,0%,90%)] hover:bg-secondary"
                          }`}
                        >
                          <item.icon className={`h-[18px] w-[18px] ${isActive ? "stroke-[2.5]" : ""}`} />
                          {item.label}
                        </button>
                      )
                    })}
                </div>
              </div>
            </div>

            {/* User section at bottom */}
            <div className="p-3 border-t border-border">
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-secondary mb-2">
                <div className="w-9 h-9 rounded-full bg-[hsl(90,100%,50%,0.15)] flex items-center justify-center shrink-0">
                  <span className="text-[hsl(90,100%,50%)] text-sm font-bold font-sans">
                    {user?.name?.charAt(0) || "U"}
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm text-[hsl(0,0%,90%)] font-medium font-sans truncate">
                    {user?.name || "Usuario"}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-sans">
                    {user?.role || "Rol"}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSidebarOpen(false)
                  logout()
                }}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-sans text-[hsl(0,60%,60%)] hover:bg-[hsl(0,84%,60%,0.1)] transition-colors"
              >
                <LogOut className="h-[18px] w-[18px]" />
                Cerrar sesion
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
