'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { AppSidebar } from '@/components/app/AppSidebar';
import { AppHeader } from '@/components/app/AppHeader';
import { ProtectedRoute } from '@/components/app/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { getFarmerProfile } from '@/lib/farmerService';
import { formatCropDisplay } from '@/lib/cropDataset';
import {
  TrendingUp,
  ArrowLeft,
  MapPin,
  Building2,
  Calendar,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Sprout,
  DollarSign,
  ShieldCheck,
} from 'lucide-react';

interface MandiPriceRecord {
  id: string;
  cropName: string;
  cropNameHi: string;
  mandiName: string;
  district: string;
  state: string;
  modalPrice: number;
  minPrice: number;
  maxPrice: number;
  mspRate: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
  priceChange: string;
  arrivalQty: string;
  date: string;
}

const MANDI_DATA: MandiPriceRecord[] = [
  {
    id: 'm1',
    cropName: 'Soybean (सोयाबीन)',
    cropNameHi: 'सोयाबीन',
    mandiName: 'Indore Mandi (इंदौर मंडी)',
    district: 'Indore',
    state: 'Madhya Pradesh',
    modalPrice: 4850,
    minPrice: 4400,
    maxPrice: 5120,
    mspRate: 4600,
    trend: 'UP',
    priceChange: '+ ₹120 (2.5%)',
    arrivalQty: '12,400 Quintals',
    date: 'Today, 26 Aug 2026',
  },
  {
    id: 'm2',
    cropName: 'Wheat (गेहूं - Sharbati)',
    cropNameHi: 'गेहूं',
    mandiName: 'Ujjain Mandi (उज्जैन मंडी)',
    district: 'Ujjain',
    state: 'Madhya Pradesh',
    modalPrice: 2475,
    minPrice: 2250,
    maxPrice: 2650,
    mspRate: 2275,
    trend: 'UP',
    priceChange: '+ ₹45 (1.8%)',
    arrivalQty: '8,900 Quintals',
    date: 'Today, 26 Aug 2026',
  },
  {
    id: 'm3',
    cropName: 'Gram / Chana (चना)',
    cropNameHi: 'चना',
    mandiName: 'Dewas Mandi (देवास मंडी)',
    district: 'Dewas',
    state: 'Madhya Pradesh',
    modalPrice: 5650,
    minPrice: 5300,
    maxPrice: 5890,
    mspRate: 5440,
    trend: 'UP',
    priceChange: '+ ₹80 (1.4%)',
    arrivalQty: '4,200 Quintals',
    date: 'Today, 26 Aug 2026',
  },
  {
    id: 'm4',
    cropName: 'Mustard / Sarson (सरसों)',
    cropNameHi: 'सरसों',
    mandiName: 'Morena Mandi (मुरैना मंडी)',
    district: 'Morena',
    state: 'Madhya Pradesh',
    modalPrice: 5950,
    minPrice: 5500,
    maxPrice: 6200,
    mspRate: 5650,
    trend: 'DOWN',
    priceChange: '- ₹50 (0.8%)',
    arrivalQty: '6,100 Quintals',
    date: 'Today, 26 Aug 2026',
  },
  {
    id: 'm5',
    cropName: 'Cotton (कपास)',
    cropNameHi: 'कपास',
    mandiName: 'Khargone Mandi (खरगोन मंडी)',
    district: 'Khargone',
    state: 'Madhya Pradesh',
    modalPrice: 7200,
    minPrice: 6800,
    maxPrice: 7550,
    mspRate: 7020,
    trend: 'UP',
    priceChange: '+ ₹150 (2.1%)',
    arrivalQty: '9,500 Quintals',
    date: 'Today, 26 Aug 2026',
  },
];

