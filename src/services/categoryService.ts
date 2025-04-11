
import { Category } from "@/types/Category";

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

// Mock data for fallback
// const getMockCategories = (): Category[] => [
//   { id: 1, name: "Electrónicos" },
//   { id: 2, name: "Ropa" },
//   { id: 3, name: "Hogar" },
//   { id: 4, name: "Juguetes" }
// ];
