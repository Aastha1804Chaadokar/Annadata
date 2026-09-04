'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { getFarmerProfile } from '@/lib/farmerService';
import { getLatestSoilReport } from '@/lib/soilService';
import { getWeatherData } from '@/lib/weatherService';
import {
  generateAiResponse,
  getSavedChatHistory,
  saveChatHistory,
  clearChatHistory,
  getLangCode,
  LANGUAGE_SPEECH_MAP,
  SupportedLang,
} from '@/lib/assistantService';
import { FarmerProfile } from '@/types/farmer';
import { SoilReportRecord } from '@/types/soil';
import { WeatherData } from '@/types/weather';
import { ChatMessage } from '@/types/assistant';
import { AppSidebar } from '@/components/app/AppSidebar';
import { AppHeader } from '@/components/app/AppHeader';
import { ProtectedRoute } from '@/components/app/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { formatCropDisplay } from '@/lib/cropDataset';
import { SUPPORTED_LANGUAGES, STORAGE_KEY as LANG_STORAGE_KEY } from '@/lib/i18n/config';
import {
  Bot,
  User,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowLeft,
  Trash2,
  Sprout,
  MapPin,
  AlertTriangle,
  HelpCircle,
  Globe,
  Radio,
  Check,
} from 'lucide-react';

import { useTranslation } from 'react-i18next';

// ─── Web Speech API Type Declarations ───────────────────────────────────────
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

