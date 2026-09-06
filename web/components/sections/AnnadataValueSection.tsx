'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { 
  Sprout, 
  FlaskConical, 
  CloudSun, 
  MapPin, 
  Bot, 
  ShoppingCart, 
  ArrowRight,
  Layers
} from 'lucide-react';

export const AnnadataValueSection: React.FC = () => {
  const { t } = useTranslation();

  const MODULES = [
    {
      icon: <MapPin className="w-5 h-5 text-[#8D5B4C]" />,
      title: '📍 Farm Location',
      desc: 'Pinpoint farm land boundaries and identify agro-climatic zones.',
      href: '/farm-location',
    },
    {
      icon: <FlaskConical className="w-5 h-5 text-[#285C32]" />,
      title: '🌱 Soil Health',
      desc: 'Digitize soil test cards, check NPK levels & get soil management advice.',
      href: '/soil-health',
    },
    {
      icon: <Sprout className="w-5 h-5 text-[#3F7D3A]" />,
      title: '🌾 Crop Recommendation',
      desc: 'AI crop suitability tailored to your land, season, soil and water.',
      href: '/crop-recommendation',
    },
    {
      icon: <CloudSun className="w-5 h-5 text-[#3A6B7C]" />,
      title: '🌦 Weather',
      desc: 'Hyper-local 7-day rain forecasts, temperature & spray advisories.',
      href: '/weather',
    },
    {
      icon: <Bot className="w-5 h-5 text-[#1E3A8A]" />,
      title: '🤖 AI Agricultural Assistant',
      desc: 'Ask questions in your native language for instant farming guidance.',
      href: '/ai-assistant',
    },
    {
      icon: <ShoppingCart className="w-5 h-5 text-[#854D0E]" />,
      title: '🛒 Buy & Sell Marketplace',
      desc: 'Check live mandi prices and connect directly with verified buyers.',
      href: '/market',
    },
  ];

  return (
    <section id="features" className="py-16 sm:py-20 bg-white text-[#17201A] border-b border-[#E5EAD9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E5EDE0] text-[#285C32] text-xs font-bold uppercase tracking-wider border border-[#D2E0CA]">
            <Layers className="w-3.5 h-3.5 text-[#3F7D3A]" />
            <span>CONNECTED PLATFORM</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-[#1F4529] tracking-tight">
            One Platform. Every Farming Decision.
          </h2>

          <p className="text-sm sm:text-base text-[#526350] max-w-2xl mx-auto leading-relaxed font-normal">
            From understanding your soil to choosing a crop, protecting it and finding the right market — Annadata brings the farming journey together.
          </p>
        </div>

        {/* 6-Card Compact Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {MODULES.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="bg-[#FBFDF8] rounded-2xl p-5 border border-[#DCE4D4] shadow-xs hover:shadow-md hover:bg-white hover:border-[#285C32]/50 transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-[#DEE7D4] shadow-2xs">
                  {item.icon}
                </div>

                <h3 className="text-base sm:text-lg font-black text-[#1F4529] group-hover:text-[#2E7D32] transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-[#556353] leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-3.5 mt-3.5 border-t border-stone-100 flex items-center text-xs font-bold text-[#2E7D32] group-hover:translate-x-0.5 transition-transform gap-1">
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};
