'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { PageHero } from '@/components/ui/PageHero';
import { Button } from '@/components/ui/Button';
import {
  Sprout,
  Sparkles,
  CloudSun,
  Camera,
  Bot,
  TrendingUp,
  PhoneCall,
  Globe,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

export default function FeaturesPage() {
  const { t } = useTranslation();

  const FEATURES = [
    {
      id: 'soil',
      num: 'FEATURE 01',
      title: `🌱 ${t('soil.title', 'Soil Health Intelligence')}`,
      subtitle: t('features.f1Sub', 'Soil Test Card Digitization'),
      desc: t('features.f1Desc', 'Parses official Soil Health Card test parameters — Nitrogen, Phosphorus, Potassium, Soil pH, and Organic Carbon — to recommend precise fertilizer dosages.'),
      disclaimer: t('features.f1Disc', 'Official Soil Health Cards are required for exact laboratory NPK dosage calculations.'),
      icon: <Sprout className="w-6 h-6 text-[#3F7D3A]" />,
      badge: t('features.f1Badge', 'Soil Diagnostics'),
    },
    {
      id: 'crop',
      num: 'FEATURE 02',
      title: `🌾 ${t('cropRec.title', 'Crop Recommendation Engine')}`,
      subtitle: t('features.f2Sub', 'Multi-Factor Agronomic Match'),
      desc: t('features.f2Desc', 'Recommends optimal crop options based on soil type, seasonal weather forecast, local water availability, and historical Mandi market trends.'),
      disclaimer: t('features.f2Disc', 'Demonstration agronomic matching model.'),
      icon: <Sparkles className="w-6 h-6 text-[#E8B94A]" />,
      badge: t('features.f2Badge', 'Yield Optimization'),
    },
    {
      id: 'weather',
      num: 'FEATURE 03',
      title: `🌦 ${t('weather.title', 'Weather Intelligence • Mausam (मौसम)')}`,
      subtitle: t('features.f3Sub', 'Micro-Climate Telemetry'),
      desc: t('features.f3Desc', 'Delivers localized temperature, rainfall probability, humidity, and wind warnings so farmers know when to sow, irrigate, spray, or harvest.'),
      disclaimer: t('features.f3Disc', 'Integrates with localized IMD weather streams.'),
      icon: <CloudSun className="w-6 h-6 text-[#6FA8B8]" />,
      badge: t('features.f3Badge', 'Real-Time Alerts'),
    },
    {
      id: 'health',
      num: 'FEATURE 04',
      title: `📷 ${t('dashboard.cropHealthTitle', 'Crop Health Scan')}`,
      subtitle: t('features.f4Sub', 'Symptom Pattern Scan'),
      desc: t('features.f4Desc', 'Allows farmers to photograph leaves, stems, or fruits. Identifies visible symptom patterns and provides educational next steps.'),
      disclaimer: t('features.f4Disc', 'Educational advisory tool — does not replace certified agricultural extension diagnostic officers.'),
      icon: <Camera className="w-6 h-6 text-[#3F7D3A]" />,
      badge: t('features.f4Badge', 'Image Vision'),
    },
    {
      id: 'ai',
      num: 'FEATURE 05',
      title: `🤖 ${t('assistant.title', 'Ask Annadata AI Assistant')}`,
      subtitle: t('features.f5Sub', 'Conversational Advisory'),
      desc: t('features.f5Desc', 'Farmers ask questions using text or voice in their native language and receive plain-spoken agricultural guidance.'),
      disclaimer: t('features.f5Disc', 'AI assistant trained on agricultural extension guidelines.'),
      icon: <Bot className="w-6 h-6 text-[#3F7D3A]" />,
      badge: t('features.f5Badge', 'Conversational AI'),
    },
    {
      id: 'market',
      num: 'FEATURE 06',
      title: `💰 ${t('dashboard.marketTitle', 'Market & Mandi Insights')}`,
      subtitle: t('features.f6Sub', 'Price Trend Advisory'),
      desc: t('features.f6Desc', 'Tracks local Mandi prices, nearby markets, and seasonal commodity demand trends to assist farmers in timing crop sales.'),
      disclaimer: t('features.f6Disc', 'Demo market telemetry model.'),
      icon: <TrendingUp className="w-6 h-6 text-[#9A7048]" />,
      badge: t('features.f6Badge', 'Price Trends'),
    },
    {
      id: 'ivr',
      num: 'FEATURE 07',
      title: `📞 ${t('features.f7Title', 'Basic Phone IVR Helpline')}`,
      subtitle: t('features.f7Sub', 'Toll-Free Voice Helpline'),
      desc: t('features.f7Desc', 'Enables farmers without internet or smartphones to dial a toll-free number, select their language, and receive automated voice weather & crop advisories.'),
      disclaimer: t('features.f7Disc', 'Coming soon for keypad phone users.'),
      icon: <PhoneCall className="w-6 h-6 text-[#9A7048]" />,
      badge: t('features.f7Badge', '100% Offline Access'),
    },
    {
      id: 'languages',
      num: 'FEATURE 08',
      title: `🌐 ${t('features.f8Title', '7 Regional Indian Languages')}`,
      subtitle: t('features.f8Sub', 'Inclusive Multilingual UI'),
      desc: t('features.f8Desc', 'Supports Hindi, English, Marathi, Tamil, Telugu, Kannada, and Bengali across text and voice interfaces.'),
      disclaimer: t('features.f8Disc', 'Fully localized interface.'),
      icon: <Globe className="w-6 h-6 text-[#3F7D3A]" />,
      badge: t('features.f8Badge', 'Multilingual'),
    },
  ];

  const LANGUAGES_LIST = [
    'Hindi (हिन्दी)',
    'English',
    'Marathi (मराठी)',
    'Bengali (বাংলা)',
    'Tamil (தமிழ்)',
    'Telugu (తెలుగు)',
    'Kannada (ಕನ್ನಡ)',
  ];

  return (
    <main className="min-h-screen bg-[#F8FAF3]">
      <PageHero
        badge={t('features.capBadge', 'Platform Capabilities')}
        title={t('features.heroTitle', 'Everything a farmer needs, in one place.')}
        subtitle={t('features.heroSub', "Explore Annadata's 8 core feature modules designed for soil intelligence, localized guidance, market awareness, and inclusive access.")}
        icon={<Sparkles className="w-4 h-4 text-[#E8B94A]" />}
      />

      {/* 8 Feature Cards Grid */}
      <section className="py-20 bg-[#F8FAF3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FEATURES.map((feature) => (
              <div
                key={feature.id}
                id={feature.id}
                className="p-8 rounded-3xl bg-white border border-[#3F7D3A]/12 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-[#3F7D3A]/30 transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-[#3F7D3A] uppercase tracking-wider">
                      {feature.num}
                    </span>
                    <span className="px-3 py-1 bg-[#EEF5E8] text-[#285C32] text-xs font-bold rounded-full border border-[#DCECCF]">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-[#285C32] mb-1">{feature.title}</h3>
                  <div className="text-xs font-bold text-[#3F7D3A] uppercase tracking-wider mb-4">
                    {feature.subtitle}
                  </div>

                  <p className="text-sm text-[#667267] leading-relaxed mb-6">
                    {feature.desc}
                  </p>
                </div>

                {/* Disclaimer / Notice Box */}
                <div className="p-3.5 rounded-xl bg-[#FFF8E8] border border-[#E8B94A]/40 text-xs text-[#667267] flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-[#E8B94A] shrink-0 mt-0.5" />
                  <span>{feature.disclaimer}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Supported Languages Showcase Box */}
          <div className="mt-16 p-8 rounded-3xl bg-white border border-[#3F7D3A]/20 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-[#285C32] font-black text-xl">
              <Globe className="w-6 h-6 text-[#3F7D3A]" />
              <span>{t('features.suppLangTitle', 'Supported Regional Languages (7)')}</span>
            </div>
            <p className="text-sm text-[#667267]">
              {t('features.suppLangSub', 'Annadata breaking down language barriers so every farmer can interact in their mother tongue:')}
            </p>
            <div className="flex flex-wrap gap-2.5 pt-2">
              {LANGUAGES_LIST.map((lang) => (
                <span
                  key={lang}
                  className="px-4 py-2 rounded-xl bg-[#EEF5E8] text-[#285C32] text-xs font-bold border border-[#DCECCF]"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-[#EEF5E8] border-t border-[#DCECCF]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <h2 className="text-3xl font-black text-[#285C32]">{t('features.ctaTitle', 'See For Farmers Guide')}</h2>
          <p className="text-sm text-[#667267]">{t('features.ctaSub', 'Learn how Annadata solves real daily challenges for Indian farmers.')}</p>
          <Link href="/for-farmers">
            <Button variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
              {t('features.ctaBtn', 'Read For Farmers Guide')}
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
