'use client';

import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { getCart, type CartItemResponse } from '@/services/cartService';
import { useAuth } from './AuthContext';

type CartItem = CartItemResponse;

interface CartContextType {
  items: CartItem[];
  count: number;
  refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);

  const refresh = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    try {
      const { items: data } = await getCart();
      setItems(data || []);
    } catch {
      setItems([]);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const count = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, count, refresh }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (ctx === undefined) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
