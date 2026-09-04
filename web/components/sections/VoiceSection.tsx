'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { MessageSquare, Mic, Volume2, VolumeX, Sparkles, ArrowRight, Check, Radio } from 'lucide-react';
import { getLangCode, LANGUAGE_SPEECH_MAP, SupportedLang } from '@/lib/assistantService';

export const VoiceSection: React.FC = () => {
  const { t, i18n } = useTranslation();

  const SAMPLE_QUESTIONS = [
    {
      q: 'What should I grow this season based on my soil?',
      qHi: 'मेरी मिट्टी और मौसम के आधार पर मुझे इस सीजन में क्या बोना चाहिए?',
      ans: 'Based on your soil test (pH 6.8, Medium Nitrogen) and upcoming rainfall pattern in Indore district, Soybean (JS-9560 or JS-2034) is highly suitable for this Kharif season. Ensure seed inoculation with Rhizobium culture before sowing.',
      ansHi: 'आपकी मृदा जांच (pH 6.8, मध्यम नाइट्रोजन) और आगामी मानसूनी बारिश के आधार पर सोयाबीन (JS-9560 या JS-2034) खरीफ सीजन के लिए सबसे उपयुक्त है। बुआई से पहले राइजोबियम कल्चर से बीज उपचार अवश्य करें।',
    },
    {
      q: 'Why are my soybean leaves turning yellow?',
      qHi: 'मेरी सोयाबीन की पत्तियां पीली क्यों पड़ रही हैं?',
      ans: 'Yellowing in soybean leaves can be caused by sucking pests like whiteflies or early nitrogen deficiency. Spray Neem Oil (10,000 PPM) @ 500ml per acre as an organic remedy or Thiamethoxam 25% WG if infestation is severe.',
      ansHi: 'सोयाबीन की पत्तियों का पीला पड़ना सफेद मक्खी या नाइट्रोजन की कमी का लक्षण हो सकता है। जैविक उपचार के लिए नीम तेल (10,000 PPM) 500 मिली प्रति एकड़ छिड़कें या गंभीर स्थिति में थायामेथॉक्सम 25% WG का स्प्रे करें।',
    },
    {
      q: 'Will rain affect my spray schedule this week?',
      qHi: 'क्या इस हफ्ते बारिश मेरे कीटनाशक छिड़काव को प्रभावित करेगी?',
      ans: 'Rain probability is low for the next 48 hours in your district. Weather conditions are ideal for scheduled pesticide or foliar fertilizer spraying. Always spray during morning or late afternoon.',
      ansHi: 'आपके जिले में अगले 48 घंटों में बारिश की संभावना बहुत कम है। कीटनाशक या उर्वरक छिड़काव के लिए मौसम बिल्कुल अनुकूल है। स्प्रे हमेशा सुबह या शाम के समय करें।',
    },
    {
      q: 'What does my NPK soil report mean?',
      qHi: 'मेरी मृदा रिपोर्ट में NPK का क्या मतलब है?',
      ans: 'Your soil report shows pH 6.8 (Optimal), Available Nitrogen at 260 kg/ha (Medium), Phosphorus at 18 kg/ha, and Potassium at 290 kg/ha. Apply 45 kg DAP and 35 kg Urea split into two doses.',
      ansHi: 'आपकी रिपोर्ट में मृदा pH 6.8 (उत्तम), नाइट्रोजन 260 किग्रा/हेक्टेयर (मध्यम), फास्फोरस 18 किग्रा/हेक्टेयर और पोटाश 290 किग्रा/हेक्टेयर है। संतुलित पोषण के लिए 45 किग्रा डीएपी और 35 किग्रा यूरिया दो किस्तों में दें।',
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const isHindiFamily = ['hi', 'mr', 'bn', 'ta', 'te', 'kn'].includes((i18n.language || 'en').substring(0, 2));
  const activeItem = SAMPLE_QUESTIONS[activeIndex];
  const displayQ = isHindiFamily ? activeItem.qHi : activeItem.q;
  const displayAns = isHindiFamily ? activeItem.ansHi : activeItem.ans;

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    utteranceRef.current = null;
    setIsPlaying(false);
  };

  const handleSpeak = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isPlaying) {
      stopSpeaking();
      return;
    }

    window.speechSynthesis.cancel();
    const langCode = getLangCode(i18n.language);
    const cleanText = displayAns.replace(/[*_~`#]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utteranceRef.current = utterance;

    const allVoices = window.speechSynthesis.getVoices();
    if (allVoices.length > 0) {
      const match = allVoices.find((v) => v.lang === langCode || v.lang.startsWith(langCode.split('-')[0])) || allVoices.find((v) => v.lang.includes('IN')) || allVoices[0];
      utterance.voice = match;
      utterance.lang = match.lang;
    } else {
      utterance.lang = langCode;
    }

    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => {
      setIsPlaying(false);
      utteranceRef.current = null;
    };
    utterance.onerror = () => {
      setIsPlaying(false);
      utteranceRef.current = null;
    };

    window.speechSynthesis.speak(utterance);
  };

  // Stop speech if language or active question changes
  useEffect(() => {
    stopSpeaking();
  }, [i18n.language, activeIndex]);

  const activeLangCode = getLangCode(i18n.language);
  const langInfo = LANGUAGE_SPEECH_MAP[(i18n.language || 'en').substring(0, 2) as SupportedLang] || LANGUAGE_SPEECH_MAP.hi;

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
                Common Farmer Inquiries (सामान्य किसान प्रश्न):
              </span>
              <div className="flex flex-col gap-2">
                {SAMPLE_QUESTIONS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`p-3 rounded-2xl text-left text-xs font-bold transition-all border ${
                      activeIndex === idx
                        ? 'bg-[#173F2A] text-white border-[#173F2A] shadow-xs scale-[1.01]'
                        : 'bg-white text-[#17201A] border-[#173F2A]/10 hover:border-[#3F7D3A]/40'
                    }`}
                  >
                    "{isHindiFamily ? item.qHi : item.q}"
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Link href="/app/assistant">
                <Button variant="primary" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                  {t('voice.askNow', 'Open Interactive Voice Assistant')}
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
                  <h3 className="text-base font-bold text-[#17201A]">Ask Annadata Voice AI</h3>
                  <span className="text-[11px] text-[#3F7D3A] font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#3F7D3A] inline-block" />
                    Context-aware (Bhopal • Soybean • pH 6.8)
                  </span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#EEF5E8] text-[#173F2A] text-xs font-bold flex items-center gap-1">
                <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                <span>{langInfo.nativeName} ({activeLangCode})</span>
              </span>
            </div>

            {/* Conversation Flow */}
            <div className="space-y-4">
              {/* Farmer Speech Bubble */}
              <div className="flex items-start gap-3 justify-end">
                <div className="bg-[#EEF5E8] border border-[#3F7D3A]/15 p-4 rounded-3xl rounded-tr-xs max-w-md text-right space-y-1">
                  <span className="text-[10px] font-bold text-[#3F7D3A] block">Farmer Query (किसान का सवाल):</span>
                  <p className="text-xs sm:text-sm font-bold text-[#17201A]">
                    "{displayQ}"
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
                    <button
                      type="button"
                      onClick={handleSpeak}
                      className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full border transition-all active:scale-95 ${
                        isPlaying
                          ? 'bg-amber-100 text-amber-900 border-amber-400 shadow-xs'
                          : 'bg-white text-[#173F2A] hover:text-[#3F7D3A] border-stone-200 hover:border-[#3F7D3A]'
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-amber-700" />
                          <span>Stop ⏹</span>
                          <span className="flex gap-0.5 items-end h-2.5 ml-0.5">
                            <span className="w-0.5 h-2 bg-amber-600 animate-bounce" />
                            <span className="w-0.5 h-3 bg-amber-600 animate-bounce delay-75" />
                          </span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-[#3F7D3A]" />
                          <span>🔊 Listen ({langInfo.nativeName})</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-[#17201A] font-medium leading-relaxed">
                    {displayAns}
                  </p>
                  <div className="p-2.5 bg-white rounded-xl border border-stone-200/80 text-[11px] text-[#5F6F62] flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#3F7D3A] shrink-0" />
                    <span>Cross-referenced with ICAR & IMD agronomic database</span>
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
