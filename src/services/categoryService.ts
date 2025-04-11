
import { Category, CategoryFormData } from "@/types/Category";

// API base URL
const baseUrl = "http://localhost:3001/api";

// Get all categories
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${baseUrl}/category`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    // Return mock categories as fallback
    // return getMockCategories();
  }
};
// Create Category
export const createCategory = async (categoryData: CategoryFormData): Promise<Category> => {
  const response = await fetch(`${baseUrl}/category`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(categoryData),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    const error: any = new Error(errorBody.message || 'Error al crear categoría');
    error.status = response.status;
    throw error; // 👈 relanza el error personalizado
  }

  return await response.json();
};
