'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { AppSidebar } from '@/components/app/AppSidebar';
import { AppHeader } from '@/components/app/AppHeader';
import { ProtectedRoute } from '@/components/app/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { getFarmerProfile } from '@/lib/farmerService';
import {
  Settings,
  ArrowLeft,
  User,
  Globe,
  Bell,
  Shield,
  Save,
  CheckCircle2,
  PhoneCall,
  MapPin,
  Tractor,
} from 'lucide-react';

function SettingsContent() {
  const { t } = useTranslation();
  const profile = getFarmerProfile();

  const [smsAlerts, setSmsAlerts] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [mandiAlerts, setMandiAlerts] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveSettings = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAF3] flex flex-col">
      <AppHeader />

      <div className="flex flex-1">
        <AppSidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-4xl">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
            <div>
              <Link href="/app/dashboard" className="text-xs font-bold text-[#3F7D3A] hover:underline flex items-center gap-1 mb-1">
                <ArrowLeft className="w-3.5 h-3.5" /> {t('common.backToDashboard')}
              </Link>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-black text-[#285C32]">
                  ⚙ Settings & Account Preferences
                </h1>
              </div>
              <p className="text-xs text-[#667267] mt-0.5">
                Manage your application language, farm profile options, and SMS agricultural notifications.
              </p>
            </div>
          </div>

          {/* Success Toast */}
          {isSaved && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-bold flex items-center gap-2 shadow-sm animate-in fade-in duration-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Settings and preferences saved successfully!</span>
            </div>
          )}

          {/* SECTION 1: LANGUAGE PREFERENCE */}
          <div className="p-6 rounded-3xl bg-white border border-[#3F7D3A]/20 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#EEF5E8] text-[#3F7D3A]">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#285C32]">Global Application Language</h3>
                  <p className="text-xs text-[#667267]">Choose your preferred language for the Annadata platform.</p>
                </div>
              </div>

              <LanguageSelector variant="header" />
            </div>
          </div>

          {/* SECTION 2: FARM PROFILE SUMMARY & QUICK EDIT */}
          <div className="p-6 rounded-3xl bg-white border border-[#3F7D3A]/20 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#EEF5E8] text-[#3F7D3A]">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#285C32]">Farmer Profile & Land Details</h3>
                  <p className="text-xs text-[#667267]">Registered farm location and crop parameters.</p>
                </div>
              </div>

              <Link href="/app/farm">
                <Button variant="secondary" size="sm" icon={<Tractor className="w-3.5 h-3.5" />}>
                  {t('dashboard.viewEditFarm')}
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
              <div className="p-3.5 rounded-xl bg-[#F8FAF3] border border-stone-200">
                <span className="text-stone-500 block text-[10px] uppercase font-extrabold">Name</span>
                <strong className="text-[#285C32] text-sm">{profile?.name}</strong>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F8FAF3] border border-stone-200">
                <span className="text-stone-500 block text-[10px] uppercase font-extrabold">Mobile</span>
                <strong className="text-[#285C32] text-sm">{profile?.mobile}</strong>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F8FAF3] border border-stone-200">
                <span className="text-stone-500 block text-[10px] uppercase font-extrabold">Location</span>
                <strong className="text-[#285C32] text-sm">{profile?.village}, {profile?.district}</strong>
              </div>
            </div>
          </div>

          {/* SECTION 3: SMS & WEATHER NOTIFICATIONS */}
          <div className="p-6 rounded-3xl bg-white border border-[#3F7D3A]/20 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
              <div className="p-2 rounded-xl bg-[#EEF5E8] text-[#3F7D3A]">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#285C32]">Farmer SMS Alerts & Broadcasts</h3>
                <p className="text-xs text-[#667267]">Receive important agricultural advisories directly on your phone.</p>
              </div>
            </div>

            <div className="space-y-3 text-xs font-semibold">
              <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8FAF3] border border-stone-200 cursor-pointer">
                <div>
                  <span className="text-[#285C32] font-bold block">Rainfall & Weather Emergency Alerts</span>
                  <span className="text-[11px] text-stone-500 font-medium">Get SMS alerts when rain probability exceeds 60%</span>
                </div>
                <input
                  type="checkbox"
                  checked={weatherAlerts}
                  onChange={(e) => setWeatherAlerts(e.target.checked)}
                  className="w-4 h-4 text-[#3F7D3A] rounded focus:ring-[#3F7D3A]"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8FAF3] border border-stone-200 cursor-pointer">
                <div>
                  <span className="text-[#285C32] font-bold block">Fertilization & Spraying Advisories</span>
                  <span className="text-[11px] text-stone-500 font-medium">Timely reminders for crop top-dressing & pest spray windows</span>
                </div>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="w-4 h-4 text-[#3F7D3A] rounded focus:ring-[#3F7D3A]"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8FAF3] border border-stone-200 cursor-pointer">
                <div>
                  <span className="text-[#285C32] font-bold block">Daily Mandi Price Bulletins</span>
                  <span className="text-[11px] text-stone-500 font-medium">Receive daily crop rates from nearest Mandi</span>
                </div>
                <input
                  type="checkbox"
                  checked={mandiAlerts}
                  onChange={(e) => setMandiAlerts(e.target.checked)}
                  className="w-4 h-4 text-[#3F7D3A] rounded focus:ring-[#3F7D3A]"
                />
              </label>
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="primary" size="sm" onClick={handleSaveSettings} icon={<Save className="w-3.5 h-3.5" />}>
                Save Notification Settings
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}
