"use client"

import React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Lock, User, Eye, EyeOff, AlertCircle } from "lucide-react"

export function LoginPage() {
  const { login } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    await new Promise((r) => setTimeout(r, 800))

    const success = login(username, password)
    if (!success) {
      setError("Usuario o contrasena incorrectos")
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[hsl(90,100%,50%)] flex items-center justify-center">
              <span className="text-[hsl(0,0%,5%)] font-bold text-lg font-sans">P</span>
            </div>
            <h1 className="text-2xl font-bold text-[hsl(0,0%,95%)] font-sans">PlasticosLC</h1>
          </div>
          <p className="text-muted-foreground text-sm font-sans">Sistema de Facturacion</p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-border bg-card p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[hsl(0,0%,95%)] font-sans">Iniciar Sesion</h2>
            <p className="text-muted-foreground text-sm mt-1 font-sans">
              Ingresa tus credenciales para acceder
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-[hsl(0,84%,60%,0.1)] border border-[hsl(0,84%,60%,0.3)] text-[hsl(0,84%,60%)]">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p className="text-sm font-sans">{error}</p>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label htmlFor="username" className="text-sm font-medium text-[hsl(0,0%,80%)] font-sans">
                Usuario
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ingresa tu usuario"
                  required
                  className="w-full h-11 pl-10 pr-4 rounded-lg border border-border bg-secondary text-[hsl(0,0%,95%)] placeholder:text-muted-foreground text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[hsl(90,100%,50%)] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium text-[hsl(0,0%,80%)] font-sans">
                Contrasena
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contrasena"
                  required
                  className="w-full h-11 pl-10 pr-10 rounded-lg border border-border bg-secondary text-[hsl(0,0%,95%)] placeholder:text-muted-foreground text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[hsl(90,100%,50%)] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[hsl(0,0%,80%)] transition-colors"
                  aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="h-11 mt-2 rounded-lg bg-[hsl(90,100%,50%)] text-[hsl(0,0%,5%)] font-semibold text-sm font-sans hover:bg-[hsl(90,100%,45%)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-[hsl(0,0%,5%)] border-t-transparent rounded-full animate-spin" />
              ) : (
                "Iniciar Sesion"
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center mb-3 font-sans">Credenciales de prueba</p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-secondary text-sm">
                <div className="flex flex-col">
                  <span className="text-muted-foreground font-sans text-xs">Admin</span>
                  <span className="text-[hsl(0,0%,90%)] font-sans">admin / admin123</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setUsername("admin")
                    setPassword("admin123")
                  }}
                  className="text-xs px-3 py-1.5 rounded-md bg-[hsl(90,100%,50%,0.15)] text-[hsl(90,100%,50%)] hover:bg-[hsl(90,100%,50%,0.25)] transition-colors font-sans font-medium"
                >
                  Usar
                </button>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-secondary text-sm">
                <div className="flex flex-col">
                  <span className="text-muted-foreground font-sans text-xs">Demo</span>
                  <span className="text-[hsl(0,0%,90%)] font-sans">demo / demo123</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setUsername("demo")
                    setPassword("demo123")
                  }}
                  className="text-xs px-3 py-1.5 rounded-md bg-[hsl(90,100%,50%,0.15)] text-[hsl(90,100%,50%)] hover:bg-[hsl(90,100%,50%,0.25)] transition-colors font-sans font-medium"
                >
                  Usar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
