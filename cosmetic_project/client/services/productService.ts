import { api } from '@/utils/api';
import type { Product } from '@/types';

export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
}

export function getProducts(params?: ProductFilters) {
  const search = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v != null && v !== '') search.set(k, String(v));
    });
  }
  const q = search.toString();
  return api<Product[]>(`/api/products${q ? `?${q}` : ''}`);
}

export function getProductById(id: string) {
  return api<Product>(`/api/products/${id}`);
}

export function createProduct(data: Partial<Product>) {
  return api<Product>('/api/products', { method: 'POST', body: JSON.stringify(data) });
}

export function updateProduct(id: string, data: Partial<Product>) {
  return api<Product>(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function deleteProduct(id: string) {
  return api(`/api/products/${id}`, { method: 'DELETE' });
}
