"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useProducts } from "@/components/product-provider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ProductDetail() {
  const { id } = useParams()
  const router = useRouter()
  const { products, deleteProduct, loading, error, refreshProducts } = useProducts()
  const [product, setProduct] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  useEffect(() => {
    // Refresh products when the component mounts to ensure we have the latest data
    refreshProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!loading) {
      const foundProduct = products.find((p) => p.id === id)
      if (foundProduct) {
        setProduct(foundProduct)
      } else {
        setLocalError("Product not found")
      }
    }
  }, [id, products, loading, router])

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteProduct(id as string)
      router.push("/")
    } catch (err) {
      setLocalError("Failed to delete product")
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error || localError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6" onClick={() => router.push("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
        </Button>
        <Alert variant="destructive">
          <AlertDescription>{error || localError}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6" onClick={() => router.push("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
        </Button>
        <Alert>
          <AlertDescription>Product not found</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" className="mb-6" onClick={() => router.push("/")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
          {product.imageUrl ? (
            <Image src={product.imageUrl || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">No image available</div>
          )}
        </div>

        <div>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <Badge className="mt-2">{product.category}</Badge>
              <p className="text-2xl font-bold mt-4">${product.price.toFixed(2)}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => router.push(`/products/edit/${id}`)}>
                <Edit className="h-4 w-4" />
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="icon" className="text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the product.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-500 hover:bg-red-600"
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{product.description}</p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Availability</h2>
              <p className={product.availability ? "text-green-600" : "text-red-600"}>
                {product.availability ? "In Stock" : "Out of Stock"}
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Dimensions</h2>
              <p className="text-gray-700">
                H: {product.dimensions.height}cm × W: {product.dimensions.width}cm × D: {product.dimensions.depth}cm
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Materials</h2>
              <div className="flex flex-wrap gap-2">
                {product.materials.map((material: string, index: number) => (
                  <Badge key={index} variant="outline">
                    {material}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Colors</h2>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color: string, index: number) => (
                  <div
                    key={index}
                    className="w-6 h-6 rounded-full border"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
