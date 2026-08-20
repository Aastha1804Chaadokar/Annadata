'use client';

import React, { useState } from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { DEMO_CROP_RECOMMENDATION } from '@/lib/constants';
import { motion } from 'framer-motion';
import { Check, Code2 } from 'lucide-react';

const CROP_TABS = [
  { id: 'soybean', name: 'Soybean', score: 92, image: '🌾' },
  { id: 'wheat', name: 'Wheat (गेहूँ)', score: 88, image: '🌾' },
  { id: 'maize', name: 'Maize (मक्का)', score: 85, image: '🌽' },
  { id: 'cotton', name: 'Cotton (कपास)', score: 79, image: '🌱' },
];

export const CropSection: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState(CROP_TABS[0]);

  return (
    <section id="features" className="py-24 bg-[#F8FAF3] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="AI Recommendation Demo"
          title="Choose the right crop."
          subtitle="Match your soil profile, rainfall forecast, and local Mandi pricing with optimal crop recommendations to maximize yield and market return."
        />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Crop Selector Tabs */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#667267] mb-2">
              Select Crop Model Demo:
            </h4>
            {CROP_TABS.map((crop) => (
              <button
                key={crop.id}
                onClick={() => setSelectedCrop(crop)}
                className={`w-full p-4 rounded-2xl flex items-center justify-between text-left transition-all duration-200 ${
                  selectedCrop.id === crop.id
                    ? 'bg-white text-[#285C32] shadow-md border-2 border-[#3F7D3A]'
                    : 'bg-white/60 text-[#667267] hover:bg-white border border-stone-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{crop.image}</span>
                  <div>
                    <div className="font-bold text-base text-[#285C32]">{crop.name}</div>
                    <div className="text-xs text-[#667267]">Kharif / Rabi Model</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-[#EEF5E8] text-[#3F7D3A] font-extrabold text-xs rounded-full border border-[#DCECCF]">
                    {crop.score}% Match
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Detailed Recommendation Card */}
          <motion.div
            key={selectedCrop.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-8 bg-white rounded-3xl p-8 shadow-sm border border-[#3F7D3A]/20 relative overflow-hidden"
          >
            {/* Header Badge */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#3F7D3A]">
                  Recommended Crop
                </span>
                <h3 className="text-3xl font-black text-[#285C32] mt-1">
                  {DEMO_CROP_RECOMMENDATION.cropName}
                </h3>
                <p className="text-xs text-[#667267] italic font-mono mt-0.5">
                  {DEMO_CROP_RECOMMENDATION.scientificName}
                </p>
              </div>

              <div className="bg-[#3F7D3A] text-white px-5 py-3 rounded-2xl text-center shadow-sm">
                <span className="block text-2xl font-black">{selectedCrop.score}%</span>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#DCECCF]">Suitability</span>
              </div>
            </div>

            {/* Matching Factors Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
              {DEMO_CROP_RECOMMENDATION.factors.map((factor, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#EEF5E8] border border-[#DCECCF]">
                  <div className="text-xs text-[#3F7D3A] font-semibold mb-1">{factor.label}</div>
                  <div className="text-sm font-bold text-[#285C32] mb-1">{factor.value}</div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#285C32]">
                    <Check className="w-3 h-3 text-[#3F7D3A]" /> Match: {factor.match}
                  </span>
                </div>
              ))}
            </div>

            {/* Architecture code notice */}
            <div className="pt-4 border-t border-stone-200 flex items-center justify-between text-xs text-[#667267]">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#3F7D3A]" />
                <span>Frontend prototype — connects to future backend endpoint <code className="bg-[#EEF5E8] px-1.5 py-0.5 rounded text-[#285C32] font-semibold">/api/crops</code></span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
