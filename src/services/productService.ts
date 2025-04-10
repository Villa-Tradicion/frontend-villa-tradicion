
import { Product, ProductFormData } from "@/types/Product";
import { getCategories } from "./categoryService";

// API base URL
const baseUrl = "http://localhost:3001/api";

// Get all products
export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${baseUrl}/products`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    // Return mock data as fallback if API fails
    // return getMockProducts();
  }
};

// Get product categories
export const getCategory = async () => {
  try {
    return getCategories()
  } catch (error) {
    console.error("Error fetching categories:", error);
    // Return mock categories as fallback
    // return [
    //   { id: 1, name: "Electrónicos" },
    //   { id: 2, name: "Ropa" },
    //   { id: 3, name: "Hogar" },
    //   { id: 4, name: "Juguetes" }
    // ];
  }
};

// Get a single product by ID
export const getProductById = async (id: number): Promise<Product | undefined> => {
  try {
    const response = await fetch(`${baseUrl}/products/${id}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    // Return mock product as fallback
    // return getMockProducts().find(p => p.id === id);
  }
};

// Create a new product
export const createProduct = async (productData: ProductFormData): Promise<Product> => {
  try {
    const response = await fetch(`${baseUrl}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error creating product:", error);
    // Create mock product as fallback
    // return createMockProduct(productData);
  }
};

// Update an existing product
export const updateProduct = async (id: number, productData: ProductFormData): Promise<Product> => {
  try {
    const response = await fetch(`${baseUrl}/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    // Update mock product as fallback
    // return updateMockProduct(id, productData);
  }
};

// Delete a product
export const deleteProduct = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${baseUrl}/products/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    // Delete from mock data as fallback
    // deleteMockProduct(id);
  }
};