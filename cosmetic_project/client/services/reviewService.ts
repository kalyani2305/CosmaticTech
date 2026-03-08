import { api } from '@/utils/api';
import type { Review } from '@/types';

export function getReviews(productId: string) {
  return api<Review[]>(`/api/reviews/${productId}`);
}

export function createReview(productId: string, rating: number, comment?: string) {
  return api<Review>(`/api/reviews/${productId}`, { method: 'POST', body: JSON.stringify({ rating, comment }) });
}

export function updateReview(reviewId: string, rating: number, comment?: string) {
  return api<Review>(`/api/reviews/${reviewId}`, { method: 'PUT', body: JSON.stringify({ rating, comment }) });
}

export function deleteReview(reviewId: string) {
  return api(`/api/reviews/${reviewId}`, { method: 'DELETE' });
}
