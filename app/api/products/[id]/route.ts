import { NextResponse } from "next/server"
import type { Product } from "@/components/product-provider"

// This references the same mock database from the main products route
// In a real application, you would import your database connection
const products: Product[] = [
  {
    id: "1",
    name: "Modern Desk Chair",
    description: "Ergonomic office chair with lumbar support and adjustable height.",
    price: 199.99,
    availability: true,
    dimensions: {
      height: 120,
      width: 65,
      depth: 65,
    },
    materials: ["Leather", "Aluminum", "Foam"],
    colors: ["#000000", "#FFFFFF", "#964B00"],
    imageUrl: "/placeholder.svg?height=500&width=500",
    category: "Furniture",
  },
  {
    id: "2",
    name: "Minimalist Coffee Table",
    description: "Sleek coffee table with tempered glass top and wooden legs.",
    price: 149.99,
    availability: true,
    dimensions: {
      height: 45,
      width: 120,
      depth: 60,
    },
    materials: ["Glass", "Wood", "Steel"],
    colors: ["#964B00", "#000000"],
    imageUrl: "/placeholder.svg?height=500&width=500",
    category: "Furniture",
  },
  {
    id: "3",
    name: "Wireless Headphones",
    description: "Premium noise-cancelling headphones with 30-hour battery life.",
    price: 249.99,
    availability: false,
    dimensions: {
      height: 20,
      width: 18,
      depth: 8,
    },
    materials: ["Plastic", "Aluminum", "Foam"],
    colors: ["#000000", "#FFFFFF", "#FF0000"],
    imageUrl: "/placeholder.svg?height=500&width=500",
    category: "Electronics",
  },
]

// GET a single product by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const id = params.id
  const product = products.find((p) => p.id === id)

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  return NextResponse.json(product)
}

// PUT (update) a product
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const updatedProduct = await request.json()

    // Find the product index
    const index = products.findIndex((p) => p.id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Validate required fields
    if (!updatedProduct.name || !updatedProduct.description || !updatedProduct.price || !updatedProduct.category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Update the product
    products[index] = { ...updatedProduct, id }

    return NextResponse.json(products[index])
  } catch (error) {
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
  }
}

// DELETE a product
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Find the product index
  const index = products.findIndex((p) => p.id === id)

  if (index === -1) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  // Remove the product
  products.splice(index, 1)

  return new NextResponse(null, { status: 204 })
}
