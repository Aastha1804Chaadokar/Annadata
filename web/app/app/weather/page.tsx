'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { getFarmerProfile } from '@/lib/farmerService';
import { getWeatherData } from '@/lib/weatherService';
import { FarmerProfile } from '@/types/farmer';
import { WeatherData } from '@/types/weather';
import { AppSidebar } from '@/components/app/AppSidebar';
import { AppHeader } from '@/components/app/AppHeader';
import { ProtectedRoute } from '@/components/app/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { formatCropDisplay } from '@/lib/cropDataset';
import {
  CloudSun,
  ArrowLeft,
  RefreshCw,
  MapPin,
  Droplets,
  Wind,
  CloudRain,
  Sun,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Compass,
  Gauge,
  Sprout,
  ShieldAlert,
  ChevronRight,
  Info,
} from 'lucide-react';

function WeatherDashboardContent() {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const loadWeather = async () => {
    setIsRefreshing(true);
    const p = getFarmerProfile();
    setProfile(p);
    const wData = await getWeatherData(p);
    setWeather(wData);
    setIsLoading(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadWeather();
  }, []);

  if (isLoading || !profile || !weather) {
    return (
      <div className="min-h-screen bg-[#F8FAF3] flex flex-col">
        <AppHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <main className="flex-1 p-8 flex items-center justify-center">
            <div className="text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-[#3F7D3A] animate-spin mx-auto" />
              <div className="font-bold text-sm text-[#285C32]">{t('weather.fetchingForecast', 'Fetching micro-climate forecast for your farm...')}</div>
              <p className="text-xs text-[#667267]">{t('weather.connectingTelemetry', 'Connecting to local weather telemetry...')}</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const cropNameStr = profile.currentCrop ? formatCropDisplay(profile.currentCrop) : profile.mainCrop || 'Soybean';

  return (
    <div className="min-h-screen bg-[#F8FAF3] flex flex-col">
      <AppHeader />

      <div className="flex flex-1">
        <AppSidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-6xl">
          {/* Top Breadcrumb & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
            <div>
              <Link href="/app/dashboard" className="text-xs font-bold text-[#3F7D3A] hover:underline flex items-center gap-1 mb-1">
                <ArrowLeft className="w-3.5 h-3.5" /> {t('common.backToDashboard')}
              </Link>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-black text-[#285C32]">
                  🌦 {t('weather.title')}
                </h1>
                {weather.isMockData && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold border border-amber-300">
                    {t('weather.offlineMode', 'Offline Simulation')}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#667267] mt-0.5">
                {t('weather.subtitle')}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={loadWeather}
                disabled={isRefreshing}
                icon={<RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />}
              >
                {isRefreshing ? t('weather.updatingWeather', 'Updating Weather...') : t('weather.refreshWeather', 'Refresh Weather')}
              </Button>
            </div>
          </div>

          {/* Farm Location Header Banner */}
          <div className="p-5 rounded-3xl bg-white border border-[#3F7D3A]/20 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#EEF5E8] text-[#3F7D3A]">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#667267] uppercase tracking-wider block">{t('location.state', 'Farm Location')}</span>
                <strong className="text-base font-extrabold text-[#285C32]">{weather.locationName}</strong>
                {profile.latitude && profile.longitude && (
                  <div className="text-[11px] font-semibold text-[#3F7D3A]">
                    {t('location.coordinates')}: {profile.latitude.toFixed(4)}°, {profile.longitude.toFixed(4)}°
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-[#667267] bg-[#F8FAF3] px-4 py-2.5 rounded-2xl border border-stone-200">
              <div className="flex items-center gap-1.5">
                <Sprout className="w-4 h-4 text-[#3F7D3A]" />
                <span>{t('dashboard.currentCrop')}: <strong className="text-[#285C32]">{cropNameStr}</strong></span>
              </div>
              <span className="text-stone-300">|</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#3F7D3A]" />
                <span>{t('weather.updated', 'Updated')}: {weather.current.updatedAt}</span>
              </div>
            </div>
          </div>

          {/* HERO WEATHER CARD + QUICK METRICS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Main Current Temperature Card */}
            <div className="lg:col-span-1 p-6 rounded-3xl bg-gradient-to-br from-[#285C32] to-[#3F7D3A] text-white shadow-md space-y-6 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                  {t('weather.currentClimate')}
                </span>
                <CloudSun className="w-8 h-8 text-amber-300" />
              </div>

              <div>
                <div className="text-5xl font-black tracking-tight flex items-baseline gap-1">
                  <span>{weather.current.temperature}°</span>
                  <span className="text-2xl font-bold opacity-80">C</span>
                </div>
                <div className="text-xs text-emerald-100 font-semibold mt-1">
                  {t('weather.feelsLike')} {weather.current.apparentTemperature}°C • {weather.current.condition}
                </div>
              </div>

              <div className="pt-4 border-t border-white/20 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-emerald-100/70 text-[10px] uppercase font-bold block">{t('weather.rainChance')}</span>
                  <strong className="text-white text-sm">{weather.current.precipitationProb}%</strong>
                </div>
                <div>
                  <span className="text-emerald-100/70 text-[10px] uppercase font-bold block">{t('weather.windSpeed')}</span>
                  <strong className="text-white text-sm">{weather.current.windSpeed} km/h</strong>
                </div>
              </div>
            </div>

            {/* Right: Detailed Telemetry Grid */}
            <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-[#3F7D3A]/15 shadow-sm space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#667267]">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  <span>{t('weather.humidity')}</span>
                </div>
                <div className="text-2xl font-black text-[#285C32]">{weather.current.humidity}%</div>
                <span className="text-[10px] font-semibold text-[#3F7D3A] block">{t('weather.soilAirMoisture', 'Relative soil-air moisture')}</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#3F7D3A]/15 shadow-sm space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#667267]">
                  <Wind className="w-4 h-4 text-teal-600" />
                  <span>{t('weather.windSpeed')}</span>
                </div>
                <div className="text-2xl font-black text-[#285C32]">{weather.current.windSpeed} <span className="text-xs font-normal">km/h</span></div>
                <span className="text-[10px] font-semibold text-[#3F7D3A] block">{t('weather.direction', 'Direction')}: {weather.current.windDirection}° SW</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#3F7D3A]/15 shadow-sm space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#667267]">
                  <CloudRain className="w-4 h-4 text-sky-600" />
                  <span>{t('weather.rainChance')}</span>
                </div>
                <div className="text-2xl font-black text-[#285C32]">{weather.current.precipitationProb}%</div>
                <span className="text-[10px] font-semibold text-[#3F7D3A] block">{t('weather.next24h', 'Next 24 hours probability')}</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#3F7D3A]/15 shadow-sm space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#667267]">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>{t('weather.uvIndex')}</span>
                </div>
                <div className="text-2xl font-black text-[#285C32]">{weather.current.uvIndex} <span className="text-xs font-semibold text-amber-600">{t('weather.high', 'High')}</span></div>
                <span className="text-[10px] font-semibold text-[#3F7D3A] block">{t('weather.solarIndex', 'Solar radiation index')}</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#3F7D3A]/15 shadow-sm space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#667267]">
                  <Gauge className="w-4 h-4 text-indigo-500" />
                  <span>{t('weather.pressure')}</span>
                </div>
                <div className="text-2xl font-black text-[#285C32]">{weather.current.pressure} <span className="text-xs font-normal">hPa</span></div>
                <span className="text-[10px] font-semibold text-[#3F7D3A] block">{t('weather.barometric', 'Barometric pressure')}</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#EEF5E8] border border-[#DCECCF] space-y-1 flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#3F7D3A]">
                  <Compass className="w-4 h-4" />
                  <span>{t('weather.status')}</span>
                </div>
                <div className="text-sm font-extrabold text-[#285C32]">{weather.current.condition}</div>
                <span className="text-[10px] font-bold text-[#3F7D3A]">{t('dashboard.liveTelemetryActive')}</span>
              </div>
            </div>
          </div>

          {/* AGRICULTURAL ACTION ADVISORIES BAR (CRUCIAL MODULE REQUIREMENT) */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#3F7D3A]" />
                <h2 className="text-xl font-black text-[#285C32]">
                  🌾 {t('weather.advisoriesTitle', 'Agricultural Field Action Advisories')}
                </h2>
              </div>
              <span className="text-xs font-bold text-[#667267]">{t('weather.evaluatedFor', 'Evaluated for')} {cropNameStr}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 1. IRRIGATION ADVISORY */}
              <div className={`p-6 rounded-3xl border shadow-sm space-y-3 flex flex-col justify-between ${
                weather.advisories.irrigation.status === 'HOLD'
                  ? 'bg-amber-50/70 border-amber-200'
                  : weather.advisories.irrigation.status === 'URGENT'
                  ? 'bg-red-50/70 border-red-200'
                  : 'bg-emerald-50/70 border-emerald-200'
              }`}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                      weather.advisories.irrigation.status === 'HOLD'
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : weather.advisories.irrigation.status === 'URGENT'
                        ? 'bg-red-100 text-red-900 border-red-300'
                        : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    }`}>
                      {weather.advisories.irrigation.status}
                    </span>
                    <Droplets className="w-5 h-5 text-blue-600" />
                  </div>

                  <h3 className="text-base font-extrabold text-[#285C32]">
                    💧 {weather.advisories.irrigation.title}
                  </h3>

                  <p className="text-xs font-bold text-stone-700">
                    {weather.advisories.irrigation.message}
                  </p>

                  <p className="text-xs text-[#667267] leading-relaxed">
                    {weather.advisories.irrigation.recommendation}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-200/60 space-y-1 text-[11px] text-[#4F5E52]">
                  {weather.advisories.irrigation.details.map((d, idx) => (
                    <div key={idx} className="flex items-start gap-1">
                      <span>•</span>
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. SPRAYING ADVISORY */}
              <div className={`p-6 rounded-3xl border shadow-sm space-y-3 flex flex-col justify-between ${
                weather.advisories.spraying.status === 'AVOID'
                  ? 'bg-red-50/70 border-red-200'
                  : weather.advisories.spraying.status === 'CAUTION'
                  ? 'bg-amber-50/70 border-amber-200'
                  : 'bg-emerald-50/70 border-emerald-200'
              }`}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                      weather.advisories.spraying.status === 'AVOID'
                        ? 'bg-red-100 text-red-900 border-red-300'
                        : weather.advisories.spraying.status === 'CAUTION'
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    }`}>
                      {weather.advisories.spraying.status}
                    </span>
                    <Wind className="w-5 h-5 text-teal-600" />
                  </div>

                  <h3 className="text-base font-extrabold text-[#285C32]">
                    🚜 {weather.advisories.spraying.title}
                  </h3>

                  <p className="text-xs font-bold text-stone-700">
                    {weather.advisories.spraying.message}
                  </p>

                  <p className="text-xs text-[#667267] leading-relaxed">
                    {weather.advisories.spraying.recommendation}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-200/60 space-y-1 text-[11px] text-[#4F5E52]">
                  {weather.advisories.spraying.details.map((d, idx) => (
                    <div key={idx} className="flex items-start gap-1">
                      <span>•</span>
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. HARVESTING / FIELD ACTIVITY ADVISORY */}
              <div className={`p-6 rounded-3xl border shadow-sm space-y-3 flex flex-col justify-between ${
                weather.advisories.harvesting.status === 'UNSUITABLE'
                  ? 'bg-amber-50/70 border-amber-200'
                  : 'bg-emerald-50/70 border-emerald-200'
              }`}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                      weather.advisories.harvesting.status === 'UNSUITABLE'
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    }`}>
                      {weather.advisories.harvesting.status}
                    </span>
                    <Sun className="w-5 h-5 text-amber-500" />
                  </div>

                  <h3 className="text-base font-extrabold text-[#285C32]">
                    🌾 {weather.advisories.harvesting.title}
                  </h3>

                  <p className="text-xs font-bold text-stone-700">
                    {weather.advisories.harvesting.message}
                  </p>

                  <p className="text-xs text-[#667267] leading-relaxed">
                    {weather.advisories.harvesting.recommendation}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-200/60 space-y-1 text-[11px] text-[#4F5E52]">
                  {weather.advisories.harvesting.details.map((d, idx) => (
                    <div key={idx} className="flex items-start gap-1">
                      <span>•</span>
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* HOURLY FORECAST SLIDER (NEXT 24 HOURS) */}
          <div className="p-6 rounded-3xl bg-white border border-[#3F7D3A]/20 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-[#285C32]">
                ⏱ {t('weather.hourlyTimeline')}
              </h3>
              <span className="text-xs font-semibold text-[#667267]">{t('weather.hourlySubtitle', 'Hourly Temperature & Rain Chance')}</span>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
              {weather.hourly.map((item, idx) => (
                <div
                  key={idx}
                  className="min-w-[110px] p-3.5 rounded-2xl bg-[#F8FAF3] border border-stone-200 text-center space-y-2 shrink-0 hover:border-[#3F7D3A] transition-colors"
                >
                  <span className="text-xs font-bold text-[#667267] block">{item.time}</span>
                  <CloudSun className="w-6 h-6 text-[#3F7D3A] mx-auto" />
                  <div className="text-lg font-black text-[#285C32]">{item.temp}°C</div>
                  <div className="flex items-center justify-center gap-1 text-[11px] text-sky-700 font-bold">
                    <CloudRain className="w-3 h-3" />
                    <span>{item.rainProb}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 7-DAY WEATHER OUTLOOK */}
          <div className="p-6 rounded-3xl bg-white border border-[#3F7D3A]/20 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-[#285C32]">
                📅 {t('weather.dailyForecast')}
              </h3>
              <span className="text-xs font-semibold text-[#667267]">{t('weather.villageWeather', 'Village level weather trend')}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {weather.daily.map((day, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border text-center space-y-2 transition-all ${
                    idx === 0
                      ? 'bg-[#EEF5E8] border-[#3F7D3A]/40 shadow-sm'
                      : 'bg-[#F8FAF3] border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <span className="text-xs font-extrabold text-[#285C32] block">{day.dayName}</span>
                  <div className="text-[11px] text-[#667267] truncate font-medium">{day.condition}</div>

                  <CloudSun className="w-7 h-7 text-[#3F7D3A] mx-auto my-1" />

                  <div className="text-sm font-black text-[#285C32]">
                    {day.tempMax}° / <span className="text-xs text-stone-500 font-semibold">{day.tempMin}°C</span>
                  </div>

                  <div className="pt-2 border-t border-stone-200 text-[10px] space-y-0.5">
                    <div className="font-extrabold text-sky-700">☔ {day.precipitationProb}% rain</div>
                    {day.rainSum > 0 && (
                      <div className="text-stone-500 font-semibold">{day.rainSum} mm total</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function WeatherPage() {
  return (
    <ProtectedRoute>
      <WeatherDashboardContent />
    </ProtectedRoute>
  );
}
