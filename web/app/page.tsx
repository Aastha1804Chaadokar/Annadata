'use client';

import React from 'react';
import { Hero } from '@/components/hero/Hero';
import { HeroInfoStrip } from '@/components/hero/HeroInfoStrip';
import { StoryTransitionSection } from '@/components/sections/StoryTransitionSection';
import { ProblemSection } from '@/components/sections/ProblemSection';
import { SolutionSection } from '@/components/sections/SolutionSection';
import { ImageFeatureSection } from '@/components/sections/ImageFeatureSection';
import { FarmLocationSection } from '@/components/sections/FarmLocationSection';
import { SoilSection } from '@/components/sections/SoilSection';
import { CropSection } from '@/components/sections/CropSection';
import { HarvestMosaicSection } from '@/components/sections/HarvestMosaicSection';
import { WeatherSection } from '@/components/sections/WeatherSection';
import { VoiceSection } from '@/components/sections/VoiceSection';
import { IndiaFirstSection } from '@/components/sections/IndiaFirstSection';
import { LanguageSection } from '@/components/sections/LanguageSection';
import { AccessOptionsSection } from '@/components/sections/AccessOptionsSection';
import { FarmerStorySection } from '@/components/sections/FarmerStorySection';
import { FinalCTA } from '@/components/sections/FinalCTA';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F7F6F0] text-[#17201A] selection:bg-[#D8B45A]/30 selection:text-[#173F2A]">
      {/* 1. Full-Screen 100vh Cinematic Agricultural Hero */}
      <Hero />

      {/* 2. Compact 5-Pillar Information Strip */}
      <HeroInfoStrip />

      {/* 3. Hero -> Story Transition (01 — THE IDEA: Technology Should Understand The Land) */}
      <StoryTransitionSection />

      {/* 4. Problem Section — Every Farming Decision Starts With a Question */}
      <ProblemSection />

      {/* 5. Annadata Solution — One Platform. Better Farming Decisions (8 Modules) */}
      <SolutionSection />

      {/* 6. Large Cinematic Full-Width Image Section (01 — KNOW YOUR LAND) */}
      <ImageFeatureSection />

      {/* 7. Farm Location — Your Farm. Precisely Located (Interactive Geocoding) */}
      <FarmLocationSection />

      {/* 8. Soil Health — Know What Lies Beneath Your Crop */}
      <SoilSection />

      {/* 9. Crop Suitability & Recommendation Engine */}
      <CropSection />

      {/* 10. Interactive Harvest Mosaic Section (Circular Crops Zoom-on-Hover) */}
      <HarvestMosaicSection />

      {/* 11. Hyper-Local Agro-Meteorological Weather */}
      <WeatherSection />

      {/* 11. Ask Annadata — Multilingual AI Voice Assistant */}
      <VoiceSection />

      {/* 12. India-First — Built for India's Fields & Agro-Climatic Diversity */}
      <IndiaFirstSection />

      {/* 13. Multilingual Support — Technology Should Speak Your Language */}
      <LanguageSection />

      {/* 14. Universal Access — Smartphone, Web & Keypad Phone IVR */}
      <AccessOptionsSection />

      {/* 15. Farmer Realities — Built Around the People Who Grow India */}
      <FarmerStorySection />

      {/* 16. Full-Screen Golden Hour Closing Call-To-Action */}
      <FinalCTA />
    </main>
  );
}
