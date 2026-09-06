'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Sprout, ArrowRight, Sparkles, MapPin, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

export const Hero: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section
      id="home"
      className="relative min-h-[88vh] sm:min-h-[92vh] w-full flex flex-col justify-between overflow-hidden bg-[#173F2A] text-white"
    >
      {/* Background Image with Dark Editorial Overlays */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        <Image
          src="/assets/hero-farm.jpg"
          alt="Indian agricultural farmland"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-105"
          quality={95}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#173F2A] via-transparent to-black/60" />
      </div>

      {/* Spacer for Top Navbar */}
      <div className="h-24 sm:h-28" />

      {/* Main Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 py-6 my-auto">
        <div className="max-w-3xl space-y-5 text-left">
          
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#D8B45A] text-xs font-bold tracking-widest uppercase shadow-sm"
          >
            <Sprout className="w-3.5 h-3.5 text-[#D8B45A]" />
            <span>{t('hero.eyebrow', 'ANNADATA')}</span>
          </motion.div>

          {/* Main Hero Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-[68px] font-black tracking-tight text-white leading-[1.06] drop-shadow-md"
          >
            Har Kisan,<br />
            Har Fasal,<br />
            <span className="text-[#D8B45A]">Har Faisla.</span>
          </motion.h1>

          {/* Smaller Supporting Line */}
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl sm:text-2xl font-bold text-white/95 tracking-tight drop-shadow-sm"
          >
            {t('hero.supportingLine', 'Smarter agriculture for India.')}
          </motion.h2>

          {/* Short Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-sm sm:text-base text-white/85 max-w-xl leading-relaxed font-normal"
          >
            {t(
              'hero.description',
              'Helping Indian farmers make better decisions from planning to harvest.'
            )}
          </motion.p>

          {/* CTA Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="pt-3 flex flex-wrap items-center gap-3.5"
          >
            <Link href="/register">
              <Button variant="accent" size="lg" className="shadow-xl" icon={<ArrowRight className="w-4 h-4" />}>
                {t('hero.getStarted', 'Get Started')}
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button variant="outline" size="lg" className="border-white/40 text-white hover:bg-white/10 shadow-md" icon={<Sparkles className="w-4 h-4 text-[#D8B45A]" />}>
                {t('hero.explore', 'How It Works')}
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Bottom Info Strip */}
      <div className="z-10 border-t border-white/15 bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs text-white/90">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D8B45A] animate-pulse" />
              <strong className="text-white uppercase tracking-wider font-black">INDIA</strong>
            </div>
            <span className="text-white/40 hidden sm:inline">•</span>
            <span className="font-medium text-white/90">Smart Farming Platform</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/15 text-[11px]">
              <MapPin className="w-3 h-3 text-[#D8B45A]" />
              <span>GPS Farm Geocoding</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/15 text-[11px]">
              <Sun className="w-3 h-3 text-[#D8B45A]" />
              <span>Micro-Climate Forecast</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
