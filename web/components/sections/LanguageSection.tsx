'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { INDIAN_LANGUAGES } from '@/lib/constants';
import { Globe2, Sparkles, Check } from 'lucide-react';

export const LanguageSection: React.FC = () => {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    if (typeof window !== 'undefined') {
      localStorage.setItem('annadata_language', code);
    }
  };

  return (
    <section className="py-24 bg-[#F7F6F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EEF5E8] text-[#173F2A] text-xs font-bold uppercase tracking-wider">
            <Globe2 className="w-3.5 h-3.5 text-[#3F7D3A]" />
            <span>{t('language.eyebrow', 'VERNACULAR ACCESS')}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#173F2A] tracking-tight">
            {t('language.heading', 'Farming guidance in your language.')}
          </h2>

          <p className="text-sm sm:text-base text-[#5F6F62] font-medium leading-relaxed">
            {t(
              'language.subheading',
              'Language should never be a barrier to agronomic knowledge. Click below to experience Annadata in your regional language.'
            )}
          </p>

          {/* Interactive Language Selector Grid */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {INDIAN_LANGUAGES.map((lang) => {
              const isSelected = i18n.language === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border ${
                    isSelected
                      ? 'bg-[#173F2A] text-white border-[#173F2A] shadow-md scale-105'
                      : 'bg-white text-[#17201A] border-[#173F2A]/10 hover:border-[#3F7D3A]/40 shadow-xs'
                  }`}
                >
                  <span className="text-lg font-black leading-tight">
                    {lang.nativeName}
                  </span>
                  <span className={`text-[11px] font-semibold ${isSelected ? 'text-[#D8B45A]' : 'text-[#5F6F62]'}`}>
                    {lang.name}
                  </span>
                  {isSelected && (
                    <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-extrabold uppercase text-[#D8B45A]">
                      <Check className="w-3 h-3" />
                      Active
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <p className="text-xs text-[#5F6F62] italic pt-2">
            Selecting a language updates all navigation, dashboards, recommendations, weather guidance, and voice synthesis across Annadata.
          </p>
        </div>
      </div>
    </section>
  );
};
