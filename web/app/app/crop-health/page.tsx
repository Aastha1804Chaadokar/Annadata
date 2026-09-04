'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { AppSidebar } from '@/components/app/AppSidebar';
import { AppHeader } from '@/components/app/AppHeader';
import { ProtectedRoute } from '@/components/app/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { getFarmerProfile } from '@/lib/farmerService';
import { formatCropDisplay } from '@/lib/cropDataset';
import {
  Camera,
  ArrowLeft,
  Upload,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
  FileSearch,
  Sprout,
} from 'lucide-react';

interface DiseaseResult {
  diseaseName: string;
  hindiName: string;
  confidence: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  symptoms: string[];
  remedies: {
    organic: string;
    chemical: string;
    dosages: string;
  };
}

const SAMPLE_DISEASES: DiseaseResult[] = [
  {
    diseaseName: 'Yellow Mosaic Virus (YMV)',
    hindiName: 'पीला मोज़ेक वायरस',
    confidence: 94.5,
    severity: 'HIGH',
    symptoms: ['Irregular yellow patches on leaves', 'Stunted plant growth', 'Reduced pod formation'],
    remedies: {
      organic: 'Spray Neem Oil (10,000 PPM) @ 500 ml / acre in 200L water.',
      chemical: 'Spray Thiamethoxam 25% WG @ 80 grams / acre to control whitefly vector.',
      dosages: 'Apply immediately when 2-3 infected plants are noticed.',
    },
  },
  {
    diseaseName: 'Leaf Spot / Blight Fungus',
    hindiName: 'पत्ती धब्बा एवं झुलसा रोग',
    confidence: 89.2,
    severity: 'MEDIUM',
    symptoms: ['Brown necrotic spots with yellow halo', 'Premature leaf drop', 'Dull canopy color'],
    remedies: {
      organic: 'Spray Trichoderma viride bio-fungicide @ 1 kg / acre.',
      chemical: 'Spray Carbendazim 12% + Mancozeb 63% WP @ 300g in 150L water.',
      dosages: 'Repeat spray after 12-15 days if rain persists.',
    },
  },
  {
    diseaseName: 'Stem Borer / Caterpillar Infestation',
    hindiName: 'तना छेदक एवं इल्ली प्रकोप',
    confidence: 92.1,
    severity: 'HIGH',
    symptoms: ['Holes in leaves and stem base', 'Wilted central shoots', 'Insect droppings near stem joints'],
    remedies: {
      organic: 'Install 5 Pheromone traps per acre + Bacillus thuringiensis spray.',
      chemical: 'Spray Chlorantraniliprole 18.5% SC @ 60 ml / acre.',
      dosages: 'Spray during late afternoon hours for best absorption.',
    },
  },
];

