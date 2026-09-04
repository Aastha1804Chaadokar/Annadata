'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getSoilReportById } from '@/lib/soilService';
import { SoilReportRecord } from '@/types/soil';
import { AppSidebar } from '@/components/app/AppSidebar';
import { AppHeader } from '@/components/app/AppHeader';
import { ProtectedRoute } from '@/components/app/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import {
  ArrowLeft,
  Sprout,
  Sparkles,
  Calendar,
  Layers,
  Droplets,
  HelpCircle,
  FileText,
  AlertTriangle,
} from 'lucide-react';

function SoilReportDetailContent() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [report, setReport] = useState<SoilReportRecord | null>(null);

  useEffect(() => {
    if (id) {
      const found = getSoilReportById(id);
      if (found) {
        setReport(found);
      }
    }
  }, [id]);

  if (!report) {
    return (
      <div className="min-h-screen bg-[#F8FAF3] flex flex-col">
        <AppHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <main className="flex-1 p-8 max-w-4xl text-center space-y-4">
            <h1 className="text-2xl font-black text-[#285C32]">Soil Report Not Found</h1>
            <p className="text-xs text-[#667267]">
              The requested soil report record ID is not present in local storage.
            </p>
            <Link href="/app/soil">
              <Button icon={<ArrowLeft className="w-4 h-4" />}>Back to Soil Health</Button>
            </Link>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAF3] flex flex-col">
      <AppHeader />

      <div className="flex flex-1">
        <AppSidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-5xl">
          {/* Back Navigation */}
          <Link
            href="/app/soil"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3F7D3A] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Soil Health Dashboard
          </Link>

          {/* Title Bar */}
          <div className="p-6 md:p-8 rounded-3xl bg-white border border-[#3F7D3A]/20 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[#EEF5E8] text-[#3F7D3A] border border-[#DCECCF]">
                  Soil Health Profile
                </span>
                <h1 className="text-3xl font-black text-[#285C32] mt-2">
                  Soil Report Details
                </h1>
                <p className="text-xs text-[#667267] mt-1 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" /> Last Tested Date: <strong>{report.testDate}</strong>
                  <span>•</span>
                  <span>Source: <strong>{report.source === 'report_upload' ? 'Soil Health Card Upload' : 'Manual Form Entry'}</strong></span>
                </p>
              </div>

              <Link href="/app/crop-recommendation">
                <Button icon={<Sparkles className="w-4 h-4" />}>
                  Get Crop Recommendations
                </Button>
              </Link>
            </div>

            {/* Uploaded File Reference Disclosure if source is upload */}
            {report.reportFile && (
              <div className="p-3.5 rounded-2xl bg-[#F8FAF3] border border-stone-200 text-xs text-[#667267] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#3F7D3A]" />
                  <span>
                    Uploaded Document: <strong>{report.reportFile.fileName || 'Soil_Test_Report.pdf'}</strong>
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-white text-[10px] font-bold text-[#9A7048] border">
                  {report.reportFile.storageStatus}
                </span>
              </div>
            )}
          </div>

          {/* PARAMETER VALUES AND UNITS DISPLAY */}
          <div className="p-6 md:p-8 rounded-3xl bg-white border border-[#3F7D3A]/15 shadow-sm space-y-6">
            <h2 className="text-xl font-black text-[#285C32] pb-3 border-b border-stone-100">
              Tested Nutrient & Soil Metrics
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* pH */}
              <div className="p-5 rounded-2xl bg-[#F8FAF3] border border-[#3F7D3A]/15 space-y-2">
                <span className="text-xs font-bold text-[#667267]">pH Value</span>
                <div className="text-3xl font-black text-[#285C32]">{report.ph}</div>
                <span className="inline-block px-3 py-1 rounded-full bg-[#EEF5E8] text-[#3F7D3A] text-xs font-extrabold border border-[#DCECCF]">
                  {report.interpretation?.parameters.find((p) => p.parameter === 'pH')?.status || 'Suitable'}
                </span>
                <p className="text-xs text-[#667267] pt-2 border-t border-stone-200">
                  {report.interpretation?.parameters.find((p) => p.parameter === 'pH')?.explanation}
                </p>
              </div>

              {/* Nitrogen */}
              <div className="p-5 rounded-2xl bg-[#F8FAF3] border border-[#3F7D3A]/15 space-y-2">
                <span className="text-xs font-bold text-[#667267]">Nitrogen (N)</span>
                <div className="text-3xl font-black text-[#285C32]">
                  {report.nitrogen.value} <span className="text-sm font-normal text-[#667267]">{report.nitrogen.unit}</span>
                </div>
                <span className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-extrabold border border-amber-200">
                  {report.interpretation?.parameters.find((p) => p.parameter.includes('Nitrogen'))?.status || 'Medium'}
                </span>
                <p className="text-xs text-[#667267] pt-2 border-t border-stone-200">
                  {report.interpretation?.parameters.find((p) => p.parameter.includes('Nitrogen'))?.explanation}
                </p>
              </div>

              {/* Phosphorus */}
              <div className="p-5 rounded-2xl bg-[#F8FAF3] border border-[#3F7D3A]/15 space-y-2">
                <span className="text-xs font-bold text-[#667267]">Phosphorus (P)</span>
                <div className="text-3xl font-black text-[#285C32]">
                  {report.phosphorus.value} <span className="text-sm font-normal text-[#667267]">{report.phosphorus.unit}</span>
                </div>
                <span className="inline-block px-3 py-1 rounded-full bg-[#EEF5E8] text-[#3F7D3A] text-xs font-extrabold border border-[#DCECCF]">
                  {report.interpretation?.parameters.find((p) => p.parameter.includes('Phosphorus'))?.status || 'High'}
                </span>
                <p className="text-xs text-[#667267] pt-2 border-t border-stone-200">
                  {report.interpretation?.parameters.find((p) => p.parameter.includes('Phosphorus'))?.explanation}
                </p>
              </div>

              {/* Potassium */}
              <div className="p-5 rounded-2xl bg-[#F8FAF3] border border-[#3F7D3A]/15 space-y-2">
                <span className="text-xs font-bold text-[#667267]">Potassium (K)</span>
                <div className="text-3xl font-black text-[#285C32]">
                  {report.potassium.value} <span className="text-sm font-normal text-[#667267]">{report.potassium.unit}</span>
                </div>
                <span className="inline-block px-3 py-1 rounded-full bg-[#EEF5E8] text-[#3F7D3A] text-xs font-extrabold border border-[#DCECCF]">
                  {report.interpretation?.parameters.find((p) => p.parameter.includes('Potassium'))?.status || 'Medium'}
                </span>
                <p className="text-xs text-[#667267] pt-2 border-t border-stone-200">
                  {report.interpretation?.parameters.find((p) => p.parameter.includes('Potassium'))?.explanation}
                </p>
              </div>

              {/* Organic Carbon */}
              <div className="p-5 rounded-2xl bg-[#F8FAF3] border border-[#3F7D3A]/15 space-y-2">
                <span className="text-xs font-bold text-[#667267]">Organic Carbon</span>
                <div className="text-3xl font-black text-[#285C32]">
                  {report.organicCarbon.value} <span className="text-sm font-normal text-[#667267]">{report.organicCarbon.unit}</span>
                </div>
                <span className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-extrabold border border-amber-200">
                  {report.interpretation?.parameters.find((p) => p.parameter.includes('Organic'))?.status || 'Medium'}
                </span>
                <p className="text-xs text-[#667267] pt-2 border-t border-stone-200">
                  {report.interpretation?.parameters.find((p) => p.parameter.includes('Organic'))?.explanation}
                </p>
              </div>

              {/* Electrical Conductivity if available */}
              {report.electricalConductivity && (
                <div className="p-5 rounded-2xl bg-[#F8FAF3] border border-[#3F7D3A]/15 space-y-2">
                  <span className="text-xs font-bold text-[#667267]">Electrical Conductivity (EC)</span>
                  <div className="text-3xl font-black text-[#285C32]">
                    {report.electricalConductivity.value} <span className="text-sm font-normal text-[#667267]">{report.electricalConductivity.unit}</span>
                  </div>
                  <span className="inline-block px-3 py-1 rounded-full bg-[#EEF5E8] text-[#3F7D3A] text-xs font-extrabold border border-[#DCECCF]">
                    Normal
                  </span>
                  <p className="text-xs text-[#667267] pt-2 border-t border-stone-200">
                    Measures total soluble salts in field soil.
                  </p>
                </div>
              )}
            </div>

            {/* Farm Soil Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-100 text-xs">
              <div className="p-4 rounded-xl bg-stone-50 border space-y-1">
                <span className="text-[#667267] font-semibold block">Soil Classification</span>
                <span className="font-extrabold text-[#285C32] text-sm block">{report.soilType}</span>
              </div>
              <div className="p-4 rounded-xl bg-stone-50 border space-y-1">
                <span className="text-[#667267] font-semibold block">Irrigation Availability</span>
                <span className="font-extrabold text-[#285C32] text-sm block">{report.irrigationType}</span>
              </div>
            </div>
          </div>

          {/* Simple Explanation Section */}
          <div className="p-6 md:p-8 rounded-3xl bg-white border border-[#3F7D3A]/15 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#3F7D3A]" />
              <h3 className="text-lg font-black text-[#285C32]">
                How should I understand this?
              </h3>
            </div>
            <div className="space-y-3 text-xs text-[#667267] leading-relaxed">
              <p>
                <strong className="text-[#285C32]">pH:</strong> Shows how acidic or alkaline the soil is. Neutral pH (6.0 - 7.5) maximizes plant uptake of N, P, K.
              </p>
              <p>
                <strong className="text-[#285C32]">Nitrogen:</strong> Important for plant growth, leaf canopy development, and green foliage synthesis.
              </p>
              <p>
                <strong className="text-[#285C32]">Phosphorus:</strong> Essential for root growth, early crop vigor, flowering, and seed pod formation.
              </p>
              <p>
                <strong className="text-[#285C32]">Potassium:</strong> Strengthens stalk health, protects against fungal diseases, and regulates drought transpiration.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function SoilReportDetailPage() {
  return (
    <ProtectedRoute>
      <SoilReportDetailContent />
    </ProtectedRoute>
  );
}
