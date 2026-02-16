"use client"

import React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Lock, User, Eye, EyeOff, AlertCircle } from "lucide-react"

export function LoginPage() {
  const { login, isLoading: contextLoading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const success = await login(email, password)
    if (!success) {
      setError("Usuario o contraseña incorrectos")
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center  bg-white lg:p-4">
      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-1  lg:grid-cols-2 gap-6 rounded-3xl overflow-hidden shadow-2xl bg-white">
          {/* Left Panel - Blue Section */}
          <div className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-[hsl(217,85%,50%)] to-[hsl(217,85%,35%)] p-12 text-white relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 right-10 w-32 h-32 rounded-full border border-white"></div>
              <div className="absolute bottom-20 left-5 w-24 h-24 rounded-full border border-white"></div>
            </div>

            <div className="relative z-10 text-center">

              {/* Content */}
              <h2 className="text-3xl font-bold mb-1"> Bienvenido a PlasticosLC</h2>
              <img
                src="/Logo-PlasticosLC.png"
                alt="Logo PlasticosLC"
                className="mx-auto mb-8 w-88 h-88 object-contain"
              />


              {/* Navigation Dots */}
              <div className="flex hidden items-center justify-center gap-4">
                <button className="p-2 rounded-full border-2 border-white/30 hover:border-white transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button className="p-2 rounded-full border-2 border-white/30 hover:border-white transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Form Section */}
          <div className="flex flex-col justify-center p-8 lg:p-12">
            {/* Logo for mobile */}
            <div className="flex hidden lg:hidden items-center justify-center mb-8">
              <span className="text-2xl font-bold text-[hsl(217,85%,50%)]">PLC</span>
            </div>
            {/* Logo for mobile */}
            <img
              src="/Logo-PlasticosLC.png"
              alt="Logo PlasticosLC"
              className="mx-auto mb-8 w-20 h-20 object-contain lg:hidden"
            />

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[hsl(222,15%,10%)] mb-2">
                Iniciar sesión
              </h2>
              <p className="text-sm hidden text-gray-600">
                ¿No tienes una cuenta?{" "}
                <button className="text-[hsl(217,85%,50%)] hover:underline font-semibold">
                  Regístrate
                </button>
              </p>
            </div>


            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-[hsl(0,84%,60%,0.1)] border border-[hsl(0,84%,60%,0.3)] text-[hsl(0,84%,60%)]">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <p className="text-sm font-sans">{error}</p>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium text-[hsl(222,15%,10%)]">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="h-11 px-4 rounded-lg border border-gray-300 bg-white placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(217,85%,50%)] transition-all"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-sm font-medium text-[hsl(222,15%,10%)]">
                  Contraseña
                </label>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                  className="h-11 px-4 rounded-lg border border-gray-300 bg-white placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(217,85%,50%)] transition-all"
                />
                <p className="text-xs text-gray-500">Must be at least 8 characters.</p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="h-11 mt-4 rounded-lg bg-[hsl(217,85%,50%)] text-white font-semibold text-sm hover:bg-[hsl(217,85%,45%)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Iniciar sesión"
                )}
              </button>

            </form>

            <p className="text-xs text-gray-500 text-center mt-6">
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