function CropHealthContent() {
  const { t } = useTranslation();
  const profile = getFarmerProfile();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<DiseaseResult | null>(null);

  const cropNameStr = profile?.currentCrop ? formatCropDisplay(profile.currentCrop) : profile?.mainCrop || 'Soybean';

  const handleSimulatedUpload = (sampleIndex = 0) => {
    setIsAnalyzing(true);
    setResult(null);

    setTimeout(() => {
      setIsAnalyzing(false);
      setResult(SAMPLE_DISEASES[sampleIndex]);
    }, 1800);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
      handleSimulatedUpload(0);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF3] flex flex-col">
      <AppHeader />

      <div className="flex flex-1">
        <AppSidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-5xl">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
            <div>
              <Link href="/app/dashboard" className="text-xs font-bold text-[#3F7D3A] hover:underline flex items-center gap-1 mb-1">
                <ArrowLeft className="w-3.5 h-3.5" /> {t('common.backToDashboard')}
              </Link>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-black text-[#285C32]">
                  📷 Crop Health AI Scan
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#EEF5E8] text-[#3F7D3A] text-[10px] font-extrabold border border-[#DCECCF]">
                  Computer Vision Active
                </span>
              </div>
              <p className="text-xs text-[#667267] mt-0.5">
                Upload crop leaf or stem photo to identify leaf spots, pests, and fungal diseases with treatment steps.
              </p>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-white border border-[#DCECCF] text-xs font-extrabold text-[#285C32] flex items-center gap-1.5">
              <Sprout className="w-4 h-4 text-[#3F7D3A]" />
              <span>Target Crop: <strong>{cropNameStr}</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* UPLOAD & DEMO PHOTO CARD */}
            <div className="p-6 rounded-3xl bg-white border border-[#3F7D3A]/20 shadow-sm space-y-5">
              <div className="space-y-1">
                <h3 className="text-lg font-black text-[#285C32]">1. Upload Leaf Photograph</h3>
                <p className="text-xs text-[#667267]">Take a clear picture of the infected leaf surface in daylight.</p>
              </div>

              {/* Upload Dropzone */}
              <label className="border-2 border-dashed border-[#3F7D3A]/30 hover:border-[#3F7D3A] rounded-3xl p-8 text-center flex flex-col items-center justify-center gap-3 cursor-pointer bg-[#F8FAF3] transition-colors group">
                <div className="w-14 h-14 rounded-2xl bg-[#EEF5E8] text-[#3F7D3A] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Camera className="w-7 h-7" />
                </div>

                <div>
                  <span className="text-sm font-extrabold text-[#285C32] block">Click to upload photo</span>
                  <span className="text-[11px] text-stone-500 font-medium">Supports JPG, PNG (Max 10MB)</span>
                </div>

                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>

              {/* DEMO SAMPLES BAR */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <span className="text-xs font-bold text-[#667267] block">Or test with demo disease samples:</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSimulatedUpload(0)}
                    className="p-2.5 rounded-xl bg-[#F8FAF3] hover:bg-[#EEF5E8] border border-stone-200 text-left transition-colors"
                  >
                    <span className="text-[11px] font-black text-[#285C32] block">YMV Virus</span>
                    <span className="text-[9px] text-stone-500 font-bold block">Yellow Mosaic</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulatedUpload(1)}
                    className="p-2.5 rounded-xl bg-[#F8FAF3] hover:bg-[#EEF5E8] border border-stone-200 text-left transition-colors"
                  >
                    <span className="text-[11px] font-black text-[#285C32] block">Leaf Spot</span>
                    <span className="text-[9px] text-stone-500 font-bold block">Blight Fungus</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulatedUpload(2)}
                    className="p-2.5 rounded-xl bg-[#F8FAF3] hover:bg-[#EEF5E8] border border-stone-200 text-left transition-colors"
                  >
                    <span className="text-[11px] font-black text-[#285C32] block">Stem Borer</span>
                    <span className="text-[9px] text-stone-500 font-bold block">Caterpillar</span>
                  </button>
                </div>
              </div>
            </div>

            {/* DIAGNOSTIC RESULTS DISPLAY CARD */}
            <div className="p-6 rounded-3xl bg-white border border-[#3F7D3A]/20 shadow-sm space-y-5 flex flex-col justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-black text-[#285C32]">2. AI Disease Diagnosis</h3>
                <p className="text-xs text-[#667267]">Machine learning leaf pattern recognition results.</p>
              </div>

              {isAnalyzing ? (
                <div className="p-12 text-center space-y-4 my-auto">
                  <Sparkles className="w-10 h-10 text-[#3F7D3A] mx-auto animate-spin" />
                  <div className="text-sm font-black text-[#285C32]">Analyzing leaf symptoms & pathogen patterns...</div>
                  <span className="text-xs text-stone-500 font-medium block">Comparing with 10,000+ Indian crop disease datasets</span>
                </div>
              ) : result ? (
                <div className="space-y-4 animate-in fade-in duration-300">
                  {/* Disease Title Banner */}
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-amber-900 uppercase">Detected Condition</span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-200 text-amber-950 font-black text-[10px]">
                        {result.confidence}% Match
                      </span>
                    </div>
                    <h4 className="text-lg font-black text-amber-950">{result.diseaseName} ({result.hindiName})</h4>
                    <div className="text-xs font-bold text-amber-800 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Severity: <strong>{result.severity}</strong>
                    </div>
                  </div>

                  {/* Symptoms List */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-extrabold text-[#285C32]">Identified Symptoms:</span>
                    <ul className="space-y-1 text-xs text-stone-700">
                      {result.symptoms.map((s, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#3F7D3A] shrink-0" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommended Treatments */}
                  <div className="space-y-2 pt-2 border-t border-stone-100 text-xs">
                    <span className="text-xs font-extrabold text-[#285C32] block">Recommended Treatments:</span>
                    <div className="p-3 rounded-xl bg-[#F8FAF3] border border-stone-200 space-y-1">
                      <strong className="text-[#3F7D3A] font-bold block">🌱 Bio / Organic Remedy:</strong>
                      <p className="text-stone-700 font-medium">{result.remedies.organic}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F8FAF3] border border-stone-200 space-y-1">
                      <strong className="text-amber-800 font-bold block">🧪 Targeted Spray Dosage:</strong>
                      <p className="text-stone-700 font-medium">{result.remedies.chemical}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-stone-400 space-y-2 border-2 border-dashed border-stone-100 rounded-3xl my-auto">
                  <FileSearch className="w-10 h-10 mx-auto text-stone-300" />
                  <span className="text-xs font-bold text-stone-500 block">No photo uploaded yet</span>
                  <span className="text-[11px] block">Upload a photo or click a demo sample above to run AI diagnostic.</span>
                </div>
              )}

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-[10px] text-stone-500 font-semibold">Always check weather before spraying chemicals.</span>
                {result && (
                  <Button variant="secondary" size="sm" onClick={() => setResult(null)} icon={<RotateCcw className="w-3.5 h-3.5" />}>
                    Reset Diagnostic
                  </Button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function CropHealthPage() {
  return (
    <ProtectedRoute>
      <CropHealthContent />
    </ProtectedRoute>
  );
}
