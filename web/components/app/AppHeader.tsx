'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getFarmerProfile } from '@/lib/farmerService';
import { FarmerProfile } from '@/types/farmer';
import { formatCropDisplay } from '@/lib/cropDataset';
import {
  MapPin,
  UserCheck,
  Menu,
  X,
  LayoutDashboard,
  Tractor,
  Sprout,
  Sparkles,
  CloudSun,
  Camera,
  Bot,
  TrendingUp,
  Settings,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { useTranslation } from 'react-i18next';

export const AppHeader: React.FC = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const p = getFarmerProfile();
    if (typeof window !== 'undefined') {
      const authUserStr = localStorage.getItem('annadata_auth_user');
      if (authUserStr) {
        try {
          const authUser = JSON.parse(authUserStr);
          if (authUser?.name) {
            p.name = authUser.name;
          }
        } catch (e) {}
      }
    }
    setProfile(p);
  }, []);

  const SIDEBAR_ITEMS = [
    { name: t('navbar.dashboard', 'Dashboard'), href: '/app/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: t('navbar.myFarm', 'My Farm'), href: '/app/farm', icon: <Tractor className="w-4 h-4" /> },
    { name: t('navbar.soilHealth', 'Soil Health'), href: '/app/soil', icon: <Sprout className="w-4 h-4" /> },
    { name: t('navbar.cropRecommendation', 'Crop Recommendation'), href: '/app/crop-recommendation', icon: <Sparkles className="w-4 h-4" /> },
    { name: t('navbar.weather', 'Weather'), href: '/app/weather', icon: <CloudSun className="w-4 h-4" /> },
    { name: t('navbar.cropHealth', 'Crop Health Scan'), href: '/app/crop-health', icon: <Camera className="w-4 h-4" /> },
    { name: t('navbar.askAi', 'Ask Annadata AI'), href: '/app/assistant', icon: <Bot className="w-4 h-4" /> },
    { name: t('navbar.market', 'Market & Mandi'), href: '/app/market', icon: <TrendingUp className="w-4 h-4" /> },
    { name: t('navbar.settings', 'Settings'), href: '/app/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const displayName = profile?.name || 'Farmer';
  const displayLocation = profile ? `${profile.village}, ${profile.district}` : 'India';

  return (
    <>
      <header className="bg-white border-b border-[#E3EADF] px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 sticky top-0 z-40 shadow-xs">
        
        {/* Left: Mobile Menu Trigger + Farmer Identity */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label={mobileNavOpen ? 'Close Navigation' : 'Open Navigation'}
            className="md:hidden p-2 rounded-xl bg-[#EEF5E8] text-[#173F2A] hover:bg-[#DCECCF] transition-colors"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/app/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#173F2A] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <Sprout className="w-5 h-5 text-[#D8B45A]" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-black text-[#173F2A] leading-tight">
                {displayName}
              </div>
              <div className="text-[11px] text-[#5F6F62] flex items-center gap-1 font-medium">
                <MapPin className="w-3 h-3 text-[#3F7D3A] shrink-0" />
                <span className="truncate max-w-[140px] sm:max-w-none">{displayLocation}</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Right: Language Selector + Crop / Tag Badges */}
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSelector variant="header" />

          {profile?.currentCrop && (
            <span className="hidden sm:inline-flex px-3 py-1 bg-[#FFF8E8] text-[#9A7048] text-xs font-bold rounded-full border border-[#E8B94A]/30">
              {formatCropDisplay(profile.currentCrop)}
            </span>
          )}

          <Link
            href="/"
            title="Return to Public Website"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[#5F6F62] hover:text-[#173F2A] px-2.5 py-1 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <span>Public Site</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </header>

      {/* Responsive Mobile Drawer Menu for Farmer Portal */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-stone-900/50 backdrop-blur-xs flex flex-col justify-start">
          <div className="bg-white border-b border-[#E3EADF] p-5 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl animate-in slide-in-from-top duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#173F2A] text-white flex items-center justify-center">
                  <Sprout className="w-4 h-4 text-[#D8B45A]" />
                </div>
                <span className="text-sm font-black text-[#173F2A]">Annadata Farmer Portal</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                className="p-1.5 rounded-lg bg-stone-100 text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="space-y-1">
              {SIDEBAR_ITEMS.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/app/dashboard' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileNavOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#EEF5E8] text-[#173F2A] border border-[#DCECCF]'
                        : 'text-[#4F5E52] hover:bg-[#F8FAF3]'
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              <Link
                href="/"
                onClick={() => setMobileNavOpen(false)}
                className="text-xs font-bold text-[#5F6F62] hover:text-[#173F2A] flex items-center gap-1"
              >
                <span>← Public Website</span>
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileNavOpen(false)}
                className="text-xs font-bold text-red-600 hover:text-red-700"
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
