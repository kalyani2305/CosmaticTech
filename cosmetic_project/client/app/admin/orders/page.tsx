'use client';

import { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus } from '@/services/orderService';
import type { Order } from '@/types';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = () => getAllOrders().then(setOrders).catch(() => []).finally(() => setLoading(false));

  useEffect(() => {
    refresh();
  }, []);

  const handleStatusChange = async (orderId: string, status: Order['status']) => {
    await updateOrderStatus(orderId, status);
    refresh();
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-gray-900 mb-6">Orders</h1>
      {loading ? (
        <div className="animate-pulse h-64 bg-gray-100 rounded-xl" />
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left p-3 font-medium">ID</th>
                <th className="text-left p-3 font-medium">User</th>
                <th className="text-left p-3 font-medium">Total</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Date</th>
                <th className="text-right p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-gray-50 last:border-0">
                  <td className="p-3 font-mono text-xs">{o.id.slice(0, 8)}</td>
                  <td className="p-3">{(o as any).users?.name || o.user_id}</td>
                  <td className="p-3">${Number(o.total_price).toFixed(2)}</td>
                  <td className="p-3">
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value as Order['status'])}
                      className="input-field w-auto py-1 text-sm"
                    >
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-3">{new Date(o.created_at).toLocaleString()}</td>
                  <td className="p-3 text-right">—</td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <p className="p-6 text-gray-500">No orders.</p>}
        </div>
      )}
    </div>
  );
}
