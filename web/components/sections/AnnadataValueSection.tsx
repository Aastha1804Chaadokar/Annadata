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
  CheckCircle2
} from 'lucide-react';

export const AnnadataValueSection: React.FC = () => {
  const { t } = useTranslation();

  const MODULES = [
    {
      icon: <FlaskConical className="w-5 h-5 text-[#285C32]" />,
      title: '🌱 Soil Health',
      label: 'Soil Health',
      tag: 'Digitizer & Chemistry',
      desc: 'Upload laboratory soil cards, digitize NPK & pH levels, and get precise soil health advice.',
      href: '/soil-health',
      appHref: '/app/soil',
    },
    {
      icon: <Sprout className="w-5 h-5 text-[#3F7D3A]" />,
      title: '🌾 Crop Recommendations',
      label: 'Crop Suitability',
      tag: 'AI Agronomy',
      desc: 'Scientific crop suggestions tailored to your soil type, season, water capacity, and market.',
      href: '/crop-recommendation',
      appHref: '/app/crop-recommendation',
    },
    {
      icon: <CloudSun className="w-5 h-5 text-[#3A6B7C]" />,
      title: '🌦 Weather Insights',
      label: 'Weather Guidance',
      tag: 'Agro-Meteorology',
      desc: 'Hyper-local 7-day forecast with temperature, rain probability, humidity, and spraying windows.',
      href: '/weather',
      appHref: '/app/weather',
    },
    {
      icon: <MapPin className="w-5 h-5 text-[#8D5B4C]" />,
      title: '📍 Farm Location',
      label: 'Farm Geocoding',
      tag: 'Land Telemetry',
      desc: 'Pinpoint your exact farm boundaries with GPS coordinates and regional agro-climatic zoning.',
      href: '/farm-location',
      appHref: '/app/farm-location',
    },
    {
      icon: <Bot className="w-5 h-5 text-[#1E3A8A]" />,
      title: '🤖 AI Agricultural Assistant',
      label: 'AI Assistant',
      tag: 'Voice & Multilingual',
      desc: 'Ask questions by voice or text in 7 Indian languages for instant farming guidance and diagnosis.',
      href: '/ai-assistant',
      appHref: '/app/assistant',
    },
    {
      icon: <ShoppingCart className="w-5 h-5 text-[#854D0E]" />,
      title: '🛒 Buy & Sell Marketplace',
      label: 'Direct Mandi',
      tag: 'Market Linkage',
      desc: 'List crops, check live mandi rates, and connect directly with verified buyers across India.',
      href: '/market',
      appHref: '/app/market',
    },
  ];

  return (
    <section id="benefits" className="py-16 sm:py-20 bg-[#F7F9F3] text-[#17201A] border-b border-[#E3E8D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E5ECE0] text-[#285C32] text-xs font-bold uppercase tracking-wider border border-[#D3DEC9]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#3F7D3A]" />
            <span>{t('value.badge', 'Unified Platform')}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-[#1F4529] tracking-tight">
            {t('value.heading', 'One platform for better decisions throughout your farming journey.')}
          </h2>

          <p className="text-xs sm:text-sm text-[#586857] max-w-xl mx-auto leading-relaxed">
            {t(
              'value.subtitle',
              'All essential agricultural intelligence and tools combined into a simple, farmer-friendly experience.'
            )}
          </p>
        </div>

        {/* 6-Card Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MODULES.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-[#DCE4D4] shadow-xs hover:shadow-md hover:border-[#285C32]/40 transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#F0F5EB] flex items-center justify-center border border-[#DEE7D4]">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-bold text-[#586857] uppercase tracking-wider bg-[#F5F7F1] px-2.5 py-0.5 rounded-full border border-[#E2E8DC]">
                    {item.tag}
                  </span>
                </div>

                <h3 className="text-lg font-black text-[#1F4529] group-hover:text-[#2E7D32] transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-[#586857] leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                <Link
                  href={item.href}
                  className="text-xs font-bold text-[#2E7D32] hover:text-[#1F4529] inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Explore Feature</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
