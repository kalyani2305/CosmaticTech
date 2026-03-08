'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProductById } from '@/services/productService';
import { updateProduct } from '@/services/productService';
import { getCategories } from '@/services/categoryService';
import type { Product } from '@/types';
import type { Category } from '@/types';

export default function AdminEditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ name: '', description: '', ingredients: '', brand: '', price: '', category_id: '', images: '', stock: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getProductById(id).then((p) => {
      setProduct(p);
      setForm({
        name: p.name,
        description: p.description || '',
        ingredients: p.ingredients || '',
        brand: p.brand,
        price: String(p.price),
        category_id: p.category_id,
        images: (p.images || []).join(', '),
        stock: String(p.stock),
      });
    }).catch(() => setProduct(null));
    getCategories().then(setCategories).catch(() => {});
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setError('');
    setLoading(true);
    try {
      await updateProduct(id, {
        name: form.name,
        description: form.description || undefined,
        ingredients: form.ingredients || undefined,
        brand: form.brand,
        price: parseFloat(form.price),
        category_id: form.category_id,
        images: form.images ? form.images.split(',').map((s) => s.trim()).filter(Boolean) : [],
        stock: parseInt(form.stock, 10) || 0,
      });
      router.push('/admin/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setLoading(false);
    }
  };

  if (!product) return <div className="py-12">Loading…</div>;

  return (
    <div>
      <Link href="/admin/products" className="text-sm text-primary-600 hover:underline mb-6 inline-block">← Back to products</Link>
      <h1 className="font-display text-2xl font-semibold text-gray-900 mb-6">Edit product</h1>
      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input-field" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
          <input value={form.brand} onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))} className="input-field" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="input-field min-h-[80px]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients</label>
          <input value={form.ingredients} onChange={(e) => setForm((f) => ({ ...f, ingredients: e.target.value }))} className="input-field" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
            <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
            <input type="number" min="0" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} className="input-field" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
          <select value={form.category_id} onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))} className="input-field" required>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URLs (comma-separated)</label>
          <input value={form.images} onChange={(e) => setForm((f) => ({ ...f, images: e.target.value }))} className="input-field" />
        </div>
        <button type="submit" disabled={loading} className="btn-primary">Save changes</button>
      </form>
    </div>
  );
}
