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
      icon: <MapPin className="w-5 h-5 text-[#8D5B4C]" />,
      title: '📍 Farm Location',
      desc: 'Pinpoint farm land boundaries and identify agro-climatic zones.',
      href: '/farm-location',
    },
    {
      icon: <Bot className="w-5 h-5 text-[#1E3A8A]" />,
      title: '🤖 AI Assistant',
      desc: 'Ask questions in your native language for instant farming guidance.',
      href: '/ai-assistant',
    },
    {
      icon: <ShoppingCart className="w-5 h-5 text-[#854D0E]" />,
      title: '🛒 Marketplace',
      desc: 'Check live mandi prices and connect directly with verified buyers.',
      href: '/market',
    },
  ];

  return (
    <section id="features" className="py-14 sm:py-18 bg-[#F7F9F3] text-[#17201A] border-b border-[#E3E8D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-2.5 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5ECE0] text-[#285C32] text-xs font-bold uppercase tracking-wider border border-[#D3DEC9]">
            <Layers className="w-3.5 h-3.5 text-[#3F7D3A]" />
            <span>ANNADATA PLATFORM</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-[#1F4529] tracking-tight">
            Annadata Features
          </h2>

          <p className="text-xs sm:text-sm text-[#586857] max-w-md mx-auto">
            Practical, easy-to-use tools designed for every stage of your harvest.
          </p>
        </div>

        {/* 6-Card Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {MODULES.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="bg-white rounded-2xl p-5 border border-[#DCE4D4] shadow-xs hover:shadow-md hover:border-[#285C32]/50 transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="space-y-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#F0F5EB] flex items-center justify-center border border-[#DEE7D4]">
                  {item.icon}
                </div>

                <h3 className="text-base font-black text-[#1F4529] group-hover:text-[#2E7D32] transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-[#586857] leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-stone-100 flex items-center text-xs font-bold text-[#2E7D32] group-hover:translate-x-0.5 transition-transform gap-1">
                <span>Open Feature</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};
