"use client"

import { useRouter } from "next/navigation"
import { ProductForm } from "@/components/product-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function AddProduct() {
  const router = useRouter()

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" className="mb-6" onClick={() => router.push("/")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
      </Button>

      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
      <ProductForm />
    </div>
  )
}
