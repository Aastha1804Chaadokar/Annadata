'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Sparkles, Sprout } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const FinalCTA: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="relative isolate min-h-[85vh] w-full flex items-center justify-center py-32 overflow-hidden text-white bg-[#173F2A]">
      {/* 1. Full-Screen Cinematic Golden Hour Background */}
      <div className="absolute inset-0 z-0 w-full h-full pointer-events-none">
        <Image
          src="/assets/cta-golden-hour.jpg"
          alt="Indian agricultural farmland at golden hour sunset"
          fill
          sizes="100vw"
          className="object-cover object-center scale-105"
          quality={95}
        />
        {/* Subtle Dark/Natural Gradient Overlay for Perfect Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#173F2A]/90 via-transparent to-black/60" />
      </div>

      {/* 2. Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
        
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#D8B45A] text-xs font-bold tracking-widest uppercase">
          <Sprout className="w-3.5 h-3.5" />
          <span>HAR KISAN • HAR FASAL • HAR FAISLA</span>
        </div>

        {/* Large Cinematic Heading */}
        <h2 className="text-4xl sm:text-6xl lg:text-[76px] font-black tracking-tight text-white leading-[1.04]">
          Your farm.<br />
          Your crop.<br />
          <span className="text-[#D8B45A]">Your decision.</span>
        </h2>

        {/* Supporting Subtitle */}
        <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto font-normal leading-relaxed">
          Make every farming decision with better information. Join Indian farmers using Annadata for soil intelligence, weather guidance, and crop suitability.
        </p>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Link href="/app/onboarding">
            <Button variant="accent" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
              Get Started
            </Button>
          </Link>
          <Link href="/features">
            <Button variant="outline" size="lg" className="border-white/40 text-white hover:bg-white/10" icon={<Sparkles className="w-4 h-4 text-[#D8B45A]" />}>
              Explore Annadata
            </Button>
          </Link>
        </div>

        {/* Micro Trust Indicator */}
        <div className="pt-6 text-xs text-white/70 font-medium">
          Free access for Indian farmers • No credit card required • 7 Indian languages
        </div>

      </div>
    </section>
  );
};
