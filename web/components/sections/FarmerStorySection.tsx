'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { Heart, Sprout } from 'lucide-react';

export const FarmerStorySection: React.FC = () => {
  const { t } = useTranslation();

  const STORIES = [
    {
      theme: 'Soil Balance',
      quote:
        'Understanding soil pH and N-P-K before applying fertilizer prevents burning crops and reduces input costs significantly.',
      region: 'Malwa Region, Madhya Pradesh',
      crop: 'Soybean & Wheat Rotation',
    },
    {
      theme: 'Timely Spraying',
      quote:
        'Checking real-time wind speed and 24-hour rainfall probabilities stops expensive bio-sprays from washing away.',
      region: 'Vidarbha, Maharashtra',
      crop: 'Cotton & Pulses',
    },
    {
      theme: 'Crop Selection',
      quote:
        'Choosing drought-tolerant pulses during dry seasons protects farmer livelihood and builds long-term soil organic carbon.',
      region: 'Bundelkhand, Uttar Pradesh',
      crop: 'Gram & Mustard',
    },
  ];

  return (
    <section className="py-24 bg-[#F7F6F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EEF5E8] text-[#173F2A] text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 text-[#3F7D3A]" />
            <span>{t('story.eyebrow', 'AGRICULTURAL GROUND REALITY')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#173F2A] tracking-tight">
            {t('story.heading', 'Every field has a story.')}
          </h2>
          <p className="text-sm sm:text-base text-[#5F6F62] font-medium">
            {t(
              'story.subheading',
              'Indian farming is built on dedication, land wisdom, and seasonal resilience. Annadata stands alongside farmers with modern science.'
            )}
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STORIES.map((story, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-white border border-[#173F2A]/10 shadow-xs flex flex-col justify-between space-y-6 hover:border-[#3F7D3A]/40 transition-colors"
            >
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full bg-[#FAF7EE] text-[#173F2A] font-extrabold text-[11px] border border-[#D8B45A]/30">
                  {story.theme}
                </span>
                <p className="text-sm sm:text-base font-bold text-[#17201A] leading-relaxed italic">
                  "{story.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                <div>
                  <strong className="text-[#173F2A] block">{story.region}</strong>
                  <span className="text-[#5F6F62] text-[11px]">{story.crop}</span>
                </div>
                <Sprout className="w-5 h-5 text-[#3F7D3A]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
