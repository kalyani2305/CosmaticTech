import { api } from '@/utils/api';
import type { Category } from '@/types';

export function getCategories() {
  return api<Category[]>('/api/categories');
}

export function createCategory(name: string, description?: string) {
  return api<Category>('/api/categories', { method: 'POST', body: JSON.stringify({ name, description }) });
}

export function updateCategory(id: string, data: Partial<Category>) {
  return api<Category>(`/api/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function deleteCategory(id: string) {
  return api(`/api/categories/${id}`, { method: 'DELETE' });
}
