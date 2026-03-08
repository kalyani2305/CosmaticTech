'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import CartItem from '@/components/CartItem';

export default function CartPage() {
  const { user, loading: authLoading } = useAuth();
  const { items, refresh } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (user) refresh();
  }, [user, refresh]);

  if (!mounted || authLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse h-8 bg-gray-100 rounded w-48 mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600">Please sign in to view your cart.</p>
        <Link href="/auth/login?redirect=/cart" className="mt-4 inline-block btn-primary">Sign in</Link>
      </div>
    );
  }

  const subtotal = items.reduce((sum, i) => sum + (i.products?.price ?? 0) * i.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-2xl font-semibold text-gray-900 mb-6">Shopping cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <p className="text-gray-600">Your cart is empty.</p>
          <Link href="/products" className="mt-4 inline-block btn-primary">Continue shopping</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          </div>
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
              <h2 className="font-medium text-gray-900 mb-4">Summary</h2>
              <p className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
              </p>
              <Link href="/checkout" className="mt-6 block w-full text-center btn-primary py-3">
                Proceed to checkout
              </Link>
              <Link href="/products" className="mt-3 block w-full text-center btn-secondary py-3">
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
