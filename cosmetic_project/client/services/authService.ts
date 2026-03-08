import { api } from '@/utils/api';
import type { User } from '@/types';

export async function register(name: string, email: string, password: string) {
  const res = await api<{ user: User; token: string }>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  return res;
}

export async function login(email: string, password: string) {
  const res = await api<{ user: User; token: string }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return res;
}

export async function getProfile() {
  return api<User>('/api/auth/profile');
}
