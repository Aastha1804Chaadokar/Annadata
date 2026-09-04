'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { CloudSun, CloudRain, Thermometer, Wind, Droplets, ArrowRight, AlertTriangle } from 'lucide-react';

export const WeatherSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="weather" className="py-24 bg-white border-y border-[#173F2A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* LEFT: Section Description (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EEF5E8] text-[#173F2A] text-xs font-bold uppercase tracking-wider">
              <CloudSun className="w-3.5 h-3.5 text-[#3F7D3A]" />
              <span>{t('weather.eyebrow', 'MICRO-CLIMATE TELEMETRY')}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#173F2A] tracking-tight leading-tight">
              {t('weather.heading', 'Let weather guide your daily farm decisions.')}
            </h2>

            <p className="text-sm sm:text-base text-[#5F6F62] leading-relaxed font-medium">
              {t(
                'weather.subheading',
                'Avoid wasted chemical sprays and prevent over-irrigation. Annadata connects directly to Open-Meteo telemetry based on your farm coordinates to deliver practical field advisories.'
              )}
            </p>

            <div className="space-y-2.5">
              <div className="p-3 bg-[#F7F6F0] rounded-2xl border border-[#173F2A]/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#3F7D3A] shadow-xs">
                  <Droplets className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <strong className="text-[#17201A] block">Irrigation Advisory</strong>
                  <span className="text-[#5F6F62]">Hold water if rain &gt;60% expected in next 48 hours.</span>
                </div>
              </div>

              <div className="p-3 bg-[#F7F6F0] rounded-2xl border border-[#173F2A]/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#D8B45A] shadow-xs">
                  <Wind className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <strong className="text-[#17201A] block">Foliar Spray Advisory</strong>
                  <span className="text-[#5F6F62]">Avoid pesticide spray when wind speed exceeds 18 km/h.</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/app/weather">
                <Button variant="primary" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                  {t('weather.checkForecast', 'Check Farm Weather')}
                </Button>
              </Link>
            </div>
          </div>

          {/* RIGHT: Live Weather Card Preview (7 cols) */}
          <div className="lg:col-span-7 bg-[#F7F6F0] rounded-3xl p-6 sm:p-8 border border-[#173F2A]/10 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#173F2A]/10">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#5F6F62] block">
                  LIVE TELEMETRY PREVIEW
                </span>
                <h3 className="text-xl font-bold text-[#17201A]">
                  Indore District Farmland
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-white text-[#173F2A] font-bold text-xs border border-[#173F2A]/10">
                Open-Meteo GPS
              </span>
            </div>

            {/* Weather Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 bg-white rounded-2xl border border-stone-200/80 text-center shadow-xs">
                <Thermometer className="w-5 h-5 text-[#D8B45A] mx-auto mb-1" />
                <span className="text-[11px] text-[#5F6F62] block">Temperature</span>
                <strong className="text-xl sm:text-2xl font-black text-[#17201A]">28.4°C</strong>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-stone-200/80 text-center shadow-xs">
                <CloudRain className="w-5 h-5 text-[#3F7D3A] mx-auto mb-1" />
                <span className="text-[11px] text-[#5F6F62] block">Rain Probability</span>
                <strong className="text-xl sm:text-2xl font-black text-[#17201A]">15%</strong>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-stone-200/80 text-center shadow-xs">
                <Wind className="w-5 h-5 text-[#3F7D3A] mx-auto mb-1" />
                <span className="text-[11px] text-[#5F6F62] block">Wind Speed</span>
                <strong className="text-xl sm:text-2xl font-black text-[#17201A]">11 km/h</strong>
              </div>
            </div>

            {/* Actionable Field Alert */}
            <div className="p-4 rounded-2xl bg-[#FAF7EE] border border-[#D8B45A]/40 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#D8B45A] shrink-0 mt-0.5" />
              <div className="text-xs space-y-0.5">
                <strong className="text-[#17201A]">Foliar Spraying Condition: Good</strong>
                <p className="text-[#5F6F62]">
                  Low wind speed and clear skies expected today. Favorable window for bio-fertilizer and foliar nutrient application.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
