'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Beaker, ArrowRight, ShieldCheck, AlertCircle, FileCheck, Camera } from 'lucide-react';

export const SoilSection: React.FC = () => {
  const { t } = useTranslation();

  const PARAMETERS = [
    { name: 'Soil pH', value: '6.8', status: 'Optimal / Neutral', color: 'text-[#3F7D3A]', bg: 'bg-[#EEF5E8]' },
    { name: 'Available Nitrogen (N)', value: '280 kg/ha', status: 'Medium', color: 'text-[#D8B45A]', bg: 'bg-[#FAF7EE]' },
    { name: 'Available Phosphorus (P)', value: '18 kg/ha', status: 'Medium', color: 'text-[#D8B45A]', bg: 'bg-[#FAF7EE]' },
    { name: 'Available Potassium (K)', value: '310 kg/ha', status: 'High / Sufficient', color: 'text-[#3F7D3A]', bg: 'bg-[#EEF5E8]' },
    { name: 'Organic Carbon (OC)', value: '0.62 %', status: 'Medium', color: 'text-[#D8B45A]', bg: 'bg-[#FAF7EE]' },
  ];

  return (
    <section id="soil" className="py-24 bg-white border-y border-[#173F2A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* LEFT: Section Headline & Scientific Boundary Content (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EEF5E8] text-[#173F2A] text-xs font-bold uppercase tracking-wider">
              <Beaker className="w-3.5 h-3.5 text-[#3F7D3A]" />
              <span>{t('soil.eyebrow', 'SOIL HEALTH INTELLIGENCE')}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#173F2A] tracking-tight leading-tight">
              {t('soil.heading', 'Know what your soil is telling you.')}
            </h2>

            <p className="text-sm sm:text-base text-[#5F6F62] leading-relaxed font-medium">
              {t(
                'soil.description',
                'Healthy crops start with balanced soil nutrients. Annadata interprets certified laboratory Soil Health Card parameters to prevent over-fertilization and boost yield.'
              )}
            </p>

            {/* Clear Scientific Boundary Box */}
            <div className="p-5 rounded-3xl bg-[#FAF7EE] border border-[#D8B45A]/30 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#173F2A]">
                <ShieldCheck className="w-4 h-4 text-[#3F7D3A]" />
                <span>Scientific Integrity Standard</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white rounded-2xl border border-stone-200/80 space-y-1">
                  <strong className="text-[#17201A] flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-[#3F7D3A]" />
                    Soil Test Data (Lab)
                  </strong>
                  <p className="text-[11px] text-[#5F6F62]">
                    Precise chemical analysis for Nitrogen, Phosphorus, Potassium, and pH.
                  </p>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-stone-200/80 space-y-1">
                  <strong className="text-[#17201A] flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-[#D8B45A]" />
                    Indicative Soil Photo
                  </strong>
                  <p className="text-[11px] text-[#5F6F62]">
                    Visual color assessment only. Does not replace laboratory testing.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/app/soil">
                <Button variant="primary" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                  {t('soil.checkSoil', 'Check Soil Health')}
                </Button>
              </Link>
            </div>
          </div>

          {/* RIGHT: Soil Health Card Digitized Dashboard Preview (6 cols) */}
          <div className="lg:col-span-6">
            <div className="bg-[#F7F6F0] rounded-3xl p-6 sm:p-8 border border-[#173F2A]/10 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-[#173F2A]/10">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#5F6F62] block">
                    GOVERNMENT SOIL HEALTH CARD
                  </span>
                  <h3 className="text-lg font-bold text-[#17201A]">
                    Sample Soil Nutrient Interpretation
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#EEF5E8] text-[#173F2A] text-xs font-bold border border-[#173F2A]/10">
                  ICAR Standards
                </span>
              </div>

              {/* Parameter Rows */}
              <div className="space-y-2.5">
                {PARAMETERS.map((param, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-white rounded-2xl border border-stone-200/80 flex items-center justify-between shadow-xs"
                  >
                    <div>
                      <strong className="text-xs sm:text-sm text-[#17201A] block">
                        {param.name}
                      </strong>
                      <span className="text-[11px] font-semibold text-[#5F6F62]">
                        {param.value}
                      </span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${param.bg} ${param.color}`}>
                      {param.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Disclaimer */}
              <p className="text-[11px] text-[#5F6F62] italic flex items-center gap-1.5 pt-2">
                <AlertCircle className="w-3.5 h-3.5 text-[#D8B45A] shrink-0" />
                <span>Photo-based analysis provides an indicative assessment and does not replace laboratory testing.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
