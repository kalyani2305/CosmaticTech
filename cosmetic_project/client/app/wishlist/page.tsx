'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getWishlist, removeFromWishlist, type WishlistEntry } from '@/services/wishlistService';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/types';

export default function WishlistPage() {
  const { user, loading } = useAuth();
  const [items, setItems] = useState<WishlistEntry[]>([]);

  useEffect(() => {
    if (user) getWishlist().then(setItems).catch(() => setItems([]));
  }, [user]);

  const handleRemove = async (productId: string) => {
    await removeFromWishlist(productId);
    setItems((prev) => prev.filter((i) => i.product_id !== productId));
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">Loading…</div>;
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600">Please sign in to view your wishlist.</p>
        <Link href="/auth/login?redirect=/wishlist" className="mt-4 inline-block btn-primary">Sign in</Link>
      </div>
    );
  }

  const products = items.map((i) => i.products).filter(Boolean) as Product[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-2xl font-semibold text-gray-900 mb-6">Wishlist</h1>
      {products.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <p className="text-gray-600">Your wishlist is empty.</p>
          <Link href="/products" className="mt-4 inline-block btn-primary">Discover products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {items.map((entry) =>
            entry.products ? (
              <div key={entry.id} className="relative group">
                <ProductCard product={entry.products} />
                <button
                  type="button"
                  onClick={() => handleRemove(entry.product_id)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-gray-50 z-10"
                  aria-label="Remove from wishlist"
                >
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                </button>
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}
