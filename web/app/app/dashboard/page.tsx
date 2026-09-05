'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { getFarmerProfile } from '@/lib/farmerService';
import { getLatestSoilReport } from '@/lib/soilService';
import { FarmerProfile } from '@/types/farmer';
import { SoilReportRecord } from '@/types/soil';
import { formatCropDisplay } from '@/lib/cropDataset';
import { AppSidebar } from '@/components/app/AppSidebar';
import { AppHeader } from '@/components/app/AppHeader';
import { Button } from '@/components/ui/Button';
import {
  Sprout,
  Sparkles,
  CloudSun,
  Camera,
  Bot,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Tractor,
  MapPin,
} from 'lucide-react';

function DashboardContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const showCreatedToast = searchParams?.get('created') === 'true';

  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [soilReport, setSoilReport] = useState<SoilReportRecord | null>(null);

  useEffect(() => {
    setProfile(getFarmerProfile());
    setSoilReport(getLatestSoilReport());
  }, []);

  if (!profile) return null;

  const hasSoil = !!soilReport;

  const JOURNEY_STEPS = [
    {
      step: 1,
      title: t('onboarding.step1'),
      status: 'completed',
      detail: `${profile.village}, ${profile.district} • ${profile.landSize} ${profile.landUnit}`,
      href: '/app/farm',
      isComingSoon: false,
    },
    {
      step: 2,
      title: t('onboarding.step2'),
      status: hasSoil ? 'completed' : 'active',
      detail: hasSoil ? `Last tested: ${soilReport.testDate}` : t('dashboard.soilNotAdded'),
      href: '/app/soil',
      isComingSoon: false,
    },
    {
      step: 3,
      title: t('cropRec.season'),
      status: hasSoil ? 'active' : 'pending',
      detail: 'Kharif, Rabi, or Zaid crop planning',
      href: '/app/crop-recommendation',
      isComingSoon: false,
    },
    {
      step: 4,
      title: t('dashboard.cropRecTitle'),
      status: hasSoil ? 'active' : 'pending',
      detail: t('dashboard.cropRecDesc'),
      href: hasSoil ? '/app/crop-recommendation' : '/app/soil',
      isComingSoon: false,
    },
    {
      step: 5,
      title: t('dashboard.weatherTitle'),
      status: 'active',
      detail: t('dashboard.weatherDesc'),
      href: '/app/weather',
      isComingSoon: false,
    },
    {
      step: 6,
      title: t('dashboard.aiTitle'),
      status: 'active',
      detail: t('dashboard.askAiDesc'),
      href: '/app/assistant',
      isComingSoon: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF3] flex flex-col">
      <AppHeader />

      <div className="flex flex-1">
        <AppSidebar />

        {/* Dashboard Main Content */}
        <main className="flex-1 p-6 md:p-8 space-y-8 max-w-7xl">
          {/* Success Banner when coming from onboarding */}
          {showCreatedToast && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-bold flex items-center justify-between shadow-sm animate-in fade-in duration-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Your farm profile has been created successfully. Welcome to your Annadata dashboard!</span>
              </div>
            </div>
          )}

          {/* Welcome Banner */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-[#EEF5E8] via-[#F8FAF3] to-[#FFF8E8] border border-[#DCECCF] shadow-sm space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white text-[#3F7D3A] text-xs font-bold border border-[#DCECCF]">
                <Sprout className="w-4 h-4" />
                <span>Namaste, {profile.name}!</span>
              </div>
              <span className="px-3 py-1 bg-white text-[#3F7D3A] text-xs font-extrabold rounded-full border border-[#DCECCF]">
                {profile.structuredLocation?.source === 'device-geolocation' ? `📍 ${t('location.gpsVerified')}` : t('location.manualEntry')}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#285C32]">
              {t('dashboard.title')} — {profile.name}
            </h1>
            <p className="text-sm font-semibold text-[#667267] flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#3F7D3A]" />
              <span>📍 {profile.village}, {profile.district}, {profile.state} • {profile.landSize} {profile.landUnit}</span>
            </p>
          </div>

          {/* FARMER JOURNEY PROGRESS STEPPER */}
          <div className="p-6 md:p-8 rounded-3xl bg-white border border-[#3F7D3A]/20 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h2 className="text-lg font-black text-[#285C32]">
                {t('dashboard.journeyFlowTitle')}
              </h2>
              <span className="text-xs font-semibold text-[#667267]">
                {t('dashboard.journeyFlowSub')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
              {JOURNEY_STEPS.map((s) => {
                return (
                  <div
                    key={s.step}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                      s.status === 'completed'
                        ? 'bg-[#EEF5E8] border-[#DCECCF] text-[#285C32]'
                        : s.status === 'active'
                        ? 'bg-white border-[#3F7D3A] ring-2 ring-[#3F7D3A]/20'
                        : 'bg-stone-50 border-stone-200 text-stone-400'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-white/80">
                          {t('dashboard.stepLabel')} {s.step}
                        </span>
                        {s.status === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4 text-[#3F7D3A]" />
                        ) : s.isComingSoon ? (
                          <span className="text-[9px] font-extrabold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            {t('dashboard.comingSoon')}
                          </span>
                        ) : null}
                      </div>
                      <h3 className="text-xs font-black text-[#285C32] mb-1">{s.title}</h3>
                      <p className="text-[11px] text-[#667267] line-clamp-2">{s.detail}</p>
                    </div>

                    <Link href={s.href} className="mt-3 text-[11px] font-bold text-[#3F7D3A] hover:underline inline-flex items-center gap-1">
                      <span>{s.isComingSoon ? t('dashboard.preview') : t('dashboard.open')}</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Farm Profile Summary Card */}
          <div className="p-6 rounded-3xl bg-white border border-[#3F7D3A]/15 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h2 className="text-lg font-black text-[#285C32]">{t('dashboard.myFarmInfo')}</h2>
              <Link href="/app/farm" className="text-xs font-bold text-[#3F7D3A] hover:underline flex items-center gap-1">
                <Tractor className="w-3.5 h-3.5" /> {t('dashboard.viewEditFarm')}
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#F8FAF3] border border-stone-200">
                <span className="text-[#667267] font-semibold block">{t('dashboard.location')}</span>
                <span className="font-extrabold text-[#285C32] block mt-0.5">{profile.village}, {profile.district}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F8FAF3] border border-stone-200">
                <span className="text-[#667267] font-semibold block">{t('dashboard.state')}</span>
                <span className="font-extrabold text-[#285C32] block mt-0.5">{profile.state}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F8FAF3] border border-stone-200">
                <span className="text-[#667267] font-semibold block">{t('dashboard.currentCrop')}</span>
                <span className="font-extrabold text-[#3F7D3A] block mt-0.5">
                  {profile.currentCrop ? formatCropDisplay(profile.currentCrop) : profile.mainCrop}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F8FAF3] border border-stone-200">
                <span className="text-[#667267] font-semibold block">{t('dashboard.landArea')}</span>
                <span className="font-extrabold text-[#285C32] block mt-0.5">{profile.landSize} {profile.landUnit}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F8FAF3] border border-stone-200">
                <span className="text-[#667267] font-semibold block">{t('dashboard.irrigation')}</span>
                <span className="font-extrabold text-[#285C32] block mt-0.5">{profile.irrigation}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F8FAF3] border border-stone-200">
                <span className="text-[#667267] font-semibold block">{t('dashboard.language')}</span>
                <span className="font-extrabold text-[#285C32] block mt-0.5">{profile.language}</span>
              </div>
            </div>
          </div>

          {/* Module Action Cards Grid */}
          <div>
            <h2 className="text-xl font-black text-[#285C32] mb-4">
              {t('dashboard.farmerActionModules')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* CARD 1: SOIL HEALTH */}
              <div className="p-6 rounded-3xl bg-white border border-[#3F7D3A]/20 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-[#EEF5E8]">
                      <Sprout className="w-6 h-6 text-[#3F7D3A]" />
                    </div>
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-[#EEF5E8] text-[#3F7D3A] border border-[#DCECCF]">
                      {hasSoil ? t('dashboard.soilReportActive') : t('dashboard.actionRequired')}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-[#285C32] mb-1">🌱 {t('navbar.soilHealth', 'Soil Health')}</h3>
                  {hasSoil ? (
                    <div className="space-y-2 mb-4 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-stone-500">
                          Last tested: <strong>{new Date(soilReport.testDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</strong>
                        </span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                          soilReport.interpretation?.overallStatus === 'GOOD'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-900 border-amber-300'
                        }`}>
                          {soilReport.interpretation?.overallStatus || 'BALANCED'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-[#667267] font-semibold bg-[#F8FAF3] p-2.5 rounded-xl border border-stone-100">
                        <span>pH: <strong className="text-[#285C32]">{soilReport.ph}</strong></span>
                        <span>•</span>
                        <span>OC: <strong>{soilReport.organicCarbon?.value}%</strong></span>
                        <span>•</span>
                        <span>N: <strong>{soilReport.nitrogen?.value}</strong></span>
                        <span>P: <strong>{soilReport.phosphorus?.value}</strong></span>
                        <span>K: <strong>{soilReport.potassium?.value}</strong></span>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <p className="text-xs font-bold text-amber-700 mb-1">{t('dashboard.soilNotAdded', 'No verified soil test added')}</p>
                      <p className="text-xs text-[#667267] leading-relaxed">
                        {t('dashboard.soilCardDesc', 'Upload your Soil Health Card report to unlock AI crop recommendations.')}
                      </p>
                    </div>
                  )}
                </div>

                <Link href="/app/soil" className="pt-3 border-t border-stone-100">
                  <Button variant={hasSoil ? 'secondary' : 'primary'} size="sm" className="w-full justify-between" icon={<ArrowRight className="w-4 h-4" />}>
                    <span>{hasSoil ? 'View Current Soil Position' : 'Upload Soil Report'}</span>
                  </Button>
                </Link>
              </div>

              {/* CARD 2: CROP RECOMMENDATION */}
              <div className="p-6 rounded-3xl bg-white border border-[#3F7D3A]/20 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-[#FFF8E8]">
                      <Sparkles className="w-6 h-6 text-[#E8B94A]" />
                    </div>
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-[#FFF8E8] text-[#9A7048] border border-[#E8B94A]/30">
                      Rule Engine Active
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-[#285C32] mb-1">🌾 {t('navbar.cropRecommendation')}</h3>
                  <p className="text-xs font-bold text-[#3F7D3A] mb-2">
                    {hasSoil ? t('dashboard.findSuitableCrops') : t('dashboard.addSoilFirst')}
                  </p>
                  <p className="text-xs text-[#667267] leading-relaxed mb-6">
                    {t('dashboard.cropRecDesc')}
                  </p>
                </div>

                <Link href={hasSoil ? '/app/crop-recommendation' : '/app/soil'} className="pt-3 border-t border-stone-100">
                  <Button variant="secondary" size="sm" className="w-full justify-between" icon={<ArrowRight className="w-4 h-4" />}>
                    <span>{hasSoil ? t('dashboard.getRecommendations') : t('dashboard.addSoilFirst')}</span>
                  </Button>
                </Link>
              </div>

              {/* CARD 3: WEATHER (ACTIVE MODULE) */}
              <div className="p-6 rounded-3xl bg-white border border-[#3F7D3A]/20 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-[#EAF5F5]">
                      <CloudSun className="w-6 h-6 text-[#6FA8B8]" />
                    </div>
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-[#EAF5F5] text-[#2C6B7A] border border-[#6FA8B8]/30">
                      {t('dashboard.liveTelemetryActive')}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-[#285C32] mb-1">🌦 {t('weather.title')}</h3>
                  <p className="text-xs font-bold text-[#3F7D3A] mb-2">{t('weather.subtitle')}</p>
                  <p className="text-xs text-[#667267] leading-relaxed mb-6">
                    {t('dashboard.weatherDesc')}
                  </p>
                </div>

                <Link href="/app/weather" className="pt-3 border-t border-stone-100">
                  <Button variant="secondary" size="sm" className="w-full justify-between" icon={<ArrowRight className="w-4 h-4" />}>
                    <span>{t('dashboard.viewWeather')}</span>
                  </Button>
                </Link>
              </div>

              {/* CARD 4: CROP HEALTH SCAN (ACTIVE MODULE) */}
              <div className="p-6 rounded-3xl bg-white border border-[#3F7D3A]/20 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-[#EEF5E8]">
                      <Camera className="w-6 h-6 text-[#3F7D3A]" />
                    </div>
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-[#EEF5E8] text-[#3F7D3A] border border-[#DCECCF]">
                      AI Diagnostic Active
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-[#285C32] mb-1">📷 Crop Health Scan</h3>
                  <p className="text-xs font-bold text-[#3F7D3A] mb-2">Leaf Symptom & Disease Identifier</p>
                  <p className="text-xs text-[#667267] leading-relaxed mb-6">
                    Upload leaf or stem photographs to detect visible symptom patterns, yellow mosaic virus, or fungal spots with immediate organic and chemical remedies.
                  </p>
                </div>

                <Link href="/app/crop-health" className="pt-3 border-t border-stone-100">
                  <Button variant="primary" size="sm" className="w-full justify-between" icon={<ArrowRight className="w-4 h-4" />}>
                    <span>Scan Crop Health</span>
                  </Button>
                </Link>
              </div>

              {/* CARD 5: ASK ANNADATA AI (ACTIVE MODULE) */}
              <div className="p-6 rounded-3xl bg-white border border-[#3F7D3A]/20 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-[#EEF5E8]">
                      <Bot className="w-6 h-6 text-[#3F7D3A]" />
                    </div>
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-[#EEF5E8] text-[#3F7D3A] border border-[#DCECCF]">
                      {t('dashboard.multilingualAiActive', 'Multilingual AI Active')}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-[#285C32] mb-1">🤖 Ask Annadata AI</h3>
                  <p className="text-xs font-bold text-[#3F7D3A] mb-2">{t('dashboard.askAiSub', 'Multilingual Voice & Text Assistant')}</p>
                  <p className="text-xs text-[#667267] leading-relaxed mb-6">
                    {t('dashboard.askAiDesc', 'Multilingual conversational AI trained on Indian agricultural extension guidance.')}
                  </p>
                </div>

                <Link href="/app/assistant" className="pt-3 border-t border-stone-100">
                  <Button variant="primary" size="sm" className="w-full justify-between" icon={<ArrowRight className="w-4 h-4" />}>
                    <span>{t('dashboard.askAiBtn', 'Ask AI Assistant')}</span>
                  </Button>
                </Link>
              </div>

              {/* CARD 6: MARKET & MANDI PRICES (ACTIVE MODULE) */}
              <div className="p-6 rounded-3xl bg-white border border-[#D8B45A]/40 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-[#FFF8E8]">
                      <TrendingUp className="w-6 h-6 text-[#9A7048]" />
                    </div>
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-[#FFF8E8] text-[#9A7048] border border-[#E8B94A]/30">
                      Live Mandi Rates Active
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-[#285C32] mb-1">💰 Market & Mandi Prices</h3>
                  <p className="text-xs font-bold text-[#9A7048] mb-2">Crop prices & nearby APMC Mandi trends</p>
                  <p className="text-xs text-[#667267] leading-relaxed mb-6">
                    Track local Mandi price trends, MSP government benchmarks, and seasonal commodity arrivals to choose the best selling window.
                  </p>
                </div>

                <Link href="/app/market" className="pt-3 border-t border-stone-100">
                  <Button variant="primary" size="sm" className="w-full justify-between" icon={<ArrowRight className="w-4 h-4" />}>
                    <span>View Mandi Prices</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

import { ProtectedRoute } from '@/components/app/ProtectedRoute';

export default function FarmerDashboardPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div className="min-h-screen bg-[#F8FAF3] flex items-center justify-center text-xs text-[#3F7D3A] font-bold">Loading Farmer Dashboard...</div>}>
        <DashboardContent />
      </Suspense>
    </ProtectedRoute>
  );
}
