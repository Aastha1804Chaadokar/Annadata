'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, Sprout } from 'lucide-react';
import { motion } from 'framer-motion';

interface HarvestItem {
  id: string;
  name: string;
  hindi: string;
  category: string;
  image: string;
  className: string;
  imgClassName?: string;
}

const HARVEST_BUBBLES: HarvestItem[] = [
  {
    id: 'wheat-spike',
    name: 'Golden Wheat',
    hindi: 'गेहूँ',
    category: 'Rabi Staple',
    image: '/assets/wheat-spike.jpg',
    className: 'w-44 h-44 sm:w-64 sm:h-64 lg:w-80 lg:h-80 -mb-6 lg:-mb-10 z-10',
  },
  {
    id: 'green-peas',
    name: 'Green Peas',
    hindi: 'मटर',
    category: 'Legume & Nitrogen Fixer',
    image: '/assets/green-peas.jpg',
    className: 'w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 -mt-6 sm:-mt-12 z-15',
  },
  {
    id: 'sunrise-soil',
    name: 'Field Germination',
    hindi: 'अंकुरण',
    category: 'Soil Vitality',
    image: '/assets/hero-farm.jpg',
    className: 'w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 mt-12 sm:mt-16 -ml-4 z-5',
  },
  {
    id: 'corn-cob',
    name: 'Ripe Maize / Corn',
    hindi: 'मक्का',
    category: 'Kharif High Yield',
    image: '/assets/corn-cob.jpg',
    className: 'w-40 h-40 sm:w-60 sm:h-60 lg:w-72 lg:h-72 mt-2 sm:mt-6 z-15',
  },
  {
    id: 'farmer-hands',
    name: 'Farmer Inspection',
    hindi: 'अन्नदाता परख',
    category: 'Seed Quality',
    image: '/assets/farmer-hand-wheat.jpg',
    className: 'w-28 h-28 sm:w-40 sm:h-40 lg:w-48 lg:h-48 -mt-8 sm:-mt-14 z-20',
  },
  {
    id: 'golden-bale',
    name: 'Golden Hour Harvest',
    hindi: 'सुनहरी कटाई',
    category: 'Post-Harvest Yield',
    image: '/assets/cta-golden-hour.jpg',
    className: 'w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 mt-16 sm:mt-20 -ml-2 z-10',
  },
  {
    id: 'green-crop',
    name: 'Lush Green Canopy',
    hindi: 'हरी-भरी फसल',
    category: 'Vegetative Growth',
    image: '/assets/crop-field.jpg',
    className: 'w-52 h-52 sm:w-72 sm:h-72 lg:w-96 lg:h-96 -mt-4 sm:-mt-8 z-20',
  },
  {
    id: 'harvester-combine',
    name: 'Modern Combine Harvester',
    hindi: 'आधुनिक हार्वेस्टर',
    category: 'Field Mechanization',
    image: '/assets/harvester-combine.jpg',
    className: 'w-44 h-44 sm:w-56 sm:h-56 lg:w-72 lg:h-72 mt-4 sm:mt-8 z-15',
  },
  {
    id: 'corn-detail',
    name: 'Millet & Grains',
    hindi: 'अन्न भंडार',
    category: 'Nutritional Grains',
    image: '/assets/corn-cob.jpg',
    className: 'w-20 h-20 sm:w-28 sm:h-28 lg:w-36 lg:h-36 mt-20 sm:mt-24 -ml-4 z-10',
  },
];

