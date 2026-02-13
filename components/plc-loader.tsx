"use client"

export function PlcLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <img
              src="/Icon-plasticosLC.webp"
              alt="Loading"
              className="w-24 h-24 object-contain animate-pulse"
            />
          </div>
        </div>

        {/* Loading text */}
        <div className="text-center">
          <p className="text-[hsl(217,85%,50%)] font-semibold text-lg">Cargando...</p>
          <p className="text-gray-500 text-sm mt-2">Validando sesión</p>
        </div>
      </div>
    </div>
  )
}
