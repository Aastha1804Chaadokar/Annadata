'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getCropByIdOrSlug, CROP_DATASET } from '@/lib/cropKnowledgeData';
import { CropDetails } from '@/types/crop';
import { AppSidebar } from '@/components/app/AppSidebar';
import { AppHeader } from '@/components/app/AppHeader';
import { ProtectedRoute } from '@/components/app/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import {
  ArrowLeft,
  Sprout,
  Droplets,
  Thermometer,
  MapPin,
  Calendar,
  AlertTriangle,
  BookOpen,
  CheckCircle,
  Sparkles,
} from 'lucide-react';

function CropDetailContent() {
  const params = useParams();
  const rawCropParam = (params?.crop as string) || 'wheat';
  const [crop, setCrop] = useState<CropDetails | null>(null);

  useEffect(() => {
    if (rawCropParam) {
      const found = getCropByIdOrSlug(rawCropParam);
      if (found) {
        setCrop(found);
      } else {
        // Fallback default to first crop if not matched exactly
        setCrop(CROP_DATASET[0]);
      }
    }
  }, [rawCropParam]);

  if (!crop) return null;

  return (
    <div className="min-h-screen bg-[#F8FAF3] flex flex-col">
      <AppHeader />

      <div className="flex flex-1">
        <AppSidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-5xl">
          {/* Back button */}
          <Link
            href="/app/crop-recommendation"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3F7D3A] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Crop Recommendations
          </Link>

          {/* Hero Header */}
          <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#EEF5E8] via-[#F8FAF3] to-[#FFF8E8] border border-[#DCECCF] shadow-sm space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-[#3F7D3A] text-xs font-bold border border-[#DCECCF]">
              <Sprout className="w-4 h-4" />
              <span>Crop Agronomic Profile</span>
            </div>
            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="text-3xl sm:text-4xl font-black text-[#285C32]">
                {crop.cropName} ({crop.hindiName})
              </h1>
              <span className="text-sm font-mono text-[#667267] italic">
                {crop.scientificName}
              </span>
            </div>
            <p className="text-xs text-[#667267]">
              Agronomic requirements and cultivation guidance for optimal productivity in Indian farming regions.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-1">
              <span className="text-xs font-bold text-[#667267] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#3F7D3A]" /> Suitable Season
              </span>
              <span className="text-lg font-black text-[#285C32] block">
                {crop.suitableSeasons.join(', ')}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-1">
              <span className="text-xs font-bold text-[#667267] flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-[#3F7D3A]" /> Water Requirement
              </span>
              <span className="text-lg font-black text-[#285C32] block">
                {crop.waterRequirement}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-1">
              <span className="text-xs font-bold text-[#667267] flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-[#3F7D3A]" /> Temperature Range
              </span>
              <span className="text-lg font-black text-[#285C32] block">
                {crop.temperatureRange.min} - {crop.temperatureRange.max} {crop.temperatureRange.unit}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-1">
              <span className="text-xs font-bold text-[#667267] flex items-center gap-1">
                <Sprout className="w-3.5 h-3.5 text-[#3F7D3A]" /> Preferred pH
              </span>
              <span className="text-lg font-black text-[#285C32] block">
                {crop.phRange.min} - {crop.phRange.max}
              </span>
            </div>
          </div>

          {/* Detailed Specifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Soil Requirements */}
            <div className="p-6 rounded-3xl bg-white border border-[#3F7D3A]/15 shadow-sm space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                <BookOpen className="w-5 h-5 text-[#3F7D3A]" />
                <h3 className="text-lg font-black text-[#285C32]">Soil Requirements</h3>
              </div>
              <p className="text-xs text-[#667267] leading-relaxed">
                {crop.basicSoilRequirements}
              </p>
              <div className="pt-2">
                <span className="text-xs font-bold text-[#285C32] block mb-1">Preferred Soil Types:</span>
                <div className="flex flex-wrap gap-1.5">
                  {crop.preferredSoilTypes.map((st) => (
                    <span key={st} className="px-2.5 py-0.5 rounded-md bg-[#EEF5E8] text-[#3F7D3A] text-xs font-semibold border border-[#DCECCF]">
                      {st}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Major Growing Regions */}
            <div className="p-6 rounded-3xl bg-white border border-[#3F7D3A]/15 shadow-sm space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                <MapPin className="w-5 h-5 text-[#3F7D3A]" />
                <h3 className="text-lg font-black text-[#285C32]">Major Growing Regions</h3>
              </div>
              <p className="text-xs text-[#667267] leading-relaxed mb-2">
                Widely cultivated across primary agricultural zones in:
              </p>
              <div className="flex flex-wrap gap-2">
                {crop.majorRegions.map((region) => (
                  <span key={region} className="px-3 py-1 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-[#285C32]">
                    {region}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Cultivation Considerations & Potential Risks */}
          <div className="space-y-6">
            {/* Cultivation Considerations */}
            <div className="p-6 md:p-8 rounded-3xl bg-white border border-[#3F7D3A]/15 shadow-sm space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                <CheckCircle className="w-5 h-5 text-[#3F7D3A]" />
                <h3 className="text-lg font-black text-[#285C32]">Basic Cultivation Considerations</h3>
              </div>
              <p className="text-xs text-[#667267] leading-relaxed">
                {crop.cultivationConsiderations}
              </p>
            </div>

            {/* Potential Risks (No pesticide prescriptions) */}
            <div className="p-6 md:p-8 rounded-3xl bg-white border border-amber-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-amber-100 text-amber-800">
                <AlertTriangle className="w-5 h-5 text-amber-700" />
                <h3 className="text-lg font-black">Potential Risks & Vulnerabilities</h3>
              </div>
              <p className="text-xs text-[#667267] leading-relaxed">
                {crop.potentialRisks}
              </p>
              <div className="p-3 rounded-xl bg-amber-50 text-[11px] text-amber-900 border border-amber-200 mt-2">
                <strong>Agronomic Safety Note:</strong> Specific chemical or pesticide prescriptions require certified field inspection by local Krishi Vigyan Kendra (KVK) extension officers.
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function CropDetailPage() {
  return (
    <ProtectedRoute>
      <CropDetailContent />
    </ProtectedRoute>
  );
}
