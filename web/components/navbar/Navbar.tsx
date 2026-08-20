'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { Menu, X, Sprout } from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Handle scroll shadow transition
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Click outside and Escape key handler for mobile drawer menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const NAV_ITEMS = [
    { name: 'Home', href: '/' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Features', href: '/features' },
    { name: 'For Farmers', href: '/for-farmers' },
    { name: 'Farm Location', href: '/farm-location' },
    { name: 'Access Options', href: '/access-options' },
    { name: 'About', href: '/about' },
  ];

  return (
    <header
      ref={navRef}
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-[#E3EADF]'
          : 'bg-white/90 backdrop-blur-sm py-4 border-b border-[#E3EADF]/80'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-11">
          {/* LEFT: Annadata Logo Wordmark */}
          <Link
            href="/"
            aria-label="Annadata Homepage"
            className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-[#3F7D3A] rounded-xl p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-[#3F7D3A] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform duration-300">
              <Sprout className="w-6 h-6 text-[#E8B94A]" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-wider text-[#285C32] group-hover:text-[#3F7D3A] transition-colors leading-none">
                ANNADATA
              </span>
              <span className="block text-[10px] uppercase font-extrabold tracking-widest text-[#3F7D3A] -mt-0.5">
                अन्नदाता
              </span>
            </div>
          </Link>

          {/* CENTER: Desktop Navigation Links */}
          <nav aria-label="Global Navigation" className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-xs font-bold px-3 py-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#3F7D3A] ${
                    isActive
                      ? 'bg-[#EEF5E8] text-[#3F7D3A]'
                      : 'text-[#4F5E52] hover:text-[#3F7D3A] hover:bg-[#F8FAF3]'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT: Language Selector & Get Started Button */}
          <div className="hidden sm:flex items-center gap-3">
            <LanguageSelector />

            <Link href="/app" tabIndex={-1}>
              <Button variant="primary" size="sm" className="font-bold">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center gap-2">
            <LanguageSelector />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={mobileMenuOpen}
              className="p-2 rounded-xl bg-[#EEF5E8] text-[#285C32] border border-[#E3EADF] focus:outline-none focus:ring-2 focus:ring-[#3F7D3A]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E3EADF] px-4 pt-4 pb-6 mt-3 space-y-4 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-1.5">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-bold px-4 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-[#EEF5E8] text-[#3F7D3A]'
                      : 'text-[#4F5E52] hover:bg-[#F8FAF3]'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#E3EADF] flex flex-col gap-3">
            <Link href="/app" onClick={() => setMobileMenuOpen(false)} className="w-full">
              <Button variant="primary" size="md" className="w-full font-bold">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
