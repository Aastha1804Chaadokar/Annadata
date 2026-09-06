'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Compass, 
  Sprout, 
  SunMedium, 
  ShieldCheck, 
  Tractor, 
  BadgeDollarSign, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const HarvestLifecycleSection: React.FC = () => {
  const { t } = useTranslation();

  const STEPS = [
    {
      step: '1',
      name: 'PLAN',
      title: '1. PLAN',
      desc: 'Understand soil, location, season and crop options.',
      icon: <Compass className="w-5 h-5 text-[#285C32]" />,
      color: 'border-[#285C32]/30 bg-[#285C32]/5',
    },
    {
      step: '2',
      name: 'SOW',
      title: '2. SOW',
      desc: 'Choose the right crop and plan cultivation.',
      icon: <Sprout className="w-5 h-5 text-[#3F7D3A]" />,
      color: 'border-[#3F7D3A]/30 bg-[#3F7D3A]/5',
    },
    {
      step: '3',
      name: 'GROW',
      title: '3. GROW',
      desc: 'Monitor soil, weather and crop conditions.',
      icon: <SunMedium className="w-5 h-5 text-[#D8B45A]" />,
      color: 'border-[#D8B45A]/30 bg-[#D8B45A]/5',
    },
    {
      step: '4',
      name: 'PROTECT',
      title: '4. PROTECT',
      desc: 'Get timely agricultural insights and recommendations.',
      icon: <ShieldCheck className="w-5 h-5 text-[#3A6B7C]" />,
      color: 'border-[#3A6B7C]/30 bg-[#3A6B7C]/5',
    },
    {
      step: '5',
      name: 'HARVEST',
      title: '5. HARVEST',
      desc: 'Prepare for harvesting and market opportunities.',
      icon: <Tractor className="w-5 h-5 text-[#8D5B4C]" />,
      color: 'border-[#8D5B4C]/30 bg-[#8D5B4C]/5',
    },
    {
      step: '6',
      name: 'SELL',
      title: '6. SELL',
      desc: 'Connect with buyers and make better selling decisions.',
      icon: <BadgeDollarSign className="w-5 h-5 text-[#1F4529]" />,
      color: 'border-[#1F4529]/30 bg-[#1F4529]/5',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white text-[#17201A] border-b border-[#E3E8D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EBF2E5] text-[#285C32] text-xs font-bold uppercase tracking-wider border border-[#D5E4CC]">
            <Sparkles className="w-3.5 h-3.5 text-[#3F7D3A]" />
            <span>{t('lifecycle.badge', 'Harvest Lifecycle')}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-[#1F4529] tracking-tight">
            {t('lifecycle.heading', 'From Seed to Harvest')}
          </h2>

          <p className="text-xs sm:text-sm text-[#586857] max-w-xl mx-auto leading-relaxed">
            {t(
              'lifecycle.subtitle',
              'A complete agricultural roadmap guiding you with actionable intelligence at each phase.'
            )}
          </p>
        </div>

        {/* Compact Horizontal / Responsive Step Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 relative">
          {STEPS.map((item, index) => (
            <div
              key={index}
              className={`rounded-2xl p-4 sm:p-5 border transition-all duration-200 hover:shadow-md relative flex flex-col justify-between ${item.color} bg-white`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F4F7EE] flex items-center justify-center border border-[#DEE7D4]">
                    {item.icon}
                  </div>
                  <span className="w-6 h-6 rounded-full bg-[#1F4529] text-white text-xs font-black flex items-center justify-center">
                    {item.step}
                  </span>
                </div>

                <div className="font-black text-sm uppercase tracking-wider text-[#1F4529] mb-1">
                  {item.title}
                </div>

                <p className="text-xs text-[#556353] leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {index < STEPS.length - 1 && (
                <div className="hidden xl:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-[#285C32]/40">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
