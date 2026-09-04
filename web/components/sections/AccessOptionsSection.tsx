'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Smartphone, PhoneCall, Radio, ArrowRight, MessageSquare, CheckCircle2 } from 'lucide-react';

export const AccessOptionsSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-white border-y border-[#173F2A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EEF5E8] text-[#173F2A] text-xs font-bold uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 text-[#3F7D3A]" />
            <span>{t('access.eyebrow', 'MULTI-CHANNEL ACCESSIBILITY')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#173F2A] tracking-tight">
            {t('access.heading', 'Smartphone or keypad phone — Annadata is for every farmer.')}
          </h2>
          <p className="text-sm sm:text-base text-[#5F6F62] font-medium">
            {t(
              'access.subheading',
              'Whether accessing rich visual maps or dialing an automated voice helpline, every farmer receives timely agricultural support.'
            )}
          </p>
        </div>

        {/* 2 Main Access Channel Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* OPTION 1: Smartphone Web App */}
          <div className="p-8 rounded-3xl bg-[#F7F6F0] border border-[#173F2A]/10 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#173F2A] text-white flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-[#D8B45A]" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#3F7D3A] block">
                  OPTION 1 • SMARTPHONE
                </span>
                <h3 className="text-2xl font-black text-[#17201A]">
                  Annadata Web App & Dashboard
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#5F6F62] leading-relaxed">
                Full-featured interactive experience with GPS farm location detection, interactive maps, Soil Health Card input, ranked crop engines, Open-Meteo weather telemetry, and voice AI.
              </p>
              <div className="space-y-2 pt-2 text-xs text-[#173F2A] font-semibold">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#3F7D3A]" />
                  <span>Interactive Leaflet maps & soil test input</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#3F7D3A]" />
                  <span>Speech Recognition voice questions</span>
                </div>
              </div>
            </div>

            <div>
              <Link href="/app/dashboard">
                <Button variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
                  Open Farmer Dashboard
                </Button>
              </Link>
            </div>
          </div>

          {/* OPTION 2: Keypad / IVR Phone Helpline */}
          <div className="p-8 rounded-3xl bg-[#FAF7EE] border border-[#D8B45A]/30 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#D8B45A] text-[#17201A] flex items-center justify-center">
                <PhoneCall className="w-6 h-6 text-[#173F2A]" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#173F2A] block">
                  OPTION 2 • KEYPAD / FEATURE PHONE
                </span>
                <h3 className="text-2xl font-black text-[#17201A]">
                  Interactive Voice Response (IVR) Helpline
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#5F6F62] leading-relaxed">
                Call the automated farmer toll-free service to listen to daily weather advisories, Mandi crop rates, and crop disease remedies using keypad tone inputs in your vernacular language.
              </p>
              <div className="p-4 rounded-2xl bg-white border border-[#D8B45A]/30 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[#173F2A]">Helpline Telephony Integration:</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#EEF5E8] text-[#3F7D3A] font-bold text-[10px]">
                    Architecture Ready
                  </span>
                </div>
                <p className="text-[11px] text-[#5F6F62]">
                  Cloud telephony bridge (Exotel / Twilio provider) abstracted behind `TelephonyService` and `IVRService`.
                </p>
              </div>
            </div>

            <div>
              <Link href="/access-options">
                <Button variant="secondary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
                  Learn About IVR Access
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
