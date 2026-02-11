"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PlcLoader } from "./plc-loader"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Validar que exista token en sessionStorage
    const token = sessionStorage.getItem("token")

    if (!token) {
      // No hay token, redirigir a login
      router.push("/")
      setIsLoading(false)
      return
    }

    // Si hay token, permitir acceso
    setIsAuthenticated(true)
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return <PlcLoader />
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
