import { api } from '@/utils/api';

import type { Product } from '@/types';

export interface WishlistEntry {
  id: string;
  product_id: string;
  products?: Product;
}

export function getWishlist() {
  return api<WishlistEntry[]>('/api/wishlist');
}

export function addToWishlist(product_id: string) {
  return api('/api/wishlist/add', { method: 'POST', body: JSON.stringify({ product_id }) });
}

export function removeFromWishlist(productId: string) {
  return api(`/api/wishlist/${productId}`, { method: 'DELETE' });
}
