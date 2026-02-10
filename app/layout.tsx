import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"

import "./globals.css"
import { ClientProviders } from "@/components/client-providers"

const _inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "PlasticosLC - Facturacion",
  description: "Sistema de facturacion y gestion de cobros para PlasticosLC",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PlasticosLC",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#181c27",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={_inter.variable}>
      <body className="font-sans antialiased min-h-screen">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  )
}
