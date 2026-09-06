'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sprout, Sparkles } from 'lucide-react';

export const SmarterAgricultureSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="py-12 sm:py-16 bg-[#173F2A] text-white border-y border-[#285C32] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-32 bg-[#3F7D3A]/25 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#D8B45A] text-xs font-bold uppercase tracking-widest border border-white/15">
          <Sparkles className="w-3.5 h-3.5 text-[#D8B45A]" />
          <span>OUR MISSION</span>
        </div>

        {/* Section Heading */}
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
          SMARTER AGRICULTURE FOR INDIA
        </h2>

        {/* Core Message Text */}
        <p className="text-base sm:text-lg text-white/90 leading-relaxed font-medium max-w-3xl mx-auto">
          Farming comes with uncertainty at every step. Annadata brings soil, crop, weather, location, AI insights and market opportunities together to help farmers make better decisions.
        </p>

      </div>
    </section>
  );
};
