'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Beaker, Sprout, CloudSun, Camera, MessageSquare, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';

export const FeaturesGrid: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="features" className="py-24 bg-[#F7F6F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EEF5E8] text-[#173F2A] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#3F7D3A]" />
            <span>{t('features.eyebrow', 'PLATFORM FEATURES')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#173F2A] tracking-tight">
            {t('features.heading', 'Built for every stage of cultivation.')}
          </h2>
          <p className="text-sm sm:text-base text-[#5F6F62] font-medium">
            {t('features.subheading', 'Six integrated agronomic modules designed specifically for Indian farming realities.')}
          </p>
        </div>

        {/* Varied Visual Rhythm Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* FEATURE 1: Large Featured Card — Soil Health (7 cols) */}
          <div className="md:col-span-7 bg-white rounded-3xl p-8 border border-[#173F2A]/10 shadow-sm flex flex-col justify-between overflow-hidden relative group">
            <div className="space-y-4 relative z-10 max-w-md">
              <div className="w-12 h-12 rounded-2xl bg-[#EEF5E8] flex items-center justify-center text-[#173F2A]">
                <Beaker className="w-6 h-6 text-[#3F7D3A]" />
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#D8B45A] block">
                01 • Soil Intelligence
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#17201A]">
                {t('features.soilTitle', 'Soil Health Card & Nutrient Analysis')}
              </h3>
              <p className="text-xs sm:text-sm text-[#5F6F62] leading-relaxed">
                {t(
                  'features.soilDesc',
                  'Understand your soil through laboratory Soil Health Card parameters (N, P, K, pH, Organic Carbon) with ICAR agronomic interpretations.'
                )}
              </p>
              <div className="pt-2">
                <Link
                  href="/app/soil"
                  className="inline-flex items-center gap-2 text-xs font-extrabold text-[#173F2A] hover:text-[#3F7D3A] transition-colors"
                >
                  <span>{t('common.learnMore', 'Analyze Your Soil')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="relative mt-6 rounded-2xl overflow-hidden aspect-[16/9] w-full border border-stone-100">
              <Image
                src="/assets/soil-health.jpg"
                alt="Soil health testing"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center img-zoom"
              />
            </div>
          </div>

          {/* FEATURE 2: Medium Card — Weather (5 cols) */}
          <div className="md:col-span-5 bg-[#173F2A] text-white rounded-3xl p-8 shadow-sm flex flex-col justify-between overflow-hidden relative group">
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-[#D8B45A]">
                <CloudSun className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#D8B45A] block">
                02 • Weather Telemetry
              </span>
              <h3 className="text-2xl font-black text-white">
                {t('features.weatherTitle', 'Micro-Climate Telemetry & Farm Advisories')}
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                {t(
                  'features.weatherDesc',
                  'Live precipitation probabilities, wind speed alerts for spraying, and 7-day agricultural forecasts matching your exact farm GPS coordinates.'
                )}
              </p>
              <div className="pt-2">
                <Link
                  href="/app/weather"
                  className="inline-flex items-center gap-2 text-xs font-extrabold text-[#D8B45A] hover:text-white transition-colors"
                >
                  <span>{t('common.checkWeather', 'View Farm Weather')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="relative mt-6 rounded-2xl overflow-hidden aspect-[16/10] w-full border border-white/10">
              <Image
                src="/assets/weather-farm.jpg"
                alt="Farm weather sky"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover object-center img-zoom"
              />
            </div>
          </div>

          {/* FEATURE 3: Large Card — Crop Recommendation (6 cols) */}
          <div className="md:col-span-6 bg-white rounded-3xl p-8 border border-[#173F2A]/10 shadow-sm flex flex-col justify-between overflow-hidden relative group">
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF7EE] flex items-center justify-center text-[#173F2A]">
                <Sprout className="w-6 h-6 text-[#D8B45A]" />
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#D8B45A] block">
                03 • Crop Engine
              </span>
              <h3 className="text-2xl font-black text-[#17201A]">
                {t('features.cropTitle', 'Season & Soil Crop Recommendations')}
              </h3>
              <p className="text-xs sm:text-sm text-[#5F6F62] leading-relaxed">
                {t(
                  'features.cropDesc',
                  'Find crops suited to your soil nutrients, season (Kharif, Rabi, Zaid), irrigation type, and rotation history with clear agronomic reasoning.'
                )}
              </p>
              <div className="pt-2">
                <Link
                  href="/app/crop-recommendation"
                  className="inline-flex items-center gap-2 text-xs font-extrabold text-[#173F2A] hover:text-[#3F7D3A] transition-colors"
                >
                  <span>{t('common.findCrops', 'Get Crop Advice')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="relative mt-6 rounded-2xl overflow-hidden aspect-[16/9] w-full border border-stone-100">
              <Image
                src="/assets/crop-field.jpg"
                alt="Healthy crop rows"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center img-zoom"
              />
            </div>
          </div>

          {/* FEATURE 4, 5, 6: 3 Balanced Cards (6 cols split into 3 cards or grid) */}
          <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* FEATURE 4: Crop Health */}
            <div className="bg-white rounded-3xl p-6 border border-[#173F2A]/10 shadow-sm flex flex-col justify-between space-y-3">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#EEF5E8] flex items-center justify-center text-[#173F2A]">
                  <Camera className="w-5 h-5 text-[#3F7D3A]" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#5F6F62] block">
                  04 • Diagnostics
                </span>
                <h4 className="text-lg font-bold text-[#17201A]">
                  {t('features.healthTitle', 'Crop Health Leaf Diagnostics')}
                </h4>
                <p className="text-xs text-[#5F6F62] leading-relaxed">
                  Identify visible leaf spots, yellow mosaic patterns, and pests with bio/chemical remedy guidance.
                </p>
              </div>
              <Link
                href="/app/crop-health"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#173F2A] hover:text-[#3F7D3A]"
              >
                <span>Diagnose Crop</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* FEATURE 5: Ask Annadata Voice AI */}
            <div className="bg-white rounded-3xl p-6 border border-[#173F2A]/10 shadow-sm flex flex-col justify-between space-y-3">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#EEF5E8] flex items-center justify-center text-[#173F2A]">
                  <MessageSquare className="w-5 h-5 text-[#3F7D3A]" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#5F6F62] block">
                  05 • AI Voice
                </span>
                <h4 className="text-lg font-bold text-[#17201A]">
                  {t('features.assistantTitle', 'Ask Annadata Voice AI')}
                </h4>
                <p className="text-xs text-[#5F6F62] leading-relaxed">
                  Speak agricultural queries in your local Indian language and listen to spoken farmer advice.
                </p>
              </div>
              <Link
                href="/app/assistant"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#173F2A] hover:text-[#3F7D3A]"
              >
                <span>Ask Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* FEATURE 6: Mandi Market Rates (Spans 2 cols) */}
            <div className="sm:col-span-2 bg-[#FAF7EE] rounded-3xl p-6 border border-[#D8B45A]/30 shadow-sm flex items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#173F2A]" />
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#173F2A]">
                    06 • Market Intelligence
                  </span>
                </div>
                <h4 className="text-base font-bold text-[#17201A]">
                  {t('features.marketTitle', 'Live Mandi Crop Rates & MSP Benchmarks')}
                </h4>
                <p className="text-xs text-[#5F6F62]">
                  Track modal prices, arrival volume, and MSP support for soybean, wheat, mustard, and gram.
                </p>
              </div>
              <Link href="/app/market">
                <Button variant="primary" size="sm">
                  View Rates
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
