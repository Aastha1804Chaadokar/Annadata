'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { 
  Compass, 
  Sprout, 
  SunMedium, 
  ShieldCheck, 
  Tractor, 
  BadgeDollarSign, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const HarvestLifecycleSection: React.FC = () => {
  const { t } = useTranslation();

  const STAGES = [
    {
      num: '01',
      name: 'PLAN',
      title: '01 — PLAN',
      desc: 'Understand your soil, location, season and farming conditions.',
      image: '/assets/aerial-farm.jpg',
      alt: 'Indian farmer examining field boundaries and planning cultivation',
      icon: <Compass className="w-4 h-4 text-[#285C32]" />,
    },
    {
      num: '02',
      name: 'SOW',
      title: '02 — SOW',
      desc: 'Choose the right crop and begin with confidence.',
      image: '/assets/sow-seeds.jpg',
      alt: 'Farmer sowing seeds in an Indian agricultural field',
      icon: <Sprout className="w-4 h-4 text-[#3F7D3A]" />,
    },
    {
      num: '03',
      name: 'GROW',
      title: '03 — GROW',
      desc: 'Track crop and weather conditions as your crop grows.',
      image: '/assets/crop-field.jpg',
      alt: 'Growing crop field in India under natural sunlight',
      icon: <SunMedium className="w-4 h-4 text-[#D8B45A]" />,
    },
    {
      num: '04',
      name: 'PROTECT',
      title: '04 — PROTECT',
      desc: 'Identify risks and make timely farming decisions.',
      image: '/assets/farmer-hand-wheat.jpg',
      alt: 'Indian farmer inspecting healthy wheat stalks and crop condition',
      icon: <ShieldCheck className="w-4 h-4 text-[#3A6B7C]" />,
    },
    {
      num: '05',
      name: 'HARVEST',
      title: '05 — HARVEST',
      desc: 'Prepare for harvest at the right time.',
      image: '/assets/harvester-combine.jpg',
      alt: 'Indian farmer harvesting mature crop in golden fields',
      icon: <Tractor className="w-4 h-4 text-[#8D5B4C]" />,
    },
    {
      num: '06',
      name: 'SELL',
      title: '06 — SELL',
      desc: 'Find market opportunities and make better selling decisions.',
      image: '/assets/mandi-market.jpg',
      alt: 'Harvested agricultural produce in Indian mandi market',
      icon: <BadgeDollarSign className="w-4 h-4 text-[#1F4529]" />,
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#F7F6F0] text-[#17201A] border-b border-[#E5EAD9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E5EDE0] text-[#285C32] text-xs font-bold uppercase tracking-wider border border-[#D2E0CA]">
            <Sparkles className="w-3.5 h-3.5 text-[#3F7D3A]" />
            <span>HARVEST LIFECYCLE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-[#1F4529] tracking-tight">
            From Seed to Harvest
          </h2>

          <p className="text-sm sm:text-base text-[#526350] max-w-xl mx-auto leading-relaxed font-normal">
            Every harvest is a journey. Annadata helps farmers make better decisions at every stage.
          </p>

          {/* Flow Indicator */}
          <div className="pt-2 hidden md:flex items-center justify-center gap-2 text-xs font-black text-[#285C32] tracking-wider uppercase">
            <span>PLAN</span>
            <span className="text-[#8D5B4C]">→</span>
            <span>SOW</span>
            <span className="text-[#8D5B4C]">→</span>
            <span>GROW</span>
            <span className="text-[#8D5B4C]">→</span>
            <span>PROTECT</span>
            <span className="text-[#8D5B4C]">→</span>
            <span>HARVEST</span>
            <span className="text-[#8D5B4C]">→</span>
            <span>SELL</span>
          </div>
        </div>

        {/* Editorial Photo Timeline Grid: 3 columns on Desktop, 2 on Tablet, 1 on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {STAGES.map((stage, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-3xl overflow-hidden border border-[#DCE4D4] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Large Real Agricultural Photography */}
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-stone-100">
                <Image
                  src={stage.image}
                  alt={stage.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  quality={85}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                
                {/* Stage Badge Floating Over Image */}
                <div className="absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-white/40 shadow-xs text-xs font-black text-[#1F4529]">
                  {stage.icon}
                  <span>STAGE {stage.num}</span>
                </div>
              </div>

              {/* Text Editorial Card Content */}
              <div className="p-5 sm:p-6 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-black text-[#1F4529] tracking-tight group-hover:text-[#2E7D32] transition-colors">
                    {stage.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#556353] leading-relaxed pt-1">
                    {stage.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#285C32]">
                  <span>Step {stage.num} of 06</span>
                  <span className="text-[#8D5B4C] group-hover:translate-x-1 transition-transform">Explore →</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
