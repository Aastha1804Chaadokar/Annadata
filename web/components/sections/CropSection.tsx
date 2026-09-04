'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Sprout, ArrowRight, CheckCircle2, AlertCircle, Calendar, Droplets } from 'lucide-react';

const SEASONS = ['Kharif (Monsoon)', 'Rabi (Winter)', 'Zaid (Summer)'];

export const CropSection: React.FC = () => {
  const { t } = useTranslation();
  const [activeSeason, setActiveSeason] = useState('Kharif (Monsoon)');

  const CROPS = [
    {
      name: 'Soybean (सोयाबीन)',
      score: 94,
      season: 'Kharif (Monsoon)',
      soilSuit: 'Well-drained Black Soil (pH 6.5 - 7.5)',
      reasons: ['Optimal nitrogen balance in field', 'Ideal rainfall pattern expected in next 30 days', 'High local Mandi demand in Indore'],
      cautions: 'Ensure soil drainage during heavy showers.',
    },
    {
      name: 'Wheat (गेहूँ - Sharbati)',
      score: 91,
      season: 'Rabi (Winter)',
      soilSuit: 'Clay loam to heavy clay (pH 6.0 - 7.5)',
      reasons: ['Excellent potassium reserve for grain fill', 'Cool winter temperatures anticipated', 'Government MSP benchmark available'],
      cautions: 'Requires 4-5 timed irrigations.',
    },
    {
      name: 'Gram / Chana (चना)',
      score: 87,
      season: 'Rabi (Winter)',
      soilSuit: 'Medium to heavy soils (pH 6.0 - 8.0)',
      reasons: ['Fixes atmospheric nitrogen for next crop', 'Low water requirement', 'Excellent crop rotation benefit after Soybean'],
      cautions: 'Watch for wilt during early seedling stage.',
    },
  ];

  const currentCrop = CROPS.find((c) => c.season.includes(activeSeason.split(' ')[0])) || CROPS[0];

  return (
    <section id="crop-recommendation" className="py-24 bg-[#F7F6F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* LEFT: Crop Recommendation Visual Demonstration (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#173F2A]/10 shadow-sm space-y-6">
            {/* Season Selector Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-100">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#5F6F62]">
                Select Season Model:
              </span>
              <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#F7F6F0] border border-[#173F2A]/10">
                {SEASONS.map((season) => (
                  <button
                    key={season}
                    onClick={() => setActiveSeason(season)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      activeSeason === season
                        ? 'bg-[#173F2A] text-white shadow-xs'
                        : 'text-[#5F6F62] hover:text-[#173F2A]'
                    }`}
                  >
                    {season.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Recommendation Card */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D8B45A] block">
                    TOP AGRONOMIC MATCH
                  </span>
                  <h3 className="text-2xl font-black text-[#17201A]">
                    {currentCrop.name}
                  </h3>
                  <span className="text-xs text-[#5F6F62] font-semibold">
                    {currentCrop.soilSuit}
                  </span>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-[#EEF5E8] flex flex-col items-center justify-center border border-[#3F7D3A]/20">
                  <span className="text-lg font-black text-[#173F2A] leading-none">
                    {currentCrop.score}%
                  </span>
                  <span className="text-[9px] font-bold text-[#3F7D3A] uppercase">Match</span>
                </div>
              </div>

              {/* Reasons */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <span className="text-xs font-bold text-[#17201A] block">
                  Why this crop matches your farm:
                </span>
                {currentCrop.reasons.map((r, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-[#5F6F62]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#3F7D3A] shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </div>
                ))}
              </div>

              {/* Caution & Extension Note */}
              <div className="p-3.5 rounded-2xl bg-[#FAF7EE] border border-[#D8B45A]/30 text-xs text-[#17201A] space-y-1">
                <strong>Agronomic Consideration:</strong>
                <p className="text-[#5F6F62] text-[11px]">{currentCrop.cautions}</p>
              </div>
            </div>
          </div>

          {/* RIGHT: Editorial Text & Action (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF7EE] text-[#173F2A] text-xs font-bold uppercase tracking-wider border border-[#D8B45A]/30">
              <Sprout className="w-3.5 h-3.5 text-[#D8B45A]" />
              <span>{t('crop.eyebrow', 'CROP RECOMMENDATION ENGINE')}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#173F2A] tracking-tight leading-tight">
              {t('crop.heading', 'Right crop. Right season. Better decisions.')}
            </h2>

            <p className="text-sm sm:text-base text-[#5F6F62] leading-relaxed font-medium">
              {t(
                'crop.subheading',
                'Stop guessing what to sow. Annadata factors in your soil test parameters, seasonal rainfall patterns, irrigation availability, and previous crop rotation to rank the most suitable crops.'
              )}
            </p>

            <div className="space-y-2 text-xs text-[#5F6F62]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#3F7D3A]" />
                <span>Kharif, Rabi, and Zaid planning</span>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-[#3F7D3A]" />
                <span>Irrigation capacity matching (Rain-fed, Canal, Borewell, Drip)</span>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/app/crop-recommendation">
                <Button variant="primary" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                  {t('crop.findSuitable', 'Find Suitable Crops')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
