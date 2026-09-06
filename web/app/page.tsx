'use client';

import React from 'react';
import { Hero } from '@/components/hero/Hero';
import { IdeaSection } from '@/components/sections/IdeaSection';
import { FarmerUncertaintiesSection } from '@/components/sections/FarmerUncertaintiesSection';
import { HarvestLifecycleSection } from '@/components/sections/HarvestLifecycleSection';
import { AnnadataValueSection } from '@/components/sections/AnnadataValueSection';
import { ShortCTASection } from '@/components/sections/ShortCTASection';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F7F6F0] text-[#17201A] selection:bg-[#D8B45A]/30 selection:text-[#173F2A]">
      {/* 1. Hero: Har Kisan, Har Fasal, Har Faisla & Smarter Agriculture for India */}
      <Hero />

      {/* 2. The Annadata Idea: Built Around the Farmer's Journey + Large Real Photo */}
      <IdeaSection />

      {/* 3. Farmer Uncertainties: Every Harvest Comes With Uncertainty + Real Photo + Cards */}
      <FarmerUncertaintiesSection />

      {/* 4. Harvest Lifecycle: From Seed to Harvest (PLAN → SOW → GROW → PROTECT → HARVEST → SELL) + Real Photos */}
      <HarvestLifecycleSection />

      {/* 5. Annadata Value: One Platform. Every Farming Decision. */}
      <AnnadataValueSection />

      {/* 6. Short CTA: Make Your Next Farming Decision Smarter. */}
      <ShortCTASection />
    </main>
  );
}
