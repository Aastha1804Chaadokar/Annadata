'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';

export const ImageFeatureSection: React.FC = () => {
  return (
    <section className="relative w-full min-h-[85vh] py-24 sm:py-32 px-4 sm:px-8 lg:px-16 bg-[#F7F6F0] flex items-center justify-center border-b border-[#173F2A]/10">
      <div className="max-w-7xl mx-auto w-full">
        {/* Editorial Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* LEFT COLUMN: Section Label, Large Heading, Body & CTA Buttons (approx 45-50%) */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-left">
            
            {/* Section Label */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#173F2A] text-[#D8B45A] text-xs font-bold tracking-widest uppercase">
              <MapPin className="w-3.5 h-3.5 text-[#D8B45A]" />
              <span>01 — KNOW YOUR LAND</span>
            </div>

            {/* Large Editorial Heading */}
            <h2 className="text-3xl sm:text-5xl lg:text-[56px] font-bold tracking-tight text-[#173F2A] leading-[1.12]">
              Understand your farm<br className="hidden sm:inline" /> before you decide your<br className="hidden sm:inline" /> crop.
            </h2>

            {/* Body Text */}
            <p className="text-base sm:text-lg text-[#354038] leading-relaxed font-normal max-w-xl">
              Annadata combines farm location, soil information, irrigation capacity, and seasonal weather patterns to help farmers make confident, data-driven decisions that safeguard their harvest.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link href="/farm-location">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#D8B45A] text-[#172018] font-bold text-sm hover:bg-[#c4a148] transition-all shadow-md active:scale-95"
                >
                  <span>Explore Farm Location</span>
                  <ArrowRight className="w-4 h-4 text-[#172018]" />
                </button>
              </Link>
              <Link href="/app/farm">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-transparent border border-[#173F2A]/25 text-[#173F2A] font-bold text-sm hover:bg-[#173F2A]/5 transition-all active:scale-95"
                >
                  <span>View Farm Profile</span>
                </button>
              </Link>
            </div>

          </div>

          {/* RIGHT COLUMN: Large Real Agricultural Image (approx 50-55%) */}
          <div className="lg:col-span-6 w-full">
            <div className="relative w-full h-[380px] sm:h-[480px] lg:h-[580px] rounded-[32px] sm:rounded-[40px] overflow-hidden shadow-2xl border-4 border-white">
              <Image
                src="/assets/aerial-farm.jpg"
                alt="Aerial view of Indian farming landscape"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-700 hover:scale-105"
                quality={92}
                priority
              />
              {/* Subtle Natural Bottom Vignette for Caption */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#173F2A]/70 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white text-xs space-y-1">
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#D8B45A] block">
                  PRECISION LOCATION & TOPOGRAPHY
                </span>
                <p className="font-semibold text-white/95 text-sm sm:text-base">
                  Every field plot is unique in soil texture, slope, and water retention.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
