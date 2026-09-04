'use client';

import React, { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n, { STORAGE_KEY } from '@/lib/i18n/config';

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const savedLng = localStorage.getItem(STORAGE_KEY);
      if (savedLng) {
        i18n.changeLanguage(savedLng);
      } else {
        // Detect browser navigator language if no stored preference
        const navLng = (navigator.language || 'en').substring(0, 2);
        if (['en', 'hi', 'mr', 'ta', 'te', 'kn', 'bn'].includes(navLng)) {
          i18n.changeLanguage(navLng);
        }
      }
    }
  }, []);

  return <I18nextProvider i18n={i18n}>{children as any}</I18nextProvider>;
};
