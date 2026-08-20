'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clearFarmerProfile } from '@/lib/farmerService';
import {
  LayoutDashboard,
  Sprout,
  Sparkles,
  CloudSun,
  Camera,
  Bot,
  TrendingUp,
  User,
  LogOut,
} from 'lucide-react';

export const FarmerSidebar: React.FC = () => {
  const pathname = usePathname();

  const SIDEBAR_ITEMS = [
    { name: 'Dashboard', href: '/app/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: 'Soil Health', href: '/app/soil', icon: <Sprout className="w-4 h-4" /> },
    { name: 'Crop Recommendation', href: '/app/crop-recommendation', icon: <Sparkles className="w-4 h-4" /> },
    { name: 'Weather', href: '/app/weather', icon: <CloudSun className="w-4 h-4" /> },
    { name: 'Crop Health', href: '/app/crop-health', icon: <Camera className="w-4 h-4" /> },
    { name: 'Ask Annadata AI', href: '/app/assistant', icon: <Bot className="w-4 h-4" /> },
    { name: 'Market Prices', href: '/app/market', icon: <TrendingUp className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#E3EADF] p-4 flex flex-col justify-between shrink-0 min-h-[calc(100vh-76px)] hidden md:flex">
      <div className="space-y-6">
        <div>
          <div className="text-[10px] font-bold text-[#667267] uppercase tracking-wider px-3 mb-2">
            Farmer Portal Navigation
          </div>
          <nav className="space-y-1">
            {SIDEBAR_ITEMS.map((item) => {
              const isActive = pathname === item.href;
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

      <div className="pt-4 border-t border-[#E3EADF] space-y-1">
        <Link
          href="/app"
          onClick={() => clearFarmerProfile()}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Switch Profile / Reset</span>
        </Link>
      </div>
    </aside>
  );
};
