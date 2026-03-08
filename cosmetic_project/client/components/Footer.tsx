import Link from 'next/link';

const links = [
  { href: '/products', label: 'Shop' },
  { href: '/products?category=Makeup', label: 'Makeup' },
  { href: '/products?category=Skincare', label: 'Skincare' },
  { href: '/products?category=Haircare', label: 'Haircare' },
  { href: '/products?category=Fragrance', label: 'Fragrance' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="font-display text-xl font-semibold text-white">
              Glow
            </Link>
            <p className="mt-3 text-sm">
              Premium cosmetics for every skin type. Beauty, redefined.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-3">Shop</h3>
            <ul className="space-y-2">
              {links.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-3">Help</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/cart" className="hover:text-white transition-colors">Cart</Link></li>
              <li><Link href="/profile" className="hover:text-white transition-colors">Account</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-3">Contact</h3>
            <p className="text-sm">support@glow.cosmetics</p>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Glow. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
