'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { createOrder } from '@/services/orderService';
import type { ShippingAddress } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { items, refresh } = useCart();
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
  });
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) refresh();
  }, [user, refresh]);

  if (authLoading) {
    return <div className="max-w-2xl mx-auto px-4 py-12 animate-pulse">Loading…</div>;
  }

  if (!user) {
    router.replace('/auth/login?redirect=/checkout');
    return null;
  }

  const subtotal = items.reduce((sum, i) => sum + (i.products?.price ?? 0) * i.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!address.fullName || !address.address || !address.city || !address.state || !address.zip || !address.phone) {
      setError('Please fill all fields.');
      return;
    }
    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }
    setPlacing(true);
    try {
      await createOrder(address, items.map((i) => ({ product_id: i.product_id, quantity: i.quantity })));
      refresh();
      router.push('/profile?order=success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-2xl font-semibold text-gray-900 mb-6">Checkout</h1>

      {items.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <p className="text-gray-600">Your cart is empty.</p>
          <Link href="/products" className="mt-4 inline-block btn-primary">Continue shopping</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div>
            <h2 className="font-medium text-gray-900 mb-3">Shipping address</h2>
            <div className="space-y-3">
              <input type="text" placeholder="Full name" value={address.fullName} onChange={(e) => setAddress((a) => ({ ...a, fullName: e.target.value }))} className="input-field" required />
              <input type="text" placeholder="Address" value={address.address} onChange={(e) => setAddress((a) => ({ ...a, address: e.target.value }))} className="input-field" required />
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="City" value={address.city} onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))} className="input-field" required />
                <input type="text" placeholder="State" value={address.state} onChange={(e) => setAddress((a) => ({ ...a, state: e.target.value }))} className="input-field" required />
              </div>
              <input type="text" placeholder="ZIP" value={address.zip} onChange={(e) => setAddress((a) => ({ ...a, zip: e.target.value }))} className="input-field" required />
              <input type="tel" placeholder="Phone" value={address.phone} onChange={(e) => setAddress((a) => ({ ...a, phone: e.target.value }))} className="input-field" required />
            </div>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <p className="flex justify-between text-gray-600">
              <span>Order total</span>
              <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
            </p>
            <button type="submit" disabled={placing} className="mt-6 w-full btn-primary py-3">
              {placing ? 'Placing order…' : 'Place order'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
