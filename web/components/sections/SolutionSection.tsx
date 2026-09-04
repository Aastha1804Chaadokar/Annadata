'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  MapPin,
  Beaker,
  Sprout,
  CloudSun,
  Bot,
  TrendingUp,
  UserCheck,
  Globe,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const SolutionSection: React.FC = () => {
  const { t } = useTranslation();

  const CAPABILITIES = [
    {
      num: '01',
      title: 'Farm Location',
      hindi: 'खेत की सटीक स्थिति',
      desc: 'GPS geocoding pinpointing village, district, state, coordinates, and agro-climatic subzone.',
      href: '/farm-location',
      icon: <MapPin className="w-5 h-5 text-[#3F7D3A]" />,
      badge: 'Geocoding',
    },
    {
      num: '02',
      title: 'Soil Health',
      hindi: 'मृदा स्वास्थ्य विश्लेषण',
      desc: 'Digital Soil Health Card parsing N, P, K, pH, and Organic Carbon to guide balanced fertilization.',
      href: '/app/soil',
      icon: <Beaker className="w-5 h-5 text-[#9A7048]" />,
      badge: 'NPK Science',
    },
    {
      num: '03',
      title: 'Crop Recommendation',
      hindi: 'उपयुक्त फसल चयन',
      desc: 'Agronomic match engine correlating soil profile, rainfall forecast, and season (Kharif, Rabi, Zaid).',
      href: '/app/crop-recommendation',
      icon: <Sprout className="w-5 h-5 text-[#3F7D3A]" />,
      badge: 'Crop Matching',
    },
    {
      num: '04',
      title: 'Weather Intelligence',
      hindi: 'मौसम पूर्वानुमान',
      desc: 'Hyper-local temperature, rain probability, humidity, and wind warnings directly calibrated to your GPS.',
      href: '/app/weather',
      icon: <CloudSun className="w-5 h-5 text-[#2C6B7A]" />,
      badge: 'Open-Meteo API',
    },
    {
      num: '05',
      title: 'AI Agricultural Assistant',
      hindi: 'एआई कृषि मित्र',
      desc: 'Voice and text assistance in Hindi and regional languages designed around your land and crop context.',
      href: '/app/assistant',
      icon: <Bot className="w-5 h-5 text-[#173F2A]" />,
      badge: 'Multilingual AI',
    },
    {
      num: '06',
      title: 'Market Information',
      hindi: 'मंडी भाव व रुझान',
      desc: 'Price trends across local Mandis and commodity market indicators to help time post-harvest sales.',
      href: '/app/market',
      icon: <TrendingUp className="w-5 h-5 text-[#9A7048]" />,
      badge: 'Mandi Telemetry',
    },
    {
      num: '07',
      title: 'Farmer Profile',
      hindi: 'किसान व खेत प्रोफ़ाइल',
      desc: 'Comprehensive records of landholding acreage, irrigation infrastructure, and historical cropping cycles.',
      href: '/app/farm',
      icon: <UserCheck className="w-5 h-5 text-[#3F7D3A]" />,
      badge: 'Data Security',
    },
    {
      num: '08',
      title: 'Multilingual Access',
      hindi: 'मातृभाषा में सुविधा',
      desc: 'Universal inclusion across 7 Indian regional languages across web and upcoming keypad phone IVR.',
      href: '/access-options',
      icon: <Globe className="w-5 h-5 text-[#173F2A]" />,
      badge: 'Inclusion',
    },
  ];

  return (
    <section id="features" className="py-28 bg-[#F7F6F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EEF5E8] text-[#173F2A] text-xs font-bold uppercase tracking-widest border border-[#173F2A]/10">
            <Sparkles className="w-3.5 h-3.5 text-[#3F7D3A]" />
            <span>ANNADATA PLATFORM SUITE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-[54px] font-black text-[#173F2A] tracking-tight leading-tight">
            One platform.<br />
            Better farming decisions.
          </h2>

          <p className="text-base sm:text-lg text-[#5F6F62] leading-relaxed font-normal">
            Eight integrated modules working together to remove guesswork from soil preparation to market harvest.
          </p>
        </div>

        {/* 8-Capability Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CAPABILITIES.map((cap) => (
            <div
              key={cap.num}
              className="p-7 rounded-3xl bg-white border border-[#173F2A]/10 shadow-xs hover:shadow-lg hover:border-[#3F7D3A]/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black tracking-widest text-[#3F7D3A]">
                    {cap.num}
                  </span>
                  <div className="p-2.5 rounded-2xl bg-[#EEF5E8] group-hover:scale-110 transition-transform duration-300">
                    {cap.icon}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-black text-[#173F2A] group-hover:text-[#3F7D3A] transition-colors">
                    {cap.title}
                  </h3>
                  <span className="text-[11px] font-semibold text-[#5F6F62] block mt-0.5">
                    {cap.hindi}
                  </span>
                </div>

                <p className="text-xs text-[#5F6F62] leading-relaxed">
                  {cap.desc}
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#F7F6F0] text-[#173F2A]">
                  {cap.badge}
                </span>
                <Link
                  href={cap.href}
                  className="text-xs font-bold text-[#3F7D3A] hover:text-[#173F2A] inline-flex items-center gap-1"
                >
                  <span>Explore</span>
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
