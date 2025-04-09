import { NextResponse } from "next/server"
import type { Product } from "@/components/product-provider"

// This is a mock database for demonstration purposes
// In a real application, you would connect to a real database
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

// GET all products
export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json(products)
}

// POST a new product
export async function POST(request: Request) {
  try {
    const newProduct = await request.json()

    // Validate required fields
    if (!newProduct.name || !newProduct.description || !newProduct.price || !newProduct.category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate a new ID
    const id = (products.length + 1).toString()

    // Add the new product
    const productWithId = { ...newProduct, id }
    products.push(productWithId)

    return NextResponse.json(productWithId, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
  }
}
