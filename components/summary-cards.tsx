"use client"

import { useEffect, useState } from "react"
import { TrendingUp, Clock, Wallet, ArrowUpRight } from "lucide-react"

interface ApiData {
  overdue: { total: number; count: number; items: [] }
  dueThisMonth: { total: number; count: number; items: [] }
  averagePaymentDays: number
  availableForPayment: { total: number; count: number; items: [] }
}

const summaryDataTemplate = [
  {
    label: "Vencidas",
    icon: TrendingUp,
    color: "text-[hsl(0,84%,60%)]",
    months: ["Sep", "Oct", "Nov", "Dic"],
    chartPoints: [30, 50, 25, 65, 40, 75, 55, 80],
    key: "overdue",
  },
  {
    label: "Vence proximo mes",
    icon: ArrowUpRight,
    color: "text-[hsl(45,100%,60%)]",
    months: ["Sep", "Oct", "Nov", "Dic"],
    chartPoints: [20, 45, 60, 35, 55, 70, 45, 85],
    key: "dueThisMonth",
  },
  {
    label: "Tiempo promedio de pago",
    suffix: "dias",
    icon: Clock,
    color: "text-[hsl(0,0%,70%)]",
    months: ["Sep", "Oct", "Nov", "Dic"],
    chartPoints: [50, 40, 65, 30, 55, 45, 70, 60],
    key: "averagePaymentDays",
  },
]

const payoutDataTemplate = {
  label: "Disponible para Pago",
  expects: "Esperado",
  key: "availableForPayment",
}

const avatars = ["CM", "AR", "MJ", "PV", "LD"]
const avatarColors = [
  "bg-[hsl(200,70%,50%)]",
  "bg-[hsl(340,70%,50%)]",
  "bg-[hsl(160,70%,40%)]",
  "bg-[hsl(30,80%,50%)]",
  "bg-[hsl(270,60%,50%)]",
]

function MiniChart({ points }: { points: number[] }) {
  const width = 200
  const height = 40
  const maxVal = Math.max(...points)
  const step = width / (points.length - 1)

  const pathData = points
    .map((p, i) => {
      const x = i * step
      const y = height - (p / maxVal) * height
      return `${i === 0 ? "M" : "L"} ${x} ${y}`
    })
    .join(" ")

  const areaPath = `${pathData} L ${width} ${height} L 0 ${height} Z`

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-10" preserveAspectRatio="none">
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(228,10%,35%)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="hsl(228,10%,20%)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#chartGrad)" />
      <path d={pathData} fill="none" stroke="hsl(228,10%,40%)" strokeWidth="1.5" />
    </svg>
  )
}

export function SummaryCards() {
  const [data, setData] = useState<ApiData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        setIsLoading(true)
        const token = sessionStorage.getItem("token")

        if (!token) {
          throw new Error("Token de autenticación no encontrado")
        }

        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}dashboard/invoices`
        const response = await fetch(apiUrl, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) throw new Error("Error fetching invoice data")
        const result = await response.json()
        setData(result.data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido")
        setData(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInvoiceData()
  }, [])

  // Formatear números como moneda
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("es-ES", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  // Construir datos dinámicos con información de la API
  const summaryData = summaryDataTemplate.map((template) => {
    if (!data) return { ...template, amount: "0.00" }

    if (template.key === "overdue") {
      return { ...template, amount: formatCurrency(data.overdue.total) }
    } else if (template.key === "dueThisMonth") {
      return { ...template, amount: formatCurrency(data.dueThisMonth.total) }
    } else if (template.key === "averagePaymentDays") {
      return { ...template, amount: String(data.averagePaymentDays) }
    }
    return { ...template, amount: "0.00" }
  })

  const payoutData = data
    ? {
      ...payoutDataTemplate,
      amount: formatCurrency(data.availableForPayment.total),
    }
    : { ...payoutDataTemplate, amount: "0.00" }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500 bg-red-50 p-5">
        <p className="text-red-700">Error al cargar datos: {error}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1  md:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* Metric Cards */}
      {summaryData.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border shadow-xl hover:scale-95 border-border bg-card p-5 flex flex-col gap-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-black text-xs font-sans">{item.label}</span>
            <item.icon className={`h-4 w-4 ${item.color}`} />
          </div>
          <div className="flex items-baseline gap-1.5">
            {!item.suffix && <span className="text-[hsl(0,0%,55%)] text-sm font-sans">$</span>}
            <span className="text-2xl font-bold text-[hsl(0,3%,14%)] font-sans tracking-tight">
              {item.amount}
            </span>
            {item.suffix && (
              <span className="text-base text-black font-sans ml-0.5">{item.suffix}</span>
            )}
          </div>
          {/* Mini line chart */}
          <MiniChart points={item.chartPoints} />
          {/* Month labels */}
          <div className="flex items-center justify-between px-0.5">
            {item.months.map((m) => (
              <span key={m} className="text-[10px] text-muted-foreground font-sans">
                {m}
              </span>
            ))}
          </div>
          {/* Avatar group */}
          <div className="flex items-center -space-x-2 mt-1">
            {avatars.slice(0, 4).map((a, i) => (
              <div
                key={`avatar-${item.label}-${a}`}
                className={`w-7 h-7 rounded-full ${avatarColors[i]} border-2 border-card flex items-center justify-center`}
              >
                <span className="text-[10px] font-bold text-[hsl(0,0%,95%)] font-sans">{a}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Payout Card */}
      <div className="rounded-2xl border border-border bg-card p-5 flex flex-col justify-between min-h-[160px] hover:scale-95 transition-all shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-black text-[10px] font-black font-sans uppercase tracking-widest">{payoutData.label}</span>
          <span className="text-[10px] text-muted-foreground font-sans bg-gray-100 px-2 py-0.5 rounded-full">{payoutData.expects}</span>
        </div>

        <div className="flex items-center justify-between gap-2 mt-2">
          <div className="flex flex-col">
            <span className="text-3xl font-black text-[hsl(209,83%,23%)] font-sans tracking-tight">
              ${payoutData.amount}
            </span>
          </div>
          <div className="w-24 h-24 bg-white rounded-2xl p-2 shadow-sm border border-gray-100 flex items-center justify-center shrink-0">
            <img
              src="/Logo-PlasticosLC.png"
              alt="Logo Plásticos LC"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        {/* Payment methods */}
        <div className="flex hidden flex-wrap items-center gap-2 mt-1">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-sm">
            <Wallet className="h-3.5 w-3.5 text-white" />
            <span className="text-white font-sans text-xs">Visa</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[hsl(209,83%,23%)] text-sm">
            <span className="text-[hsl(0,0%,100%)] font-sans text-xs font-medium">#177210</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-sm">
            <span className="text-[hsl(0,0%,100%)] font-sans text-xs">#711221</span>
          </div>
        </div>
        <div className="flex hidden flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-sm">
            <span className="text-[hsl(0,0%,100%)] font-sans text-xs">Stripe</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-sm">
            <span className="text-[hsl(0,0%,100%)] font-sans text-xs">PayPal</span>
          </div>
        </div>
        <button
          type="button"
          className="mt-auto hidden self-end px-4 hover:scale-95 py-2 rounded-lg bg-[hsl(209,83%,23%)] text-[hsl(0,0%,100%)] text-sm font-medium font-sans hover:bg-[hsl(209,81%,33%)] transition-colors"
        >
          Pagar ahora
        </button>
      </div>
    </div>
  )
}
