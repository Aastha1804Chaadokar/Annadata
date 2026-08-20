'use client';

import React from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { DEMO_WEATHER_ADVISORY } from '@/lib/constants';
import { motion } from 'framer-motion';
import { CloudRain, Thermometer, Droplets, AlertTriangle, CloudSun } from 'lucide-react';

export const WeatherSection: React.FC = () => {
  return (
    <section className="py-24 bg-[#EAF5F5] relative overflow-hidden">
      {/* Decorative Moving Soft Cloud */}
      <motion.div
        animate={{ x: [-100, 100, -100] }}
        transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
        className="absolute top-12 left-0 opacity-15 pointer-events-none"
      >
        <CloudSun className="w-96 h-96 text-[#6FA8B8]" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge="Localized Weather Guidance"
          title="Let weather guide your decisions."
          subtitle="Timely agricultural advice tied directly to local micro-climate forecasts. Avoid wasted fertilizer and protect crops before heavy rainfall."
        />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Weather Visual Widget Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-6 bg-white rounded-3xl p-8 border border-[#6FA8B8]/30 shadow-sm space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#6FA8B8] uppercase tracking-wider">
                  {DEMO_WEATHER_ADVISORY.location}
                </span>
                <h3 className="text-2xl font-bold text-[#285C32] mt-1">Live Advisory Card</h3>
              </div>
              <CloudRain className="w-12 h-12 text-[#7BAFC1] animate-bounce" />
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#EAF5F5] border border-[#7BAFC1]/30 text-center">
                <CloudRain className="w-5 h-5 text-[#7BAFC1] mx-auto mb-1" />
                <span className="text-xs text-[#667267]">Rainfall Prob.</span>
                <span className="block text-2xl font-black text-[#285C32] mt-1">
                  {DEMO_WEATHER_ADVISORY.rainProbability}%
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFF8E8] border border-[#E8B94A]/30 text-center">
                <Thermometer className="w-5 h-5 text-[#E8B94A] mx-auto mb-1" />
                <span className="text-xs text-[#667267]">Temperature</span>
                <span className="block text-2xl font-black text-[#285C32] mt-1">
                  {DEMO_WEATHER_ADVISORY.temperature}°C
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#EEF5E8] border border-[#3F7D3A]/30 text-center">
                <Droplets className="w-5 h-5 text-[#3F7D3A] mx-auto mb-1" />
                <span className="text-xs text-[#667267]">Humidity</span>
                <span className="block text-2xl font-black text-[#285C32] mt-1">
                  {DEMO_WEATHER_ADVISORY.humidity}%
                </span>
              </div>
            </div>

            {/* Practical Actionable Advice */}
            <div className="p-5 rounded-2xl bg-[#FFF8E8] border border-[#E8B94A]/40 space-y-2">
              <div className="flex items-center gap-2 text-[#285C32] font-bold text-sm">
                <AlertTriangle className="w-4 h-4 text-[#E8B94A]" />
                <span>Actionable Advisory:</span>
              </div>
              <p className="text-sm text-[#667267] leading-relaxed">
                "{DEMO_WEATHER_ADVISORY.advisoryText}"
              </p>
            </div>
          </motion.div>

          {/* Right Column: Advisory Impact */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-6 space-y-6 text-[#243126]"
          >
            <div className="p-6 rounded-2xl bg-white border border-[#6FA8B8]/20 shadow-sm">
              <h4 className="text-lg font-bold text-[#285C32] mb-2">Irrigation Efficiency</h4>
              <p className="text-sm text-[#667267] leading-relaxed">
                Save diesel and electrical pump costs by aligning irrigation schedules with natural rainfall forecasts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#6FA8B8]/20 shadow-sm">
              <h4 className="text-lg font-bold text-[#285C32] mb-2">Pesticide & Spray Timing</h4>
              <p className="text-sm text-[#667267] leading-relaxed">
                Prevent chemical runoff by avoiding pesticide applications prior to predicted high-probability rain windows.
              </p>
            </div>

            <div className="text-xs text-[#667267] italic">
              * Demonstration weather telemetry. Connects to future Annadata weather integration service at <code className="bg-white px-2 py-0.5 rounded text-[#285C32] border border-[#6FA8B8]/20 font-semibold">/api/weather</code>.
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
