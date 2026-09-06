'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { 
  HelpCircle, 
  Sprout, 
  FlaskConical, 
  Calendar, 
  CloudSun, 
  ShieldAlert, 
  Store, 
  Coins, 
  ArrowRight 
} from 'lucide-react';

export const FarmerUncertaintiesSection: React.FC = () => {
  const { t } = useTranslation();

  const UNCERTAINTIES = [
    {
      icon: <Sprout className="w-5 h-5 text-[#285C32]" />,
      question: 'What should I grow?',
      desc: 'Choosing the right crop based on your specific land, season, and market demand.',
      tag: 'Crop Suitability',
      href: '/crop-recommendation',
    },
    {
      icon: <FlaskConical className="w-5 h-5 text-[#8D5B4C]" />,
      question: 'Is my soil healthy?',
      desc: 'Knowing your NPK levels, pH balance, and exact fertilizer requirements.',
      tag: 'Soil Analysis',
      href: '/soil-health',
    },
    {
      icon: <Calendar className="w-5 h-5 text-[#3F7D3A]" />,
      question: 'When should I sow?',
      desc: 'Finding the optimal sowing window based on temperature and monsoon timing.',
      tag: 'Sowing Calendar',
      href: '/weather',
    },
    {
      icon: <CloudSun className="w-5 h-5 text-[#3A6B7C]" />,
      question: 'What will the weather do?',
      desc: 'Receiving hyper-local rain forecasts and spray advisories to protect inputs.',
      tag: 'Weather Alerts',
      href: '/weather',
    },
    {
      icon: <ShieldAlert className="w-5 h-5 text-[#B45309]" />,
      question: 'How can I protect my crop?',
      desc: 'Detecting pest risks early and applying targeted, cost-effective remedies.',
      tag: 'Crop Health',
      href: '/how-it-works',
    },
    {
      icon: <Store className="w-5 h-5 text-[#1E3A8A]" />,
      question: 'Where can I sell my harvest?',
      desc: 'Connecting directly with verified buyers and nearby agricultural mandis.',
      tag: 'Market Linkage',
      href: '/market',
    },
    {
      icon: <Coins className="w-5 h-5 text-[#854D0E]" />,
      question: 'Am I getting a fair price?',
      desc: 'Checking real-time mandi prices to negotiate with confidence and avoid middlemen.',
      tag: 'Fair Pricing',
      href: '/market',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#F4F6EE] text-[#17201A] border-b border-[#E3E8D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E5ECE0] text-[#285C32] text-xs font-bold uppercase tracking-wider border border-[#D3DEC9]">
            <HelpCircle className="w-3.5 h-3.5 text-[#3F7D3A]" />
            <span>{t('uncertainties.badge', 'Farmer Questions')}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-[#1F4529] tracking-tight">
            {t('uncertainties.heading', 'Every Harvest Comes With Uncertainty')}
          </h2>

          <p className="text-xs sm:text-sm text-[#586857] max-w-xl mx-auto leading-relaxed">
            {t(
              'uncertainties.subtitle',
              'Farming involves hard work and real investments every season. Annadata gives clear answers to the questions that matter most.'
            )}
          </p>
        </div>

        {/* Compact Grid of Uncertainties */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {UNCERTAINTIES.map((item, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-2xl p-5 border border-[#DCE4D4] shadow-xs hover:shadow-md hover:border-[#3F7D3A]/40 transition-all duration-200 flex flex-col justify-between group ${
                idx === UNCERTAINTIES.length - 1 ? 'sm:col-span-2 lg:col-span-1 xl:col-span-1' : ''
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-[#F0F5EB] flex items-center justify-center border border-[#E0ECD7]">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-bold text-[#586857] uppercase tracking-wider bg-[#F5F7F1] px-2.5 py-0.5 rounded-full border border-[#E2E8DC]">
                    {item.tag}
                  </span>
                </div>

                <h3 className="text-base font-black text-[#1F4529] group-hover:text-[#2E7D32] transition-colors">
                  {item.question}
                </h3>

                <p className="text-xs text-[#667565] leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                <Link
                  href={item.href}
                  className="text-xs font-bold text-[#2E7D32] hover:text-[#1F4529] inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Learn how Annadata helps</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
