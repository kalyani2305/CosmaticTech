import { api } from '@/utils/api';
import type { Product } from '@/types';

export interface CartItemResponse {
  id: string;
  quantity: number;
  product_id: string;
  products?: Pick<Product, 'id' | 'name' | 'price' | 'images' | 'stock'>;
}

export function getCart() {
  return api<{ cart: { id: string }; items: CartItemResponse[] }>('/api/cart');
}

export function addToCart(product_id: string, quantity = 1) {
  return api('/api/cart/add', { method: 'POST', body: JSON.stringify({ product_id, quantity }) });
}

export function updateCartItem(itemId: string, quantity: number) {
  return api(`/api/cart/update/${itemId}`, { method: 'PUT', body: JSON.stringify({ quantity }) });
}

export function removeFromCart(itemId: string) {
  return api(`/api/cart/remove/${itemId}`, { method: 'DELETE' });
}
