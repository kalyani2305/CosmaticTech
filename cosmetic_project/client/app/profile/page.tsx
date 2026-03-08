'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getMyOrders } from '@/services/orderService';
import type { Order } from '@/types';

function ProfileContent() {
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const orderSuccess = searchParams.get('order') === 'success';

  useEffect(() => {
    if (user) getMyOrders().then(setOrders).catch(() => {});
  }, [user]);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">Loading…</div>;
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600">Please sign in to view your profile.</p>
        <Link href="/auth/login" className="mt-4 inline-block btn-primary">Sign in</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {orderSuccess && (
        <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-xl">Order placed successfully.</div>
      )}
      <h1 className="font-display text-2xl font-semibold text-gray-900 mb-6">My account</h1>
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
        <h2 className="font-medium text-gray-900 mb-2">Profile</h2>
        <p className="text-gray-600"><span className="font-medium">Name:</span> {user.name}</p>
        <p className="text-gray-600"><span className="font-medium">Email:</span> {user.email}</p>
      </div>
      <h2 className="font-medium text-gray-900 mb-4">Order history</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order.id} href={`/profile/orders/${order.id}`} className="block p-4 bg-white rounded-xl border border-gray-100 hover:border-primary-200 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium text-gray-900">Order #{order.id.slice(0, 8)}</span>
                <span className={`text-sm px-2 py-1 rounded ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'cancelled' ? 'bg-gray-100 text-gray-600' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {order.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(order.created_at).toLocaleDateString()} · ${Number(order.total_price).toFixed(2)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">Loading…</div>}>
      <ProfileContent />
    </Suspense>
  );
}
