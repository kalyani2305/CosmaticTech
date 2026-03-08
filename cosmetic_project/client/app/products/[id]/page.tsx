'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProductById } from '@/services/productService';
import { getReviews } from '@/services/reviewService';
import { addToCart } from '@/services/cartService';
import { addToWishlist, removeFromWishlist, getWishlist } from '@/services/wishlistService';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import ReviewCard from '@/components/ReviewCard';
import type { Product } from '@/types';
import type { Review } from '@/types';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuth();
  const { refresh: refreshCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    getProductById(id).then(setProduct).catch(() => setProduct(null));
    getReviews(id).then(setReviews).catch(() => setReviews([]));
    if (user) {
      getWishlist().then((list) => setWishlistIds(new Set(list.map((w) => w.product_id)))).catch(() => {});
    }
  }, [id, user]);

  const inWishlist = product && wishlistIds.has(product.id);

  const handleAddToCart = async () => {
    if (!product || product.stock < 1) return;
    setAdding(true);
    try {
      if (user) {
        await addToCart(product.id, quantity);
        refreshCart();
      } else {
        window.location.href = '/auth/login?redirect=' + encodeURIComponent('/cart');
        return;
      }
    } finally {
      setAdding(false);
    }
  };

  const toggleWishlist = async () => {
    if (!user) {
      window.location.href = '/auth/login?redirect=' + encodeURIComponent('/products/' + id);
      return;
    }
    if (!product) return;
    try {
      if (inWishlist) {
        await removeFromWishlist(product.id);
        setWishlistIds((s) => { const n = new Set(s); n.delete(product.id); return n; });
      } else {
        await addToWishlist(product.id);
        setWishlistIds((s) => new Set(s).add(product.id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmittingReview(true);
    try {
      const { createReview } = await import('@/services/reviewService');
      await createReview(id, reviewForm.rating, reviewForm.comment);
      setReviews(await getReviews(id));
      setReviewForm({ rating: 5, comment: '' });
    } finally {
      setSubmittingReview(false);
    }
  };

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Product not found.</p>
        <Link href="/products" className="mt-4 inline-block text-primary-600 hover:underline">Back to shop</Link>
      </div>
    );
  }

  const img = product.images?.[0] || '/placeholder-product.jpg';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        <div className="aspect-square relative rounded-2xl overflow-hidden bg-gray-50">
          <Image src={img} alt={product.name} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 50vw" unoptimized={img.startsWith('http')} />
        </div>
        <div>
          <p className="text-primary-600 font-medium uppercase tracking-wider">{product.brand}</p>
          <h1 className="font-display text-3xl font-semibold text-gray-900 mt-1">{product.name}</h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-amber-500">★</span>
            <span className="font-medium">{Number(product.rating).toFixed(1)}</span>
            <span className="text-gray-500">({reviews.length} reviews)</span>
          </div>
          <p className="mt-4 text-2xl font-semibold text-gray-900">${product.price.toFixed(2)}</p>
          <p className="mt-4 text-gray-600">{product.description}</p>
          {product.ingredients && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700">Ingredients</h3>
              <p className="text-sm text-gray-600 mt-1">{product.ingredients}</p>
            </div>
          )}
          <p className="mt-2 text-sm text-gray-500">Stock: {product.stock} available</p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center border border-gray-200 rounded-lg">
              <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center">−</button>
              <span className="w-10 text-center font-medium">{quantity}</span>
              <button type="button" onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))} className="w-10 h-10 flex items-center justify-center">+</button>
            </div>
            <button onClick={handleAddToCart} disabled={adding || product.stock < 1} className="btn-primary">
              {adding ? 'Adding…' : 'Add to cart'}
            </button>
            <button onClick={toggleWishlist} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50" aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}>
              <svg className={`w-6 h-6 ${inWishlist ? 'text-red-500 fill-current' : 'text-gray-400'}`} fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <section className="mt-16 border-t border-gray-200 pt-12">
        <h2 className="font-display text-xl font-semibold text-gray-900 mb-6">Reviews</h2>
        {user && (
          <form onSubmit={handleSubmitReview} className="mb-8 p-4 bg-gray-50 rounded-xl max-w-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">Your rating</label>
            <select value={reviewForm.rating} onChange={(e) => setReviewForm((f) => ({ ...f, rating: Number(e.target.value) }))} className="input-field w-auto">
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n} stars</option>
              ))}
            </select>
            <label className="block text-sm font-medium text-gray-700 mt-3 mb-2">Comment (optional)</label>
            <textarea value={reviewForm.comment} onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))} className="input-field min-h-[80px]" />
            <button type="submit" disabled={submittingReview} className="mt-3 btn-primary">Submit review</button>
          </form>
        )}
        <div className="space-y-4">
          {reviews.map((r) => (
            <ReviewCard key={r.id} review={r} onUpdate={() => getReviews(id).then(setReviews)} />
          ))}
          {reviews.length === 0 && <p className="text-gray-500">No reviews yet.</p>}
        </div>
      </section>
    </div>
  );
}
