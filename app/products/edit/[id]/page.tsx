"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useProducts } from "@/components/product-provider"
import { ProductForm } from "@/components/product-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function EditProduct() {
  const { id } = useParams()
  const router = useRouter()
  const { products } = useProducts()
  const [product, setProduct] = useState<any>(null)

  useEffect(() => {
    const foundProduct = products.find((p) => p.id === id)
    if (foundProduct) {
      setProduct(foundProduct)
    } else {
      router.push("/")
    }
  }, [id, products, router])

  if (!product) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" className="mb-6" onClick={() => router.push(`/products/${id}`)}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Product
      </Button>

      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
      <ProductForm initialData={product} />
    </div>
  )
}
