"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define the Product type
export type Product = {
  id: string
  name: string
  description: string
  price: number
  availability: boolean
  dimensions: {
    height: number
    width: number
    depth: number
  }
  materials: string[]
  colors: string[]
  imageUrl: string
  category: string
}

// Create context
type ProductContextType = {
  products: Product[]
  filteredProducts: Product[]
  searchTerm: string
  selectedCategory: string
  sortOrder: string
  loading: boolean
  error: string | null
  categories: string[]
  addProduct: (product: Omit<Product, "id">) => Promise<void>
  updateProduct: (id: string, product: Omit<Product, "id">) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  setSearchTerm: (term: string) => void
  setSelectedCategory: (category: string) => void
  setSortOrder: (order: string) => void
  refreshProducts: () => Promise<void>
}

const ProductContext = createContext<ProductContextType | undefined>(undefined)

// API base URL
const API_BASE_URL = "http://localhost:3001/api"

// Provider component
export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [sortOrder, setSortOrder] = useState("name-asc")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>([])

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_BASE_URL}/products`)

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      setProducts(data)
    } catch (err) {
      console.error("Error fetching products:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch products")
      // Set empty array to prevent undefined errors
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categorys`)
      if (!response.ok) {
        throw new Error(`Error fetching categories: ${response.status}`)
      }
      const data = await response.json()
      setCategories(data.map((category: { name: string }) => category.name))
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  // Initialize with API data
  useEffect(() => {
    fetchProducts(); // Carga los productos
    fetchCategories(); // Carga las categorías
  }, [])

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "" || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortOrder === "name-asc") {
        return a.name.localeCompare(b.name)
      } else if (sortOrder === "name-desc") {
        return b.name.localeCompare(a.name)
      } else if (sortOrder === "price-asc") {
        return a.price - b.price
      } else {
        return b.price - a.price
      }
    })

  // CRUD operations
  const addProduct = async (product: Omit<Product, "id">) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      await fetchProducts()
    } catch (err) {
      console.error("Error adding product:", err)
      setError(err instanceof Error ? err.message : "Failed to add product")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateProduct = async (id: string, updatedProduct: Omit<Product, "id">) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      await fetchProducts()
    } catch (err) {
      console.error("Error updating product:", err)
      setError(err instanceof Error ? err.message : "Failed to update product")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      await fetchProducts()
    } catch (err) {
      console.error("Error deleting product:", err)
      setError(err instanceof Error ? err.message : "Failed to delete product")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Function to manually refresh products
  const refreshProducts = async () => {
    await fetchProducts()
  }

  return (
    <ProductContext.Provider
      value={{
        products,
        filteredProducts,
        searchTerm,
        selectedCategory,
        sortOrder,
        loading,
        error,
        categories,
        addProduct,
        updateProduct,
        deleteProduct,
        setSearchTerm,
        setSelectedCategory,
        setSortOrder,
        refreshProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

// Custom hook to use the context
export function useProducts() {
  const context = useContext(ProductContext)
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider")
  }
  return context
}
