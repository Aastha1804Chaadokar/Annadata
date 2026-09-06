'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { 
  HelpCircle, 
  Sprout, 
  FlaskConical, 
  Calendar, 
  CloudSun, 
  ShieldAlert, 
  Store, 
  Coins, 
  ArrowRight 
} from 'lucide-react';

export const FarmerUncertaintiesSection: React.FC = () => {
  const { t } = useTranslation();

  const UNCERTAINTIES = [
    {
      num: '01',
      icon: <Sprout className="w-4 h-4 text-[#285C32]" />,
      question: 'What should I grow?',
      desc: 'Choose a crop suited to the farm, soil and season.',
      href: '/crop-recommendation',
    },
    {
      num: '02',
      icon: <FlaskConical className="w-4 h-4 text-[#8D5B4C]" />,
      question: 'Is my soil healthy?',
      desc: 'Understand the current condition of the soil.',
      href: '/soil-health',
    },
    {
      num: '03',
      icon: <Calendar className="w-4 h-4 text-[#3F7D3A]" />,
      question: 'When should I sow?',
      desc: 'Make decisions based on location, season and conditions.',
      href: '/weather',
    },
    {
      num: '04',
      icon: <CloudSun className="w-4 h-4 text-[#3A6B7C]" />,
      question: 'What will the weather do?',
      desc: 'Stay aware of changing weather conditions.',
      href: '/weather',
    },
    {
      num: '05',
      icon: <ShieldAlert className="w-4 h-4 text-[#B45309]" />,
      question: 'How do I protect my crop?',
      desc: 'Get timely insights as the crop grows.',
      href: '/how-it-works',
    },
    {
      num: '06',
      icon: <Store className="w-4 h-4 text-[#1E3A8A]" />,
      question: 'Where can I sell?',
      desc: 'Find better opportunities when the harvest is ready.',
      href: '/market',
    },
    {
      num: '07',
      icon: <Coins className="w-4 h-4 text-[#854D0E]" />,
      question: 'Am I getting a fair price?',
      desc: 'Understand market opportunities before selling.',
      href: '/market',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white text-[#17201A] border-b border-[#E5EAD9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16 space-y-3 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E5EDE0] text-[#285C32] text-xs font-bold uppercase tracking-wider border border-[#D2E0CA]">
            <HelpCircle className="w-3.5 h-3.5 text-[#3F7D3A]" />
            <span>FARMER UNCERTAINTIES</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-[#1F4529] tracking-tight">
            Every Harvest Comes With Uncertainty
          </h2>

          <p className="text-sm sm:text-base text-[#526350] leading-relaxed max-w-2xl font-normal">
            Before a farmer sees the harvest, there are countless decisions to make.
          </p>
        </div>

        {/* Editorial Split: Left Large Realistic Indian Farmer Photo, Right 7 Compact Uncertainty Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column: Authentic Indian Farmer Photograph */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border-4 border-[#F4F6EE]">
              <Image
                src="/assets/farmer-inspecting.jpg"
                alt="Indian farmer examining soil and growing crops with care"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center hover:scale-105 transition-transform duration-700"
                quality={90}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="text-xs uppercase tracking-widest text-[#D8B45A] font-extrabold block mb-1">
                  REALITY OF THE LAND
                </span>
                <p className="text-sm font-semibold leading-snug">
                  Every season brings questions that determine a farmer's livelihood.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: 7 Elegant Editorial Uncertainty Cards */}
          <div className="lg:col-span-7 space-y-3">
            {UNCERTAINTIES.map((item) => (
              <Link
                key={item.num}
                href={item.href}
                className="group flex items-start gap-4 p-4 sm:p-5 rounded-2xl bg-[#FBFDF8] border border-[#DCE4D4] hover:bg-white hover:border-[#285C32]/40 hover:shadow-md transition-all duration-200"
              >
                {/* Number & Icon Block */}
                <div className="flex flex-col items-center gap-1.5 shrink-0 pt-0.5">
                  <span className="text-[11px] font-black tracking-wider text-[#8D5B4C] bg-[#F5EBE6] px-2 py-0.5 rounded-md">
                    {item.num}
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center border border-[#E0ECD7] shadow-2xs">
                    {item.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-0.5">
                  <h3 className="text-base sm:text-lg font-black text-[#1F4529] group-hover:text-[#2E7D32] transition-colors">
                    "{item.question}"
                  </h3>
                  <p className="text-xs sm:text-sm text-[#556353] leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Arrow */}
                <div className="self-center shrink-0 text-[#285C32]/40 group-hover:text-[#285C32] group-hover:translate-x-1 transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
