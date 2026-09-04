'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getFarmerProfile } from '@/lib/farmerService';
import { logout as authLogout, getAuthUser } from '@/lib/authService';
import { FarmerProfile } from '@/types/farmer';
import {
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
  User,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

import { useTranslation } from 'react-i18next';

export const AppSidebar: React.FC = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();

  const [farmer, setFarmer] = useState<FarmerProfile | null>(null);
  const [authUser, setAuthUser] = useState<{ name: string; mobile: string } | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  useEffect(() => {
    setFarmer(getFarmerProfile());
    setAuthUser(getAuthUser());
  }, []);

  const SIDEBAR_ITEMS = [
    { name: t('navbar.dashboard'), href: '/app/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: t('navbar.myFarm'), href: '/app/farm', icon: <Tractor className="w-4 h-4" /> },
    { name: t('navbar.soilHealth'), href: '/app/soil', icon: <Sprout className="w-4 h-4" /> },
    { name: t('navbar.cropRecommendation'), href: '/app/crop-recommendation', icon: <Sparkles className="w-4 h-4" /> },
    { name: t('navbar.weather'), href: '/app/weather', icon: <CloudSun className="w-4 h-4" /> },
    { name: t('navbar.cropHealth'), href: '/app/crop-health', icon: <Camera className="w-4 h-4" /> },
    { name: t('navbar.askAi'), href: '/app/assistant', icon: <Bot className="w-4 h-4" /> },
    { name: t('navbar.market'), href: '/app/market', icon: <TrendingUp className="w-4 h-4" /> },
    { name: t('navbar.settings'), href: '/app/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const displayName = authUser?.name || farmer?.name || 'Kisan';
  const displayMobile = authUser?.mobile || farmer?.mobile || '';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authLogout();
    } catch (err) {
      console.warn('Logout warning:', err);
    }
    setIsLoggingOut(false);
    setShowLogoutModal(false);
    router.replace('/login');
  };

  return (
    <>
      <aside className="w-64 bg-white border-r border-[#E3EADF] p-4 flex flex-col justify-between shrink-0 min-h-[calc(100vh-76px)] hidden md:flex">
        <div className="space-y-6">
          <div>
            <div className="text-[10px] font-bold text-[#667267] uppercase tracking-wider px-3 mb-2">
              Farmer Portal Navigation
            </div>
            <nav className="space-y-1">
              {SIDEBAR_ITEMS.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/app/dashboard' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#EEF5E8] text-[#3F7D3A] border border-[#DCECCF]'
                        : 'text-[#4F5E52] hover:bg-[#F8FAF3] hover:text-[#3F7D3A]'
                    }`}
                  >
                    <span className={isActive ? 'text-[#3F7D3A]' : 'text-[#667267]'}>
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Section: Profile Summary + Settings + Logout */}
        <div className="pt-4 border-t border-[#E3EADF] space-y-3">
          {/* Farmer Profile Card */}
          <div className="p-3 rounded-2xl bg-[#F8FAF3] border border-[#DCECCF] flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#3F7D3A] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
              {initials || <User className="w-4 h-4" />}
            </div>
            <div className="overflow-hidden min-w-0">
              <div className="text-xs font-extrabold text-[#285C32] truncate">
                {displayName}
              </div>
              <div className="text-[10px] text-[#667267] font-semibold truncate">
                Farmer • {displayMobile}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-700 hover:bg-red-50 border border-transparent hover:border-red-100 transition-colors text-left"
            >
              <LogOut className="w-4 h-4 text-red-600" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-stone-200 shadow-xl space-y-5 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-[#285C32]">Logout from Annadata?</h3>
              <p className="text-xs text-[#667267] leading-relaxed">
                You will need to login again to access your farm dashboard and crop intelligence. Your farm data will remain safe.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                disabled={isLoggingOut}
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-stone-300 font-bold text-xs text-[#285C32] hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isLoggingOut}
                onClick={handleConfirmLogout}
                className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors disabled:opacity-70"
              >
                {isLoggingOut ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Logging out...</span>
                  </>
                ) : (
                  <>
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
