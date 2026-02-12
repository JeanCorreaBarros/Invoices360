"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

import {
  FileText,
  CreditCard,
  RotateCcw,
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
} from "lucide-react"

const navItems = [
  { icon: FileText, label: "Facturas", active: true, section: "principal", href: "/" },
  /*{ icon: Users, label: "Clientes", active: false, section: "principal", href: "/clientes" },
  { icon: FolderOpen, label: "Productos", active: false, section: "principal", href: "/productos" },*/
  /*{ icon: FileText, label: "Ventas", active: false, section: "principal", href: "/ventas" },*/
  { icon: ShoppingCart, label: "Compras", active: false, section: "principal", href: "/compras" },
  // Gestion section: añadimos Inventarios, Compras, Ventas
  { icon: BarChart3, label: "Reportes", active: false, section: "gestion", href: "/reportes" },
  { icon: Users, label: "Clientes", active: false, section: "gestion", href: "/clientes" },
  { icon: FolderOpen, label: "Productos", active: false, section: "gestion", href: "/productos" },
  /*{ icon: FolderOpen, label: "Inventarios", active: false, section: "gestion", href: "/inventarios" },*/
  { icon: Calculator, label: "Proveedores", active: false, section: "gestion", href: "/proveedores" },
  { icon: CreditCard, label: "Usuarios", active: false, section: "gestion", href: "/usuarios" },
  /*{ icon: ShoppingCart, label: "Compras", active: false, section: "gestion", href: "/compras" },
  { icon: FileText, label: "Ventas", active: false, section: "gestion", href: "/ventas" },*/
  { icon: Settings, label: "Configuracion", active: false, section: "otros", href: "/configuracion" },
  { icon: HelpCircle, label: "Centro de Ayuda", active: false, section: "otros", href: "/ayuda" },
]

export function DashboardHeader() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleNavigation = (href: string) => {
    router.push(href)
    setSidebarOpen(false)
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-white">
        <div className="flex items-center justify-between px-4 lg:px-6 h-14">
          {/* Logo and nav */}
          <div className="flex items-center gap-4">
            {/* Hamburger Button */}
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors text-[hsl(0,3%,8%)]"
              aria-label="Abrir menu"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 hidden h-8 rounded-lg bg-red-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm font-sans">PLC</span>
              </div>
              <span className="text-[hsl(251,55%,25%)] font-semibold text-md font-sans">
                PlasticosLC
              </span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1 ml-4" aria-label="Navegacion principal">
              {navItems
                .filter((item) => item.section === "principal")
                .map((item) => {
                  const isActive =
                    pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))

                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => item.href && handleNavigation(item.href)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-sans transition-colors ${isActive
                          ? "bg-[hsl(209,79%,35%)] text-white font-medium"
                          : "text-muted-foreground hover:text-white hover:bg-[hsl(209,79%,35%)]"
                        }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  )
                })}
            </nav>
          </div>

          {/* Right side - User (desktop only) */}
          <div className="hidden lg:flex items-center gap-2">
            {/*<ThemeToggle />*/}
            <div className="flex items-center bg-[hsl(209,79%,35%)] gap-2 px-3 py-1.5 rounded-lg bg-secondary">
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                <span className="text-[hsl(209,83%,23%)] text-xs font-bold font-sans">
                  {user?.name?.charAt(0) || "U"}
                </span>
              </div>
              <span className="text-sm text-[hsl(0,0%,100%)] font-sans">{user?.name || "Usuario"}</span>
              <ChevronDown className="h-3 w-3 text-white" />
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:scale-95 transition-colors text-sm font-sans"
              aria-label="Cerrar sesion"
            >
              <LogOut className="h-4 w-4" />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay and Panel */}
      {sidebarOpen && (
        <div className="hidden lg:flex fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="fixed inset-0 h-full bg-[hsl(0,0%,0%,0.6)] backdrop-blur-sm animate-in fade-in duration-300"

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
            className="fixed left-0 top-0 bottom-0 w-72 bg-[hsl(228,14%,9%)] border-r border-border flex flex-col animate-in slide-in-from-left duration-300 z-50"
            role="navigation"
            aria-label="Menu completo"
          >
            {/* Sidebar header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[hsl(219,75%,17%)] flex items-center justify-center">
                  <span className=" text-white font-bold text-sm font-sans">PLC</span>
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
                  {navItems
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
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-sans transition-colors ${isActive
                              ? "bg-[hsl(209,83%,23%)] text-white font-medium"
                              : "text-[hsl(0,0%,70%)] hover:text-[hsl(0,0%,90%)] hover:bg-secondary"
                            }`}
                        >
                          <item.icon className={`h-[18px] w-[18px] ${isActive ? "stroke-[2.5]" : ""}`} />
                          {item.label}
                          {isActive && (
                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[hsl(0,0%,100%)]" />
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
                  {navItems
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
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-sans transition-colors ${isActive
                              ? "bg-[hsl(209,83%,23%)] text-white font-medium"
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
                  {navItems
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
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-sans transition-colors ${isActive
                              ? "bg-[hsl(209,83%,23%)] text-white font-medium"
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
                <div className="w-9 h-9 rounded-full bg-[hsl(209,83%,23%)] flex items-center justify-center shrink-0">
                  <span className="text-[hsl(0,0%,100%)] text-sm font-bold font-sans">
                    {user?.name?.charAt(0) || "U"}
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm text-[hsl(0,0%,90%)] font-medium font-sans truncate">
                    {user?.name || "Usuario"}
                  </span>
                  <span className="text-[11px] text-white font-sans">
                    {user?.role || "Rol"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => {
                    setSidebarOpen(false)
                    handleLogout()
                  }}
                  className="flex-1 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-sans text-[hsl(0,60%,60%)] hover:bg-[hsl(0,84%,60%,0.1)] transition-colors"
                >
                  <LogOut className="h-[18px] w-[18px]" />
                  Salir
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}