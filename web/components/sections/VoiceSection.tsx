'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { MessageSquare, Mic, Volume2, Sparkles, ArrowRight, Check } from 'lucide-react';

export const VoiceSection: React.FC = () => {
  const { t } = useTranslation();

  const SAMPLE_QUESTIONS = [
    'What should I grow this season based on my soil?',
    'Why are my soybean leaves turning yellow?',
    'Will rain affect my spray schedule this week?',
    'What does my NPK soil report mean?',
  ];

  const [activeQuestion, setActiveQuestion] = useState(SAMPLE_QUESTIONS[0]);

  return (
    <section id="assistant" className="py-24 bg-[#F7F6F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* LEFT: Section Description & Example Question Chips (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EEF5E8] text-[#173F2A] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#3F7D3A]" />
              <span>{t('voice.eyebrow', 'ASK ANNADATA AI')}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#173F2A] tracking-tight leading-tight">
              {t('voice.heading', 'Your farming questions, answered in your language.')}
            </h2>

            <p className="text-sm sm:text-base text-[#5F6F62] leading-relaxed font-medium">
              {t(
                'voice.subheading',
                'Speak or type your queries in Hindi, Marathi, Tamil, Bengali, or English. Annadata combines your farm location, standing crop, and soil parameters to deliver clear answers.'
              )}
            </p>

            {/* Quick Sample Questions Chips */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#5F6F62]">
                Common Farmer Inquiries:
              </span>
              <div className="flex flex-col gap-2">
                {SAMPLE_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveQuestion(q)}
                    className={`p-3 rounded-2xl text-left text-xs font-bold transition-all border ${
                      activeQuestion === q
                        ? 'bg-[#173F2A] text-white border-[#173F2A] shadow-xs'
                        : 'bg-white text-[#17201A] border-[#173F2A]/10 hover:border-[#3F7D3A]/40'
                    }`}
                  >
                    "{q}"
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Link href="/app/assistant">
                <Button variant="primary" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                  {t('voice.askNow', 'Ask Annadata Voice AI')}
                </Button>
              </Link>
            </div>
          </div>

          {/* RIGHT: Conversational Preview Widget (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#173F2A]/10 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#173F2A] flex items-center justify-center text-white">
                  <Sparkles className="w-5 h-5 text-[#D8B45A]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#17201A]">Ask Annadata Assistant</h3>
                  <span className="text-[11px] text-[#3F7D3A] font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#3F7D3A] inline-block" />
                    Context-aware (Indore • Soybean • pH 6.8)
                  </span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#EEF5E8] text-[#173F2A] text-xs font-bold">
                Multilingual AI
              </span>
            </div>

            {/* Conversation Flow */}
            <div className="space-y-4">
              {/* Farmer Speech Bubble */}
              <div className="flex items-start gap-3 justify-end">
                <div className="bg-[#EEF5E8] border border-[#3F7D3A]/15 p-4 rounded-3xl rounded-tr-xs max-w-md text-right space-y-1">
                  <span className="text-[10px] font-bold text-[#3F7D3A] block">Farmer Query:</span>
                  <p className="text-xs sm:text-sm font-bold text-[#17201A]">
                    "{activeQuestion}"
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#3F7D3A] flex items-center justify-center text-white shrink-0 mt-1">
                  <Mic className="w-4 h-4" />
                </div>
              </div>

              {/* Annadata Advisory Response */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#173F2A] flex items-center justify-center text-[#D8B45A] shrink-0 mt-1">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="bg-[#F7F6F0] border border-[#173F2A]/10 p-5 rounded-3xl rounded-tl-xs max-w-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#3F7D3A]">
                      Annadata Agronomic Guidance
                    </span>
                    <button className="flex items-center gap-1 text-[11px] font-bold text-[#173F2A] hover:text-[#3F7D3A] px-2 py-0.5 rounded-full bg-white border border-stone-200">
                      <Volume2 className="w-3 h-3 text-[#3F7D3A]" />
                      <span>Listen</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-[#17201A] font-medium leading-relaxed">
                    Based on your soil test (pH 6.8, Medium Nitrogen) and upcoming rainfall pattern in Indore district, <strong>Soybean (JS-9560 or JS-2034)</strong> is highly suitable for this Kharif season. Ensure seed inoculation with Rhizobium culture before sowing to maximize root nodule nitrogen fixation.
                  </p>
                  <div className="p-2.5 bg-white rounded-xl border border-stone-200/80 text-[11px] text-[#5F6F62] flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#3F7D3A] shrink-0" />
                    <span>Cross-referenced with ICAR agronomic database</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
