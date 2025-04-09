"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import type { Product } from "./product-provider"

export function ProductCard({ product }: { product: Product }) {
  const router = useRouter()

  return (
    <div
      className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => router.push(`/products/${product.id}`)}
    >
      <div className="relative aspect-square">
        <Image
          src={product.imageUrl || "/placeholder.svg?height=300&width=300"}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold truncate">{product.name}</h3>
            <p className="text-sm text-gray-500 line-clamp-2 h-10">{product.description}</p>
          </div>
          <Badge variant="outline">{product.category}</Badge>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <p className="font-bold">${product.price.toFixed(2)}</p>
          <p className={product.availability ? "text-green-600 text-sm" : "text-red-600 text-sm"}>
            {product.availability ? "In Stock" : "Out of Stock"}
          </p>
        </div>
      </div>
    </div>
  )
}
