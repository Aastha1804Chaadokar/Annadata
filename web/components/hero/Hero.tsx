'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Sprout, ArrowRight, ShieldCheck, Sparkles, ChevronDown } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const Hero: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);

  const { scrollY } = useScroll();
  // Subtle photograph scale shift on scroll
  const imageScale = useTransform(scrollY, [0, 600], [1.0, 1.03]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 768) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      setMousePos({ x, y });
    };

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen w-full flex items-center justify-center pt-24 pb-16 overflow-hidden bg-[#F8FAF3]"
    >
      {/* Full-Screen Real Wheat Field Photograph Background with Subtle Parallax */}
      <motion.div
        style={{ scale: reducedMotion ? 1 : imageScale }}
        animate={{
          x: reducedMotion ? 0 : mousePos.x,
          y: reducedMotion ? 0 : mousePos.y,
        }}
        transition={{ type: 'spring', stiffness: 40, damping: 25 }}
        className="absolute inset-0 z-0 w-full h-full"
      >
        <Image
          src="/assets/hero-wheat-field.jpg"
          alt="Real Indian Wheat Field at Sunrise"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          quality={92}
        />
      </motion.div>

      {/* Very Subtle Light Overlay for Text Readability without Washing Out Photograph */}
      <div className="absolute inset-0 z-1 bg-gradient-to-b from-[#F8FAF3]/75 via-[#F8FAF3]/30 to-transparent pointer-events-none" />

      {/* Hero Content — Centered Upper-Middle Area with Max-Width 700px */}
      <div className="relative z-10 max-w-[700px] mx-auto px-4 sm:px-6 text-center space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-5"
        >
          {/* Small Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#3F7D3A]/20 text-[#285C32] text-xs font-bold shadow-sm">
            <Sprout className="w-3.5 h-3.5 text-[#3F7D3A]" />
            <span>BUILT FOR INDIAN FARMERS</span>
          </div>

          {/* Title Wordmark — Scaled Responsively to clamp(56px, 8vw, 108px) */}
          <h1 className="text-5xl sm:text-7xl md:text-[88px] lg:text-[104px] font-black tracking-tight text-[#285C32] leading-none drop-shadow-sm">
            ANNA<span className="text-[#3F7D3A]">DATA</span>
          </h1>

          {/* Tagline */}
          <h2 className="text-2xl sm:text-3xl md:text-[36px] font-extrabold text-[#285C32] tracking-tight leading-snug">
            Har Kisan, Har Fasal, Har Faisla.
          </h2>

          {/* Main Supporting Text */}
          <p className="text-base sm:text-lg md:text-[20px] text-[#243126] font-semibold leading-relaxed">
            "Smarter decisions for every Indian farmer."
          </p>

          <p className="text-xs sm:text-sm text-[#4F5E52] max-w-md mx-auto leading-normal">
            Understand your soil, choose the right crop, follow the weather, and get agricultural guidance through AI.
          </p>

          {/* CTA Buttons — Clean and Unobstructed */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="#soil">
              <Button variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
                Get Started
              </Button>
            </a>
            <a href="#how-it-works">
              <Button variant="secondary" size="md" icon={<Sparkles className="w-4 h-4 text-[#E8B94A]" />}>
                Explore Annadata
              </Button>
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-5 text-xs sm:text-sm text-[#285C32]">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-[#3F7D3A]" />
              <span>Soil Health Intelligence</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-[#3F7D3A]" />
              <span>Localized IMD Weather</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-[#3F7D3A]" />
              <span>9 Indian Languages</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[#285C32] text-xs flex flex-col items-center gap-1 font-bold z-20 pointer-events-none"
      >
        <span>Scroll to explore</span>
        <ChevronDown className="w-4 h-4 text-[#3F7D3A]" />
      </motion.div>
    </section>
  );
};
