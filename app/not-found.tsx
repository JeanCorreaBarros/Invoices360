"use client"

import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white text-center">
      <h1 className="text-6xl font-bold text-[hsl(209,83%,23%)] mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Página no encontrada</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        Lo sentimos, la página que buscas no existe o ha sido movida.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-lg bg-[hsl(209,83%,23%)] text-white font-semibold hover:bg-[hsl(209,81%,31%)] transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
