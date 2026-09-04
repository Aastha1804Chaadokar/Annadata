'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { Menu, X, Sprout } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Handle scroll state
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Click outside and Escape handler
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

  // Do not render public marketing navbar on authenticated farmer application routes
  if (pathname?.startsWith('/app')) {
    return null;
  }

  const NAV_ITEMS = [
    { name: t('navbar.home', 'Home'), href: '/' },
    { name: t('navbar.howItWorks', 'How It Works'), href: '/how-it-works' },
    { name: t('navbar.features', 'Features'), href: '/features' },
    { name: t('navbar.forFarmers', 'For Farmers'), href: '/for-farmers' },
    { name: t('navbar.farmLocation', 'Farm Location'), href: '/farm-location' },
    { name: t('navbar.download', '📱 Download App'), href: '/download' },
    { name: t('navbar.about', 'About'), href: '/about' },
  ];

  return (
    <header
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#173F2A]/95 backdrop-blur-md shadow-lg py-3 border-b border-white/10'
          : 'bg-gradient-to-b from-black/70 via-black/30 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          
          {/* LEFT: Annadata Logo Wordmark */}
          <Link
            href="/"
            aria-label="Annadata Homepage"
            className="flex items-center gap-3 group focus:outline-none rounded-2xl p-1 shrink-0"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#3F7D3A] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-300">
              <Sprout className="w-5 h-5 text-[#D8B45A]" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-[#D8B45A] transition-colors leading-none block">
                ANNADATA
              </span>
              <span className="block text-[10px] font-extrabold tracking-widest text-[#D8B45A] mt-0.5">
                अन्नदाता
              </span>
            </div>
          </Link>

          {/* CENTER: Desktop Navigation Links (Visible on large screens >= 1150px) */}
          <nav aria-label="Global Navigation" className="hidden lg:flex items-center gap-1 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 shadow-sm">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all focus:outline-none ${
                    isActive
                      ? 'bg-[#D8B45A] text-[#173F2A] font-extrabold shadow-sm'
                      : 'text-white/85 hover:text-white hover:bg-white/15'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT: Desktop Actions (Visible on large screens >= 1024px) */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <LanguageSelector variant="navbar" />

            <Link
              href="/login"
              className="text-xs font-bold text-white/90 hover:text-[#D8B45A] px-3.5 py-2 rounded-full transition-colors"
            >
              {t('navbar.login', 'Login')}
            </Link>

            <Link href="/app" tabIndex={-1}>
              <Button variant="accent" size="sm" className="font-extrabold shadow-md">
                {t('navbar.getStarted', 'Get Started')}
              </Button>
            </Link>
          </div>

          {/* Mobile/Tablet Menu Controls (Visible on screens < 1024px) */}
          <div className="flex lg:hidden items-center gap-2">
            <LanguageSelector variant="navbar" />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={mobileMenuOpen}
              className="p-2.5 rounded-2xl bg-white/15 backdrop-blur-md text-white border border-white/20 focus:outline-none hover:bg-white/25 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Responsive Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#173F2A]/98 backdrop-blur-xl border-b border-white/10 px-5 pt-4 pb-6 mt-3 space-y-4 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-1.5">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-bold px-4 py-2.5 rounded-2xl transition-all ${
                    isActive
                      ? 'bg-[#D8B45A] text-[#173F2A] font-extrabold'
                      : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-sm font-bold text-white bg-white/10 rounded-full border border-white/20 hover:bg-white/20"
            >
              {t('navbar.login', 'Login')}
            </Link>
            <Link href="/app" onClick={() => setMobileMenuOpen(false)} className="w-full">
              <Button variant="accent" size="md" className="w-full font-bold">
                {t('navbar.getStarted', 'Get Started')}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
