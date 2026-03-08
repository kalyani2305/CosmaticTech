'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllOrders } from '@/services/orderService';
import { getProducts } from '@/services/productService';
import { getCategories } from '@/services/categoryService';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [productsCount, setProductsCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);

  useEffect(() => {
    getAllOrders().then(setOrders).catch(() => []);
    getProducts().then((p) => setProductsCount(p.length)).catch(() => 0);
    getCategories().then((c) => setCategoriesCount(c.length)).catch(() => 0);
  }, []);

  const totalRevenue = orders.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + Number(o.total_price), 0);
  const recentOrders = orders.slice(0, 5);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <p className="text-sm text-gray-500">Total revenue</p>
          <p className="text-2xl font-semibold text-gray-900">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <p className="text-sm text-gray-500">Products</p>
          <p className="text-2xl font-semibold text-gray-900">{productsCount}</p>
          <Link href="/admin/products" className="text-sm text-primary-600 hover:underline mt-1">Manage</Link>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <p className="text-sm text-gray-500">Categories</p>
          <p className="text-2xl font-semibold text-gray-900">{categoriesCount}</p>
          <Link href="/admin/categories" className="text-sm text-primary-600 hover:underline mt-1">Manage</Link>
        </div>
      </div>
      <div>
        <h2 className="font-medium text-gray-900 mb-4">Recent orders</h2>
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left p-3 font-medium">Order</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Total</th>
                <th className="text-left p-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-b border-gray-50 last:border-0">
                  <td className="p-3"><Link href={`/admin/orders?id=${o.id}`} className="text-primary-600 hover:underline">{o.id.slice(0, 8)}</Link></td>
                  <td className="p-3">{o.status}</td>
                  <td className="p-3">${Number(o.total_price).toFixed(2)}</td>
                  <td className="p-3">{new Date(o.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentOrders.length === 0 && <p className="p-6 text-gray-500">No orders yet.</p>}
        </div>
      </div>
    </div>
  );
}
