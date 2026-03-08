'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import NavbarRoot from './NavbarRoot';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Shop' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <NavbarRoot className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="font-display text-2xl font-semibold text-primary-700 tracking-tight">
            Glow
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium transition-colors ${pathname === href ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'}`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors" aria-label="Cart">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 text-gray-700">
                  <span className="hidden sm:inline text-sm font-medium">{user.name}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-1 w-48 py-2 bg-white rounded-xl shadow-lg border border-gray-100 z-20">
                      <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>Profile</Link>
                      <Link href="/wishlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>Wishlist</Link>
                      {user.role === 'admin' && (
                        <Link href="/admin/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>Admin</Link>
                      )}
                      <button onClick={() => { logout(); setUserMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Sign out</button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link href="/auth/login" className="btn-primary text-sm py-2">Sign in</Link>
            )}

            <button className="md:hidden p-2 text-gray-600" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-100 flex flex-col gap-2">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} className="py-2 text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>{label}</Link>
            ))}
          </nav>
        )}
      </div>
    </NavbarRoot>
  );
}
