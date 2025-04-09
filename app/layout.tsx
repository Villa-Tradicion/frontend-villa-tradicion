import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ProductProvider } from "@/components/product-provider"
import Header from "@/components/header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Product Management",
  description: "Create, manage, and search for products",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ProductProvider>
          <Header />
          {children}
        </ProductProvider>
      </body>
    </html>
  )
}


import './globals.css'