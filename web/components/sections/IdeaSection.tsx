'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Sprout, ArrowRight, Sparkles } from 'lucide-react';

export const IdeaSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="py-16 sm:py-24 bg-[#F7F6F0] text-[#17201A] border-b border-[#E5EAD9] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Split Layout: Left Text, Right Large Real Agricultural Photography */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Text Storytelling */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Small Label */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E5EDE0] text-[#285C32] text-xs font-bold tracking-wider uppercase border border-[#D2E0CA]">
              <Sparkles className="w-3.5 h-3.5 text-[#3F7D3A]" />
              <span>SMARTER AGRICULTURE FOR INDIA</span>
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl sm:text-5xl font-black text-[#1F4529] tracking-tight leading-[1.12]">
              Built Around the Farmer's Journey
            </h2>

            {/* Main Idea */}
            <p className="text-lg sm:text-xl font-bold text-[#285C32] leading-snug">
              Farming is more than growing a crop. Every season brings decisions, risks and uncertainty.
            </p>

            {/* Detailed Idea */}
            <p className="text-sm sm:text-base text-[#526350] leading-relaxed font-normal">
              Annadata brings the right information together — soil, location, crops, weather, AI-powered insights and market opportunities — so farmers can make smarter decisions throughout the farming journey.
            </p>

            {/* Quick Action Link */}
            <div className="pt-2">
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#285C32] text-white text-xs sm:text-sm font-bold shadow-md hover:bg-[#1e4827] transition-all"
              >
                <span>Learn How It Works</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

          {/* Right Column: Large Real Photograph of Indian Farmer in Field */}
          <div className="lg:col-span-6">
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden shadow-xl border-4 border-white">
              <Image
                src="/assets/farmer-tech.jpg"
                alt="Indian farmer working in crop field with technology assistance"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center hover:scale-105 transition-transform duration-700"
                quality={90}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-white text-xs sm:text-sm font-semibold drop-shadow-md">
                <span>Empowering Indian farmers with scientific precision</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
