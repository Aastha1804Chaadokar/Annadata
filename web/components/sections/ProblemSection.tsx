'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { HelpCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const ProblemSection: React.FC = () => {
  const { t } = useTranslation();

  const QUESTIONS = [
    {
      num: '01',
      question: 'What should I grow this season?',
      context: 'Choosing between soybean, gram, or wheat without knowing upcoming monsoon forecast or market prices.',
      solution: 'Crop Recommendation Engine',
      href: '/app/crop-recommendation',
    },
    {
      num: '02',
      question: 'Is my soil healthy enough for high yield?',
      context: 'Unclear NPK ratios and soil pH lead to excessive or insufficient fertilizer spending.',
      solution: 'Soil Health Digitizer',
      href: '/app/soil',
    },
    {
      num: '03',
      question: 'When is the safest time to sow and spray?',
      context: 'Unannounced rainfall washes away freshly sprayed pesticides and expensive seeds.',
      solution: 'Micro-Climate Telemetry',
      href: '/app/weather',
    },
    {
      num: '04',
      question: 'Will the upcoming weather support my crop cycle?',
      context: 'Changes in temperature and humidity drastically impact flowering and pest emergence.',
      solution: 'Agro-Meteorology Forecasts',
      href: '/app/weather',
    },
    {
      num: '05',
      question: 'Where is my farm located relative to agro-climatic zones?',
      context: 'Different soil belts and groundwater depths require distinct agricultural inputs.',
      solution: 'GPS Farm Geocoding',
      href: '/farm-location',
    },
    {
      num: '06',
      question: 'What crop is genuinely suitable for my specific land?',
      context: 'Matching black clay loam vs. sandy soil with rainfed or canal irrigation capacity.',
      solution: 'Agronomic Suitability Model',
      href: '/app/crop-recommendation',
    },
  ];

  return (
    <section className="py-28 bg-[#173F2A] text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#3F7D3A]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D8B45A]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="max-w-3xl mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#D8B45A] text-xs font-bold uppercase tracking-widest border border-white/10">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FARMER UNCERTAINTIES</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Every farming decision starts with a question.
          </h2>

          <p className="text-base sm:text-lg text-white/75 leading-relaxed font-normal">
            Farmers invest their life savings and months of hard labor every season. Annadata resolves the most critical questions before the seed is sown.
          </p>
        </div>

        {/* Editorial Question Mosaic */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {QUESTIONS.map((item) => (
            <div
              key={item.num}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col justify-between hover:bg-white/10 hover:border-[#D8B45A]/40 transition-all duration-300 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black tracking-widest text-[#D8B45A]">
                    {item.num}
                  </span>
                  <span className="text-[11px] font-bold text-white/50 group-hover:text-white/80 transition-colors uppercase">
                    {item.solution}
                  </span>
                </div>

                <h3 className="text-xl font-black text-white group-hover:text-[#D8B45A] transition-colors leading-snug">
                  "{item.question}"
                </h3>

                <p className="text-xs text-white/70 leading-relaxed font-normal">
                  {item.context}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10">
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D8B45A] hover:text-white transition-colors"
                >
                  <span>See How Annadata Solves This</span>
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
