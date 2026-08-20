'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getFarmerProfile } from '@/lib/farmerService';
import { FarmerProfile, CropMatch } from '@/types/farmer';
import { calculateCropRecommendations } from '@/lib/cropRecommendation';
import { FarmerSidebar } from '@/components/app/FarmerSidebar';
import { AppHeader } from '@/components/app/AppHeader';
import { Button } from '@/components/ui/Button';
import { Sparkles, ArrowLeft, Check, Code2, AlertCircle } from 'lucide-react';

export default function CropRecommendationPage() {
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [season, setSeason] = useState<'Kharif' | 'Rabi' | 'Zaid'>('Kharif');
  const [recommendations, setRecommendations] = useState<CropMatch[]>([]);

  useEffect(() => {
    const p = getFarmerProfile();
    setProfile(p);
    const recs = calculateCropRecommendations({
      season: 'Kharif',
      irrigation: p.irrigation,
      district: p.district,
    });
    setRecommendations(recs);
  }, []);

  const handleSeasonChange = (s: 'Kharif' | 'Rabi' | 'Zaid') => {
    setSeason(s);
    if (profile) {
      const recs = calculateCropRecommendations({
        season: s,
        irrigation: profile.irrigation,
        district: profile.district,
      });
      setRecommendations(recs);
    }
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-[#F8FAF3] flex flex-col">
      <AppHeader />

      <div className="flex flex-1">
        <FarmerSidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-6xl">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
            <div>
              <Link href="/app/dashboard" className="text-xs font-bold text-[#3F7D3A] hover:underline flex items-center gap-1 mb-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
              </Link>
              <h1 className="text-3xl font-black text-[#285C32]">
                🌾 Crop Recommendation Engine
              </h1>
              <p className="text-xs text-[#667267]">
                Rule-based suitability analysis matching your farm profile in {profile.village}, {profile.district}.
              </p>
            </div>

            {/* Season Selector */}
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-stone-200 shadow-sm">
              {(['Kharif', 'Rabi', 'Zaid'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => handleSeasonChange(s)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    season === s
                      ? 'bg-[#3F7D3A] text-white shadow-sm'
                      : 'text-[#667267] hover:bg-[#EEF5E8]'
                  }`}
                >
                  {s} Season
                </button>
              ))}
            </div>
          </div>

          {/* Service Architecture Status */}
          <div className="p-4 rounded-2xl bg-white border border-[#3F7D3A]/20 shadow-sm flex items-center justify-between text-xs text-[#285C32]">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-[#3F7D3A]" />
              <span>
                <strong>Service Abstraction:</strong> Rules calculated dynamically via <code className="bg-[#EEF5E8] px-2 py-0.5 rounded font-bold">lib/cropRecommendation.ts</code>. Ready for ML model API swap.
              </span>
            </div>
            <span className="px-3 py-1 bg-[#EEF5E8] text-[#3F7D3A] text-xs font-extrabold rounded-full border border-[#DCECCF]">
              Rule Engine Active
            </span>
          </div>

          {/* Recommendation Results List */}
          <div className="space-y-4">
            <h2 className="text-lg font-black text-[#285C32]">
              Recommended Crops for {season} Season ({profile.irrigation} Water Support)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendations.map((crop, idx) => (
                <div
                  key={crop.cropName}
                  className={`p-6 rounded-3xl bg-white border shadow-sm space-y-4 transition-all ${
                    idx === 0 ? 'border-2 border-[#3F7D3A] shadow-md' : 'border-[#3F7D3A]/15'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      {idx === 0 && (
                        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#EEF5E8] text-[#3F7D3A] border border-[#DCECCF] uppercase tracking-wider mb-1 inline-block">
                          Top Match Recommendation
                        </span>
                      )}
                      <h3 className="text-2xl font-black text-[#285C32]">{crop.cropName}</h3>
                      <div className="text-xs text-[#667267] italic font-mono">{crop.scientificName}</div>
                    </div>

                    <div className="bg-[#3F7D3A] text-white px-4 py-2 rounded-2xl text-center shadow-sm">
                      <span className="block text-xl font-black">{crop.suitabilityScore}%</span>
                      <span className="block text-[9px] font-extrabold uppercase text-[#DCECCF]">Suitability</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#667267] leading-relaxed">
                    {crop.notes}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-stone-100">
                    <div className="text-[11px] font-bold text-[#285C32]">Match Factors:</div>
                    {crop.matchingFactors.map((factor, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-[#3F7D3A] font-semibold">
                        <Check className="w-3.5 h-3.5 text-[#3F7D3A]" />
                        <span>{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transparency Disclaimer */}
          <div className="p-4 rounded-2xl bg-[#FFF8E8] border border-[#E8B94A]/40 text-xs text-[#667267] flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#E8B94A] shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-[#285C32] block">Agronomic Notice:</strong>
              Recommendations are calculated using agronomic rule models based on season, water support, and regional climate zones. Always consult local Krishi Vigyan Kendra (KVK) agricultural extension officers.
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
