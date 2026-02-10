"use client"

import { TrendingUp, Clock, Wallet, ArrowUpRight } from "lucide-react"

const summaryData = [
  {
    label: "Vencidas",
    amount: "31,211.00",
    icon: TrendingUp,
    color: "text-[hsl(0,84%,60%)]",
    months: ["Sep", "Oct", "Nov", "Dic"],
    chartPoints: [30, 50, 25, 65, 40, 75, 55, 80],
  },
  {
    label: "Vence proximo mes",
    amount: "172,560.00",
    icon: ArrowUpRight,
    color: "text-[hsl(45,100%,60%)]",
    months: ["Sep", "Oct", "Nov", "Dic"],
    chartPoints: [20, 45, 60, 35, 55, 70, 45, 85],
  },
  {
    label: "Tiempo promedio de pago",
    amount: "12",
    suffix: "dias",
    icon: Clock,
    color: "text-[hsl(0,0%,70%)]",
    months: ["Sep", "Oct", "Nov", "Dic"],
    chartPoints: [50, 40, 65, 30, 55, 45, 70, 60],
  },
]

const payoutData = {
  label: "Disponible para Pago",
  amount: "214,390.00",
  expects: "Esperado",
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* Metric Cards */}
      {summaryData.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs font-sans">{item.label}</span>
            <item.icon className={`h-4 w-4 ${item.color}`} />
          </div>
          <div className="flex items-baseline gap-1.5">
            {!item.suffix && <span className="text-[hsl(0,0%,55%)] text-sm font-sans">$</span>}
            <span className="text-2xl font-bold text-[hsl(0,0%,95%)] font-sans tracking-tight">
              {item.amount}
            </span>
            {item.suffix && (
              <span className="text-base text-muted-foreground font-sans ml-0.5">{item.suffix}</span>
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
      <div className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-xs font-sans">{payoutData.label}</span>
          <span className="text-xs text-muted-foreground font-sans">{payoutData.expects}</span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-[hsl(0,0%,55%)] text-sm font-sans">$</span>
          <span className="text-2xl font-bold text-[hsl(0,0%,95%)] font-sans tracking-tight">
            {payoutData.amount}
          </span>
        </div>
        {/* Payment methods */}
        <div className="flex flex-wrap items-center gap-2 mt-1">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-sm">
            <Wallet className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-[hsl(0,0%,80%)] font-sans text-xs">Visa</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[hsl(90,100%,50%)] text-sm">
            <span className="text-[hsl(0,0%,5%)] font-sans text-xs font-medium">#177210</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-sm">
            <span className="text-[hsl(0,0%,80%)] font-sans text-xs">#711221</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-sm">
            <span className="text-[hsl(0,0%,80%)] font-sans text-xs">Stripe</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-sm">
            <span className="text-[hsl(0,0%,80%)] font-sans text-xs">PayPal</span>
          </div>
        </div>
        <button
          type="button"
          className="mt-auto self-end px-4 py-2 rounded-lg bg-[hsl(90,100%,50%)] text-[hsl(0,0%,5%)] text-sm font-medium font-sans hover:bg-[hsl(90,100%,45%)] transition-colors"
        >
          Pagar ahora
        </button>
      </div>
    </div>
  )
}
