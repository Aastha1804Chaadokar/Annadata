'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Sprout, ArrowRight, Sparkles, MapPin, Sun, CloudRain } from 'lucide-react';
import { motion } from 'framer-motion';

export const Hero: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section
      id="home"
      className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#173F2A] text-white"
    >
      {/* 1. Full-Screen Cinematic Agricultural Background & Overlays */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        <Image
          src="/assets/hero-farm.jpg"
          alt="Indian agricultural farmland at sunrise"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-105"
          quality={95}
        />
        {/* Dark Editorial Gradient Overlays for High-Contrast Sunlight Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#173F2A] via-transparent to-black/60" />
      </div>

      {/* Spacer for Floating Fixed Navbar */}
      <div className="h-28 sm:h-32" />

      {/* 2. Main Hero Editorial Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 py-8 my-auto">
        <div className="max-w-3xl space-y-6 text-left">
          
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#D8B45A] text-xs font-bold tracking-widest uppercase shadow-sm"
          >
            <Sprout className="w-3.5 h-3.5 text-[#D8B45A]" />
            <span>{t('hero.eyebrow', 'SMARTER AGRICULTURE FOR INDIA')}</span>
          </motion.div>

          {/* Large Hero Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-[76px] font-black tracking-tight text-white leading-[1.04] drop-shadow-md"
          >
            Har Kisan,<br />
            Har Fasal,<br />
            <span className="text-[#D8B45A]">Har Faisla.</span>
          </motion.h1>

          {/* Supporting Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl sm:text-2xl font-bold text-white/95 tracking-tight drop-shadow-sm"
          >
            {t('hero.supporting', 'Smarter decisions for every Indian farmer.')}
          </motion.h2>

          {/* Body Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-sm sm:text-base text-white/85 max-w-2xl leading-relaxed font-normal"
          >
            {t(
              'hero.body',
              'From farm location and soil health to crop recommendations and agricultural insights — Annadata brings practical technology closer to every farmer.'
            )}
          </motion.p>

          {/* CTA Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-4 flex flex-wrap items-center gap-4"
          >
            <Link href="/app/onboarding">
              <Button variant="accent" size="lg" className="shadow-xl" icon={<ArrowRight className="w-4 h-4" />}>
                {t('hero.getStarted', 'Get Started')}
              </Button>
            </Link>
            <Link href="/features">
              <Button variant="outline" size="lg" className="border-white/40 text-white hover:bg-white/10 shadow-md" icon={<Sparkles className="w-4 h-4 text-[#D8B45A]" />}>
                {t('hero.explore', 'Explore Annadata')}
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* 3. Bottom Information & Location Strip */}
      <div className="z-10 border-t border-white/15 bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4 text-xs text-white/90">
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D8B45A] animate-pulse" />
              <strong className="text-white uppercase tracking-wider font-black">INDIA</strong>
            </div>
            <span className="text-white/40 hidden sm:inline">•</span>
            <span className="hidden sm:inline font-medium">Smart Agriculture Platform</span>
            <span className="text-white/40 hidden md:inline">•</span>
            <span className="text-[#D8B45A] font-bold hidden md:inline">Built for Indian Farmers</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/15">
              <MapPin className="w-3.5 h-3.5 text-[#D8B45A]" />
              <span className="font-semibold">GPS Farm Geocoding</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/15">
              <Sun className="w-3.5 h-3.5 text-[#D8B45A]" />
              <span className="font-semibold">Micro-Climate Telemetry</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
