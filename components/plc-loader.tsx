"use client"

export function PlcLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            {/* Logo main circle */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[hsl(217,85%,50%)] to-[hsl(217,85%,35%)] flex items-center justify-center animate-pulse">
              <span className="text-5xl font-bold text-white">PLC</span>
            </div>

            {/* Animated border circle */}
            <div className="absolute inset-0 rounded-2xl border-4 border-transparent border-t-[hsl(217,85%,50%)] border-r-[hsl(217,85%,50%)] animate-spin"></div>
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
