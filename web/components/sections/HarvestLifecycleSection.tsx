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
      desc: 'Understand soil, location and season.',
      icon: <Compass className="w-5 h-5 text-[#285C32]" />,
    },
    {
      step: '2',
      name: 'SOW',
      desc: 'Choose the right crop.',
      icon: <Sprout className="w-5 h-5 text-[#3F7D3A]" />,
    },
    {
      step: '3',
      name: 'GROW',
      desc: 'Monitor crop and weather.',
      icon: <SunMedium className="w-5 h-5 text-[#D8B45A]" />,
    },
    {
      step: '4',
      name: 'PROTECT',
      desc: 'Get timely farming insights.',
      icon: <ShieldCheck className="w-5 h-5 text-[#3A6B7C]" />,
    },
    {
      step: '5',
      name: 'HARVEST',
      desc: 'Prepare for harvest.',
      icon: <Tractor className="w-5 h-5 text-[#8D5B4C]" />,
    },
    {
      step: '6',
      name: 'SELL',
      desc: 'Find better market opportunities.',
      icon: <BadgeDollarSign className="w-5 h-5 text-[#1F4529]" />,
    },
  ];

  return (
    <section className="py-14 sm:py-18 bg-white text-[#17201A] border-b border-[#E3E8D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-2.5 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF2E5] text-[#285C32] text-xs font-bold uppercase tracking-wider border border-[#D5E4CC]">
            <Sparkles className="w-3.5 h-3.5 text-[#3F7D3A]" />
            <span>AGRICULTURAL LIFECYCLE</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-[#1F4529] tracking-tight">
            From Seed to Harvest
          </h2>

          {/* Simple Flow Summary Tag */}
          <div className="pt-1 text-xs font-extrabold text-[#2E7D32] tracking-wider uppercase">
            PLAN → SOW → GROW → PROTECT → HARVEST → SELL
          </div>
        </div>

        {/* 6 Step Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 relative">
          {STEPS.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl p-4 sm:p-5 border border-[#DCE4D4] bg-[#FBFDF8] hover:bg-white hover:shadow-md transition-all duration-200 relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F0F5EB] flex items-center justify-center border border-[#DEE7D4]">
                    {item.icon}
                  </div>
                  <span className="w-5 h-5 rounded-full bg-[#1F4529] text-white text-[11px] font-black flex items-center justify-center">
                    {item.step}
                  </span>
                </div>

                <div className="font-black text-sm uppercase tracking-wider text-[#1F4529] mb-1">
                  {item.name}
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
