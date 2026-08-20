'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Sprout, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const FinalCTA: React.FC = () => {
  return (
    <section className="py-24 bg-[#EEF5E8] text-[#285C32] relative overflow-hidden border-t border-[#DCECCF]">
      {/* Soft warm glow background */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#E8B94A]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#DCECCF] text-[#3F7D3A] text-xs sm:text-sm font-semibold shadow-sm">
            <Sprout className="w-4 h-4 text-[#3F7D3A]" />
            <span>हर किसान, हर फसल, हर फैसला।</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-black text-[#285C32] tracking-tight">
            ANNA<span className="text-[#3F7D3A]">DATA</span>
          </h2>

          <p className="text-2xl sm:text-3xl font-extrabold text-[#285C32] max-w-2xl mx-auto">
            Better information. Better decisions. Better farming.
          </p>

          <p className="text-base text-[#667267] max-w-xl mx-auto">
            Join the journey toward data-driven, sustainable, and prosperous farming for every Indian agricultural field.
          </p>

          <div className="pt-6 flex justify-center">
            <a href="#home">
              <Button variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                Get Started
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
