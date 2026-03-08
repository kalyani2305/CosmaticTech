'use client';

import { useEffect, useState } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/services/categoryService';
import type { Category } from '@/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [showForm, setShowForm] = useState(false);

  const refresh = () => getCategories().then(setCategories).catch(() => []).finally(() => setLoading(false));

  useEffect(() => {
    refresh();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    await createCategory(newName.trim(), newDesc.trim() || undefined);
    setNewName('');
    setNewDesc('');
    setShowForm(false);
    refresh();
  };

  const handleUpdate = async (id: string, name: string, description: string) => {
    await updateCategory(id, { name, description });
    setEditing(null);
    refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    await deleteCategory(id);
    refresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold text-gray-900">Categories</h1>
        <button type="button" onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : 'Add category'}
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 p-4 bg-gray-50 rounded-xl flex flex-wrap gap-3">
          <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Name" className="input-field flex-1 min-w-[200px]" required />
          <input value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Description" className="input-field flex-1 min-w-[200px]" />
          <button type="submit" className="btn-primary">Create</button>
        </form>
      )}
      {loading ? (
        <div className="animate-pulse h-64 bg-gray-100 rounded-xl" />
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
          {categories.map((c) => (
            <div key={c.id} className="p-4 flex items-center justify-between gap-4">
              {editing === c.id ? (
                <>
                  <input
                    id={`name-${c.id}`}
                    type="text"
                    defaultValue={c.name}
                    className="input-field flex-1"
                  />
                  <input
                    id={`desc-${c.id}`}
                    type="text"
                    defaultValue={c.description || ''}
                    placeholder="Description"
                    className="input-field flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => handleUpdate(c.id, (document.getElementById(`name-${c.id}`) as HTMLInputElement)?.value || c.name, (document.getElementById(`desc-${c.id}`) as HTMLInputElement)?.value || '')}
                    className="btn-primary text-sm"
                  >
                    Save
                  </button>
                  <button type="button" onClick={() => setEditing(null)} className="btn-secondary text-sm">Cancel</button>
                </>
              ) : (
                <>
                  <div>
                    <p className="font-medium text-gray-900">{c.name}</p>
                    {c.description && <p className="text-sm text-gray-500">{c.description}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setEditing(c.id)} className="text-primary-600 hover:underline text-sm">Edit</button>
                    <button type="button" onClick={() => handleDelete(c.id)} className="text-red-600 hover:underline text-sm">Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
          {categories.length === 0 && <p className="p-6 text-gray-500">No categories.</p>}
        </div>
      )}
    </div>
  );
}
