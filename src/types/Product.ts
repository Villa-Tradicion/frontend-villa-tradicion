import { Category } from "./Category";

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  available: boolean;
  stock?: number; // Keeping this for backward compatibility
  heightCm?: number;
  widthCm?: number;
  depthCm?: number;
  materials?: string[];
  availableColors?: string[];
  imageUrl?: string;
  category?: Category; // Simplified for now, will be replaced with categoryId
  categoryId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  description?: string;
  price: number;
  stock?: number; // Keeping for backward compatibility
  available: boolean;
  heightCm?: number;
  widthCm?: number;
  depthCm?: number;
  materials?: string[];
  availableColors?: string[];
  imageUrl?: string;
  categoryId: number;
}
