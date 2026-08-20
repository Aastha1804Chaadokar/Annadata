'use client';

import React, { useState, useEffect, useRef } from 'react';
import { INDIAN_LANGUAGES } from '@/lib/constants';
import { Globe, ChevronDown } from 'lucide-react';

export const LanguageSelector: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState('hi');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLang =
    INDIAN_LANGUAGES.find((l) => l.code === selectedLang) || INDIAN_LANGUAGES[0];

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Language"
        aria-expanded={isOpen}
        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-[#EEF5E8] hover:bg-[#DCECCF] text-[#285C32] border border-[#D7E4D1] transition-all focus:outline-none focus:ring-2 focus:ring-[#3F7D3A]"
      >
        <Globe className="w-3.5 h-3.5 text-[#3F7D3A]" />
        <span>🌐 {currentLang.nativeName}</span>
        <ChevronDown className="w-3 h-3 text-[#3F7D3A]" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-[#D7E4D1] rounded-2xl shadow-xl py-2 z-50 max-h-64 overflow-y-auto focus:outline-none">
          <div className="px-3 py-1 text-[10px] font-bold text-[#667267] uppercase tracking-wider border-b border-stone-100 mb-1">
            Indian Languages (11)
          </div>
          {INDIAN_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => {
                setSelectedLang(lang.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-[#EEF5E8] transition-colors ${
                selectedLang === lang.code
                  ? 'text-[#285C32] font-bold bg-[#EEF5E8]'
                  : 'text-[#667267]'
              }`}
            >
              <span>{lang.nativeName}</span>
              <span className="text-[10px] font-semibold text-[#3F7D3A]">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
