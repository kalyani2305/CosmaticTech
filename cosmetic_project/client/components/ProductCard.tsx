'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const img = product.images?.[0];
  const isExternal = img?.startsWith('http');

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:border-primary-100 transition-all duration-300"
    >
      <div className="aspect-square relative bg-gray-100 overflow-hidden">
        {img ? (
          <Image
            src={img}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, 25vw"
            unoptimized={isExternal && !img.includes('unsplash')}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
          </div>
        )}
        {product.stock < 10 && product.stock > 0 && (
          <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-medium px-2 py-1 rounded">
            Low stock
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-2 left-2 bg-gray-800 text-white text-xs font-medium px-2 py-1 rounded">
            Out of stock
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs font-medium text-primary-600 uppercase tracking-wider">{product.brand}</p>
        <h3 className="mt-1 font-medium text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
          {product.name}
        </h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">${product.price.toFixed(2)}</span>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm text-gray-600">{Number(product.rating).toFixed(1)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
