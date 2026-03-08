'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { register } from '@/services/authService';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const { user, token } = await register(name, email, password);
      if (typeof window !== 'undefined') localStorage.setItem('token', token);
      setUser(user);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="font-display text-2xl font-semibold text-gray-900 mb-6">Create account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" required autoComplete="name" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" required autoComplete="email" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password (min 6 characters)</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" required autoComplete="new-password" />
        </div>
        <button type="submit" disabled={loading} className="w-full btn-primary py-3">
          {loading ? 'Creating account…' : 'Register'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account? <Link href="/auth/login" className="text-primary-600 hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
