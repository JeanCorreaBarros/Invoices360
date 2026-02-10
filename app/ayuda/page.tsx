"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

export default function AyudaPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0)

  const faqs = [
    {
      id: 1,
      question: "¿Cómo crear una nueva factura?",
      answer:
        "Para crear una nueva factura, ve a la sección de Facturas en el menú superior y haz clic en 'Nueva Factura'. Completa los datos del cliente, agrega los productos/servicios y haz clic en 'Emitir'.",
    },
    {
      id: 2,
      question: "¿Cómo descargar una factura?",
      answer:
        "Desde la lista de facturas, selecciona la factura deseada y haz clic en el botón 'Descargar'. Se descargará un archivo PDF en tu dispositivo.",
    },
    {
      id: 3,
      question: "¿Cómo gestionar mis clientes?",
      answer:
        "En la sección 'Clientes' puedes ver todos tus clientes registrados, agregar nuevos clientes y editar su información de contacto.",
    },
    {
      id: 4,
      question: "¿Cómo crear un estimado?",
      answer:
        "Accede a la sección de Estimados y haz clic en 'Nuevo Estimado'. Sigue el mismo proceso que para crear una factura. Los estimados pueden convertirse en facturas later.",
    },
    {
      id: 5,
      question: "¿Cómo ver mis reportes?",
      answer:
        "En la sección de Reportes encontrarás gráficos con información sobre tus ventas, clientes más activos, productos más vendidos y más.",
    },
  ]

  return (
    <div className="min-h-screen bg-[hsl(228,14%,9%)]">
      <DashboardHeader />

      <main className="px-4 lg:px-6 py-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-[hsl(0,0%,95%)] mb-2">Centro de Ayuda</h1>
          <p className="text-muted-foreground mb-8">
            Encuentra respuestas a las preguntas más frecuentes sobre PlasticosLC
          </p>

          {/* Contact Support */}
          <div className="bg-gradient-to-r from-[hsl(90,100%,50%)] to-[hsl(90,80%,40%)] rounded-lg p-6 mb-8 text-[hsl(0,0%,5%)]">
            <h2 className="text-xl font-semibold mb-2">¿Necesitas más ayuda?</h2>
            <p className="mb-4">Si no encuentras la respuesta que buscas, contáctanos:</p>
            <div className="flex flex-col gap-2">
              <div>
                <p className="font-medium">Email:</p>
                <a href="mailto:soporte@plasticoslc.com" className="hover:underline">
                  soporte@plasticoslc.com
                </a>
              </div>
              <div>
                <p className="font-medium">Teléfono:</p>
                <p>+1 (123) 456-7890</p>
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-[hsl(0,0%,95%)] mb-4">Preguntas Frecuentes</h2>
            {faqs.map((faq, index) => (
              <div key={faq.id} className="bg-white rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-600 transform transition-transform ${
                      expandedFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedFaq === index && (
                  <div className="px-4 pb-4 pt-0 text-gray-700 border-t border-gray-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Documentation Links */}
          <div className="mt-12 p-6 bg-white rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Documentación Adicional</h2>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-[hsl(90,100%,50%)] hover:underline">
                  → Guía completa del usuario
                </a>
              </li>
              <li>
                <a href="#" className="text-[hsl(90,100%,50%)] hover:underline">
                  → Tutorial de facturas
                </a>
              </li>
              <li>
                <a href="#" className="text-[hsl(90,100%,50%)] hover:underline">
                  → Gestión de inventario
                </a>
              </li>
              <li>
                <a href="#" className="text-[hsl(90,100%,50%)] hover:underline">
                  → Integración con otros sistemas
                </a>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
