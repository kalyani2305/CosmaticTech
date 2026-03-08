'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getOrderById } from '@/services/orderService';
import { useAuth } from '@/context/AuthContext';
import type { Order } from '@/types';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!user) return;
    getOrderById(params.id as string)
      .then(setOrder)
      .catch(() => setOrder(null));
  }, [user, params.id]);

  if (authLoading) return <div className="max-w-2xl mx-auto px-4 py-12 animate-pulse">Loading…</div>;
  if (!user) {
    router.replace('/auth/login');
    return null;
  }
  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Order not found.</p>
        <Link href="/profile" className="mt-4 inline-block text-primary-600 hover:underline">Back to profile</Link>
      </div>
    );
  }

  const addr = order.shipping_address as { fullName?: string; address?: string; city?: string; state?: string; zip?: string; phone?: string };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/profile" className="text-primary-600 hover:underline text-sm mb-6 inline-block">← Back to profile</Link>
      <h1 className="font-display text-2xl font-semibold text-gray-900 mb-6">Order #{order.id.slice(0, 8)}</h1>
      <p className="text-sm text-gray-500 mb-6">
        Placed on {new Date(order.created_at).toLocaleString()} ·{' '}
        <span className={`font-medium ${
          order.status === 'delivered' ? 'text-green-600' : order.status === 'shipped' ? 'text-blue-600' : order.status === 'cancelled' ? 'text-gray-600' : 'text-amber-600'
        }`}>
          {order.status}
        </span>
      </p>
      <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
        {(order.order_items || []).map((oi) => (
          <div key={oi.id} className="flex gap-4 p-4">
            <div className="w-20 h-20 relative rounded-lg overflow-hidden bg-gray-100 shrink-0">
              {oi.products?.images?.[0] && (
                <Image src={oi.products.images[0]} alt={oi.products.name || ''} fill className="object-cover" sizes="80px" unoptimized />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900">{oi.products?.name}</p>
              <p className="text-sm text-gray-500">Qty: {oi.quantity} × ${Number(oi.price).toFixed(2)}</p>
            </div>
            <p className="font-semibold text-gray-900">${(oi.quantity * Number(oi.price)).toFixed(2)}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-gray-50 rounded-xl">
        <p className="flex justify-between text-gray-700">
          <span>Total</span>
          <span className="font-semibold">${Number(order.total_price).toFixed(2)}</span>
        </p>
      </div>
      <div className="mt-6">
        <h3 className="font-medium text-gray-900 mb-2">Shipping address</h3>
        <p className="text-gray-600 text-sm">
          {addr.fullName}<br />
          {addr.address}<br />
          {addr.city}, {addr.state} {addr.zip}<br />
          {addr.phone}
        </p>
      </div>
    </div>
  );
}
