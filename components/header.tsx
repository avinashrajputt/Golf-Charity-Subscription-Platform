'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { useState } from 'react';

export function Header() {
  const user = useAuthStore((state) => state.user);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-secondary border-b border-gray-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center font-bold text-primary text-sm">
              ⛳
            </div>
            <span className="font-bold text-white hidden sm:inline">Golf Charity</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-300 hover:text-white text-sm">
                  Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link href="/admin/dashboard" className="text-gray-300 hover:text-white text-sm">
                    Admin
                  </Link>
                )}
                <Link href="/charities" className="text-gray-300 hover:text-white text-sm">
                  Charities
                </Link>
                <Link href="/api/auth/logout" className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white text-sm font-medium">
                  Logout
                </Link>
              </>
            ) : (
              <>
                <Link href="/charities" className="text-gray-300 hover:text-white text-sm">
                  Charities
                </Link>
                <Link href="/auth/signin" className="text-gray-300 hover:text-white text-sm">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="px-4 py-2 bg-accent hover:bg-blue-600 rounded text-primary font-medium text-sm">
                  Subscribe
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-gray-700">
            {user ? (
              <>
                <Link href="/dashboard" className="block text-gray-300 hover:text-white">
                  Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link href="/admin/dashboard" className="block text-gray-300 hover:text-white">
                    Admin
                  </Link>
                )}
                <Link href="/charities" className="block text-gray-300 hover:text-white">
                  Charities
                </Link>
                <Link href="/api/auth/logout" className="block px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white font-medium text-center">
                  Logout
                </Link>
              </>
            ) : (
              <>
                <Link href="/charities" className="block text-gray-300 hover:text-white">
                  Charities
                </Link>
                <Link href="/auth/signin" className="block text-gray-300 hover:text-white">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="block px-4 py-2 bg-accent hover:bg-blue-600 rounded text-primary font-medium text-center">
                  Subscribe
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
