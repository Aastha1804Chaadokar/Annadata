'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Compass, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const StoryTransitionSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="py-28 bg-[#F7F6F0] border-b border-[#173F2A]/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Asymmetrical Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Editorial Headline & Manifesto (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#173F2A] text-[#D8B45A] text-xs font-bold uppercase tracking-widest">
              <span>01 — THE IDEA</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-[54px] font-black text-[#173F2A] tracking-tight leading-[1.12]">
              Technology should understand the land before it advises the farmer.
            </h2>

            <div className="space-y-4 text-base sm:text-lg text-[#5F6F62] leading-relaxed font-normal">
              <p>
                Agriculture across India is not one single model — it is shaped by over 15 distinct agro-climatic zones, hundreds of soil types, local monsoon cycles, and generations of farming wisdom.
              </p>
              <p>
                Annadata does not replace the farmer's intuition with distant software. Instead, it bridges local soil chemistry, micro-climate weather forecasts, and crop suitability intelligence into practical, plain-spoken guidance.
              </p>
            </div>

            {/* Editorial Quote & Values */}
            <div className="pt-4 border-t border-[#173F2A]/15 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#3F7D3A]">
                  Rooted In Indian Soil
                </span>
                <p className="text-xs text-[#5F6F62] leading-normal">
                  Calibrated for Kharif, Rabi, and Zaid seasons across every Indian state.
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#3F7D3A]">
                  Built For Inclusion
                </span>
                <p className="text-xs text-[#5F6F62] leading-normal">
                  Accessible in regional languages via smartphone web or basic phone helpline.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/about">
                <Button variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
                  Learn Our Story
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Large Photographic Frame (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/5] border-4 border-white">
              <Image
                src="/assets/farmer-tech.jpg"
                alt="Indian farmer utilizing smartphone in field"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center transition-transform duration-700 hover:scale-105"
                quality={90}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#173F2A]/80 via-transparent to-transparent" />
              
              {/* Image Caption Tag */}
              <div className="absolute bottom-6 left-6 right-6 text-white text-xs space-y-1">
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#D8B45A] block">
                  PRACTICAL INTELLIGENCE
                </span>
                <p className="font-semibold text-white/90">
                  Bridging scientific lab data with everyday field decisions.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
