'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { updateCartItem, removeFromCart } from '@/services/cartService';
import { useCart } from '@/context/CartContext';

interface CartItemProps {
  item: {
    id: string;
    quantity: number;
    product_id: string;
    products?: { id: string; name: string; price: number; images: string[]; stock: number };
  };
}

export default function CartItem({ item }: CartItemProps) {
  const { refresh } = useCart();
  const [qty, setQty] = useState(item.quantity);
  const [updating, setUpdating] = useState(false);
  const product = item.products;
  if (!product) return null;

  const handleUpdate = async (newQty: number) => {
    if (newQty < 1 || newQty > product.stock) return;
    setUpdating(true);
    try {
      await updateCartItem(item.id, newQty);
      setQty(newQty);
      refresh();
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async () => {
    setUpdating(true);
    try {
      await removeFromCart(item.id);
      refresh();
    } finally {
      setUpdating(false);
    }
  };

  const img = product.images?.[0] || '/placeholder-product.jpg';

  return (
    <div className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
      <Link href={`/products/${product.id}`} className="shrink-0 w-24 h-24 relative rounded-lg overflow-hidden bg-gray-100">
        <Image src={img} alt={product.name} fill className="object-cover" sizes="96px" unoptimized={img.startsWith('http')} />
      </Link>
      <div className="flex-1 min-w-0">
        <Link href={`/products/${product.id}`} className="font-medium text-gray-900 hover:text-primary-600 line-clamp-2">
          {product.name}
        </Link>
        <p className="text-primary-600 font-semibold mt-1">${product.price.toFixed(2)}</p>
        <div className="mt-2 flex items-center gap-3">
          <div className="flex items-center border border-gray-200 rounded-lg">
            <button
              type="button"
              disabled={updating || qty <= 1}
              onClick={() => handleUpdate(qty - 1)}
              className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              −
            </button>
            <span className="w-9 text-center text-sm font-medium">{qty}</span>
            <button
              type="button"
              disabled={updating || qty >= product.stock}
              onClick={() => handleUpdate(qty + 1)}
              className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            disabled={updating}
            className="text-sm text-red-600 hover:underline disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="font-semibold text-gray-900">${(product.price * qty).toFixed(2)}</p>
      </div>
    </div>
  );
}
