"use client"

import { useState, useEffect, useRef } from "react"
// ...existing code...

interface Product {
    id: string;
    name: string;
    sku?: string;
    price: number;
    [key: string]: any;
}

interface InvoiceItem {
    id: number;
    referencia: string;
    precio: number;
    descuento: number;
    impuesto: string;
    descripcion: string;
    cantidad: number;
    total: number;
    productId?: string;
}

// Hook para buscar productos
function useProductsSearch() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://plasticoslc.com/api/";
                const res = await fetch(`${apiBase}products`);
                if (!res.ok) throw new Error("Error al cargar productos");
                const data = await res.json();
                setProducts(Array.isArray(data) ? data.filter((p: Product) => p.active) : []);
            } catch (err: any) {
                setError(err?.message || 'Error desconocido');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return { products, loading, error };
}
import toast from "react-hot-toast"
import { BivooLoader } from "@/components/bivoo-loader"
import { AuthGuard } from "@/components/auth-guard"
import { ModuleLayout } from "@/components/module-layout"
import { motion } from "framer-motion"
import { ArrowLeft, Save, Send, PlusCircle, Trash2, HelpCircle, Download, Printer, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { Monitor } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"

export const ssr = false
export const dynamic = "force-dynamic"

export default function NuevaFacturaPage() {
    const { products: productsList, loading: loadingProducts } = useProductsSearch();

    // Arrays de opciones para pagos
    const paymentFormsOptions = [
        { label: "Contado", value: 1 },
        { label: "Crédito 30 días", value: 2 },
        { label: "Crédito 60 días", value: 3 },
        { label: "Crédito 90 días", value: 4 },
    ];

    const paymentMethodsOptions = [
        { label: "Efectivo", value: 1 },
        { label: "Transferencia", value: 2 },
        { label: "Tarjeta", value: 3 },
        { label: "Cheque", value: 4 },
        { label: "Otro", value: 5 },
    ];

    const [showProductDropdown, setShowProductDropdown] = useState<number | null>(null); // index del item que muestra el dropdown
    const [currentStep, setCurrentStep] = useState(1); // 1: Datos, 2: Ítems, 3: Resumen
    const [items, setItems] = useState<InvoiceItem[]>([
        {
            id: Date.now(),
            referencia: "",
            precio: 0,
            descuento: 0,
            impuesto: "0%",
            descripcion: "",
            cantidad: 1,
            total: 0,
        },
    ])
    const [total, setTotal] = useState(0)
    const [subtotal, setSubtotal] = useState(0)
    const [impuestos, setImpuestos] = useState(0)
    const [descuento, setDescuento] = useState(0)
    const [cliente, setCliente] = useState("")
    const [identificacion, setIdentificacion] = useState("")
    const [telefono, setTelefono] = useState("")
    const [email, setEmail] = useState("")
    const [direccion, setDireccion] = useState("")
    const [fecha, setFecha] = useState("")
    const [formaPago, setFormaPago] = useState("Contado")
    const [medioPago, setMedioPago] = useState("Efectivo")
    const [showPaymentMethodDialog, setShowPaymentMethodDialog] = useState(false)
    const [metodoPagoDetalle, setMetodoPagoDetalle] = useState("")
    const [tipoDocumento, setTipoDocumento] = useState("Factura de venta")
    const [retencion, setRetencion] = useState("0")
    const [reteica, setReteica] = useState("0")
    const [reteiva, setReteiva] = useState("0")
    const [autoretencion, setAutoretencion] = useState("0")
    const [notes, setNotes] = useState("Notas Internas...")
    const [clientsList, setClientsList] = useState<any[]>([])
    const [clientsLoading, setClientsLoading] = useState(false)
    const [usersList, setUsersList] = useState<any[]>([])
    const [usersLoading, setUsersLoading] = useState(false)
    const [vendedor, setVendedor] = useState("")
    const [isNewClientOpen, setIsNewClientOpen] = useState(false)
    const emptyNewClient = {
        firstName: "",
        lastName: "",
        nit: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
        birthDate: "",
        gender: "",
        howFound: "",
        notes: "",
    }
    const [newClient, setNewClient] = useState<any>(emptyNewClient)
    const [showClientDropdown, setShowClientDropdown] = useState(false)
    const [logoImage, setLogoImage] = useState<File | null>(null)
    const [signatureImage, setSignatureImage] = useState<File | null>(null)
    const [logoPreview, setLogoPreview] = useState<string | null>(null)
    const [signaturePreview, setSignaturePreview] = useState<string | null>(null)
    const [isPrinting, setIsPrinting] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const [isEmitting, setIsEmitting] = useState(false)
    const [isSavingDraft, setIsSavingDraft] = useState(false)
    const [showDownloadDialog, setShowDownloadDialog] = useState(false)
    const [currentInvoiceId, setCurrentInvoiceId] = useState<number | null>(null)
    const [showPreviewModal, setShowPreviewModal] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [orderResolution, setOrderResolution] = useState("RES-2026-001") // default

    const [company, setCompany] = useState<any>(null);
    const logoInputRef = useRef<HTMLInputElement>(null)
    const signatureInputRef = useRef<HTMLInputElement>(null)

    // Signature pad state & refs
    const [showSignaturePad, setShowSignaturePad] = useState(false)
    const signatureCanvasRef = useRef<HTMLCanvasElement | null>(null)
    const isDrawingRef = useRef(false)
    const lastPointRef = useRef<{ x: number; y: number } | null>(null)

    useEffect(() => {
        // Establecer la fecha actual por defecto
        const today = new Date()
        setFecha(today.toISOString().split("T")[0])
    }, [])

    // Función helper para leer token de sessionStorage
    const getToken = (): string | null => {
        return sessionStorage.getItem("token");
    };

    // Función helper para obtener el ID del usuario del localStorage
    const getUserId = (): string => {
        try {
            const user = localStorage.getItem("user");
            if (user) {
                const userData = JSON.parse(user);
                return userData.id || "3ecb21dc-4140-428b-9678-039997cc5c11";
            }
        } catch (err) {
            console.error("Error al obtener usuario:", err);
        }
        return "3ecb21dc-4140-428b-9678-039997cc5c11";
    };

    // Función helper para obtener el prefix del tipo de documento
    const getOrderPrefix = (): string => {
        switch (tipoDocumento) {
            case "Factura de venta":
                return "FV";
            case "Nota de venta":
                return "NV";
            default:
                return "FV";
        }
    };

    // Función helper para obtener el código de forma de pago
    const getPaymentForm = (): number => {
        const form = paymentFormsOptions.find(f => f.label === formaPago);
        return form?.value || 1;
    };

    // Función helper para obtener el plazo de pago
    const getPlazoPago = (): string => {
        switch (formaPago) {
            case "Contado":
                return "0";
            case "Crédito 30 días":
                return "30";
            case "Crédito 60 días":
                return "60";
            case "Crédito 90 días":
                return "90";
            default:
                return "0";
        }
    };

    // Función helper para obtener el código de medio de pago
    const getPaymentMethod = (): number => {
        const method = paymentMethodsOptions.find(m => m.label === medioPago);
        return method?.value || 1;
    };

    // Obtener lista de clientes para el select de Vendedor
    useEffect(() => {
        const fetchClients = async () => {
            setClientsLoading(true)
            try {
                const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://plasticoslc.com/api/";
                const res = await fetch(`${apiBase}customers`, {
                    method: "GET",
                })

                if (!res.ok) {
                    const txt = await res.text().catch(() => "")
                    console.error("Error fetching clients:", res.status, txt)
                    setClientsList([])
                } else {
                    const data = await res.json().catch(() => [])
                    setClientsList(Array.isArray(data) ? data : [])
                }
            } catch (err) {
                console.error("Error fetching clients:", err)
                setClientsList([])
            } finally {
                setClientsLoading(false)
            }
        }

        fetchClients()
    }, [])

    // Obtener lista de usuarios para el select de Vendedor
    useEffect(() => {
        const fetchUsers = async () => {
            setUsersLoading(true)
            try {
                const token = getToken();
                const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://plasticoslc.com/api/";
                const res = await fetch(`${apiBase}users?page=1&limit=10`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                })

                if (!res.ok) {
                    const txt = await res.text().catch(() => "")
                    console.error("Error fetching users:", res.status, txt)
                    setUsersList([])
                } else {
                    const data = await res.json().catch(() => null)
                    setUsersList(data?.data && Array.isArray(data.data) ? data.data : [])
                }
            } catch (err) {
                console.error("Error fetching users:", err)
                setUsersList([])
            } finally {
                setUsersLoading(false)
            }
        }

        fetchUsers()
    }, [])

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://plasticoslc.com/api/";
                const res = await fetch(`${apiBase}/companies`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.ok && data.data && data.data.length > 0) {
                        setCompany(data.data[0]);
                    }
                }
            } catch (err) {
                console.error('Error fetching company:', err);
            }
        };
        fetchCompany();
    }, [])

    useEffect(() => {
        const fetchResolutions = async () => {
            const token = getToken();
            if (!token) return;
            const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://plasticoslc.com/api/";
            try {
                const res = await fetch(`${apiBase}resolutions`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });
                if (res.ok) {
                    const data = await res.json();
                    const prefix = getOrderPrefix();
                    const resolution = data.find((r: any) => r.prefix === prefix && r.active);
                    if (resolution) {
                        setOrderResolution(String(resolution.id));
                    }
                }
            } catch (err) {
                console.error('Error fetching resolutions:', err);
            }
        };
        fetchResolutions();
    }, [tipoDocumento]) // depends on tipoDocumento since getOrderPrefix uses it

    useEffect(() => {
        // Calcular totales cuando cambian los items
        let newSubtotal = 0
        let newImpuestos = 0
        let totalDescuentos = 0

        items.forEach((item) => {
            const itemSubtotal = item.precio * item.cantidad
            const itemDescuento = Math.min(item.descuento || 0, itemSubtotal)
            totalDescuentos += itemDescuento

            const itemTotal = itemSubtotal - itemDescuento
            newSubtotal += itemTotal

            if (item.impuesto) {
                const impuestoValue = Number.parseFloat(item.impuesto.replace("%", "")) / 100
                newImpuestos += itemTotal * impuestoValue
            }
        })

        setSubtotal(newSubtotal)
        setImpuestos(newImpuestos)
        setDescuento(totalDescuentos)
        setTotal(newSubtotal + newImpuestos)
    }, [items])

    // useEffect para visualizar el payload en consola en tiempo real
    useEffect(() => {
        const payload = {
            /*orderId: Date.now(),*/
            orderPrefix: getOrderPrefix(),
            orderResolution: orderResolution,
            userId: getUserId(),
            orderDate: fecha ? new Date(fecha).toISOString() : new Date().toISOString(),
            orderReceiverNit: identificacion || "",
            orderReceiverName: cliente || "",
            orderReceiverAddress: direccion || "",
            orderReceiverPhone: telefono || "",
            orderTotalDesc: descuento || 0,
            orderSubtotalBeforeTax: subtotal || 0,
            orderTotalBeforeTax: subtotal || 0,
            orderTotalTax: impuestos || 0,
            orderTaxPer: items && items[0] ? String(items[0].impuesto).replace("%", "") : "0",
            orderTotalAfterTax: total || 0,
            orderAmountPaid: total || 0,
            orderTotalAmountDue: total || 0,
            note: notes,
            cufe: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `cufe-${Date.now()}`,
            paymentForms: getPaymentForm(),
            paymentMethods: getPaymentMethod(),
            retencion: retencion || "0",
            reteica: Number(reteica) || 0,
            reteiva: Number(reteiva) || 0,
            autoretencion: Number(autoretencion) || 0,
            ciiu: 0,
            plazoPago: getPlazoPago(),
            vencimiento: "30",
            status: "1",
            items: items.map((it) => {
                const baseTotal = (Number(it.precio) || 0) * (Number(it.cantidad) || 0)
                const itemDescAmount = Math.min(Number(it.descuento) || 0, baseTotal)
                const totalAfterDiscount = baseTotal - itemDescAmount
                const taxPercent = Number(String(it.impuesto || "0").replace("%", "")) || 0
                const taxAmount = totalAfterDiscount * (taxPercent / 100)
                const finalAmount = totalAfterDiscount + taxAmount
                return {
                    productId: it.productId || it.referencia || `ITEM-${Date.now()}`,
                    itemCode: it.referencia || `ITEM-${Date.now()}`,
                    quantity: 0,
                    orderPrefix: getOrderPrefix(),
                    orderResolution: orderResolution,
                    reference: it.referencia || "",
                    itemName: it.descripcion || it.referencia || "",
                    descripcion: it.descripcion || "",
                    orderItemQuantity: Number(it.cantidad) || 0,
                    orderItemPrice: Number(it.precio) || 0,
                    orderItemIva: Number(taxAmount.toFixed(2)),
                    orderItemDesc: Number(itemDescAmount.toFixed(2)),
                    orderItemFinalAmount: Number(finalAmount.toFixed(2)),
                }
            })
        }
        console.log("📋 Payload en tiempo real:", payload)
    }, [cliente, identificacion, telefono, email, direccion, fecha, formaPago, medioPago, subtotal, impuestos, descuento, total, items, tipoDocumento, notes, orderResolution, retencion, reteica, reteiva, autoretencion])

    const addItem = () => {
        setItems([
            ...items,
            {
                id: Date.now(),
                referencia: "",
                precio: 0,
                descuento: 0,
                impuesto: "0%",
                descripcion: "",
                cantidad: 1,
                total: 0,
            },
        ])
    }

    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))

    const updateItem = (id: number, field: string, value: any) => {
        setItems(
            items.map((item) => {
                if (item.id !== id) return item;

                // Special handling for product selection in referencia
                if (field === "referencia" && typeof value === "object" && value !== null && value.__selectedProduct) {
                    return {
                        ...item,
                        referencia: value.productSku,
                        productId: value.productId,
                        descripcion: value.productName,
                        precio: value.precio,
                    };
                }

                let newValue: any = value;
                if (field === "precio") {
                    // allow decimals, clamp to a reasonable max, round to 2 decimals
                    const n = Number(value) || 0;
                    const clamped = clamp(n, -1e12, 1e12);
                    newValue = Math.round(clamped * 100) / 100;
                } else if (field === "descuento") {
                    // discount is a fixed amount: allow positive numbers
                    const n = Number(value) || 0;
                    const clamped = clamp(n, 0, 1e12);
                    newValue = Math.round(clamped * 100) / 100;
                } else if (field === "cantidad") {
                    // cantidad should be an integer and non-negative
                    const n = Number(value) || 0;
                    const clamped = clamp(n, 0, 1e9);
                    newValue = Math.round(clamped);
                }
                return item.id === id ? { ...item, [field]: newValue } : item;
            })
        );
    }

    const removeItem = (id: number) => {
        if (items.length > 1) {
            setItems(items.filter((item) => item.id !== id))
        }
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(value)
    }

    const calculateItemTotal = (item: {
        id: number
        referencia: string
        precio: number
        descuento: number
        impuesto: string
        descripcion: string
        cantidad: number
        total: number
    }) => {
        const baseTotal = item.precio * item.cantidad
        const discount = Math.min(item.descuento || 0, baseTotal) // don't allow discount > baseTotal
        const totalConDescuento = baseTotal - discount
        const taxPercent = Number(String(item.impuesto || "0").replace("%", "")) / 100
        const taxAmount = totalConDescuento * taxPercent
        return totalConDescuento + taxAmount
    }

    const handleMedioPagoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setMedioPago(e.target.value)
        setMetodoPagoDetalle("")
    }

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0]
        if (file) {
            setLogoImage(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setLogoPreview(reader.result as string | null)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0]
        if (file) {
            setSignatureImage(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setSignaturePreview(reader.result as string | null)
            }
            reader.readAsDataURL(file)
        }
    }

    // Prepare canvas for drawing (pixel ratio aware)
    const prepareSignatureCanvas = () => {
        const canvas = signatureCanvasRef.current
        if (!canvas) return
        const ratio = window.devicePixelRatio || 1
        const w = canvas.clientWidth
        const h = canvas.clientHeight
        canvas.width = Math.round(w * ratio)
        canvas.height = Math.round(h * ratio)
        const ctx = canvas.getContext("2d")
        if (ctx) {
            ctx.scale(ratio, ratio)
            ctx.lineWidth = 2
            ctx.lineCap = "round"
            ctx.strokeStyle = "#000"
            ctx.clearRect(0, 0, canvas.width, canvas.height)
        }
    }

    const startSignature = (e: React.PointerEvent) => {
        const canvas = signatureCanvasRef.current
        if (!canvas) return
        canvas.setPointerCapture((e.nativeEvent as PointerEvent).pointerId)
        isDrawingRef.current = true
        const rect = canvas.getBoundingClientRect()
        lastPointRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    const moveSignature = (e: React.PointerEvent) => {
        if (!isDrawingRef.current) return
        const canvas = signatureCanvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx || !lastPointRef.current) return
        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        ctx.beginPath()
        ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y)
        ctx.lineTo(x, y)
        ctx.stroke()
        lastPointRef.current = { x, y }
    }

    const endSignature = (e: React.PointerEvent) => {
        const canvas = signatureCanvasRef.current
        if (!canvas) return
        try {
            canvas.releasePointerCapture((e.nativeEvent as PointerEvent).pointerId)
        } catch (err) {
            // ignore
        }
        isDrawingRef.current = false
        lastPointRef.current = null
    }

    const clearSignatureCanvas = () => {
        const canvas = signatureCanvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    const dataURLToFile = async (dataurl: string, filename: string) => {
        const res = await fetch(dataurl)
        const blob = await res.blob()
        return new File([blob], filename, { type: blob.type })
    }

    const confirmSignatureFromCanvas = async () => {
        const canvas = signatureCanvasRef.current
        if (!canvas) return
        const dataUrl = canvas.toDataURL("image/png")
        setSignaturePreview(dataUrl)
        const file = await dataURLToFile(dataUrl, `signature-${Date.now()}.png`)
        setSignatureImage(file)
        setShowSignaturePad(false)
    }

    const handlePrint = () => {
        setIsPrinting(true)
        setTimeout(() => {
            window.print()
            setIsPrinting(false)
        }, 500)
    }

    const handleDownload = () => {
        setShowDownloadDialog(true)
    }

    const handleShowInvoicePreview = async (invoiceId: string | number) => {
        setIsDownloading(true);
        try {
            const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://plasticoslc.com/api/";
            const res = await fetch(`${apiBase}invoice-documents/${invoiceId}/pdf`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                },
            });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${await res.text()}`);
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            setPreviewUrl(url);
            setShowPreviewModal(true);
        } catch (error) {
            console.error('Error fetching invoice preview:', error);
            toast.error('Error al cargar la previsualización de la factura');
        } finally {
            setIsDownloading(false);
        }
    };

    const handleSaveDraft = async () => {
        console.log("Guardando borrador con payload:")
        setIsSavingDraft(true)
        const token = getToken();
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        if (token) myHeaders.append("Authorization", `Bearer ${token}`);

        try {
            // Construir payload principal
            const payload = {
                orderId: Date.now(),
                orderPrefix: getOrderPrefix(),
                orderResolution: orderResolution,
                userId: getUserId(),
                orderDate: fecha ? new Date(fecha).toISOString() : new Date().toISOString(),
                orderReceiverNit: identificacion || "",
                orderReceiverName: cliente || "",
                orderReceiverAddress: direccion || "",
                orderReceiverEmail: email || "",
                orderReceiverPhone: telefono || "",
                orderTotalDesc: descuento || 0,
                orderSubtotalBeforeTax: subtotal || 0,
                orderTotalBeforeTax: subtotal || 0,
                orderTotalTax: impuestos || 0,
                orderTaxPer: items && items[0] ? String(items[0].impuesto).replace("%", "") : "0",
                orderTotalAfterTax: total || 0,
                orderAmountPaid: total || 0,
                orderTotalAmountDue: total || 0,
                sellerId: vendedor || "",
                note: notes,
                cufe: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `cufe-${Date.now()}`,
                paymentForms: getPaymentForm(),
                paymentMethods: getPaymentMethod(),
                retencion: retencion || "0",
                reteica: Number(reteica) || 0,
                reteiva: Number(reteiva) || 0,
                autoretencion: Number(autoretencion) || 0,
                ciiu: 2,
                plazoPago: getPlazoPago(),
                vencimiento: "30",
                status: "DRAFT",
                items: items.map((it) => {
                    const baseTotal = (Number(it.precio) || 0) * (Number(it.cantidad) || 0)
                    const itemDescAmount = Math.min(Number(it.descuento) || 0, baseTotal)
                    const totalAfterDiscount = baseTotal - itemDescAmount
                    const taxPercent = Number(String(it.impuesto || "0").replace("%", "")) || 0
                    const taxAmount = totalAfterDiscount * (taxPercent / 100)
                    const finalAmount = totalAfterDiscount + taxAmount
                    return {
                        productId: it.productId || it.referencia || `ITEM-${Date.now()}`,
                        itemCode: it.referencia || `ITEM-${Date.now()}`,
                        quantity: 0,
                        orderPrefix: getOrderPrefix(),
                        orderResolution: orderResolution,
                        reference: it.referencia || "",
                        itemName: it.descripcion || it.referencia || "",
                        descripcion: it.descripcion || "",
                        orderItemQuantity: Number(it.cantidad) || 0,
                        orderItemPrice: Number(it.precio) || 0,
                        orderItemIva: Number(taxAmount.toFixed(2)),
                        orderItemDesc: Number(itemDescAmount.toFixed(2)),
                        orderItemFinalAmount: Number(finalAmount.toFixed(2)),
                    }
                })
            }
            const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://plasticoslc.com/api/";
            const res = await fetch(`${apiBase}invoices`, {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                const txt = await res.text().catch(() => "")
                /*console.error("Error saving draft:", res.status, txt)*/
                toast.error("Error guardando borrador. Revisa la consola.");
                return
            }

            const created = await res.json().catch(() => null)
            if (created) {
                toast.success("Borrador guardado exitosamente!")
                // Store the invoice ID for downloads
                setCurrentInvoiceId(created?.id ?? created?.invoiceId ?? null)
                // Reset form or navigate
            }
        } catch (err) {
            /*console.error("Error saving draft:", err)*/
            toast.error("Error guardando borrador. Revisa la consola.")
        } finally {
            setIsSavingDraft(false)
        }
    }

    const downloadInvoice = async (style: 'classic' | 'dian') => {
        if (!currentInvoiceId) {
            toast.error('No hay una factura emitida o guardada para descargar')
            setShowDownloadDialog(false)
            return
        }

        setIsDownloading(true)
        try {
            const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://plasticoslc.com/api/";
            const endpoint = 'invoice-documents'
            const res = await fetch(`${apiBase}${endpoint}/${currentInvoiceId}/pdf${style !== 'classic' ? '?style=dian' : ''}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                },
            })

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${await res.text()}`)
            }

            const blob = await res.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `invoice-${style}-${currentInvoiceId}.pdf`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)

            toast.success(`Factura descargada en estilo ${style}`)
        } catch (error) {
            console.error('Error downloading invoice:', error)
            toast.error('Error al descargar la factura')
        } finally {
            setIsDownloading(false)
            setShowDownloadDialog(false)
        }
    }

    const handleEmitInvoice = async () => {
        setIsEmitting(true)
        const token = getToken();
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        if (token) myHeaders.append("Authorization", `Bearer ${token}`);

        try {
            // Construir payload principal
            const payload = {
                orderId: Date.now(),
                orderPrefix: getOrderPrefix(),
                orderResolution: orderResolution,
                userId: getUserId(),
                orderDate: fecha ? new Date(fecha).toISOString() : new Date().toISOString(),
                orderReceiverNit: identificacion || "",
                orderReceiverName: cliente || "",
                orderReceiverAddress: direccion || "",
                orderReceiverEmail: email || "",
                orderReceiverPhone: telefono || "",
                orderTotalDesc: descuento || 0,
                orderSubtotalBeforeTax: subtotal || 0,
                orderTotalBeforeTax: subtotal || 0,
                orderTotalTax: impuestos || 0,
                orderTaxPer: items && items[0] ? String(items[0].impuesto).replace("%", "") : "0",
                orderTotalAfterTax: total || 0,
                orderAmountPaid: total || 0,
                orderTotalAmountDue: total || 0,
                sellerId: vendedor || "",
                note: notes,
                cufe: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `cufe-${Date.now()}`,
                paymentForms: getPaymentForm(),
                paymentMethods: getPaymentMethod(),
                retencion: retencion || "0",
                reteica: Number(reteica) || 0,
                reteiva: Number(reteiva) || 0,
                autoretencion: Number(autoretencion) || 0,
                ciiu: 0,
                plazoPago: getPlazoPago(),
                vencimiento: "30",
                status: "PENDING",
                items: items.map((it) => {
                    const baseTotal = (Number(it.precio) || 0) * (Number(it.cantidad) || 0)
                    const itemDescAmount = Math.min(Number(it.descuento) || 0, baseTotal)
                    const totalAfterDiscount = baseTotal - itemDescAmount
                    const taxPercent = Number(String(it.impuesto || "0").replace("%", "")) || 0
                    const taxAmount = totalAfterDiscount * (taxPercent / 100)
                    const finalAmount = totalAfterDiscount + taxAmount
                    return {
                        productId: it.productId || it.referencia || `ITEM-${Date.now()}`,
                        itemCode: it.referencia || `ITEM-${Date.now()}`,
                        quantity: 0,
                        orderPrefix: getOrderPrefix(),
                        orderResolution: orderResolution,
                        reference: it.referencia || "",
                        itemName: it.descripcion || it.referencia || "",
                        descripcion: it.descripcion || "",
                        orderItemQuantity: Number(it.cantidad) || 0,
                        orderItemPrice: Number(it.precio) || 0,
                        orderItemIva: Number(taxAmount.toFixed(2)),
                        orderItemDesc: Number(itemDescAmount.toFixed(2)),
                        orderItemFinalAmount: Number(finalAmount.toFixed(2)),
                    }
                })
            }

            const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://plasticoslc.com/api/";
            const res = await fetch(`${apiBase}invoices`, {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify(payload),
            })

            let data;
            try {
                data = await res.json();
            } catch {
                throw new Error(`HTTP ${res.status}: ${await res.text()}`);
            }

            if (data.ok) {
                toast.success(data.message || `Factura emitida correctamente (id: ${data?.id ?? data?.invoiceId ?? data?.invoice?.id ?? "-"})`);
                console.log("Emit invoice response:", data);

                // Store the invoice ID for downloads
                const newId = data?.id ?? data?.invoiceId ?? data?.invoice?.id ?? null;
                setCurrentInvoiceId(newId);

                // Show preview modal automatically
                if (newId) {
                    handleShowInvoicePreview(newId);
                }

                // Limpiar todos los inputs al emitir exitosamente
                setCliente("");
                setIdentificacion("");
                setTelefono("");
                setEmail("");
                setDireccion("");
                setFecha("");
                setFormaPago("Contado");
                setMedioPago("Efectivo");
                setShowPaymentMethodDialog(false);
                setMetodoPagoDetalle("");
                setItems([
                    {
                        id: Date.now(),
                        referencia: "",
                        precio: 0,
                        descuento: 0,
                        impuesto: "0%",
                        descripcion: "",
                        cantidad: 1,
                        total: 0,
                    },
                ]);
                setSignaturePreview(null);
                const canvas = signatureCanvasRef.current;
                if (canvas) {
                    const ctx = canvas.getContext("2d");
                    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
            } else {
                toast.error(data.message || "Error al emitir la factura");
            }
        } catch (error) {
            console.error("Error emitiendo factura:", error)
            toast.error("Error de conexión al emitir la factura. Revisa la consola para más detalles.")
        } finally {
            setIsEmitting(false)
        }
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring" as const,
                stiffness: 100,
            },
        },
    }

    // Mobile check removed to allow responsive view



    return (

        <div className="min-h-screen bg-white flex flex-col">
            <DashboardHeader />
            <main className="flex-1 overflow-y-auto p-4 md:p-9 ">

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="max-w-6xl mx-auto p-4 md:p-6 shadow-xl bg-white rounded-lg text-gray-900"
                >
                    {/* Header */}
                    <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <div className="flex items-center">
                            <Link href="/">
                                <Button variant="ghost" size="icon" className="mr-2">
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                            </Link>
                            <h1 className="text-xl md:text-2xl font-bold">Nueva Factura de Venta</h1>
                        </div>
                        <div className="hidden md:flex flex-wrap gap-2 w-full md:w-auto">
                            <Button variant="outline" className="flex items-center gap-1 hover:bg-[hsl(147,88%,41%)] shadow-lg  hover:text-white bg-white" onClick={handleSaveDraft} disabled={isSavingDraft}>
                                <Save className="h-4 w-4" />
                                {isSavingDraft ? "Guardando..." : "Guardar Borrador"}
                            </Button>
                            <Button variant="outline" className=" hidden items-center gap-1 hover:bg-[hsl(209,83%,23%)] shadow-lg hover:text-white  bg-white" onClick={handlePrint} disabled={isPrinting}>
                                <Printer className="h-4 w-4" />
                                {isPrinting ? "Imprimiendo..." : "Imprimir"}
                            </Button>
                            <Button
                                variant="outline"
                                className="hidden items-center md:hidden flex gap-1 hover:bg-[hsl(209,83%,23%)] hover:text-white bg-white"
                                onClick={handleDownload}
                                disabled={isDownloading || !currentInvoiceId}
                            >
                                <Download className="h-4 w-4" />
                                {isDownloading ? "Descargando..." : "Descargar"}
                            </Button>
                            <Button
                                className="bg-blue-900 hover:bg-[hsl(209,83%,23%)] hover:scale-95 text-white flex items-center gap-1"
                                onClick={handleEmitInvoice}
                                disabled={isEmitting}
                            >
                                <Send className="h-4 w-4" />
                                {isEmitting ? "Emitiendo..." : "Emitir Factura"}
                            </Button>
                        </div>
                    </motion.div>

                    {/* Document Type and Settings */}
                    <motion.div
                        variants={itemVariants}
                        className={`grid grid-cols-1 md:grid-cols-5 gap-4 bg-gray-50 p-4 shadow-xl rounded-lg mb-6 ${currentStep === 1 ? "" : "hidden md:grid"}`}
                    >
                        <div>
                            <label className="text-sm text-gray-600 block mb-2">Tipo de documento</label>
                            <select
                                className="w-full border rounded px-3 py-2 text-sm bg-white"
                                value={tipoDocumento}
                                onChange={(e) => setTipoDocumento(e.target.value)}
                            >
                                <option>Factura de venta</option>
                                {/*<option>Factura electrónica</option>*/}
                                <option>Nota de venta</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-gray-600 block mb-2">Lista de precios</label>
                            <select
                                className="w-full border rounded px-3 py-2 text-sm bg-gray-100 cursor-not-allowed"
                                disabled
                                value="General"
                            >
                                <option value="General">General</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm text-gray-600 block mb-2">Vendedor</label>
                            <select
                                className="w-full border rounded px-3 py-2 text-sm bg-white"
                                value={vendedor}
                                onChange={(e) => {
                                    const id = e.target.value
                                    setVendedor(id)
                                }}
                            >
                                <option value="">{usersLoading ? "Cargando..." : "Seleccionar..."}</option>
                                {usersList.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.name || ""} {u.email ? `(${u.email})` : ""}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-gray-600 block mb-2">Orden de compra</label>
                            <input disabled type="text" className="w-full border rounded px-3 py-2 text-sm bg-white" placeholder="Opcional" />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600 block mb-2">Orden de entrega</label>
                            <input disabled type="text" className="w-full border rounded px-3 py-2 text-sm bg-white" placeholder="Opcional" />
                        </div>
                    </motion.div>

                    {/* Company Info */}
                    <motion.div variants={itemVariants} className={`flex flex-col md:flex-row justify-between items-center md:items-start mb-6 gap-6 ${currentStep === 1 ? "" : "hidden md:flex"}`}>
                        <div
                            className="w-full md:w-48 h-32 border-2 border-dashed border-gray-300 flex items-center justify-center rounded-md cursor-pointer hover:bg-gray-50 transition-colors relative overflow-hidden shrink-0"
                            onClick={() => logoInputRef.current?.click()}
                        >
                            {logoPreview || company?.logo ? (
                                <div className="relative w-full h-full">
                                    <Image
                                        src={logoPreview || (company?.logo ? `https://plasticoslc.com${company.logo}` : "/placeholder.svg")}
                                        alt="Logo de la empresa"
                                        fill
                                        className="object-contain bg-white"
                                    />

                                    {/* Overlay corregido */}
                                    <div className="absolute inset-0 bg-black/0 hover:bg-black/20 flex items-center justify-center transition-all">
                                        <span className="text-white opacity-0 hover:opacity-100 transition-opacity">
                                            Cambiar
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <span className="text-gray-500">Utilizar mi logo</span>
                            )}

                            <input
                                type="file"
                                ref={logoInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleLogoUpload}
                            />
                        </div>

                        <div className="flex-1 px-0 md:px-8 my-0 text-center md:text-left">
                            <div className="">
                                <h2 className="text-lg font-semibold">{company?.tradeName || company?.businessName || 'PlasticosLC'}</h2>
                                <p className="text-gray-600">NIT: {company?.nit || '900.123.456-7'}{company?.dv ? `-${company.dv}` : ''}</p>
                                <p className="text-gray-600">{company?.email || 'contacto@PlasticosLC.com'}</p>
                                <p className="text-gray-600">{company?.address || 'Calle 123 #45-67, Bogotá'}</p>
                            </div>
                        </div>
                        <div className="w-full md:w-48">
                            <div className="flex items-center justify-between md:justify-start gap-2 mb-2">
                                <span className="font-semibold">No.</span>
                                <span className="text-blue-600 animate-pulse">
                                    {currentInvoiceId ? `PlasticosLC-${currentInvoiceId}` : "Creando..."}
                                </span>
                                <button className="text-gray-400 hover:text-gray-600">
                                    <HelpCircle className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex items-center justify-between md:justify-start gap-2 mb-2">
                                <span className="font-semibold">Consecutivo:</span>
                                <span className="animate-pulse">Creando</span>
                            </div>
                            <div className="flex items-center justify-between md:justify-start gap-2 mb-2">
                                <span className="font-semibold">Estado:</span>
                                <span className="text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full text-xs animate-pulse">No Definido</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Client Info */}
                    <motion.div variants={itemVariants} className={`grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 ${currentStep === 1 ? "" : "hidden md:grid"}`}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm  text-gray-600 mb-1">Cliente *</label>
                                <div className="relative">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className="w-full bg-white border rounded px-3 py-2"
                                            placeholder="Buscar cliente por nombre, email o teléfono..."
                                            value={cliente}
                                            onChange={(e) => {
                                                setCliente(e.target.value)
                                                setShowClientDropdown(true)
                                            }}
                                            onFocus={() => setShowClientDropdown(true)}
                                            onBlur={() => setTimeout(() => setShowClientDropdown(false), 150)
                                            }
                                        />
                                        <button
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            onClick={() => setIsNewClientOpen(true)}
                                            type="button"
                                        >
                                            <PlusCircle className="w-4 h-4" />
                                        </button>

                                        {showClientDropdown && cliente && (
                                            <ul className="absolute z-50 left-0 right-0 bg-white border rounded mt-1 max-h-48 overflow-y-auto">
                                                {clientsList
                                                    .filter((c) => {
                                                        const q = cliente.toLowerCase()
                                                        const full = (c.name || "").toLowerCase()
                                                        return (
                                                            full.includes(q) ||
                                                            (c.email || "").toLowerCase().includes(q) ||
                                                            (c.phone || "").toLowerCase().includes(q) ||
                                                            (c.id || "").toString().toLowerCase().includes(q)
                                                        )
                                                    })
                                                    .map((c) => (
                                                        <li
                                                            key={c.id}
                                                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                                            onMouseDown={() => {
                                                                // Seleccionar sólo como cliente, no como vendedor
                                                                setCliente(c.name || "")
                                                                setTelefono(c.phone || "")
                                                                setEmail(c.email || "")
                                                                setDireccion(c.address || "")
                                                                setIdentificacion(c.nit || c.id || "")
                                                                setShowClientDropdown(false)
                                                            }}
                                                        >
                                                            <div className="text-sm font-medium">{c.name || ""}</div>
                                                            <div className="text-xs text-muted-foreground">{c.email} {c.phone ? `• ${c.phone}` : ""}</div>
                                                        </li>
                                                    ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Identificación</label>
                                <input
                                    type="text"
                                    className="w-full bg-white border rounded px-3 py-2"
                                    value={identificacion}
                                    onChange={(e) => setIdentificacion(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Teléfono</label>
                                <input
                                    type="text"
                                    className="w-full border bg-white rounded px-3 py-2"
                                    value={telefono}
                                    onChange={(e) => setTelefono(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Correo electrónico</label>
                                <input type="email" value={email}
                                    onChange={(e) => setEmail(e.target.value)} className="w-full bg-white border rounded px-3 py-2" />
                            </div>

                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Fecha *</label>
                                <input
                                    type="date"
                                    className="w-full border bg-white rounded px-3 py-2"
                                    value={fecha}
                                    onChange={(e) => setFecha(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Forma de pago</label>
                                <select
                                    className="w-full border bg-white rounded px-3 py-2"
                                    value={formaPago}
                                    onChange={(e) => setFormaPago(e.target.value)}
                                >
                                    {paymentFormsOptions.map(form => (
                                        <option key={form.value}>{form.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Medio de pago</label>
                                <div className="flex">
                                    <select className="w-full border bg-white rounded-l px-3 py-2" value={medioPago} onChange={handleMedioPagoChange}>
                                        {paymentMethodsOptions.map(method => (
                                            <option key={method.value}>{method.label}</option>
                                        ))}
                                    </select>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" disabled className="rounded-l-none cursor-pointer bg-white">
                                                <PlusCircle className="h-4 w-4" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="w-[95vw] sm:max-w-[500px] bg-white">
                                            <DialogHeader>
                                                <DialogTitle>Seleccionar método de pago</DialogTitle>
                                            </DialogHeader>
                                            <Tabs defaultValue="transferencia" className="w-full">
                                                <TabsList className="grid grid-cols-2 md:grid-cols-4 h-auto mb-4">
                                                    <TabsTrigger value="efectivo">Efectivo</TabsTrigger>
                                                    <TabsTrigger value="transferencia" className="text-xs md:text-sm">Transferencia</TabsTrigger>
                                                    <TabsTrigger value="tarjeta">Tarjeta</TabsTrigger>
                                                    <TabsTrigger value="cheque">Cheque</TabsTrigger>
                                                </TabsList>
                                                <TabsContent value="efectivo" className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm text-gray-600 mb-1">Monto en efectivo</label>
                                                        <input type="number" className="w-full border rounded px-3 py-2" />
                                                    </div>
                                                    <Button
                                                        onClick={() => {
                                                            setMetodoPagoDetalle("Efectivo")
                                                            setMedioPago("Efectivo")
                                                        }}
                                                    >
                                                        Confirmar
                                                    </Button>
                                                </TabsContent>
                                                <TabsContent value="transferencia" className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm text-gray-600 mb-1">Tipo de transferencia</label>
                                                        <select className="w-full border rounded px-3 py-2">
                                                            <option>Transferencia bancaria</option>
                                                            <option>Nequi</option>
                                                            <option>Daviplata</option>
                                                            <option>PSE</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm text-gray-600 mb-1">Número de referencia</label>
                                                        <input type="text" className="w-full border rounded px-3 py-2" />
                                                    </div>
                                                    <Button
                                                        onClick={() => {
                                                            setMetodoPagoDetalle("Transferencia")
                                                            setMedioPago("Transferencia")
                                                        }}
                                                    >
                                                        Confirmar
                                                    </Button>
                                                </TabsContent>
                                                <TabsContent value="tarjeta" className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm text-gray-600 mb-1">Tipo de tarjeta</label>
                                                        <select className="w-full border rounded px-3 py-2">
                                                            <option>Visa</option>
                                                            <option>Mastercard</option>
                                                            <option>American Express</option>
                                                            <option>Otra</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm text-gray-600 mb-1">Últimos 4 dígitos</label>
                                                        <input type="text" className="w-full border rounded px-3 py-2" maxLength={4} />
                                                    </div>
                                                    <Button
                                                        onClick={() => {
                                                            setMetodoPagoDetalle("Tarjeta")
                                                            setMedioPago("Tarjeta")
                                                        }}
                                                    >
                                                        Confirmar
                                                    </Button>
                                                </TabsContent>
                                                <TabsContent value="cheque" className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm text-gray-600 mb-1">Número de cheque</label>
                                                        <input type="text" className="w-full border rounded px-3 py-2" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm text-gray-600 mb-1">Banco</label>
                                                        <input type="text" className="w-full border rounded px-3 py-2" />
                                                    </div>
                                                    <Button
                                                        onClick={() => {
                                                            setMetodoPagoDetalle("Cheque")
                                                            setMedioPago("Cheque")
                                                        }}
                                                    >
                                                        Confirmar
                                                    </Button>
                                                </TabsContent>
                                            </Tabs>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                {metodoPagoDetalle && (
                                    <div className="mt-2 text-sm text-blue-600">Método seleccionado: {metodoPagoDetalle}</div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Dirección</label>
                                <input type="text" value={direccion}
                                    onChange={(e) => setDireccion(e.target.value)} className="w-full bg-white border rounded px-3 py-2" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Items Table (Desktop) & Cards (Mobile) */}
                    <motion.div variants={itemVariants} className={`mb-6 ${currentStep === 2 ? "" : "hidden md:block"}`}>
                        {/* Desktop Table */}
                        <div className="hidden md:block min-h-[400px]">
                            <table className="w-full mb-4 border-collapse">
                                <thead>
                                    <tr className="border-b text-gray-400 text-xs uppercase tracking-wider">
                                        <th className="text-left py-3 w-8 font-medium">#</th>
                                        <th className="text-left py-3 w-48 font-medium">Referencia / Producto</th>
                                        <th className="text-left py-3 w-32 font-medium">Precio</th>
                                        <th className="text-left py-3 w-24 font-medium">Descuento</th>
                                        <th className="text-left py-3 w-28 font-medium">Impuesto</th>
                                        <th className="text-left py-3 font-medium">Descripción</th>
                                        <th className="text-left py-3 w-24 font-medium">Cantidad</th>
                                        <th className="text-left py-3 w-32 font-medium">Total</th>
                                        <th className="text-left py-3 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, index) => (
                                        <motion.tr
                                            key={item.id}
                                            className="border-b transition-colors hover:bg-gray-50/50"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <td className="py-4 text-sm text-gray-500">{index + 1}</td>
                                            <td className="py-4 pr-2">
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        className="border border-gray-200 bg-white rounded-md px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                                        value={item.referencia}
                                                        onChange={(e) => {
                                                            updateItem(item.id, "referencia", e.target.value);
                                                            setShowProductDropdown(index);
                                                        }}
                                                        onFocus={() => setShowProductDropdown(index)}
                                                        onBlur={() => setTimeout(() => setShowProductDropdown(null), 200)}
                                                        placeholder="Buscar prod..."
                                                    />
                                                    {showProductDropdown === index && item.referencia && (
                                                        <ul className="absolute z-[100] left-0 right-0 bg-white border border-gray-200 rounded-lg mt-2 max-h-64 overflow-y-auto shadow-2xl min-w-[350px] animate-in fade-in zoom-in-95 duration-200">
                                                            {loadingProducts ? (
                                                                <li className="px-4 py-3 text-gray-500 text-sm flex items-center gap-2">
                                                                    <div className="animate-spin h-3 w-3 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                                                                    Buscando...
                                                                </li>
                                                            ) : (
                                                                productsList
                                                                    .filter((p) => {
                                                                        const q = item.referencia.toLowerCase();
                                                                        return (
                                                                            (p.name && p.name.toLowerCase().includes(q)) ||
                                                                            (p.sku && p.sku.toLowerCase().includes(q)) ||
                                                                            (p.id && p.id.toLowerCase().includes(q))
                                                                        );
                                                                    })
                                                                    .slice(0, 10)
                                                                    .map((p) => (
                                                                        <li
                                                                            key={p.id}
                                                                            className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors"
                                                                            onMouseDown={() => {
                                                                                updateItem(item.id, "referencia", { __selectedProduct: true, productId: p.id, productName: p.name, productSku: p.sku, precio: p.price });
                                                                                setShowProductDropdown(null);
                                                                            }}
                                                                        >
                                                                            <div className="flex justify-between items-start mb-0.5">
                                                                                <span className="font-semibold text-gray-900 text-sm">{p.name}</span>
                                                                                <span className="text-blue-600 font-bold text-sm">${p.price}</span>
                                                                            </div>
                                                                            <div className="flex gap-3 text-[10px] text-gray-400 font-medium uppercase">
                                                                                <span>SKU: {p.sku}</span>
                                                                                <span>•</span>
                                                                                <span>Ref: {p.id.slice(0, 8)}</span>
                                                                            </div>
                                                                        </li>
                                                                    ))
                                                            )}
                                                        </ul>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-2">
                                                <input
                                                    type="number"
                                                    className="border border-gray-200 bg-white rounded-md px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                    value={item.precio}
                                                    min={0}
                                                    step={0.01}
                                                    max={1000000000000}
                                                    onChange={(e) => updateItem(item.id, "precio", e.target.value)}
                                                />
                                            </td>
                                            <td className="py-4 px-2">
                                                <input
                                                    type="number"
                                                    className="border border-gray-200 bg-white rounded-md px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-600"
                                                    value={item.descuento}
                                                    min={0}
                                                    step={0.01}
                                                    onChange={(e) => updateItem(item.id, "descuento", e.target.value)}
                                                />
                                            </td>
                                            <td className="py-4 px-2">
                                                <select
                                                    className="border border-gray-200 bg-white rounded-md px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer"
                                                    value={item.impuesto}
                                                    onChange={(e) => updateItem(item.id, "impuesto", e.target.value)}
                                                >
                                                    <option>0%</option>
                                                    <option>5%</option>
                                                    <option>19%</option>
                                                </select>
                                            </td>
                                            <td className="py-4 px-2">
                                                <input
                                                    type="text"
                                                    className="border border-gray-200 bg-white rounded-md px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                    value={item.descripcion}
                                                    placeholder="Añadir nota..."
                                                    onChange={(e) => updateItem(item.id, "descripcion", e.target.value)}
                                                />
                                            </td>
                                            <td className="py-4 px-2">
                                                <input
                                                    type="number"
                                                    className="border border-gray-200 bg-white rounded-md px-3 py-2 w-full text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none transition-all text-center"
                                                    value={item.cantidad}
                                                    min={0}
                                                    step={1}
                                                    max={1000000}
                                                    onChange={(e) => updateItem(item.id, "cantidad", e.target.value)}
                                                />
                                            </td>
                                            <td className="py-4 px-2 whitespace-nowrap text-sm font-bold text-gray-900">{formatCurrency(calculateItemTotal(item))}</td>
                                            <td className="py-4 text-center">
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-gray-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                                                    title="Eliminar ítem"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden space-y-4 mb-4">
                            {items.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col gap-3"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className="flex justify-between items-start">
                                        <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded">#{index + 1}</span>
                                        <button onClick={() => removeItem(item.id)} className="text-red-500 p-1">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Product / Reference */}
                                    <div className="relative">
                                        <label className="text-xs text-gray-500 block mb-1">Producto / Referencia</label>
                                        <input
                                            type="text"
                                            className="border bg-white rounded px-3 py-2 w-full"
                                            value={item.referencia}
                                            onChange={(e) => {
                                                updateItem(item.id, "referencia", e.target.value);
                                                setShowProductDropdown(index);
                                            }}
                                            onFocus={() => setShowProductDropdown(index)}
                                            onBlur={() => setTimeout(() => setShowProductDropdown(null), 150)}
                                            placeholder="Buscar producto..."
                                        />
                                        {showProductDropdown === index && item.referencia && (
                                            <ul className="absolute z-50 left-0 right-0 bg-white border rounded mt-1 max-h-48 overflow-y-auto shadow-lg">
                                                {loadingProducts ? (
                                                    <li className="px-3 py-2 text-gray-500">Cargando...</li>
                                                ) : (
                                                    productsList
                                                        .filter((p) => {
                                                            const q = item.referencia.toLowerCase();
                                                            return (
                                                                (p.name && p.name.toLowerCase().includes(q)) ||
                                                                (p.sku && p.sku.toLowerCase().includes(q))
                                                            );
                                                        })
                                                        .slice(0, 10)
                                                        .map((p) => (
                                                            <li
                                                                key={p.id}
                                                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-0"
                                                                onMouseDown={() => {
                                                                    updateItem(item.id, "referencia", { __selectedProduct: true, productId: p.id, productName: p.name, productSku: p.sku, precio: p.price });
                                                                    setShowProductDropdown(null);
                                                                }}
                                                            >
                                                                <div className="font-medium text-sm">{p.name}</div>
                                                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                                                    <span>{p.sku}</span>
                                                                    <span>${p.price}</span>
                                                                </div>
                                                            </li>
                                                        ))
                                                )}
                                            </ul>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs text-gray-500 block mb-1">Precio</label>
                                            <input
                                                type="number"
                                                className="border bg-white rounded px-3 py-2 w-full"
                                                value={item.precio}
                                                onChange={(e) => updateItem(item.id, "precio", e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 block mb-1">Cantidad</label>
                                            <input
                                                type="number"
                                                className="border bg-white rounded px-3 py-2 w-full"
                                                value={item.cantidad}
                                                onChange={(e) => updateItem(item.id, "cantidad", e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs text-gray-500 block mb-1">Descuento</label>
                                            <input
                                                type="number"
                                                className="border bg-white rounded px-3 py-2 w-full"
                                                value={item.descuento}
                                                onChange={(e) => updateItem(item.id, "descuento", e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 block mb-1">Impuesto</label>
                                            <select
                                                className="border bg-white rounded px-3 py-2 w-full"
                                                value={item.impuesto}
                                                onChange={(e) => updateItem(item.id, "impuesto", e.target.value)}
                                            >
                                                <option>0%</option>
                                                <option>5%</option>
                                                <option>19%</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-500 block mb-1">Descripción</label>
                                        <input
                                            type="text"
                                            className="border bg-white rounded px-3 py-2 w-full"
                                            value={item.descripcion}
                                            onChange={(e) => updateItem(item.id, "descripcion", e.target.value)}
                                            placeholder="Detalles adicionales..."
                                        />
                                    </div>

                                    <div className="flex justify-between items-center pt-2 border-t mt-1">
                                        <span className="font-semibold text-gray-700">Total Ítem</span>
                                        <span className="font-bold text-lg text-[hsl(209,83%,23%)]">{formatCurrency(calculateItemTotal(item))}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <motion.button
                            onClick={addItem}
                            className="w-full md:w-auto flex items-center justify-center gap-2 text-[hsl(209,83%,23%)] hover:text-[hsl(209,84%,15%)] border border-dashed border-[hsl(209,83%,23%)] md:border-none p-3 md:p-0 rounded-lg hover:bg-blue-50 md:hover:bg-transparent transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <PlusCircle className="w-5 h-5 md:w-4 md:h-4" />
                            <span className="font-medium">Agregar ítem</span>
                        </motion.button>
                    </motion.div>

                    {/* Totals */}
                    <motion.div variants={itemVariants} className={`flex justify-end mb-6 ${currentStep === 3 ? "" : "hidden md:flex"}`}>
                        <div className="w-full md:w-64 space-y-2 bg-gray-50 p-4 rounded-lg md:bg-transparent md:p-0">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>{formatCurrency(subtotal + descuento)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Descuento</span>
                                <span>{formatCurrency(descuento)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Impuestos</span>
                                <span>{formatCurrency(impuestos)}</span>
                            </div>
                            <div className="flex justify-between font-semibold text-lg border-t pt-2 mt-2">
                                <span>Total</span>
                                <span>{formatCurrency(total)}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Signature and Terms */}
                    <motion.div variants={itemVariants} className={`grid grid-cols-1 md:grid-cols-2 gap-8 mb-6 ${currentStep === 3 ? "" : "hidden md:grid"}`}>
                        <div
                            className="hidden md:flex border-2 border-dashed border-gray-300 h-32 items-center justify-center rounded-lg cursor-pointer hover:bg-gray-50 transition-colors relative overflow-hidden"
                            onClick={() => signatureInputRef.current?.click()}
                        >
                            {signaturePreview ? (
                                <div className="relative w-full h-full">
                                    <Image
                                        src={signaturePreview || "/placeholder.svg"}
                                        alt="Firma"
                                        fill
                                        className="object-contain bg-white"
                                    />

                                    {/* Overlay corregido */}
                                    <div className="absolute inset-0 bg-black/0 hover:bg-black/20 flex items-center justify-center transition-all">
                                        <span className="text-white opacity-0 hover:opacity-100 transition-opacity">
                                            Cambiar
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <span className="text-gray-500">Utilizar mi firma</span>

                            )}

                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setShowSignaturePad(true)
                                    setTimeout(() => prepareSignatureCanvas(), 50)
                                }}
                                className="absolute bottom-2 right-2 bg-white/90 text-sm px-2 py-1 rounded border text-gray-700 hover:bg-white"
                            >
                                Dibujar
                            </button>

                            {/* Botón para abrir el panel de dibujo */}
                            <input
                                ref={signatureInputRef}
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleSignatureUpload}
                            />
                        </div>


                        {/* Signature drawing dialog */}
                        <Dialog open={showSignaturePad} onOpenChange={(open) => { setShowSignaturePad(open); if (open) setTimeout(() => prepareSignatureCanvas(), 50) }}>
                            <DialogContent className="w-[95vw] sm:max-w-[520px] bg-white p-4">
                                <DialogHeader>
                                    <DialogTitle>Dibujar firma</DialogTitle>
                                </DialogHeader>
                                <div className="h-64 bg-white border rounded overflow-hidden">
                                    <canvas
                                        ref={signatureCanvasRef}
                                        className="w-full h-full"
                                        onPointerDown={startSignature}
                                        onPointerMove={moveSignature}
                                        onPointerUp={endSignature}
                                        onPointerCancel={endSignature}
                                    />
                                </div>
                                <div className="flex gap-2 mt-4 justify-end">
                                    <Button variant="outline" onClick={() => clearSignatureCanvas()}>Limpiar</Button>
                                    <Button variant="ghost" onClick={() => setShowSignaturePad(false)}>Cancelar</Button>
                                    <Button onClick={confirmSignatureFromCanvas}>Confirmar</Button>
                                </div>
                            </DialogContent>
                        </Dialog>


                        <div className="space-y-2">
                            <h3 className="font-semibold">Términos y condiciones</h3>
                            <textarea
                                className="w-full bg-white border rounded p-2 h-24 text-sm text-gray-600"
                                defaultValue="Esta factura se emite en todos sus efectos a una letra de cambio de conformidad con el Art. 774 del Código de comercio. Autorizo que en caso de incumplimiento de esta obligación sea reportada a las centrales de riesgo."
                            ></textarea>
                        </div>


                        {/* Create Client Modal */}
                        <Dialog open={isNewClientOpen} onOpenChange={(open) => setIsNewClientOpen(open)}>
                            <DialogContent className="w-[95vw] bg-white sm:max-w-[520px] max-h-[90vh] overflow-y-auto rounded-xl p-4 sm:p-6 shadow-lg">
                                <DialogHeader>
                                    <DialogTitle className="text-lg sm:text-xl font-semibold text-center sm:text-left">Crear Nuevo Cliente</DialogTitle>
                                </DialogHeader>

                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="first_name">Nombre</Label>
                                            <Input className="shadow-lg bg-gray-100 border border-gray-300"
                                                id="first_name" value={newClient.firstName} onChange={e => setNewClient({ ...newClient, firstName: e.target.value })} />
                                        </div>
                                        <div className=" hidden gap-2">
                                            <Label htmlFor="last_name">Apellido</Label>
                                            <Input className="shadow-lg bg-gray-100 border border-gray-300"
                                                id="last_name" value={newClient.lastName} onChange={e => setNewClient({ ...newClient, lastName: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                className="shadow-lg bg-gray-100 border border-gray-300"
                                                type="email"
                                                value={newClient.email}
                                                onChange={e => setNewClient({ ...newClient, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="phone">Teléfono</Label>
                                            <Input className="shadow-lg bg-gray-100 border border-gray-300"
                                                id="phone" value={newClient.phone} onChange={e => setNewClient({ ...newClient, phone: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="nit">NIT</Label>
                                            <Input id="nit" className="shadow-lg bg-gray-100 border border-gray-300"
                                                value={newClient.nit} onChange={e => setNewClient({ ...newClient, nit: e.target.value })} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="address">Dirección</Label>
                                            <Input id="address" className="shadow-lg bg-gray-100 border border-gray-300"
                                                value={newClient.address} onChange={e => setNewClient({ ...newClient, address: e.target.value })} />
                                        </div>
                                    </div>



                                    <div className=" grid-cols-1 hidden sm:grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="city">Ciudad</Label>
                                            <Input id="city" value={newClient.city} onChange={e => setNewClient({ ...newClient, city: e.target.value })} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="postal_code">Código Postal</Label>
                                            <Input id="postal_code" value={newClient.postalCode} onChange={e => setNewClient({ ...newClient, postalCode: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className=" grid-cols-1 hidden sm:grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="birth_date">Fecha de Nacimiento</Label>
                                            <Input id="birth_date" type="date" value={newClient.birthDate} onChange={e => setNewClient({ ...newClient, birthDate: e.target.value })} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="gender">Género</Label>
                                            <Select value={newClient.gender} onValueChange={(value) => setNewClient({ ...newClient, gender: value })}>
                                                <SelectTrigger className="rounded-lg"><SelectValue placeholder="Seleccionar género" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="M">Masculino</SelectItem>
                                                    <SelectItem value="F">Femenino</SelectItem>
                                                    <SelectItem value="O">Otro</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="hidden gap-2">
                                        <Label htmlFor="howFound">¿Cómo nos conoció?</Label>
                                        <Select value={newClient.howFound} onValueChange={(value) => setNewClient({ ...newClient, howFound: value })}>
                                            <SelectTrigger className="rounded-lg"><SelectValue placeholder="Seleccionar opción" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="social_media">Redes Sociales</SelectItem>
                                                <SelectItem value="referral">Recomendación</SelectItem>
                                                <SelectItem value="search">Búsqueda en Internet</SelectItem>
                                                <SelectItem value="other">Otro</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className=" hidden gap-2">
                                        <Label htmlFor="notes">Notas Adicionales</Label>
                                        <Textarea id="notes" value={newClient.notes} onChange={e => setNewClient({ ...newClient, notes: e.target.value })} className="min-h-[100px]" />
                                    </div>
                                </div>

                                <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
                                    <Button variant="outline" onClick={() => { setIsNewClientOpen(false); setNewClient(emptyNewClient); }} className="w-full sm:w-auto">Cancelar</Button>
                                    <Button onClick={async () => {
                                        // Crear cliente
                                        const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://plasticoslc.com/api/";
                                        const payload = {
                                            name: `${newClient.firstName} ${newClient.lastName}`.trim(),
                                            nit: newClient.nit,
                                            email: newClient.email,
                                            phone: newClient.phone,
                                            address: newClient.address
                                        };

                                        try {
                                            const res = await fetch(`${apiBase}customers`, {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/json"
                                                },
                                                body: JSON.stringify(payload),
                                            })

                                            if (!res.ok) {
                                                const txt = await res.text().catch(() => "")
                                                console.error("Error creating client:", res.status, txt)
                                                alert("Error creando cliente. Revisa la consola.")
                                                return
                                            }

                                            const created = await res.json().catch(() => null)
                                            if (created) {
                                                setClientsList((prev) => [created, ...prev])
                                                setCliente(created.name || "")
                                                setTelefono(created.phone || "")
                                                setIdentificacion(created.nit || created.id || "")
                                                setVendedor(created.id)
                                                setIsNewClientOpen(false)
                                                setNewClient(emptyNewClient)
                                            }
                                        } catch (err) {
                                            console.error("Error creating client:", err)
                                            alert("Error creando cliente. Revisa la consola.")
                                        }
                                    }} className="w-full sm:w-auto bg-[hsl(209,83%,23%)] hover:bg-[hsl(209,83%,14%)] text-white">Guardar</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </motion.div>

                    {/* Payment Section */}
                    <motion.div variants={itemVariants} className="border-t hidden pt-4">
                        <h3 className="font-semibold mb-2">Pago recibido</h3>
                        <p className="text-sm text-gray-600">
                            Si ha recibido un pago asociado a esta venta puedes hacer aquí tu registro.
                        </p>
                        <Dialog>
                            <DialogTrigger asChild>
                                <motion.button
                                    className="mt-2 text-green-500 hover:text-green-600 flex items-center gap-1"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <PlusCircle className=" w-4" />
                                    Agregar pago
                                </motion.button>
                            </DialogTrigger>
                            <DialogContent className="bg-white">
                                <DialogHeader>
                                    <DialogTitle>Registrar pago</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div>
                                        <label className="block  text-sm text-gray-600 mb-1">Fecha de pago</label>
                                        <input
                                            type="date"
                                            className="w-full bg-white border rounded px-3 py-2"
                                            defaultValue={new Date().toISOString().split("T")[0]}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">Monto</label>
                                        <input type="number" className="w-full bg-white border rounded px-3 py-2" defaultValue={total} />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">Método de pago</label>
                                        <select className="w-full bg-white border rounded px-3 py-2">
                                            <option>Efectivo</option>
                                            <option>Transferencia bancaria</option>
                                            <option>Tarjeta de crédito</option>
                                            <option>Tarjeta débito</option>
                                            <option>Cheque</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">Referencia</label>
                                        <input
                                            type="text"
                                            className="w-full bg-white border rounded px-3 py-2"
                                            placeholder="Número de transacción, recibo, etc."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">Notas</label>
                                        <textarea className="w-full bg-white border rounded px-3 py-2" rows={3}></textarea>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button>Registrar pago</Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </motion.div>

                    {/* Retenciones */}
                    <motion.div variants={itemVariants} className={`mt-6 border-t pt-4 ${currentStep === 3 ? "" : "hidden md:block"}`}>
                        <h3 className="font-semibold mb-4">Retenciones</h3>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            <div>
                                <Label htmlFor="retencion" className="text-sm text-gray-600 mb-1 block">Retención (%)</Label>
                                <Input
                                    id="retencion"
                                    type="number"
                                    placeholder="0"
                                    value={retencion}
                                    onChange={(e) => setRetencion(e.target.value)}
                                    className="bg-white border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <Label htmlFor="reteica" className="text-sm text-gray-600 mb-1 block">Rete ICA (%)</Label>
                                <Input
                                    id="reteica"
                                    type="number"
                                    placeholder="0"
                                    value={reteica}
                                    onChange={(e) => setReteica(e.target.value)}
                                    className="bg-white border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <Label htmlFor="reteiva" className="text-sm text-gray-600 mb-1 block">Rete IVA (%)</Label>
                                <Input
                                    id="reteiva"
                                    type="number"
                                    placeholder="0"
                                    value={reteiva}
                                    onChange={(e) => setReteiva(e.target.value)}
                                    className="bg-white border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <Label htmlFor="autoretencion" className="text-sm text-gray-600 mb-1 block">Autoretencion (%)</Label>
                                <Input
                                    id="autoretencion"
                                    type="number"
                                    placeholder="0"
                                    value={autoretencion}
                                    onChange={(e) => setAutoretencion(e.target.value)}
                                    className="bg-white border rounded px-3 py-2"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Notes */}
                    <motion.div variants={itemVariants} className={`mt-6 border-t pt-4 ${currentStep === 3 ? "" : "hidden md:block"}`}>
                        <h3 className="font-semibold mb-2">Notas internas</h3>
                        <textarea
                            className="w-full bg-white border rounded p-2 h-24 text-sm text-gray-600"
                            placeholder="Añade notas internas que no aparecerán en la factura..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        ></textarea>
                    </motion.div>

                    {/* Spacer to prevent content from being hidden behind sticky nav */}
                    <div className="md:hidden h-16"></div>

                    {/* Mobile Wizard Navigation - Adjusted bottom to account for MobileBottomNav (h-16) */}
                    <div className="md:hidden flex justify-between mt-6 pt-4 border-t sticky bottom-16 bg-white p-4 -mx-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-30">
                        {currentStep > 1 && (
                            <Button variant="outline" onClick={() => setCurrentStep(prev => prev - 1)}>
                                <ChevronLeft className="w-4 h-4 mr-1" /> Atrás
                            </Button>
                        )}

                        {currentStep < 3 ? (
                            <Button className="ml-auto" onClick={() => setCurrentStep(prev => prev + 1)}>
                                Siguiente <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        ) : (
                            <div className="flex gap-2 ml-auto">
                                <Button variant="outline" onClick={handleSaveDraft} disabled={isSavingDraft}>
                                    <Save className="w-4 h-4 mr-1" /> Guardar
                                </Button>
                                <Button onClick={handleEmitInvoice} disabled={isEmitting} className="hidden">
                                    <Send className="w-4 h-4 mr-1" /> Emitir
                                </Button>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Download Dialog */}
                <Dialog open={showDownloadDialog} onOpenChange={setShowDownloadDialog}>
                    <DialogContent className="bg-white">
                        <DialogHeader>
                            <DialogTitle>Seleccionar estilo de descarga</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col gap-4">
                            <p>¿En qué estilo deseas descargar la factura?</p>
                            <div className="flex gap-4">
                                <Button
                                    onClick={() => downloadInvoice('classic')}
                                    disabled={isDownloading}
                                    className="flex-1"
                                >
                                    {isDownloading ? "Descargando..." : "Estilo Clásico"}
                                </Button>
                                <Button
                                    onClick={() => downloadInvoice('dian')}
                                    disabled={isDownloading}
                                    className="flex-1"
                                >
                                    {isDownloading ? "Descargando..." : "Estilo DIAN"}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
                {/* Preview Modal */}
                <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
                    <DialogContent className="max-w-4xl w-[95vw] h-[90vh] bg-white p-0 overflow-hidden">
                        <DialogHeader className="p-4 border-b">
                            <DialogTitle>Previsualización de Factura</DialogTitle>
                        </DialogHeader>
                        <div className="flex-1 w-full h-full">
                            {previewUrl ? (
                                <iframe
                                    src={previewUrl}
                                    className="w-full h-[calc(90vh-80px)] border-none"
                                    title="Invoice Preview"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <p>Cargando previsualización...</p>
                                </div>
                            )}
                        </div>
                        <DialogFooter className="p-4 border-t bg-gray-50">
                            <Button onClick={() => setShowPreviewModal(false)}>Cerrar</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </main>
            <div className="md:hidden">
                <MobileBottomNav />
            </div>
        </div>

    )
}
