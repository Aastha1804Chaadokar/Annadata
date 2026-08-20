'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getFarmerProfile } from '@/lib/farmerService';
import { FarmerProfile } from '@/types/farmer';
import { FarmerSidebar } from '@/components/app/FarmerSidebar';
import { AppHeader } from '@/components/app/AppHeader';
import { Button } from '@/components/ui/Button';
import {
  Sprout,
  Sparkles,
  CloudSun,
  Camera,
  Bot,
  TrendingUp,
  MapPin,
  Tractor,
  Droplets,
  Languages,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

export default function FarmerDashboardPage() {
  const [profile, setProfile] = useState<FarmerProfile | null>(null);

  useEffect(() => {
    setProfile(getFarmerProfile());
  }, []);

  if (!profile) return null;

  const MODULE_CARDS = [
    {
      title: '🌱 Soil Health',
      subtitle: 'Understand your soil parameters & test reports',
      desc: 'Digitize Soil Health Card metrics (N, P, K, pH) for precise fertilizer dosages.',
      actionText: 'Open Soil Health',
      href: '/app/soil',
      badge: 'Demo / Sample Data',
      icon: <Sprout className="w-6 h-6 text-[#3F7D3A]" />,
      bgColor: 'bg-white',
    },
    {
      title: '🌾 Crop Recommendation',
      subtitle: 'Find crops suitable for your farm',
      desc: 'Rule-based matching engine comparing season, soil profile, water & Mandi trends.',
      actionText: 'Open Recommendation Engine',
      href: '/app/crop-recommendation',
      badge: 'Rule Engine Active',
      icon: <Sparkles className="w-6 h-6 text-[#E8B94A]" />,
      bgColor: 'bg-white',
    },
    {
      title: '🌦 Weather Intelligence',
      subtitle: 'Check today\'s local micro-climate forecast',
      desc: 'Rainfall probability, temperature, and agricultural spray/irrigation advisories.',
      actionText: 'Open Weather Telemetry',
      href: '/app/weather',
      badge: 'IMD Telemetry Demo',
      icon: <CloudSun className="w-6 h-6 text-[#6FA8B8]" />,
      bgColor: 'bg-white',
    },
    {
      title: '📷 Crop Health Scan',
      subtitle: 'Check visible leaf symptoms',
      desc: 'Upload leaf or stem photographs to detect visible symptom patterns.',
      actionText: 'Upload Crop Photo',
      href: '/app/crop-health',
      badge: 'Demo / Vision Model',
      icon: <Camera className="w-6 h-6 text-[#3F7D3A]" />,
      bgColor: 'bg-white',
    },
    {
      title: '🤖 Ask Annadata AI',
      subtitle: 'Ask your farming questions in your language',
      desc: 'Multilingual conversational AI trained on Indian agricultural extension guidance.',
      actionText: 'Ask Question',
      href: '/app/assistant',
      badge: 'Multilingual AI',
      icon: <Bot className="w-6 h-6 text-[#3F7D3A]" />,
      bgColor: 'bg-white',
    },
    {
      title: '💰 Market & Mandi Prices',
      subtitle: 'Check crop prices & nearby Mandi trends',
      desc: 'Track local Mandi price trends and seasonal commodity demand.',
      actionText: 'View Market Trends',
      href: '/app/market',
      badge: 'Integration Coming Soon',
      icon: <TrendingUp className="w-6 h-6 text-[#9A7048]" />,
      bgColor: 'bg-white',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF3] flex flex-col">
      <AppHeader />

      <div className="flex flex-1">
        {/* Dedicated Sidebar */}
        <FarmerSidebar />

        {/* Dashboard Main Content */}
        <main className="flex-1 p-6 md:p-8 space-y-8 max-w-7xl">
          {/* Welcome Banner */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-[#EEF5E8] via-[#F8FAF3] to-[#FFF8E8] border border-[#DCECCF] shadow-sm space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white text-[#3F7D3A] text-xs font-bold border border-[#DCECCF]">
              <Sprout className="w-4 h-4" />
              <span>Namaste, {profile.name}! • नमस्ते</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#285C32]">
              Good morning! Let's check your farm.
            </h1>
            <p className="text-sm text-[#667267]">
              Here is your farm overview and active agricultural intelligence tools for {profile.village}, {profile.district}.
            </p>
          </div>

          {/* Farm Profile Summary Card */}
          <div className="p-6 rounded-3xl bg-white border border-[#3F7D3A]/15 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h2 className="text-lg font-black text-[#285C32]">Your Farm Profile</h2>
              <Link href="/app" className="text-xs font-bold text-[#3F7D3A] hover:underline">
                Edit Profile
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#F8FAF3] border border-stone-200">
                <span className="text-[#667267] font-semibold block">Location</span>
                <span className="font-extrabold text-[#285C32] block mt-0.5">{profile.village}, {profile.district}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F8FAF3] border border-stone-200">
                <span className="text-[#667267] font-semibold block">State</span>
                <span className="font-extrabold text-[#285C32] block mt-0.5">{profile.state}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F8FAF3] border border-stone-200">
                <span className="text-[#667267] font-semibold block">Main Crop</span>
                <span className="font-extrabold text-[#3F7D3A] block mt-0.5">{profile.mainCrop}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F8FAF3] border border-stone-200">
                <span className="text-[#667267] font-semibold block">Land Size</span>
                <span className="font-extrabold text-[#285C32] block mt-0.5">{profile.landSize} {profile.landUnit}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F8FAF3] border border-stone-200">
                <span className="text-[#667267] font-semibold block">Irrigation</span>
                <span className="font-extrabold text-[#285C32] block mt-0.5">{profile.irrigation}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F8FAF3] border border-stone-200">
                <span className="text-[#667267] font-semibold block">Language</span>
                <span className="font-extrabold text-[#285C32] block mt-0.5">{profile.language}</span>
              </div>
            </div>
          </div>

          {/* Module Action Cards Grid */}
          <div>
            <h2 className="text-xl font-black text-[#285C32] mb-4">
              Farmer Action Modules
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MODULE_CARDS.map((card, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-white border border-[#3F7D3A]/12 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-[#3F7D3A]/30 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-2xl bg-[#EEF5E8]">
                        {card.icon}
                      </div>
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-[#FFF8E8] text-[#9A7048] border border-[#E8B94A]/30">
                        {card.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-[#285C32] mb-1">{card.title}</h3>
                    <p className="text-xs font-bold text-[#3F7D3A] mb-2">{card.subtitle}</p>
                    <p className="text-xs text-[#667267] leading-relaxed mb-6">{card.desc}</p>
                  </div>

                  <Link href={card.href} className="pt-3 border-t border-stone-100">
                    <Button variant="secondary" size="sm" className="w-full justify-between" icon={<ArrowRight className="w-4 h-4" />}>
                      <span>{card.actionText}</span>
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Product Transparency Notice */}
          <div className="p-4 rounded-2xl bg-white border border-[#E8B94A]/40 text-xs text-[#667267] flex items-start gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 text-[#E8B94A] shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-[#285C32] block">Product Transparency Principle:</strong>
              Annadata is under progressive product development. Modules marked with "Demo / Sample Data" or "Coming Soon" indicate upcoming service integrations.
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
