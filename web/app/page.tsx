'use client';

import React from 'react';
import { Hero } from '@/components/hero/Hero';
import { FarmerUncertaintiesSection } from '@/components/sections/FarmerUncertaintiesSection';
import { HarvestLifecycleSection } from '@/components/sections/HarvestLifecycleSection';
import { AnnadataValueSection } from '@/components/sections/AnnadataValueSection';
import { ShortCTASection } from '@/components/sections/ShortCTASection';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F4F6EE] text-[#17201A] selection:bg-[#D8B45A]/30 selection:text-[#173F2A]">
      {/* 1. Hero: Har Kisan, Har Fasal, Har Faisla & Core Message */}
      <Hero />

      {/* 2. Farmer Uncertainties: Every Harvest Comes With Uncertainty */}
      <FarmerUncertaintiesSection />

      {/* 3. Harvest Lifecycle: From Seed to Harvest (Plan -> Sow -> Grow -> Protect -> Harvest -> Sell) */}
      <HarvestLifecycleSection />

      {/* 4. Annadata Value: One platform for better decisions throughout your farming journey */}
      <AnnadataValueSection />

      {/* 5. Short CTA: Start Your Farming Journey */}
      <ShortCTASection />
    </main>
  );
}
