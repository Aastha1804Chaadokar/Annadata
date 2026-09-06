'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Sprout, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const ShortCTASection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="py-16 sm:py-20 bg-[#173F2A] text-white relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#3F7D3A]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#D8B45A]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
        
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#D8B45A] text-xs font-bold uppercase tracking-wider">
          <Sprout className="w-3.5 h-3.5" />
          <span>HAR KISAN • HAR FASAL • HAR FAISLA</span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          {t('shortCta.heading', 'Start Your Farming Journey')}
        </h2>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-white/85 max-w-xl mx-auto font-normal leading-relaxed">
          {t(
            'shortCta.subtitle',
            'Join thousands of farmers making smarter decisions for soil health, crop selection, and fair market selling.'
          )}
        </p>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <Link href="/register">
            <Button
              variant="accent"
              size="lg"
              className="shadow-lg"
              icon={<UserPlus className="w-4 h-4" />}
            >
              {t('shortCta.registerBtn', 'Create Free Account')}
            </Button>
          </Link>
          <Link href="/login">
            <Button
              variant="outline"
              size="lg"
              className="border-white/40 text-white hover:bg-white/10 shadow-md"
              icon={<LogIn className="w-4 h-4 text-[#D8B45A]" />}
            >
              {t('shortCta.loginBtn', 'Farmer Login')}
            </Button>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-white/70 font-medium">
          <span>✓ Free for Indian Farmers</span>
          <span>✓ 7 Indian Languages</span>
          <span>✓ Works on all mobile devices</span>
        </div>

      </div>
    </section>
  );
};
