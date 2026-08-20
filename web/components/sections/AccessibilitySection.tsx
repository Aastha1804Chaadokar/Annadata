'use client';

import React from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ACCESS_CHANNELS } from '@/lib/constants';
import { motion } from 'framer-motion';
import { Smartphone, PhoneCall, MessageSquare, ShieldCheck } from 'lucide-react';

export const AccessibilitySection: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Smartphone':
        return <Smartphone className="w-8 h-8 text-[#3F7D3A]" />;
      case 'PhoneCall':
        return <PhoneCall className="w-8 h-8 text-[#9A7048]" />;
      case 'MessageSquare':
        return <MessageSquare className="w-8 h-8 text-[#E8B94A]" />;
      default:
        return <Smartphone className="w-8 h-8 text-[#3F7D3A]" />;
    }
  };

  return (
    <section id="accessibility" className="py-24 bg-[#FFF8E8] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Universal Access Architecture"
          title="Technology should reach every farmer."
          subtitle="Annadata is designed for farmers across all Indian languages, device types, and levels of digital literacy — from 4G smartphones to basic 2G feature phones."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {ACCESS_CHANNELS.map((channel, idx) => (
            <motion.div
              key={channel.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="p-8 rounded-3xl bg-white border border-[#3F7D3A]/12 shadow-sm hover:shadow-md hover:border-[#3F7D3A]/30 transition-all duration-300 relative group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="p-4 rounded-2xl bg-[#F8FAF3] border border-stone-200">
                    {getIcon(channel.icon)}
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider bg-[#EEF5E8] text-[#285C32] border border-[#DCECCF]">
                    {channel.badge}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-[#285C32] mb-1">
                  {channel.title}
                </h3>
                <h4 className="text-xs font-bold uppercase tracking-wider mb-4 text-[#3F7D3A]">
                  {channel.subtitle}
                </h4>

                <p className="text-sm leading-relaxed text-[#667267] mb-6">
                  {channel.description}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center gap-2 text-xs font-semibold text-[#3F7D3A]">
                <ShieldCheck className="w-4 h-4 text-[#3F7D3A] shrink-0" />
                <span>Zero digital barrier required</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
