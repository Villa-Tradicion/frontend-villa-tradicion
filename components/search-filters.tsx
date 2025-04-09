"use client"

import { useProducts } from "./product-provider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

export function SearchFilters() {
  const { searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, sortOrder, setSortOrder, products } =
    useProducts()

  // Manejar el caso en el que `products` esté vacío o no cargado
  const categories = products?.length
    ? Array.from(new Set(products.map((product) => product.category)))
    : []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Search & Filters</h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Category</h3>
        <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="" id="all" />
            <Label htmlFor="all">All Categories</Label>
          </div>

          {categories.length > 0 ? (
            categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <RadioGroupItem value={category} id={category} />
                <Label htmlFor={category}>{category}</Label>
              </div>
            ))
          ) : (
            <p>No categories available</p>
          )}
        </RadioGroup>
      </div>

      <div>
        <h3 className="font-medium mb-3">Sort By</h3>
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name-asc">Name (A-Z)</SelectItem>
            <SelectItem value="name-desc">Name (Z-A)</SelectItem>
            <SelectItem value="price-asc">Price (Low to High)</SelectItem>
            <SelectItem value="price-desc">Price (High to Low)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