export const HarvestMosaicSection: React.FC = () => {
  const [hoveredCrop, setHoveredCrop] = useState<string | null>(null);

  return (
    <section className="relative w-full py-24 sm:py-32 bg-[#7E8C6E] text-white overflow-hidden border-b border-[#173F2A]/15">
      {/* 1. Large Faint Editorial Watermark Running Across Background */}
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 select-none pointer-events-none overflow-hidden whitespace-nowrap opacity-[0.14] text-[#F7F6F0]">
        <span className="text-[14vw] font-black uppercase tracking-tight leading-none">
          From Seed to Harvest • अन्नदाता • Har Kisan
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 2. Top Editorial Header Grid matching Reference */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start mb-16 sm:mb-24">
          
          {/* Left: Large Editorial Headline (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[#F5E79E] text-xs font-bold uppercase tracking-widest">
              <Sprout className="w-3.5 h-3.5 text-[#F5E79E]" />
              <span>THE HARVEST LIFECYCLE</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-[62px] font-black tracking-tight text-white leading-[1.06]">
              Our Mission:<br />
              <span className="text-[#F7F6F0]">Better Farming for</span><br />
              <span className="text-[#F5E79E]">a Better Future.</span>
            </h2>
          </div>

          {/* Right: Narrative Description & CTA Pill Button (5 cols) */}
          <div className="lg:col-span-5 space-y-6 lg:pt-8 text-white/90">
            <p className="text-sm sm:text-base leading-relaxed font-normal text-[#F4F7EE]">
              Annadata provides high-quality agricultural intelligence and practical solutions that support farmers, enhance crop yields, and promote sustainable soil management. From soil preparation to harvest day, we bring data and science to every acre.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/crop-recommendation">
                <button
                  type="button"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#F5E79E] text-[#1E2E1E] font-bold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-lg active:scale-95 group"
                >
                  <span className="w-2 h-2 rounded-full bg-[#1E2E1E] group-hover:scale-125 transition-transform" />
                  <span>Explore Harvest Crops</span>
                  <ArrowRight className="w-4 h-4 text-[#1E2E1E] group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>
              <Link href="/contact">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-black/20 hover:bg-black/30 border border-white/25 text-white font-bold text-xs uppercase tracking-wider transition-all backdrop-blur-sm"
                >
                  <span>Get in Touch</span>
                </button>
              </Link>
            </div>
          </div>

        </div>

        {/* 3. Live Active Hover Badge */}
        <div className="h-8 mb-4 flex items-center justify-center">
          {hoveredCrop ? (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#173F2A] text-[#F5E79E] border border-[#F5E79E]/30 text-xs font-bold shadow-xl animate-in fade-in zoom-in-95 duration-200">
              <Sparkles className="w-3.5 h-3.5 text-[#F5E79E]" />
              <span>{hoveredCrop}</span>
            </div>
          ) : (
            <span className="text-xs text-white/60 font-medium tracking-wide">
              Hover over any harvest photo to inspect crop details
            </span>
          )}
        </div>

        {/* 4. Interactive Circular Mosaic of Varied-Size Photos */}
        <div className="w-full flex items-center justify-center -mx-4 sm:mx-0 overflow-x-auto pb-8 pt-4 scrollbar-none">
          <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 min-w-max px-6">
            {HARVEST_BUBBLES.map((bubble) => (
              <div
                key={bubble.id}
                onMouseEnter={() => setHoveredCrop(`${bubble.name} (${bubble.hindi}) — ${bubble.category}`)}
                onMouseLeave={() => setHoveredCrop(null)}
                className={`group relative rounded-full overflow-hidden shadow-2xl border-4 border-white/80 bg-stone-900 cursor-pointer shrink-0 transition-all duration-500 ease-out hover:scale-110 hover:shadow-3xl hover:border-white hover:z-30 hover:ring-4 hover:ring-[#F5E79E]/50 ${bubble.className}`}
              >
                {/* Photo with smooth slight zoom on hover */}
                <Image
                  src={bubble.image}
                  alt={bubble.name}
                  fill
                  sizes="(max-width: 768px) 150px, 300px"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-120"
                  quality={92}
                />
                
                {/* Subtle dark vignette gradient for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-40 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />

                {/* Micro hover label inside circle */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px] pointer-events-none">
                  <span className="text-[11px] sm:text-xs font-black text-white leading-tight drop-shadow-md">
                    {bubble.name}
                  </span>
                  <span className="text-[10px] text-[#F5E79E] font-bold">
                    {bubble.hindi}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Bottom Narrative Accent */}
        <div className="mt-8 text-center">
          <p className="text-xs sm:text-sm text-white/80 max-w-xl mx-auto font-medium">
            From golden wheat grain fills to lush kharif vegetative stages — calibrated for 15+ Indian agro-climatic zones.
          </p>
        </div>

      </div>
    </section>
  );
};
