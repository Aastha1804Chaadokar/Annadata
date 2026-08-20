'use client';

import React from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { DEMO_SOIL_CARD } from '@/lib/constants';
import { motion } from 'framer-motion';
import { AlertCircle, FileText } from 'lucide-react';

export const SoilSection: React.FC = () => {
  return (
    <section id="soil" className="py-24 bg-[#FFF8E8] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Soil Health Intelligence"
          title="Know Your Soil."
          subtitle="Healthy soil produces bountiful crops. Annadata organizes Soil Health Card parameters into clear, actionable fertilizer and soil management recommendations."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mt-12">
          {/* Left Column: Soil Cross-Section Visual with Roots */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-6"
          >
            <div className="relative rounded-3xl overflow-hidden border-2 border-[#9A7048]/20 shadow-lg bg-gradient-to-b from-[#EEF5E8] via-[#FFF8E8] to-[#9A7048]/30 p-8 text-[#285C32]">
              {/* Plant Above Ground */}
              <div className="flex justify-center -mt-2 mb-4">
                <div className="relative flex flex-col items-center">
                  <div className="w-1.5 h-16 bg-[#3F7D3A] rounded-full" />
                  <div className="w-12 h-6 bg-[#3F7D3A] rounded-t-full -mt-4 border-2 border-[#DCECCF]" />
                </div>
              </div>

              {/* Surface Soil Line */}
              <div className="border-b-2 border-dashed border-[#9A7048]/40 my-4 text-center">
                <span className="bg-[#FFF8E8] border border-[#9A7048]/30 px-3.5 py-1 rounded-full text-xs font-bold text-[#285C32]">
                  Top Soil Horizon (0 - 15 cm)
                </span>
              </div>

              {/* Root System Simulation */}
              <div className="relative h-44 my-4 flex items-center justify-center">
                <svg className="w-full h-full opacity-90" viewBox="0 0 300 150" fill="none">
                  <path d="M150 0 Q150 40 120 80 Q100 110 80 140" stroke="#9A7048" strokeWidth="3" fill="none" />
                  <path d="M150 0 Q150 40 180 80 Q200 110 220 140" stroke="#9A7048" strokeWidth="3" fill="none" />
                  <path d="M150 0 Q150 60 150 145" stroke="#9A7048" strokeWidth="4" fill="none" />
                  <path d="M150 30 Q120 60 90 90" stroke="#E8B94A" strokeWidth="2" fill="none" />
                  <path d="M150 30 Q180 60 210 90" stroke="#E8B94A" strokeWidth="2" fill="none" />
                </svg>

                {/* Nutrient Badges */}
                <div className="absolute top-4 left-6 bg-white border border-[#3F7D3A]/30 px-3 py-1 rounded-xl text-xs font-extrabold text-[#3F7D3A] shadow-sm">
                  N (Nitrogen)
                </div>
                <div className="absolute top-12 right-6 bg-white border border-[#E8B94A]/40 px-3 py-1 rounded-xl text-xs font-extrabold text-[#E8B94A] shadow-sm">
                  P (Phosphorus)
                </div>
                <div className="absolute bottom-6 left-12 bg-white border border-[#9A7048]/40 px-3 py-1 rounded-xl text-xs font-extrabold text-[#9A7048] shadow-sm">
                  K (Potassium)
                </div>
                <div className="absolute bottom-6 right-12 bg-white border border-[#3F7D3A]/30 px-3 py-1 rounded-xl text-xs font-extrabold text-[#285C32] shadow-sm">
                  pH 6.8
                </div>
              </div>

              {/* Subsoil Label */}
              <div className="border-t border-[#9A7048]/20 pt-3 text-center">
                <span className="text-xs text-[#9A7048] font-semibold">Subsoil Layer & Root Moisture Absorption</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Demo Soil Health Card Metrics */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-6 space-y-4"
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#3F7D3A]/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#3F7D3A]" />
                  <h3 className="font-bold text-lg text-[#285C32]">Sample Soil Health Card</h3>
                </div>
                <span className="px-3 py-1 bg-[#EEF5E8] text-[#285C32] text-xs font-bold rounded-full border border-[#DCECCF]">
                  Digitized View
                </span>
              </div>

              {/* Parameter Rows */}
              <div className="space-y-3">
                {DEMO_SOIL_CARD.parameters.map((param) => (
                  <div key={param.key} className="p-3.5 rounded-xl bg-[#F8FAF3] border border-stone-200/80 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-[#285C32]">{param.name} ({param.key})</span>
                        <span className="text-xs text-[#667267]">Target: {param.target}</span>
                      </div>
                      <div className="text-sm font-bold text-[#243126] mt-0.5">{param.value}</div>
                    </div>
                    <span
                      className="px-3 py-1 text-xs font-bold rounded-full"
                      style={{
                        backgroundColor: `${param.color}15`,
                        color: param.color,
                        border: `1px solid ${param.color}40`,
                      }}
                    >
                      {param.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* MANDATORY DISCLAIMER BOX */}
            <div className="p-4 rounded-xl bg-white border border-[#E8B94A]/40 text-[#667267] text-xs flex items-start gap-3 shadow-sm">
              <AlertCircle className="w-5 h-5 text-[#E8B94A] shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block text-sm text-[#285C32] mb-0.5">Laboratory Accuracy Notice</strong>
                {DEMO_SOIL_CARD.notice}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
