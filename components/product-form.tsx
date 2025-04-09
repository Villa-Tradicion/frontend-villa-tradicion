"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useProducts, type Product } from "./product-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus } from "lucide-react"

type ProductFormProps = {
  initialData?: Product
}

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter()
  const { addProduct, updateProduct } = useProducts()

  const [formData, setFormData] = useState<Omit<Product, "id">>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    availability: initialData?.availability || true,
    dimensions: initialData?.dimensions || {
      height: 0,
      width: 0,
      depth: 0,
    },
    materials: initialData?.materials || [""],
    colors: initialData?.colors || ["#000000"],
    imageUrl: initialData?.imageUrl || "",
    category: initialData?.category || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      dimensions: {
        ...formData.dimensions,
        [name]: Number.parseFloat(value) || 0,
      },
    })
  }

  const handleAvailabilityChange = (checked: boolean) => {
    setFormData({ ...formData, availability: checked })
  }

  const handleCategoryChange = (value: string) => {
    setFormData({ ...formData, category: value })
  }

  const handleMaterialChange = (index: number, value: string) => {
    const newMaterials = [...formData.materials]
    newMaterials[index] = value
    setFormData({ ...formData, materials: newMaterials })
  }

  const addMaterial = () => {
    setFormData({ ...formData, materials: [...formData.materials, ""] })
  }

  const removeMaterial = (index: number) => {
    const newMaterials = [...formData.materials]
    newMaterials.splice(index, 1)
    setFormData({ ...formData, materials: newMaterials })
  }

  const handleColorChange = (index: number, value: string) => {
    const newColors = [...formData.colors]
    newColors[index] = value
    setFormData({ ...formData, colors: newColors })
  }

  const addColor = () => {
    setFormData({ ...formData, colors: [...formData.colors, "#000000"] })
  }

  const removeColor = (index: number) => {
    const newColors = [...formData.colors]
    newColors.splice(index, 1)
    setFormData({ ...formData, colors: newColors })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.name || !formData.description || formData.price <= 0 || !formData.category) {
      alert("Please fill in all required fields")
      return
    }

    // Clean up empty materials and colors
    const cleanedFormData = {
      ...formData,
      materials: formData.materials.filter((m) => m.trim() !== ""),
      colors: formData.colors.filter((c) => c !== ""),
    }

    try {
      if (initialData) {
        await updateProduct(initialData.id, cleanedFormData)
        router.push(`/products/${initialData.id}`)
      } else {
        await addProduct(cleanedFormData)
        router.push("/")
      }
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : "An unknown error occurred"}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 md:col-span-2">
          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="price">Price ($) *</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min="0.01"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="category">Category *</Label>
          <Select value={formData.category} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Furniture">Furniture</SelectItem>
              <SelectItem value="Electronics">Electronics</SelectItem>
              <SelectItem value="Home Decor">Home Decor</SelectItem>
              <SelectItem value="Kitchen">Kitchen</SelectItem>
              <SelectItem value="Clothing">Clothing</SelectItem>
              <SelectItem value="Accessories">Accessories</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="availability" checked={formData.availability} onCheckedChange={handleAvailabilityChange} />
          <Label htmlFor="availability">In Stock</Label>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Dimensions (cm)</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="height">Height</Label>
            <Input
              id="height"
              name="height"
              type="number"
              min="0"
              step="0.1"
              value={formData.dimensions.height}
              onChange={handleDimensionChange}
            />
          </div>

          <div>
            <Label htmlFor="width">Width</Label>
            <Input
              id="width"
              name="width"
              type="number"
              min="0"
              step="0.1"
              value={formData.dimensions.width}
              onChange={handleDimensionChange}
            />
          </div>

          <div>
            <Label htmlFor="depth">Depth</Label>
            <Input
              id="depth"
              name="depth"
              type="number"
              min="0"
              step="0.1"
              value={formData.dimensions.depth}
              onChange={handleDimensionChange}
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Materials</h3>
          <Button type="button" variant="outline" size="sm" onClick={addMaterial}>
            <Plus className="h-4 w-4 mr-1" /> Add Material
          </Button>
        </div>

        {formData.materials.map((material, index) => (
          <div key={index} className="flex items-center mb-2">
            <Input
              value={material}
              onChange={(e) => handleMaterialChange(index, e.target.value)}
              placeholder="e.g., Wood, Metal, Plastic"
              className="mr-2"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeMaterial(index)}
              disabled={formData.materials.length <= 1}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Colors</h3>
          <Button type="button" variant="outline" size="sm" onClick={addColor}>
            <Plus className="h-4 w-4 mr-1" /> Add Color
          </Button>
        </div>

        {formData.colors.map((color, index) => (
          <div key={index} className="flex items-center mb-2">
            <div className="flex items-center mr-2 flex-1">
              <div className="w-8 h-8 rounded-md border mr-2" style={{ backgroundColor: color }} />
              <Input type="color" value={color} onChange={(e) => handleColorChange(index, e.target.value)} />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeColor(index)}
              disabled={formData.colors.length <= 1}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <Button type="submit">{initialData ? "Update Product" : "Add Product"}</Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => (initialData ? router.push(`/products/${initialData.id}`) : router.push("/"))}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