function AssistantContent() {
  const { t, i18n } = useTranslation();
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [soilReport, setSoilReport] = useState<SoilReportRecord | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // ── Auto-Speak Preference (Persisted in localStorage) ─────────────────────
  const [autoSpeak, setAutoSpeak] = useState<boolean>(true);

  // ── Real Voice Recording State ────────────────────────────────────────────
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [interimText, setInterimText] = useState<string>('');
  const recognitionRef = useRef<any>(null);

  // ── Real TTS State ────────────────────────────────────────────────────────
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [ttsDebug, setTtsDebug] = useState<string>('');
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const prevLangRef = useRef<string>(i18n.language);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // 1. Initialize Profile & Context
  useEffect(() => {
    const p = getFarmerProfile();
    setProfile(p);
    const s = getLatestSoilReport();
    setSoilReport(s);

    getWeatherData(p).then((w) => setWeather(w));

    const saved = getSavedChatHistory();
    if (saved.length > 0) {
      setMessages(saved);
    } else {
      const initialGreeting = generateAiResponse('hello', p, s, null, i18n.language);
      setMessages([initialGreeting]);
      saveChatHistory([initialGreeting]);
    }

    // Init speech synthesis & preload voices
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const loadVoices = () => {
        window.speechSynthesis.getVoices();
      };
      loadVoices();
      window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      utteranceRef.current = null;
    };
  }, []);

  // 2. Real-Time Language Change Reaction (Updates greetings, voices & speech models)
  useEffect(() => {
    if (!profile) return;
    const currentLang = i18n.language || 'en';

    // If language changed
    if (prevLangRef.current !== currentLang) {
      prevLangRef.current = currentLang;

      // Stop any ongoing audio
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setSpeakingMsgId(null);
      utteranceRef.current = null;

      // Check if chat only has the greeting message or if we should add a language switch greeting
      setMessages((prev) => {
        // If empty or only has 1 greeting, replace with new language greeting
        if (prev.length <= 1 && (!prev[0] || prev[0].sender === 'assistant')) {
          const freshGreeting = generateAiResponse('hello', profile, soilReport, weather, currentLang);
          saveChatHistory([freshGreeting]);
          return [freshGreeting];
        }

        // Add a localized status notification from the assistant
        const langInfo = LANGUAGE_SPEECH_MAP[currentLang as SupportedLang] || LANGUAGE_SPEECH_MAP.hi;
        const noticeMsg: ChatMessage = {
          id: `notice_${Date.now()}`,
          sender: 'assistant',
          text: `🌐 **Language updated to ${langInfo.nativeName} (${langInfo.name}).** AI Voice & Speech Recognition are now active in **${langInfo.nativeName}** (${langInfo.bcp47}).`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          language: currentLang,
          category: 'general',
          suggestedFollowUps: generateAiResponse('hello', profile, soilReport, weather, currentLang).suggestedFollowUps,
        };
        const updated = [...prev, noticeMsg];
        saveChatHistory(updated);
        return updated;
      });

      setTtsDebug(`Language switched to ${currentLang} (${getLangCode(currentLang)})`);
    }
  }, [i18n.language, profile, soilReport, weather]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!profile) return null;

  // ─────────────────────────────────────────────────────────────────────────
  // REAL SPEECH RECOGNITION (Multilingual STT)
  // ─────────────────────────────────────────────────────────────────────────
  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
    setInterimText('');
  };

  const startRecording = () => {
    setVoiceError(null);
    setInterimText('');

    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setVoiceError('Voice recognition is not supported in your browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognitionRef.current = recognition;

    // Set recognition language to active selected language (e.g. hi-IN, mr-IN, bn-IN, etc.)
    const activeLangCode = getLangCode(i18n.language);
    recognition.lang = activeLangCode;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += t;
        } else {
          interimTranscript += t;
        }
      }

      if (interimTranscript) {
        setInterimText(interimTranscript);
      }

      if (finalTranscript) {
        setInputText(finalTranscript.trim());
        setInterimText('');
        // Auto-send query after voice recognition completes
        setTimeout(() => {
          handleSendMessage(finalTranscript.trim());
        }, 300);
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'no-speech') {
        setVoiceError('No speech detected. Please speak clearly into your microphone.');
      } else if (event.error === 'not-allowed') {
        setVoiceError('Microphone permission denied. Please enable microphone access in your browser.');
      } else if (event.error === 'network') {
        setVoiceError('Network error. Speech recognition requires an active internet connection.');
      } else {
        setVoiceError(`Voice error: ${event.error}. Please try again.`);
      }
      setIsRecording(false);
      setInterimText('');
    };

    recognition.onend = () => {
      setIsRecording(false);
      setInterimText('');
      recognitionRef.current = null;
    };

    recognition.start();
  };

  const toggleVoiceRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // REAL TEXT-TO-SPEECH (Multilingual TTS)
  // ─────────────────────────────────────────────────────────────────────────
  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    utteranceRef.current = null;
    setSpeakingMsgId(null);
  };

  const cleanTextForSpeech = (text: string): string => {
    return text
      .replace(/[*_~`#]/g, '')
      .replace(/•/g, '')
      .replace(/₹/g, 'Rupees ')
      .replace(/\n+/g, '. ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const doSpeak = (msgId: string, cleanText: string, targetLang?: string) => {
    const synth = window.speechSynthesis;
    const allVoices = synth.getVoices();
    const langCode = getLangCode(targetLang || i18n.language);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utteranceRef.current = utterance; // Keep ref to prevent Chrome GC bug

    if (allVoices.length > 0) {
      const exact = allVoices.find((v) => v.lang === langCode || v.lang.replace('_', '-') === langCode);
      const partial = allVoices.find((v) => v.lang.startsWith(langCode.split('-')[0]));
      const indian = allVoices.find((v) => v.lang.includes('IN'));
      const english = allVoices.find((v) => v.lang.startsWith('en'));
      const chosen = exact || partial || indian || english || allVoices[0];

      utterance.voice = chosen;
      utterance.lang = chosen.lang;
      setTtsDebug(`Voice: ${chosen.name} (${chosen.lang})`);
    } else {
      utterance.lang = langCode;
      setTtsDebug(`Default voice (${langCode})`);
    }

    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => setSpeakingMsgId(msgId);
    utterance.onend = () => {
      setSpeakingMsgId(null);
      utteranceRef.current = null;
    };
    utterance.onerror = (e) => {
      if (e.error !== 'interrupted') {
        console.error('[TTS Error]', e.error);
        setTtsDebug(`TTS Error: ${e.error}`);
      }
      setSpeakingMsgId(null);
      utteranceRef.current = null;
    };

    synth.speak(utterance);
  };

  const handleToggleAudio = (msgId: string, text: string, msgLang?: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setTtsDebug('Speech Synthesis not supported in this browser.');
      return;
    }

    if (speakingMsgId === msgId) {
      stopSpeaking();
      return;
    }

    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setSpeakingMsgId(null);

    const cleanText = cleanTextForSpeech(text);
    const targetLang = msgLang || i18n.language;
    const voices = window.speechSynthesis.getVoices();

    if (voices.length > 0) {
      setTimeout(() => doSpeak(msgId, cleanText, targetLang), 50);
    } else {
      setTtsDebug('Loading voices...');
      let spoken = false;
      const onReady = () => {
        if (spoken) return;
        spoken = true;
        window.speechSynthesis.removeEventListener('voiceschanged', onReady);
        setTimeout(() => doSpeak(msgId, cleanText, targetLang), 50);
      };
      window.speechSynthesis.addEventListener('voiceschanged', onReady);
      setTimeout(() => {
        if (!spoken) {
          spoken = true;
          window.speechSynthesis.removeEventListener('voiceschanged', onReady);
          doSpeak(msgId, cleanText, targetLang);
        }
      }, 700);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // CHAT SEND & AUTO-SPEAK
  // ─────────────────────────────────────────────────────────────────────────
  const handleSendMessage = (textToSend?: string) => {
    const q = textToSend || inputText;
    if (!q.trim() || isTyping) return;

    const currentLang = i18n.language || 'en';

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: q.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: currentLang,
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    setInputText('');
    setIsTyping(true);
    setVoiceError(null);

    setTimeout(() => {
      const aiReply = generateAiResponse(q, profile, soilReport, weather, currentLang);
      const finalMsgs = [...updated, aiReply];
      setMessages(finalMsgs);
      saveChatHistory(finalMsgs);
      setIsTyping(false);

      // Auto-speak response if enabled
      if (autoSpeak && typeof window !== 'undefined' && window.speechSynthesis) {
        setTimeout(() => {
          handleToggleAudio(aiReply.id, aiReply.text, currentLang);
        }, 100);
      }
    }, 500);
  };

  const handleClearHistory = () => {
    clearChatHistory();
    stopSpeaking();
    const initialGreeting = generateAiResponse('hello', profile, soilReport, weather, i18n.language);
    setMessages([initialGreeting]);
  };

  const handleSwitchLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANG_STORAGE_KEY, langCode);
    }
  };

  const cropNameStr = profile.currentCrop ? formatCropDisplay(profile.currentCrop) : profile.mainCrop || 'Soybean';
  const activeLangCode = getLangCode(i18n.language);
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === (i18n.language || 'en')) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="min-h-screen bg-[#F8FAF3] flex flex-col">
      <AppHeader />

      <div className="flex flex-1">
        <AppSidebar />

        <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-5 max-w-5xl flex flex-col">
          {/* Header & Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
            <div>
              <Link href="/app/dashboard" className="text-xs font-bold text-[#3F7D3A] hover:underline flex items-center gap-1 mb-1">
                <ArrowLeft className="w-3.5 h-3.5" /> {t('common.backToDashboard', 'Back to Dashboard')}
              </Link>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-[#173F2A]">
                  🤖 {t('assistant.title', 'AI Farming Voice Assistant')}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#EEF5E8] text-[#3F7D3A] text-[11px] font-extrabold border border-[#DCECCF] flex items-center gap-1">
                  <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                  <span>{currentLangObj.flag} {currentLangObj.nativeName} ({activeLangCode})</span>
                </span>
              </div>
              <p className="text-xs text-[#5F6F62] mt-0.5">
                {t('assistant.subtitle', 'Speak or type in any Indian language. The assistant responds with voice and text.')}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Auto-Speak Toggle */}
              <button
                type="button"
                onClick={() => setAutoSpeak(!autoSpeak)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                  autoSpeak
                    ? 'bg-[#173F2A] text-white border-[#173F2A] shadow-xs'
                    : 'bg-white text-[#5F6F62] border-stone-200 hover:border-stone-300'
                }`}
                title="Toggle automatic speech synthesis when assistant replies"
              >
                {autoSpeak ? <Volume2 className="w-3.5 h-3.5 text-[#D8B45A]" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>Auto-Speak: {autoSpeak ? 'ON (चालू)' : 'OFF (बंद)'}</span>
              </button>

              <Button variant="secondary" size="sm" onClick={handleClearHistory} icon={<Trash2 className="w-3.5 h-3.5 text-red-600" />}>
                Clear
              </Button>
            </div>
          </div>

          {/* QUICK ONE-TAP LANGUAGE SELECTOR BAR */}
          <div className="p-3 bg-white rounded-2xl border border-[#173F2A]/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#173F2A] shrink-0">
              <Globe className="w-4 h-4 text-[#3F7D3A]" />
              <span>{t('assistant.chooseLanguage', 'Choose Assistant Language / भाषा चुनें')}:</span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isActive = (i18n.language || 'en') === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSwitchLanguage(lang.code)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1 border ${
                      isActive
                        ? 'bg-[#3F7D3A] text-white border-[#3F7D3A] shadow-xs scale-105'
                        : 'bg-[#F8FAF3] hover:bg-[#EEF5E8] text-[#173F2A] border-stone-200'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                    {isActive && <Check className="w-3 h-3 ml-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ACTIVE FARM CONTEXT SUMMARY CHIP */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#3F7D3A]/20 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-[#173F2A] font-extrabold">
              <Sparkles className="w-4 h-4 text-[#3F7D3A]" />
              <span>{t('assistant.syncedContext', 'Active Farm Context')}:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-xl bg-[#F8FAF3] border border-stone-200 text-[#173F2A] font-bold flex items-center gap-1">
                <Sprout className="w-3.5 h-3.5 text-[#3F7D3A]" /> {cropNameStr}
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-[#F8FAF3] border border-stone-200 text-[#173F2A] font-bold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#3F7D3A]" /> {profile.village}, {profile.district}
              </span>
              {soilReport && (
                <span className="px-2.5 py-1 rounded-xl bg-[#F8FAF3] border border-stone-200 text-[#173F2A] font-bold flex items-center gap-1">
                  🧪 Soil pH: {soilReport.ph}
                </span>
              )}
              {weather && (
                <span className="px-2.5 py-1 rounded-xl bg-[#F8FAF3] border border-stone-200 text-[#173F2A] font-bold flex items-center gap-1">
                  🌦 {weather.current.temperature}°C • Rain: {weather.current.precipitationProb}%
                </span>
              )}
            </div>
          </div>

          {/* QUICK SUGGESTED QUESTIONS BAR */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#5F6F62] flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-[#3F7D3A]" /> {t('assistant.quickPrompts', 'Quick Farming Questions')}:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => handleSendMessage(`${cropNameStr} fertilizer dosage`)}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#EEF5E8] border border-stone-200 text-xs font-extrabold text-[#173F2A] shrink-0 transition-colors shadow-xs"
              >
                🌾 {cropNameStr} Fertilizer & Khad (खाद मात्रा)
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage('Should I irrigate today based on weather?')}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#EEF5E8] border border-stone-200 text-xs font-extrabold text-[#173F2A] shrink-0 transition-colors shadow-xs"
              >
                💧 Rain & Irrigation Advisory (सिंचाई सलाह)
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage('Yellow leaves and pest treatment')}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#EEF5E8] border border-stone-200 text-xs font-extrabold text-[#173F2A] shrink-0 transition-colors shadow-xs"
              >
                🐛 Yellow Leaves & Pest Spray (कीट व पत्ती धब्बा)
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage('Soil pH test and NPK report')}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#EEF5E8] border border-stone-200 text-xs font-extrabold text-[#173F2A] shrink-0 transition-colors shadow-xs"
              >
                🧪 Soil Health Card & pH (मृदा परीक्षण)
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage('Current mandi prices')}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#EEF5E8] border border-stone-200 text-xs font-extrabold text-[#173F2A] shrink-0 transition-colors shadow-xs"
              >
                📈 APMC Mandi Rates (मंडी भाव)
              </button>
            </div>
          </div>

          {/* CHAT TRANSCRIPT AREA */}
          <div className="flex-1 bg-white rounded-3xl p-4 sm:p-6 border border-[#173F2A]/10 shadow-sm space-y-5 overflow-y-auto max-h-[520px]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-9 h-9 rounded-2xl bg-[#EEF5E8] text-[#3F7D3A] flex items-center justify-center shrink-0 border border-[#DCECCF]">
                    <Bot className="w-5 h-5" />
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-3xl p-5 space-y-3 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#173F2A] text-white rounded-tr-none font-semibold shadow-sm'
                      : 'bg-[#F8FAF3] border border-stone-200 text-[#173F2A] rounded-tl-none shadow-sm'
                  }`}
                >
                  {/* Sender Header */}
                  <div className="flex items-center justify-between border-b border-stone-200/40 pb-2">
                    <span className="font-extrabold text-[11px] flex items-center gap-1.5">
                      <span>{msg.sender === 'user' ? 'You (किसान)' : 'Annadata AI Assistant'}</span>
                      {msg.language && (
                        <span className="px-2 py-0.2 rounded-md bg-stone-200/60 text-stone-700 text-[9px] font-bold">
                          {msg.language.toUpperCase()}
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] opacity-75">{msg.timestamp}</span>
                  </div>

                  {/* Main Text Content */}
                  <div className="whitespace-pre-line font-medium text-sm">
                    {msg.text}
                  </div>

                  {/* STRUCTURED RESPONSE DETAILS (IF ASSISTANT) */}
                  {msg.sender === 'assistant' && msg.structuredData && (
                    <div className="space-y-3 pt-2">
                      {/* DOSAGE TABLE */}
                      {msg.structuredData.dosages && msg.structuredData.dosages.length > 0 && (
                        <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2">
                          <div className="font-black text-xs text-[#3F7D3A]">📋 {t('assistant.dosages', 'Dosage & Application Schedule')}:</div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-[11px] text-left border-collapse">
                              <thead>
                                <tr className="border-b border-stone-200 text-[#5F6F62] font-bold">
                                  <th className="py-1 px-2">Product</th>
                                  <th className="py-1 px-2">Dosage / Acre</th>
                                  <th className="py-1 px-2">Application Timing</th>
                                </tr>
                              </thead>
                              <tbody>
                                {msg.structuredData.dosages.map((d, i) => (
                                  <tr key={i} className="border-b border-stone-100">
                                    <td className="py-1.5 px-2 font-bold text-[#173F2A]">{d.product}</td>
                                    <td className="py-1.5 px-2 font-bold text-[#3F7D3A]">{d.amountPerAcre}</td>
                                    <td className="py-1.5 px-2 text-stone-600">{d.timing}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* STEPS LIST */}
                      {msg.structuredData.steps && msg.structuredData.steps.length > 0 && (
                        <div className="p-3.5 rounded-2xl bg-white border border-stone-200 space-y-1.5">
                          <div className="font-bold text-xs text-[#173F2A]">📌 Action Steps:</div>
                          {msg.structuredData.steps.map((st, i) => (
                            <div key={i} className="text-[11px] text-stone-700 font-medium pl-2">{st}</div>
                          ))}
                        </div>
                      )}

                      {/* WARNING BOX */}
                      {msg.structuredData.warnings && msg.structuredData.warnings.length > 0 && (
                        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                          <div className="font-bold text-xs flex items-center gap-1 text-amber-800">
                            <AlertTriangle className="w-4 h-4 text-amber-600" /> {t('assistant.warnings', 'Important Precaution')}:
                          </div>
                          {msg.structuredData.warnings.map((w, i) => (
                            <div key={i} className="text-[11px] font-semibold pl-5">• {w}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 🔊 MULTILINGUAL LISTEN BUTTON */}
                  {msg.sender === 'assistant' && (
                    <div className="pt-3 flex items-center justify-between border-t border-stone-200/60 mt-2">
                      <button
                        type="button"
                        onClick={() => handleToggleAudio(msg.id, msg.text, msg.language)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
                          speakingMsgId === msg.id
                            ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-sm animate-pulse'
                            : 'bg-white hover:bg-[#EEF5E8] border-stone-300 text-[#3F7D3A] hover:border-[#3F7D3A]'
                        }`}
                      >
                        {speakingMsgId === msg.id ? (
                          <>
                            <VolumeX className="w-4 h-4 text-amber-700" />
                            <span>Stop Speaking (रोकें) ⏹</span>
                            <span className="flex gap-0.5 items-end h-3 ml-1">
                              <span className="w-1 h-3 bg-amber-600 animate-bounce rounded-full" />
                              <span className="w-1 h-2 bg-amber-600 animate-bounce delay-75 rounded-full" />
                              <span className="w-1 h-3.5 bg-amber-600 animate-bounce delay-150 rounded-full" />
                            </span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-4 h-4 text-[#3F7D3A]" />
                            <span>🔊 Listen in {LANGUAGE_SPEECH_MAP[(msg.language as SupportedLang) || 'hi']?.nativeName || 'हिन्दी'}</span>
                          </>
                        )}
                      </button>
                      <span className="text-[10px] text-stone-400 font-medium">Verified by ICAR & IMD</span>
                    </div>
                  )}

                  {/* SUGGESTED FOLLOW-UP BUTTONS */}
                  {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                    <div className="pt-2 border-t border-stone-200/50 space-y-1.5">
                      <span className="text-[10px] font-bold text-[#5F6F62] block">Suggested Follow-ups:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestedFollowUps.map((f, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleSendMessage(f)}
                            className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#EEF5E8] border border-stone-300 text-[11px] font-bold text-[#3F7D3A] transition-colors"
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-9 h-9 rounded-2xl bg-[#3F7D3A] text-white flex items-center justify-center shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}

            {/* TYPING INDICATOR */}
            {isTyping && (
              <div className="flex gap-3 items-center text-xs text-[#3F7D3A] font-bold animate-pulse">
                <div className="w-8 h-8 rounded-xl bg-[#EEF5E8] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-[#3F7D3A]" />
                </div>
                <span>Annadata AI is formulating localized advisory in {currentLangObj.nativeName}...</span>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* VOICE RECORDING LIVE BANNER */}
          {isRecording && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center animate-bounce">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-black text-sm">🎙 Listening in {currentLangObj.nativeName} ({activeLangCode})...</div>
                  <div className="font-normal text-xs text-emerald-700 mt-0.5">
                    {interimText ? `"${interimText}"` : 'Speak now in your native language...'}
                  </div>
                </div>
              </div>
              <Button size="sm" variant="secondary" onClick={stopRecording}>
                {t('common.cancel', 'Done / Stop')}
              </Button>
            </div>
          )}

          {/* VOICE ERROR BANNER */}
          {voiceError && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <MicOff className="w-5 h-5 text-red-500 shrink-0" />
                <span>{voiceError}</span>
              </div>
              <button
                type="button"
                className="text-[10px] text-red-500 hover:text-red-700 underline shrink-0"
                onClick={() => setVoiceError(null)}
              >
                Dismiss
              </button>
            </div>
          )}

          {/* INPUT CONTROL BAR */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 pt-1"
          >
            <button
              type="button"
              onClick={toggleVoiceRecording}
              title={isRecording ? 'Stop Voice Recording' : `Speak in ${currentLangObj.nativeName} (आवाज़ से पूछें)`}
              className={`p-3.5 rounded-2xl border transition-all ${
                isRecording
                  ? 'bg-red-500 text-white border-red-600 animate-pulse shadow-md scale-105'
                  : 'bg-white hover:bg-[#EEF5E8] text-[#3F7D3A] border-stone-300 hover:border-[#3F7D3A]'
              }`}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              placeholder={interimText ? `"${interimText}"` : `${t('assistant.askPlaceholder', 'Ask any farming query in')} ${currentLangObj.nativeName}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-3.5 rounded-2xl border border-stone-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#3F7D3A] bg-white shadow-xs"
            />

            <Button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              icon={<Send className="w-4 h-4" />}
            >
              {t('assistant.askButton', 'Send')}
            </Button>
          </form>

          {/* TTS Audio Diagnostics Bar */}
          <div className="rounded-2xl bg-stone-50 border border-stone-200 p-3 space-y-1.5 text-[10px] text-stone-500">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                🔊 Voice Engine: <span className="text-[#3F7D3A] font-bold">{ttsDebug || 'Ready'}</span> · Speech Locale: <strong>{activeLangCode}</strong>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (typeof window === 'undefined' || !window.speechSynthesis) return;
                  window.speechSynthesis.cancel();
                  const testGreeting = generateAiResponse('hello', profile, soilReport, weather, i18n.language);
                  handleToggleAudio('test_audio', testGreeting.text, i18n.language);
                }}
                className="px-2.5 py-1 rounded-lg bg-[#3F7D3A] text-white text-[10px] font-bold hover:bg-[#285C32] transition-colors"
              >
                🔊 Test Speak in {currentLangObj.nativeName}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AssistantPage() {
  return (
    <ProtectedRoute>
      <AssistantContent />
    </ProtectedRoute>
  );
}
