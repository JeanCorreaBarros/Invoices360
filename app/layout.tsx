import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"

import "./globals.css"

import { ClientProviders } from "@/components/client-providers"
import { ProtectedLayout } from "@/components/protected-layout"
import { HotToaster } from "@/components/hot-toaster"

const _inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "PlasticosLC - Facturación",
  description: "Sistema de facturación y gestión de cobros para PlasticosLC",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PlasticosLC",
  },
  icons: {
    icon: "/icon.ico",
    apple: "/icon.ico",
  },
}

export const viewport: Viewport = {
  themeColor: "#181c27",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={_inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen">
        <ClientProviders>
          <ProtectedLayout>{children}</ProtectedLayout>
        </ClientProviders>
        <HotToaster />
      </body>
    </html>
  )
}
