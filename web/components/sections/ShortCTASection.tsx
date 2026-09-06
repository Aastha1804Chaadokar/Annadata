'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Sprout, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const ShortCTASection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="py-14 sm:py-18 bg-[#173F2A] text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#3F7D3A]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#D8B45A]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-5">
        
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#D8B45A] text-xs font-bold uppercase tracking-wider">
          <Sprout className="w-3.5 h-3.5" />
          <span>HAR KISAN • HAR FASAL • HAR FAISLA</span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
          Make Your Next Farming Decision Smarter.
        </h2>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-white/85 max-w-lg mx-auto font-normal leading-relaxed">
          Join Indian farmers using Annadata for soil intelligence, weather guidance, and crop suitability.
        </p>

        {/* Action Button */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link href="/register">
            <Button
              variant="accent"
              size="lg"
              className="shadow-xl px-8"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Get Started
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
};
