'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { UserCheck, MapPin, Beaker, Sprout, CheckCircle2, ArrowRight } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const { t } = useTranslation();

  const STEPS = [
    {
      step: '01',
      title: t('steps.profileTitle', 'Tell us about your farm'),
      desc: t('steps.profileDesc', 'Enter basic details like farmer name, land size, and your current standing crop.'),
      icon: <UserCheck className="w-5 h-5 text-[#3F7D3A]" />,
      pill: 'Step 1',
    },
    {
      step: '02',
      title: t('steps.locationTitle', 'Detect your farm location'),
      desc: t('steps.locationDesc', 'Use GPS or enter your village to lock micro-climatic weather and soil zones.'),
      icon: <MapPin className="w-5 h-5 text-[#3F7D3A]" />,
      pill: 'Step 2',
    },
    {
      step: '03',
      title: t('steps.soilTitle', 'Understand your soil'),
      desc: t('steps.soilDesc', 'Enter lab Soil Health Card values or upload an indicative soil photo.'),
      icon: <Beaker className="w-5 h-5 text-[#3F7D3A]" />,
      pill: 'Step 3',
    },
    {
      step: '04',
      title: t('steps.cropTitle', 'Select your season'),
      desc: t('steps.cropDesc', 'Choose Kharif (Monsoon), Rabi (Winter), or Zaid (Summer) for targeted crop matching.'),
      icon: <Sprout className="w-5 h-5 text-[#3F7D3A]" />,
      pill: 'Step 4',
    },
    {
      step: '05',
      title: t('steps.recommendationTitle', 'Get crop recommendations'),
      desc: t('steps.recommendationDesc', 'Receive ranked crops suited to your soil nutrients, rainfall, and irrigation.'),
      icon: <CheckCircle2 className="w-5 h-5 text-[#3F7D3A]" />,
      pill: 'Step 5',
    },
    {
      step: '06',
      title: t('steps.decisionTitle', 'Make informed decisions'),
      desc: t('steps.decisionDesc', 'Follow irrigation advisories, market rates, and ask voice AI questions in your language.'),
      icon: <ArrowRight className="w-5 h-5 text-[#3F7D3A]" />,
      pill: 'Step 6',
    },
  ];

  return (
    <section className="py-24 bg-white border-y border-[#173F2A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EEF5E8] text-[#173F2A] text-xs font-bold uppercase tracking-wider">
            <span>{t('how.eyebrow', 'HOW IT WORKS')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#173F2A] tracking-tight">
            {t('how.heading', 'Simple, sequential farm guidance.')}
          </h2>
          <p className="text-sm sm:text-base text-[#5F6F62] font-medium">
            {t('how.subheading', 'Six clear steps to take you from soil understanding to market confidence.')}
          </p>
        </div>

        {/* 6-Step Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STEPS.map((step) => (
            <div
              key={step.step}
              className="p-6 rounded-3xl bg-[#F7F6F0] border border-[#173F2A]/10 hover:border-[#3F7D3A]/40 transition-all hover:shadow-md space-y-4 relative group"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-[#D8B45A] group-hover:text-[#173F2A] transition-colors">
                  {step.step}
                </span>
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-xs">
                  {step.icon}
                </div>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-[#17201A]">
                  {step.title}
                </h3>
                <p className="text-xs text-[#5F6F62] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Action CTA */}
        <div className="mt-12 text-center">
          <Link href="/app/onboarding">
            <Button variant="primary" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
              {t('how.startOnboarding', 'Start Your Farm Journey')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
