'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { getFarmerProfile } from '@/lib/farmerService';
import { getLatestSoilReport } from '@/lib/soilService';
import {
  runCropRecommendationEngine,
  saveCropRecommendationSession,
  getRecommendationHistory,
} from '@/lib/cropRecommendationService';
import { FarmerProfile } from '@/types/farmer';
import { SoilReportRecord } from '@/types/soil';
import { RankedCropResult, SavedCropRecommendation } from '@/types/crop';
import { AppSidebar } from '@/components/app/AppSidebar';
import { AppHeader } from '@/components/app/AppHeader';
import { Button } from '@/components/ui/Button';
import {
  Sparkles,
  ArrowLeft,
  Check,
  Sprout,
  ChevronRight,
  CloudSun,
  Bot,
  Tractor,
  BookOpen,
  AlertCircle,
} from 'lucide-react';

function CropRecommendationContent() {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [soilReport, setSoilReport] = useState<SoilReportRecord | null>(null);

  // Form Inputs
  const [season, setSeason] = useState<'Kharif' | 'Rabi' | 'Zaid'>('Kharif');
  const [irrigation, setIrrigation] = useState<string>('Rain-fed');
  const [previousCrop, setPreviousCrop] = useState<string>('Soybean');
  const [currentCrop, setCurrentCrop] = useState<string>('');

  // Results State
  const [recommendations, setRecommendations] = useState<RankedCropResult[]>([]);
  const [engineLabel, setEngineLabel] = useState<string>('Initial rule-based recommendation');
  const [disclaimer, setDisclaimer] = useState<string>('');
  const [history, setHistory] = useState<SavedCropRecommendation[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  useEffect(() => {
    const p = getFarmerProfile();
    setProfile(p);
    if (p && p.irrigation) {
      setIrrigation(p.irrigation);
    }
    const latestSoil = getLatestSoilReport();
    setSoilReport(latestSoil);

    const initialHistory = getRecommendationHistory();
    setHistory(initialHistory);

    // Initial run
    handleGenerate(p, latestSoil, 'Kharif', p?.irrigation || 'Rain-fed', 'Soybean');
  }, []);

  const handleGenerate = (
    prof: FarmerProfile | null,
    soil: SoilReportRecord | null,
    selectedSeason: 'Kharif' | 'Rabi' | 'Zaid',
    selectedIrrigation: string,
    prevCrop: string
  ) => {
    setIsGenerating(true);

    const result = runCropRecommendationEngine({
      season: selectedSeason,
      irrigation: selectedIrrigation,
      soil: soil
        ? {
            ph: soil.ph,
            nitrogen: soil.nitrogen,
            phosphorus: soil.phosphorus,
            potassium: soil.potassium,
            organicCarbon: soil.organicCarbon,
            soilType: soil.soilType,
          }
        : undefined,
      location: prof
        ? {
            state: prof.state,
            district: prof.district,
            village: prof.village,
          }
        : undefined,
      previousCrop: prevCrop,
      currentCrop,
      landSize: prof?.landSize,
    });

    setRecommendations(result.recommendations);
    setEngineLabel(result.engineType);
    setDisclaimer(result.disclaimer);

    // Save session snapshot
    saveCropRecommendationSession(
      {
        season: selectedSeason,
        irrigation: selectedIrrigation,
        soil: soil
          ? {
              ph: soil.ph,
              nitrogen: soil.nitrogen,
              phosphorus: soil.phosphorus,
              potassium: soil.potassium,
              organicCarbon: soil.organicCarbon,
              soilType: soil.soilType,
            }
          : undefined,
        location: prof
          ? {
              state: prof.state,
              district: prof.district,
              village: prof.village,
            }
          : undefined,
        previousCrop: prevCrop,
        currentCrop,
        landSize: prof?.landSize,
      },
      result.recommendations
    );

    setHistory(getRecommendationHistory());
    setIsGenerating(false);
  };

  const onTriggerRecommendations = () => {
    handleGenerate(profile, soilReport, season, irrigation, previousCrop);
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-[#F8FAF3] flex flex-col">
      <AppHeader />

      <div className="flex flex-1">
        <AppSidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-6xl">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
            <div>
              <Link href="/app/dashboard" className="text-xs font-bold text-[#3F7D3A] hover:underline flex items-center gap-1 mb-1">
                <ArrowLeft className="w-3.5 h-3.5" /> {t('common.backToDashboard')}
              </Link>
              <h1 className="text-3xl sm:text-4xl font-black text-[#285C32]">
                {t('cropRec.title')}
              </h1>
              <p className="text-xs font-semibold text-[#667267] mt-1">
                {t('cropRec.subtitle')}
              </p>
            </div>

            <span className="px-3.5 py-1 bg-[#EEF5E8] text-[#3F7D3A] text-xs font-extrabold rounded-full border border-[#DCECCF]">
              {engineLabel}
            </span>
          </div>

          {/* YOUR FARM & SOIL SNAPSHOT SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* YOUR FARM Card */}
            <div className="p-6 rounded-3xl bg-white border border-[#3F7D3A]/20 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <Tractor className="w-5 h-5 text-[#3F7D3A]" />
                  <h2 className="text-lg font-black text-[#285C32]">{t('dashboard.myFarmInfo')}</h2>
                </div>
                <Link href="/app/farm" className="text-xs font-bold text-[#3F7D3A] hover:underline">
                  {t('dashboard.viewEditFarm')}
                </Link>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-stone-50">
                  <span className="text-[#667267]">{t('dashboard.location')}</span>
                  <strong className="text-[#285C32]">{profile.village}, {profile.district}, {profile.state}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-50">
                  <span className="text-[#667267]">{t('dashboard.landArea')}</span>
                  <strong className="text-[#285C32]">{profile.landSize} {profile.landUnit} ({profile.farmingType})</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#667267]">{t('dashboard.irrigation')}</span>
                  <strong className="text-[#3F7D3A]">{profile.irrigation}</strong>
                </div>
              </div>
            </div>

            {/* SOIL Card */}
            <div className="p-6 rounded-3xl bg-white border border-[#3F7D3A]/20 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-[#3F7D3A]" />
                  <h2 className="text-lg font-black text-[#285C32]">{t('dashboard.soilStatus')}</h2>
                </div>
                <Link href="/app/soil" className="text-xs font-bold text-[#3F7D3A] hover:underline">
                  {soilReport ? `Tested (${soilReport.testDate})` : `+ ${t('soil.addReport')}`}
                </Link>
              </div>

              {soilReport ? (
                <div className="grid grid-cols-5 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-[#F8FAF3] border">
                    <span className="text-[10px] text-[#667267] block font-bold">pH</span>
                    <strong className="text-sm text-[#285C32] block">{soilReport.ph}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-[#F8FAF3] border">
                    <span className="text-[10px] text-[#667267] block font-bold">N</span>
                    <strong className="text-xs text-[#285C32] block">{soilReport.nitrogen.value}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-[#F8FAF3] border">
                    <span className="text-[10px] text-[#667267] block font-bold">P</span>
                    <strong className="text-xs text-[#285C32] block">{soilReport.phosphorus.value}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-[#F8FAF3] border">
                    <span className="text-[10px] text-[#667267] block font-bold">K</span>
                    <strong className="text-xs text-[#285C32] block">{soilReport.potassium.value}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-[#F8FAF3] border">
                    <span className="text-[10px] text-[#667267] block font-bold">OC</span>
                    <strong className="text-xs text-[#285C32] block">{soilReport.organicCarbon.value}%</strong>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-bold flex items-center justify-between">
                  <span>{t('dashboard.soilNotAdded')}</span>
                  <Link href="/app/soil">
                    <Button size="sm">{t('dashboard.addSoilInfo')}</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* SEASON SELECTOR & RECOMMENDATION TRIGGER */}
          <div className="p-6 md:p-8 rounded-3xl bg-white border border-[#3F7D3A]/20 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h2 className="text-lg font-black text-[#285C32]">
                {t('cropRec.season')}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(['Kharif', 'Rabi', 'Zaid'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSeason(s)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    season === s
                      ? 'border-[#3F7D3A] bg-[#EEF5E8] ring-2 ring-[#3F7D3A]/20 text-[#285C32]'
                      : 'border-stone-200 bg-white hover:bg-[#F8FAF3] text-[#4F5E52]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-sm">{s} Season</span>
                    {season === s && <Check className="w-4 h-4 text-[#3F7D3A]" />}
                  </div>
                  <span className="text-xs text-[#667267] block">
                    {s === 'Kharif' && 'Monsoon (June — October)'}
                    {s === 'Rabi' && 'Winter (October — March)'}
                    {s === 'Zaid' && 'Summer (March — June)'}
                  </span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100 text-xs">
              <div>
                <label className="block font-bold text-[#285C32] mb-1">Previous Crop Rotation</label>
                <select
                  value={previousCrop}
                  onChange={(e) => setPreviousCrop(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-semibold bg-white"
                >
                  <option value="Soybean">Soybean</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Rice">Rice</option>
                  <option value="Maize">Maize</option>
                  <option value="Gram / Chickpea">Gram / Chickpea</option>
                  <option value="Mustard">Mustard</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Fallow / None">Fallow / None</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#285C32] mb-1">{t('dashboard.currentCrop')}</label>
                <input
                  type="text"
                  placeholder="e.g. Standing Soybean"
                  value={currentCrop}
                  onChange={(e) => setCurrentCrop(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-semibold bg-white"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                onClick={onTriggerRecommendations}
                disabled={isGenerating}
                icon={<Sparkles className="w-4 h-4 text-[#E8B94A]" />}
              >
                {isGenerating ? 'Evaluating Rules...' : t('cropRec.getRecommendations')}
              </Button>
            </div>
          </div>

          {/* RECOMMENDED CROPS RESULTS SECTION */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-[#285C32]">
              {t('cropRec.matches')} ({season} Season)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((item, idx) => (
                <div
                  key={item.crop}
                  className={`p-6 rounded-3xl bg-white border shadow-sm flex flex-col justify-between transition-all hover:shadow-md ${
                    idx === 0
                      ? 'border-2 border-[#3F7D3A] bg-gradient-to-b from-white to-[#F8FAF3]'
                      : 'border-[#3F7D3A]/15'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        {idx === 0 && (
                          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#EEF5E8] text-[#3F7D3A] border border-[#DCECCF] uppercase tracking-wider mb-1 inline-block">
                            Top Match
                          </span>
                        )}
                        <h3 className="text-xl font-black text-[#285C32]">
                          🌾 {item.crop}
                        </h3>
                        {item.scientificName && (
                          <div className="text-xs text-[#667267] italic font-mono">
                            {item.scientificName}
                          </div>
                        )}
                      </div>

                      {/* Rounded Integer Score */}
                      <div className="bg-[#3F7D3A] text-white px-3.5 py-1.5 rounded-2xl text-center shadow-sm shrink-0">
                        <span className="block text-lg font-black">{item.suitability}%</span>
                        <span className="block text-[8px] font-extrabold uppercase text-[#DCECCF]">Suitability</span>
                      </div>
                    </div>

                    {/* Why reasons */}
                    <div className="space-y-1.5 pt-2 border-t border-stone-100">
                      <div className="text-[11px] font-bold text-[#285C32]">Why:</div>
                      {item.reasons.map((reason, rIdx) => (
                        <div key={rIdx} className="flex items-start gap-1.5 text-xs text-[#3F7D3A] font-medium leading-tight">
                          <Check className="w-3.5 h-3.5 text-[#3F7D3A] shrink-0 mt-0.5" />
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>

                    {/* Why Not considerations if score is lower */}
                    {item.whyNot && item.whyNot.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-stone-100">
                        <div className="text-[11px] font-bold text-amber-800">Considerations:</div>
                        {item.whyNot.map((notReason, nIdx) => (
                          <div key={nIdx} className="flex items-start gap-1.5 text-[11px] text-stone-600 leading-tight">
                            <span className="text-amber-700 font-bold shrink-0">•</span>
                            <span>{notReason}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-stone-100">
                    <Link href={item.detailsUrl || `/app/crop-recommendation/${item.crop.split(' ')[0].toLowerCase()}`}>
                      <Button variant="secondary" size="sm" className="w-full justify-between" icon={<ChevronRight className="w-4 h-4" />}>
                        <span>{t('dashboard.open')}</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* WHAT SHOULD I DO NEXT? ACTION BANNER */}
          <div className="p-6 md:p-8 rounded-3xl bg-white border border-[#3F7D3A]/20 shadow-sm space-y-4">
            <h3 className="text-lg font-black text-[#285C32]">What should I do next?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link href="/app/weather">
                <Button variant="secondary" className="w-full justify-between" icon={<CloudSun className="w-4 h-4 text-[#6FA8B8]" />}>
                  <span>{t('dashboard.viewWeather')}</span>
                </Button>
              </Link>

              <Link href="/app/assistant">
                <Button variant="secondary" className="w-full justify-between" icon={<Bot className="w-4 h-4 text-[#3F7D3A]" />}>
                  <span>{t('dashboard.askAiBtn')}</span>
                </Button>
              </Link>

              <Link href={recommendations[0]?.detailsUrl || '/app/crop-recommendation/wheat'}>
                <Button variant="primary" className="w-full justify-between" icon={<BookOpen className="w-4 h-4" />}>
                  <span>View Crop Details</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* NON-PRETENTIOUS DISCLAIMER NOTICE */}
          <div className="p-4 rounded-2xl bg-[#FFF8E8] border border-[#E8B94A]/40 text-xs text-[#667267] flex items-start gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 text-[#E8B94A] shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-[#285C32] block">Agronomic Recommendation Notice:</strong>
              {disclaimer ||
                'This recommendation is informational and should be considered along with local agricultural guidance, current weather, water availability and market conditions.'}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

import { ProtectedRoute } from '@/components/app/ProtectedRoute';

export default function CropRecommendationPage() {
  return (
    <ProtectedRoute>
      <CropRecommendationContent />
    </ProtectedRoute>
  );
}
