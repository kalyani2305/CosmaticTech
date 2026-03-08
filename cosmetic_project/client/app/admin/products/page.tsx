'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProducts } from '@/services/productService';
import { getCategories } from '@/services/categoryService';
import { deleteProduct } from '@/services/productService';
import type { Product } from '@/types';
import type { Category } from '@/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    getProducts().then(setProducts).catch(() => []).finally(() => setLoading(false));
    getCategories().then(setCategories).catch(() => {});
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await deleteProduct(id);
    setProducts((p) => p.filter((x) => x.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold text-gray-900">Products</h1>
        <Link href="/admin/products/new" className="btn-primary">Add product</Link>
      </div>
      {loading ? (
        <div className="animate-pulse h-64 bg-gray-100 rounded-xl" />
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left p-3 font-medium">Name</th>
                <th className="text-left p-3 font-medium">Brand</th>
                <th className="text-left p-3 font-medium">Price</th>
                <th className="text-left p-3 font-medium">Stock</th>
                <th className="text-left p-3 font-medium">Rating</th>
                <th className="text-right p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 last:border-0">
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3">{p.brand}</td>
                  <td className="p-3">${Number(p.price).toFixed(2)}</td>
                  <td className="p-3">{p.stock}</td>
                  <td className="p-3">{Number(p.rating).toFixed(1)}</td>
                  <td className="p-3 text-right">
                    <Link href={`/admin/products/${p.id}`} className="text-primary-600 hover:underline mr-3">Edit</Link>
                    <button type="button" onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && <p className="p-6 text-gray-500">No products.</p>}
        </div>
      )}
    </div>
  );
}