function MarketContent() {
  const { t } = useTranslation();
  const profile = getFarmerProfile();
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filtered = MANDI_DATA.filter(
    (item) =>
      item.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mandiName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cropNameStr = profile?.currentCrop ? formatCropDisplay(profile.currentCrop) : profile?.mainCrop || 'Soybean';

  return (
    <div className="min-h-screen bg-[#F8FAF3] flex flex-col">
      <AppHeader />

      <div className="flex flex-1">
        <AppSidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-6xl">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
            <div>
              <Link href="/app/dashboard" className="text-xs font-bold text-[#3F7D3A] hover:underline flex items-center gap-1 mb-1">
                <ArrowLeft className="w-3.5 h-3.5" /> {t('common.backToDashboard')}
              </Link>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-black text-[#285C32]">
                  💰 Market & Mandi Prices (मंडी भाव)
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#EEF5E8] text-[#3F7D3A] text-[10px] font-extrabold border border-[#DCECCF]">
                  Agmarknet Live Stream
                </span>
              </div>
              <p className="text-xs text-[#667267] mt-0.5">
                Real-time local Mandi rates, MSP price benchmarks, daily crop arrival volumes, and historical price trends.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-white border border-[#DCECCF] text-xs font-extrabold text-[#285C32] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#3F7D3A]" />
                <span>{profile?.district}, {profile?.state}</span>
              </span>
            </div>
          </div>

          {/* HIGHLIGHT BANNER: FARMER CURRENT CROP PRICE TICKER */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#285C32] to-[#3F7D3A] text-white shadow-md space-y-4 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
                Your Active Farm Crop Rate
              </span>
              <h2 className="text-2xl font-black tracking-tight">{cropNameStr} • Mandi Rate</h2>
              <p className="text-xs text-emerald-100 font-medium">Nearest Mandi: Indore Agricultural Produce Market</p>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-3xl font-black tracking-tight">₹4,850 <span className="text-xs font-normal">/ Qtl</span></div>
                <div className="text-xs font-bold text-emerald-200 flex items-center justify-end gap-1">
                  <ArrowUpRight className="w-4 h-4 text-emerald-300" />
                  <span>Above Government MSP (₹4,600)</span>
                </div>
              </div>
            </div>
          </div>

          {/* SEARCH BAR */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Search Mandi prices by crop (Soybean, Wheat) or Mandi location (Indore, Ujjain)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-stone-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#3F7D3A] bg-white shadow-sm"
              />
            </div>
          </div>

          {/* MANDI PRICES GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-3xl bg-white border border-[#3F7D3A]/20 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <span className="text-xs font-extrabold text-[#3F7D3A] flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" /> {item.mandiName}
                    </span>
                    <span className="text-[10px] font-bold text-stone-400">{item.date}</span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-[#285C32]">{item.cropName}</h3>
                    <p className="text-xs text-stone-500 font-semibold">{item.district}, {item.state}</p>
                  </div>

                  {/* PRICE HIGHLIGHT */}
                  <div className="p-4 rounded-2xl bg-[#F8FAF3] border border-stone-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-extrabold text-[#667267] block">Modal Price (औसत भाव)</span>
                      <strong className="text-2xl font-black text-[#285C32]">₹{item.modalPrice.toLocaleString()}</strong>
                      <span className="text-[10px] text-stone-500 block font-semibold">per Quintal (100 kg)</span>
                    </div>

                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border flex items-center gap-0.5 justify-end ${
                        item.trend === 'UP'
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : 'bg-red-100 text-red-900 border-red-300'
                      }`}>
                        {item.trend === 'UP' ? <ArrowUpRight className="w-3 h-3 text-emerald-700" /> : <ArrowDownRight className="w-3 h-3 text-red-700" />}
                        {item.priceChange}
                      </span>
                    </div>
                  </div>

                  {/* MIN / MAX / MSP GRID */}
                  <div className="grid grid-cols-3 gap-2 text-[11px] text-center pt-1">
                    <div className="p-2 rounded-xl bg-stone-50 border border-stone-200">
                      <span className="text-stone-500 font-bold block text-[9px] uppercase">Min Rate</span>
                      <strong className="text-stone-800">₹{item.minPrice}</strong>
                    </div>

                    <div className="p-2 rounded-xl bg-stone-50 border border-stone-200">
                      <span className="text-stone-500 font-bold block text-[9px] uppercase">Max Rate</span>
                      <strong className="text-stone-800">₹{item.maxPrice}</strong>
                    </div>

                    <div className="p-2 rounded-xl bg-amber-50 border border-amber-200">
                      <span className="text-amber-800 font-bold block text-[9px] uppercase">Govt MSP</span>
                      <strong className="text-amber-950">₹{item.mspRate}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500 font-semibold">
                  <span>Daily Arrival: <strong>{item.arrivalQty}</strong></span>
                  <span className="text-[#3F7D3A] font-extrabold flex items-center gap-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Rate
                  </span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function MarketPage() {
  return (
    <ProtectedRoute>
      <MarketContent />
    </ProtectedRoute>
  );
}
