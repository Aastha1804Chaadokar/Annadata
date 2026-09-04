'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Beaker, Sprout, CloudSun, MessageSquare, Globe2 } from 'lucide-react';

export const HeroInfoStrip: React.FC = () => {
  const { t } = useTranslation();

  const STRIP_ITEMS = [
    {
      num: '01',
      title: t('strip.soil', 'Understand Soil'),
      desc: t('strip.soilDesc', 'NPK & pH Analysis'),
      icon: <Beaker className="w-4 h-4 text-[#3F7D3A]" />,
      href: '/app/soil',
    },
    {
      num: '02',
      title: t('strip.crop', 'Choose Crops'),
      desc: t('strip.cropDesc', 'Kharif & Rabi matches'),
      icon: <Sprout className="w-4 h-4 text-[#3F7D3A]" />,
      href: '/app/crop-recommendation',
    },
    {
      num: '03',
      title: t('strip.weather', 'Track Weather'),
      desc: t('strip.weatherDesc', 'Live farm telemetry'),
      icon: <CloudSun className="w-4 h-4 text-[#3F7D3A]" />,
      href: '/app/weather',
    },
    {
      num: '04',
      title: t('strip.ai', 'Ask AI'),
      desc: t('strip.aiDesc', 'Voice assistance in 7 languages'),
      icon: <MessageSquare className="w-4 h-4 text-[#3F7D3A]" />,
      href: '/app/assistant',
    },
    {
      num: '05',
      title: t('strip.lang', 'Access in Your Language'),
      desc: t('strip.langDesc', 'Hindi, Marathi, Tamil & more'),
      icon: <Globe2 className="w-4 h-4 text-[#3F7D3A]" />,
      href: '/access-options',
    },
  ];

  return (
    <section className="w-full bg-white border-y border-[#173F2A]/10 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {STRIP_ITEMS.map((item) => (
            <Link
              key={item.num}
              href={item.href}
              className="group p-3.5 rounded-2xl hover:bg-[#F7F6F0] transition-colors border border-transparent hover:border-[#173F2A]/10 flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black tracking-widest text-[#D8B45A] group-hover:text-[#173F2A] transition-colors">
                  {item.num}
                </span>
                <div className="p-1.5 rounded-lg bg-[#EEF5E8] group-hover:bg-white transition-colors">
                  {item.icon}
                </div>
              </div>
              <h3 className="text-xs sm:text-sm font-extrabold text-[#17201A] group-hover:text-[#173F2A] transition-colors">
                {item.title}
              </h3>
              <p className="text-[11px] text-[#5F6F62] leading-tight line-clamp-1">
                {item.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
