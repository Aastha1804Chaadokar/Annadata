'use client';

import React from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { motion } from 'framer-motion';
import { Sprout, Sun, CloudRain, Sparkles } from 'lucide-react';

export const DecisionSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 bg-[#EEF5E8] relative overflow-hidden border-t border-[#DCECCF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge="Farming Lifecycle"
          title="Every harvest begins with a decision."
          subtitle="Annadata brings soil health, localized weather forecasts, crop science, and conversational AI together to empower Indian farmers at every step."
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
          {[
            {
              step: '01',
              title: 'Test & Know Soil',
              desc: 'Parse soil card metrics (N, P, K, pH) to understand field nutrients.',
              icon: <Sprout className="w-6 h-6 text-[#3F7D3A]" />,
            },
            {
              step: '02',
              title: 'Choose Optimal Crop',
              desc: 'AI recommends crops matching season, region, water & market trends.',
              icon: <Sparkles className="w-6 h-6 text-[#E8B94A]" />,
            },
            {
              step: '03',
              title: 'Follow Weather Guidance',
              desc: 'Real-time rain & temp alerts instruct when to sow, irrigate or spray.',
              icon: <CloudRain className="w-6 h-6 text-[#6FA8B8]" />,
            },
            {
              step: '04',
              title: 'Harvest & Sell Smart',
              desc: 'Track local Mandi price trends and access expert advisory when needed.',
              icon: <Sun className="w-6 h-6 text-[#E8B94A]" />,
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="p-6 rounded-2xl bg-white border border-[#3F7D3A]/10 shadow-sm relative group hover:border-[#3F7D3A]/30 hover:shadow-md transition-all duration-300"
            >
              <div className="text-3xl font-black text-[#DCECCF] group-hover:text-[#3F7D3A] transition-colors mb-4">
                {item.step}
              </div>
              <div className="p-3 w-fit rounded-xl bg-[#EEF5E8] mb-4">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-[#285C32] mb-2">{item.title}</h3>
              <p className="text-sm text-[#667267] leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
