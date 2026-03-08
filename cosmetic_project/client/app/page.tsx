import Link from 'next/link';
import { getProducts } from '@/services/productService';
import ProductGrid from '@/components/ProductGrid';

export const revalidate = 60;

export default async function HomePage() {
  const products = await getProducts({ sort: 'newest' }).catch(() => []);
  const featured = products.slice(0, 8);

  return (
    <div>
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-accent-rose/10 py-20 lg:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-gray-900 tracking-tight">
            Beauty, redefined
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Discover premium makeup, skincare, haircare and fragrance. Curated for every glow.
          </p>
          <Link href="/products" className="inline-block mt-8 btn-primary text-base px-8 py-3">
            Shop now
          </Link>
        </div>
      </section>

      <section className="py-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10 text-sm font-medium text-gray-600">
            <Link href="/products?category=Makeup" className="hover:text-primary-600 transition-colors">Makeup</Link>
            <Link href="/products?category=Skincare" className="hover:text-primary-600 transition-colors">Skincare</Link>
            <Link href="/products?category=Haircare" className="hover:text-primary-600 transition-colors">Haircare</Link>
            <Link href="/products?category=Fragrance" className="hover:text-primary-600 transition-colors">Fragrance</Link>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-gray-900 mb-8">New arrivals</h2>
          <ProductGrid products={featured} />
          <div className="mt-10 text-center">
            <Link href="/products" className="btn-secondary">View all products</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
