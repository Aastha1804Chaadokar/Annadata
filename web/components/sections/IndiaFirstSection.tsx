'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Layers, SunMedium, CloudLightning, Mountain, Globe2, Check } from 'lucide-react';

export const IndiaFirstSection: React.FC = () => {
  const { t } = useTranslation();

  const DIVERSITY_CARDS = [
    {
      title: 'Cropping Cycles',
      items: ['Kharif (Monsoon)', 'Rabi (Winter)', 'Zaid (Summer)'],
      icon: <SunMedium className="w-5 h-5 text-[#D8B45A]" />,
      desc: 'Aligned with India’s agricultural seasons and regional sowing calendars.',
    },
    {
      title: 'Indian Soil Diversity',
      items: ['Black Cotton Soil', 'Alluvial Soil', 'Red & Laterite', 'Clay Loam'],
      icon: <Layers className="w-5 h-5 text-[#8C6239]" />,
      desc: 'Tailored nutrient interpretation thresholds across major agro-ecological zones.',
    },
    {
      title: 'Agro-Climatic Regions',
      items: ['Indo-Gangetic Plains', 'Deccan Plateau', 'Coastal Belts', 'Arid West'],
      icon: <Mountain className="w-5 h-5 text-[#3F7D3A]" />,
      desc: 'Micro-climate rainfall and temperature telemetry for distinct geographic zones.',
    },
    {
      title: 'Multilingual Reach',
      items: ['Hindi', 'Marathi', 'Bengali', 'Tamil', 'Telugu', 'Kannada'],
      icon: <Globe2 className="w-5 h-5 text-[#173F2A]" />,
      desc: 'Full UI and voice AI accessibility in 7 Indian vernacular languages.',
    },
  ];

  return (
    <section className="py-24 bg-white border-y border-[#173F2A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EEF5E8] text-[#173F2A] text-xs font-bold uppercase tracking-wider">
            <span>{t('india.eyebrow', 'INDIA-FIRST AGRONOMY')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#173F2A] tracking-tight">
            {t('india.heading', 'Built for the diversity of Indian farms.')}
          </h2>
          <p className="text-sm sm:text-base text-[#5F6F62] font-medium">
            {t(
              'india.subheading',
              'Indian agriculture spans 15 distinct agro-climatic zones, hundreds of soil variations, and deep regional traditions. Annadata is architected from the ground up for Indian farming realities.'
            )}
          </p>
        </div>

        {/* Diversity Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DIVERSITY_CARDS.map((card, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-[#F7F6F0] border border-[#173F2A]/10 shadow-xs hover:border-[#3F7D3A]/40 transition-colors space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-xs">
                  {card.icon}
                </div>
                <h3 className="text-base font-bold text-[#17201A]">
                  {card.title}
                </h3>
                <p className="text-xs text-[#5F6F62] leading-relaxed">
                  {card.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-[#173F2A]/10 space-y-1.5">
                {card.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="flex items-center gap-2 text-xs font-semibold text-[#173F2A]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3F7D3A]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
