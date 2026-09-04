'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, LanguageCode, STORAGE_KEY } from '@/lib/i18n/config';
import { Globe, ChevronDown, Check, Languages } from 'lucide-react';

interface LanguageSelectorProps {
  variant?: 'navbar' | 'header' | 'compact';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ variant = 'header' }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentCode = (i18n.language || 'en').substring(0, 2) as LanguageCode;
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === currentCode) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (code: LanguageCode) => {
    i18n.changeLanguage(code);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, code);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-xs transition-all border shadow-sm ${
          variant === 'navbar'
            ? 'bg-white hover:bg-[#EEF5E8] border-stone-200 text-[#285C32]'
            : 'bg-[#F8FAF3] hover:bg-[#EEF5E8] border-[#DCECCF] text-[#3F7D3A]'
        }`}
      >
        <Languages className="w-4 h-4 text-[#3F7D3A]" />
        <span>{currentLangObj.nativeName}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-[#667267] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-1.5 w-48 rounded-2xl bg-white border border-[#DCECCF] shadow-xl p-1.5 space-y-1 animate-in fade-in duration-150">
          <div className="px-2.5 py-1 text-[10px] font-black uppercase text-[#667267] tracking-wider border-b border-stone-100">
            Select Language / भाषा चुनें
          </div>
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = currentCode === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full px-3 py-2 rounded-xl text-left text-xs font-extrabold flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-[#EEF5E8] text-[#3F7D3A]'
                    : 'hover:bg-[#F8FAF3] text-[#285C32]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{lang.flag}</span>
                  <span>{lang.nativeName}</span>
                  <span className="text-[10px] text-stone-400 font-normal">({lang.name})</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#3F7D3A]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
