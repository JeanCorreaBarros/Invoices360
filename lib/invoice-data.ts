export interface InvoiceLineItem {
  description: string
  amount: number
}

export interface Invoice {
  id: string
  number: string
  company: string
  customer: string
  customerAvatar: string
  status: "Unsent" | "Viewed" | "Paid" | "Draft" | "Overdue" | "Sent" | "Partial" | "Cancelled"
  amount: number
  daysAgo: string
  lineItems: InvoiceLineItem[]
  subtotal: number
  total: number
  balanceDue: number
}

export const invoices: Invoice[] = [
  {
    id: "1",
    number: "404-002",
    company: "TechFlow Inc",
    customer: "Carlos Mendez",
    customerAvatar: "CM",
    status: "Unsent",
    amount: 80770.0,
    daysAgo: "hace 2 dias",
    lineItems: [
      { description: "Desarrollo Web", amount: 45000.0 },
      { description: "Diseno UI/UX", amount: 25770.0 },
      { description: "Consultoria", amount: 10000.0 },
    ],
    subtotal: 80770.0,
    total: 80770.0,
    balanceDue: 80770.0,
  },
  {
    id: "2",
    number: "426-001",
    company: "GreenLeaf Co",
    customer: "Ana Rodriguez",
    customerAvatar: "AR",
    status: "Viewed",
    amount: 27114.0,
    daysAgo: "hace 4 dias",
    lineItems: [
      { description: "Materiales Plasticos", amount: 15000.0 },
      { description: "Moldeo por Inyeccion", amount: 8114.0 },
      { description: "Empaque", amount: 4000.0 },
    ],
    subtotal: 27114.0,
    total: 27114.0,
    balanceDue: 27114.0,
  },
  {
    id: "3",
    number: "427-012",
    company: "BlueRock",
    customer: "Maria Jones",
    customerAvatar: "MJ",
    status: "Unsent",
    amount: 53154.0,
    daysAgo: "hace 5 dias",
    lineItems: [
      { description: "Desarrollo de Concepto", amount: 10630.8 },
      { description: "Desarrollo CRM", amount: 31892.4 },
      { description: "Integracion CRM", amount: 10630.8 },
    ],
    subtotal: 53154.0,
    total: 53154.0,
    balanceDue: 53154.0,
  },
  {
    id: "4",
    number: "424-112",
    company: "RedStar Ltd",
    customer: "Pedro Vargas",
    customerAvatar: "PV",
    status: "Viewed",
    amount: 61223.0,
    daysAgo: "hace 10 dias",
    lineItems: [
      { description: "Produccion en Serie", amount: 35000.0 },
      { description: "Control de Calidad", amount: 16223.0 },
      { description: "Logistica", amount: 10000.0 },
    ],
    subtotal: 61223.0,
    total: 61223.0,
    balanceDue: 61223.0,
  },
  {
    id: "5",
    number: "437-020",
    company: "SilverWave",
    customer: "Laura Diaz",
    customerAvatar: "LD",
    status: "Viewed",
    amount: 7311.0,
    daysAgo: "hace 19 dias",
    lineItems: [
      { description: "Prototipo", amount: 4311.0 },
      { description: "Materiales", amount: 3000.0 },
    ],
    subtotal: 7311.0,
    total: 7311.0,
    balanceDue: 7311.0,
  },
  {
    id: "6",
    number: "440-005",
    company: "NovaPlast",
    customer: "Roberto Sanchez",
    customerAvatar: "RS",
    status: "Paid",
    amount: 125000.0,
    daysAgo: "hace 1 dia",
    lineItems: [
      { description: "Produccion PET", amount: 75000.0 },
      { description: "Extrusion", amount: 50000.0 },
    ],
    subtotal: 125000.0,
    total: 125000.0,
    balanceDue: 0,
  },
  {
    id: "7",
    number: "441-003",
    company: "EcoPlast SA",
    customer: "Fernanda Torres",
    customerAvatar: "FT",
    status: "Draft",
    amount: 34500.0,
    daysAgo: "hace 3 dias",
    lineItems: [
      { description: "Plastico Reciclado", amount: 20000.0 },
      { description: "Procesamiento", amount: 14500.0 },
    ],
    subtotal: 34500.0,
    total: 34500.0,
    balanceDue: 34500.0,
  },
]
