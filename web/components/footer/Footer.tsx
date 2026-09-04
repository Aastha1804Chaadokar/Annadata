'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sprout, Heart, Globe, Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Footer: React.FC = () => {
  const { t, i18n } = useTranslation();
  const pathname = usePathname();

  if (pathname?.startsWith('/app')) {
    return null;
  }

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('annadata_language', langCode);
    }
  };

  const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'mr', label: 'मराठी' },
    { code: 'bn', label: 'বাংলা' },
    { code: 'gu', label: 'ગુજરાતી' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ' },
    { code: 'ta', label: 'தமிழ்' },
  ];

  return (
    <footer className="bg-[#173F2A] text-[#F7F6F0] border-t border-[#3F7D3A]/30">
      {/* Top Banner / Brand Vision */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-14 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#3F7D3A] flex items-center justify-center text-[#F7F6F0] shadow-md">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-[#F7F6F0] block leading-none">
                  ANNADATA
                </span>
                <span className="text-xs font-semibold text-[#D8B45A] tracking-wider block mt-1">
                  अन्नदाता • Har Kisan, Har Fasal, Har Faisla.
                </span>
              </div>
            </div>

            <p className="text-sm text-[#F7F6F0]/75 leading-relaxed max-w-sm">
              Modern agricultural intelligence rooted in Indian soil. Empowering farmers with soil test insights, hyper-local weather alerts, adaptive crop suitability, and multilingual AI advisory.
            </p>

            {/* Language Quick-Selector */}
            <div className="pt-2">
              <div className="flex items-center gap-2 text-xs text-[#D8B45A] font-bold uppercase tracking-wider mb-2">
                <Globe className="w-3.5 h-3.5" />
                <span>Preferred Language / भाषा</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`px-2.5 py-1 text-xs rounded-md transition-all font-medium ${
                      i18n.language === lang.code
                        ? 'bg-[#D8B45A] text-[#173F2A] font-bold shadow-sm'
                        : 'bg-white/5 text-[#F7F6F0]/70 hover:bg-white/15 hover:text-white'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links 1: Platform */}
          <div className="lg:col-span-3 sm:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#D8B45A]">
              Platform / मंच
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-[#F7F6F0]/75 hover:text-[#D8B45A] transition-colors flex items-center gap-1 group">
                  <span>{t('navbar.home', 'Home')}</span>
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-[#F7F6F0]/75 hover:text-[#D8B45A] transition-colors flex items-center gap-1 group">
                  <span>{t('navbar.howItWorks', 'How It Works')}</span>
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-[#F7F6F0]/75 hover:text-[#D8B45A] transition-colors flex items-center gap-1 group">
                  <span>{t('navbar.features', 'Features & Modules')}</span>
                </Link>
              </li>
              <li>
                <Link href="/for-farmers" className="text-[#F7F6F0]/75 hover:text-[#D8B45A] transition-colors flex items-center gap-1 group">
                  <span>{t('navbar.forFarmers', 'For Indian Farmers')}</span>
                </Link>
              </li>
              <li>
                <Link href="/farm-location" className="text-[#F7F6F0]/75 hover:text-[#D8B45A] transition-colors flex items-center gap-1 group">
                  <span>{t('navbar.farmLocation', 'Farm Location (GPS)')}</span>
                </Link>
              </li>
              <li>
                <Link href="/access-options" className="text-[#F7F6F0]/75 hover:text-[#D8B45A] transition-colors flex items-center gap-1 group">
                  <span>{t('navbar.accessOptions', 'Access Options (Web & IVR)')}</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[#F7F6F0]/75 hover:text-[#D8B45A] transition-colors flex items-center gap-1 group">
                  <span>{t('navbar.about', 'About Mission')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links 2: Farmer App Modules */}
          <div className="lg:col-span-3 sm:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#D8B45A]">
              Farmer App / किसान पोर्टल
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/app/dashboard" className="text-[#F7F6F0]/75 hover:text-[#D8B45A] transition-colors flex items-center justify-between">
                  <span>Farmer Dashboard</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/app/farm" className="text-[#F7F6F0]/75 hover:text-[#D8B45A] transition-colors flex items-center justify-between">
                  <span>Farm Profile & GPS</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/app/soil" className="text-[#F7F6F0]/75 hover:text-[#D8B45A] transition-colors flex items-center justify-between">
                  <span>Soil Health Lab & Scan</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/app/crop-recommendation" className="text-[#F7F6F0]/75 hover:text-[#D8B45A] transition-colors flex items-center justify-between">
                  <span>Crop Recommendation Engine</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/app/weather" className="text-[#F7F6F0]/75 hover:text-[#D8B45A] transition-colors flex items-center justify-between">
                  <span>Hyper-Local Farm Weather</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/app/assistant" className="text-[#F7F6F0]/75 hover:text-[#D8B45A] transition-colors flex items-center justify-between">
                  <span>Ask Annadata (AI Voice)</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/app/market" className="text-[#F7F6F0]/75 hover:text-[#D8B45A] transition-colors flex items-center justify-between">
                  <span>Mandi Prices & Trends</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links 3: Trust & Helpline */}
          <div className="lg:col-span-2 sm:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#D8B45A]">
              Support / संपर्क
            </h4>
            <div className="space-y-3 text-xs text-[#F7F6F0]/75">
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#D8B45A] mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-[#F7F6F0]">Kisan IVR Helpline</p>
                  <p className="text-[11px] text-[#F7F6F0]/60">Toll-free IVR (Coming Soon)</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-[#D8B45A] mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-[#F7F6F0]">Assistance</p>
                  <a href="mailto:support@annadata.ag" className="hover:text-[#D8B45A] transition-colors">
                    support@annadata.ag
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D8B45A] mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-[#F7F6F0]">AgriTech Innovation</p>
                  <p className="text-[11px] text-[#F7F6F0]/60">Dedicated to Indian Agriculture</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] leading-relaxed text-[#F7F6F0]/70">
                <p className="font-semibold text-[#D8B45A] mb-1">Scientific Notice</p>
                Recommendations are decision aids. Confirm with local Krishi Vigyan Kendras (KVK).
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F7F6F0]/60">
          <p>© {new Date().getFullYear()} Annadata (अन्नदाता) AgriTech. All rights reserved.</p>
          <div className="flex items-center gap-1 text-[#F7F6F0]/80">
            <span>Built with respect & devotion for the</span>
            <Heart className="w-3.5 h-3.5 text-[#D8B45A] fill-current mx-0.5" />
            <span className="font-bold text-[#F7F6F0]">Annadata of India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
