'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Beaker, Sprout, CloudSun, Sparkles, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';

export const WhySection: React.FC = () => {
  const { t } = useTranslation();

  const PILLARS = [
    {
      title: t('why.soilTitle', 'Soil Intelligence'),
      desc: t('why.soilDesc', 'Understand N-P-K balances, pH levels, and organic carbon based on ICAR standards.'),
      icon: <Beaker className="w-5 h-5 text-[#3F7D3A]" />,
    },
    {
      title: t('why.locationTitle', 'Location-Aware Guidance'),
      desc: t('why.locationDesc', 'GPS detection and district-level agro-climatic mapping tailored for your village.'),
      icon: <MapPin className="w-5 h-5 text-[#3F7D3A]" />,
    },
    {
      title: t('why.weatherTitle', 'Micro-Climate Weather'),
      desc: t('why.weatherDesc', 'Rain probabilities, foliar spraying advisories, and irrigation hold alerts.'),
      icon: <CloudSun className="w-5 h-5 text-[#3F7D3A]" />,
    },
    {
      title: t('why.cropTitle', 'Crop Recommendations'),
      desc: t('why.cropDesc', 'Kharif, Rabi, and Zaid crop matching with crop rotation and water needs.'),
      icon: <Sprout className="w-5 h-5 text-[#3F7D3A]" />,
    },
  ];

  return (
    <section className="py-24 bg-[#F7F6F0] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* LEFT: Authentic Photography Card (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white aspect-[4/5] w-full">
              <Image
                src="/assets/soil-health.jpg"
                alt="Farmer holding fertile agricultural soil"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center img-zoom"
                quality={92}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#173F2A]/80 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <span className="px-3 py-1 rounded-full bg-[#D8B45A] text-[#17201A] font-extrabold text-xs uppercase tracking-wider">
                  Soil to Harvest
                </span>
                <h3 className="text-xl font-bold leading-snug">
                  "Good decisions begin in the soil."
                </h3>
                <p className="text-xs text-stone-200">
                  Annadata bridges laboratory soil science with everyday farm decisions.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Editorial Content & Value Pillars (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EEF5E8] border border-[#173F2A]/10 text-[#173F2A] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#3F7D3A]" />
                <span>{t('why.eyebrow', 'WHY ANNADATA')}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#173F2A] tracking-tight leading-tight">
                {t('why.heading', 'Technology that understands the farm.')}
              </h2>
              <p className="text-sm sm:text-base text-[#5F6F62] leading-relaxed font-medium">
                {t(
                  'why.subheading',
                  'From soil and weather to crops and markets, Annadata brings important farming information together in one simple place.'
                )}
              </p>
            </div>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PILLARS.map((pillar, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white border border-[#173F2A]/10 shadow-xs hover:border-[#3F7D3A]/40 transition-colors space-y-2"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#EEF5E8] flex items-center justify-center">
                    {pillar.icon}
                  </div>
                  <h4 className="text-sm font-bold text-[#17201A]">
                    {pillar.title}
                  </h4>
                  <p className="text-xs text-[#5F6F62] leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link href="/how-it-works">
                <Button variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
                  {t('why.learnHow', 'See How Annadata Works')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
