'use client';

import React from 'react';
import { Hero } from '@/components/hero/Hero';
import { SmarterAgricultureSection } from '@/components/sections/SmarterAgricultureSection';
import { FarmerUncertaintiesSection } from '@/components/sections/FarmerUncertaintiesSection';
import { HarvestLifecycleSection } from '@/components/sections/HarvestLifecycleSection';
import { AnnadataValueSection } from '@/components/sections/AnnadataValueSection';
import { ShortCTASection } from '@/components/sections/ShortCTASection';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F4F6EE] text-[#17201A] selection:bg-[#D8B45A]/30 selection:text-[#173F2A]">
      {/* 1. Short Hero: Har Kisan, Har Fasal, Har Faisla */}
      <Hero />

      {/* 2. Smarter Agriculture For India */}
      <SmarterAgricultureSection />

      {/* 3. Farmer Uncertainties: Every Harvest Comes With Uncertainty */}
      <FarmerUncertaintiesSection />

      {/* 4. Harvest Lifecycle: From Seed to Harvest (PLAN → SOW → GROW → PROTECT → HARVEST → SELL) */}
      <HarvestLifecycleSection />

      {/* 5. Annadata Features: Small Feature Row/Grid */}
      <AnnadataValueSection />

      {/* 6. Bottom CTA: Make Your Next Farming Decision Smarter. */}
      <ShortCTASection />
    </main>
  );
}
