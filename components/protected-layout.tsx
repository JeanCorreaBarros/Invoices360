"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { PlcLoader } from "./plc-loader"

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // No proteger la ruta de login
    if (pathname === "/") {
      setIsLoading(false)
      setIsAuthenticated(true)
      return
    }

    // Validar token en cada navegación
    const token = sessionStorage.getItem("token")

    if (!token) {
      // No hay token, redirigir a login
      router.replace("/")
      return
    }

    // Si hay token, permitir acceso
    setIsAuthenticated(true)
    setIsLoading(false)
  }, [pathname, router])

  // Escuchar el evento popstate (navegación hacia atrás)
  useEffect(() => {
    const handlePopState = () => {
      const token = sessionStorage.getItem("token")
      
      // Si no hay token y no estamos en login, redirigir
      if (!token && pathname !== "/") {
        router.replace("/")
      }
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [pathname, router])

  // Para la ruta de login, no mostrar loader
  if (pathname === "/") {
    return <>{children}</>
  }

  // Para otras rutas, mostrar loader mientras valida
  if (isLoading) {
    return <PlcLoader />
  }

  // Si no está autenticado y no es login, no mostrar nada (redirigiendo)
  if (!isAuthenticated) {
    return <PlcLoader />
  }

  return <>{children}</>
}
