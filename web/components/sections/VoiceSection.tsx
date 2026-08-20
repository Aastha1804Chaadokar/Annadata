'use client';

import React, { useState } from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { INDIAN_LANGUAGES, DEMO_VOICE_CHAT } from '@/lib/constants';
import { motion } from 'framer-motion';
import { Mic, Volume2, Sparkles, Globe2 } from 'lucide-react';

export const VoiceSection: React.FC = () => {
  const [activeLang, setActiveLang] = useState('hi');
  const [isRecording, setIsRecording] = useState(false);

  return (
    <section className="py-24 bg-[#F3F7ED] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Multilingual Voice Assistant"
          title="Ask Annadata."
          subtitle="Speak naturally in your mother tongue. Annadata listens, understands your regional dialect, and responds with plain-language agricultural guidance."
        />

        <div className="mt-12 max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-[#3F7D3A]/15">
          {/* Supported Language Chips */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#667267] mb-3">
              <Globe2 className="w-4 h-4 text-[#3F7D3A]" />
              <span>Supported Regional Languages:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {INDIAN_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setActiveLang(lang.code)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    activeLang === lang.code
                      ? 'bg-[#3F7D3A] text-white shadow-sm scale-105'
                      : 'bg-[#EEF5E8] text-[#285C32] hover:bg-[#DCECCF]'
                  }`}
                >
                  {lang.nativeName} ({lang.name})
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Voice Simulation Container */}
          <div className="space-y-6 bg-[#F8FAF3] p-6 sm:p-8 rounded-2xl border border-[#DCECCF]">
            {/* User Speech Bubble */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-[#E8B94A] text-[#285C32] flex items-center justify-center font-bold shrink-0 shadow-sm">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <div className="bg-[#EEF5E8] border border-[#DCECCF] p-4 rounded-2xl rounded-tl-none max-w-lg">
                <div className="text-xs font-bold text-[#3F7D3A] mb-1">Farmer Voice Input (किसान की आवाज):</div>
                <p className="text-lg font-extrabold text-[#285C32]">
                  "{DEMO_VOICE_CHAT.query}"
                </p>
                <p className="text-xs text-[#667267] mt-1 italic">
                  ({DEMO_VOICE_CHAT.queryEnglish})
                </p>
              </div>
            </motion.div>

            {/* AI Assistant Speech Bubble */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-start justify-end gap-4"
            >
              <div className="bg-white border-2 border-[#3F7D3A]/20 p-5 rounded-2xl rounded-tr-none max-w-xl shadow-sm">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#3F7D3A]">
                    <Sparkles className="w-4 h-4 text-[#E8B94A]" />
                    <span>Annadata AI Advisory Response</span>
                  </div>
                  <Volume2 className="w-4 h-4 text-[#3F7D3A] animate-pulse cursor-pointer" />
                </div>
                <p className="text-lg font-bold text-[#285C32]">
                  "{DEMO_VOICE_CHAT.response}"
                </p>
                <p className="text-xs text-[#667267] mt-1.5 italic">
                  ({DEMO_VOICE_CHAT.responseEnglish})
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#3F7D3A] text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                🌾
              </div>
            </motion.div>

            {/* Simulated Voice Button Trigger */}
            <div className="pt-4 flex flex-col items-center justify-center">
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`relative p-5 rounded-full text-white shadow-md transition-transform active:scale-95 ${
                  isRecording ? 'bg-amber-600 animate-pulse' : 'bg-[#3F7D3A] hover:bg-[#285C32]'
                }`}
              >
                <Mic className="w-8 h-8" />
                {isRecording && (
                  <span className="absolute inset-0 rounded-full border-4 border-amber-300 animate-ping opacity-75" />
                )}
              </button>
              <span className="text-xs text-[#667267] font-medium mt-3">
                {isRecording ? 'Listening... Speak your farming query' : 'Tap microphone icon to try voice query demo'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
