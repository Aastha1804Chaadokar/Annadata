'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { getFarmerProfile } from '@/lib/farmerService';
import { getLatestSoilReport } from '@/lib/soilService';
import { getWeatherData } from '@/lib/weatherService';
import { generateAiResponse, getSavedChatHistory, saveChatHistory, clearChatHistory } from '@/lib/assistantService';
import { FarmerProfile } from '@/types/farmer';
import { SoilReportRecord } from '@/types/soil';
import { WeatherData } from '@/types/weather';
import { ChatMessage } from '@/types/assistant';
import { AppSidebar } from '@/components/app/AppSidebar';
import { AppHeader } from '@/components/app/AppHeader';
import { ProtectedRoute } from '@/components/app/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { formatCropDisplay } from '@/lib/cropDataset';
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
} from 'lucide-react';

import { useTranslation } from 'react-i18next';

// ─── Web Speech API Type Declarations ───────────────────────────────────────
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getLangCode(i18nLang: string): string {
  const map: Record<string, string> = {
    en: 'en-IN',
    hi: 'hi-IN',
    mr: 'mr-IN',
    ta: 'ta-IN',
    te: 'te-IN',
    kn: 'kn-IN',
    bn: 'bn-IN',
  };
  return map[i18nLang] || 'hi-IN';
}

function AssistantContent() {
  const { t, i18n } = useTranslation();
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [soilReport, setSoilReport] = useState<SoilReportRecord | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // ── Real Voice Recording State ────────────────────────────────────────────
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [interimText, setInterimText] = useState<string>('');
  const recognitionRef = useRef<any>(null);

  // ── Real TTS State ────────────────────────────────────────────────────────
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [ttsDebug, setTtsDebug] = useState<string>('');
  // CRITICAL: Hold utterance in ref to prevent Chrome GC killing it mid-speech
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const chatBottomRef = useRef<HTMLDivElement>(null);

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
      const initialGreeting = generateAiResponse('hello', p, s, null);
      setMessages([initialGreeting]);
      saveChatHistory([initialGreeting]);
    }

    // Init speech synthesis and eagerly load voices
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      // Chrome loads voices async — preload them now
      const loadVoices = () => {
        window.speechSynthesis.getVoices();
      };
      loadVoices();
      window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    }

    // Cleanup on unmount — inline to avoid TDZ with const functions defined below
    return () => {
      // stop speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      // stop TTS
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      utteranceRef.current = null;
    };
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!profile) return null;

  // ─────────────────────────────────────────────────────────────────────────
  // REAL SPEECH RECOGNITION
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
      setVoiceError('Voice recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognitionRef.current = recognition;

    recognition.lang = getLangCode(i18n.language);
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
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'no-speech') {
        setVoiceError('No speech detected. Please speak clearly and try again.');
      } else if (event.error === 'not-allowed') {
        setVoiceError('Microphone permission denied. Please allow microphone access in your browser settings.');
      } else if (event.error === 'network') {
        setVoiceError('Network error. Voice recognition requires an internet connection.');
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
  // REAL TEXT-TO-SPEECH
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
      .replace(/\n+/g, '. ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const doSpeak = (msgId: string, cleanText: string, langCode: string) => {
    const synth = window.speechSynthesis;
    const allVoices = synth.getVoices();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utteranceRef.current = utterance; // hold in ref to prevent GC

    // Only set voice/lang if voices are available; otherwise let browser pick default
    if (allVoices.length > 0) {
      const exact = allVoices.find((v) => v.lang === langCode);
      const partial = allVoices.find((v) => v.lang.startsWith(langCode.split('-')[0]));
      const english = allVoices.find((v) => v.lang.startsWith('en'));
      const chosen = exact || partial || english || allVoices[0];
      utterance.voice = chosen;
      utterance.lang = chosen.lang;
      setTtsDebug(`${allVoices.length} voices · using: ${chosen.name} (${chosen.lang})`);
    } else {
      setTtsDebug('No voices loaded — using browser default');
    }

    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => setSpeakingMsgId(msgId);
    utterance.onend = () => { setSpeakingMsgId(null); utteranceRef.current = null; };
    utterance.onerror = (e) => {
      if (e.error !== 'interrupted') {
        setTtsDebug(`TTS error: ${e.error}`);
        console.error('[TTS]', e.error);
      }
      setSpeakingMsgId(null);
      utteranceRef.current = null;
    };

    synth.speak(utterance);
  };

  const handleToggleAudio = (msgId: string, text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setTtsDebug('speechSynthesis not supported in this browser');
      return;
    }

    if (speakingMsgId === msgId) {
      stopSpeaking();
      return;
    }

    // Cancel any current speech
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setSpeakingMsgId(null);

    const cleanText = cleanTextForSpeech(text);
    const langCode = getLangCode(i18n.language);
    const voices = window.speechSynthesis.getVoices();

    if (voices.length > 0) {
      // Voices already loaded — speak after short delay (Chrome cancel() race fix)
      setTimeout(() => doSpeak(msgId, cleanText, langCode), 50);
    } else {
      // Voices not yet loaded — wait for voiceschanged, then speak
      setTtsDebug('Waiting for voices to load...');
      let spoken = false;
      const onReady = () => {
        if (spoken) return;
        spoken = true;
        window.speechSynthesis.removeEventListener('voiceschanged', onReady);
        setTimeout(() => doSpeak(msgId, cleanText, langCode), 50);
      };
      window.speechSynthesis.addEventListener('voiceschanged', onReady);
      // Fallback: speak after 800ms even if voiceschanged never fires
      setTimeout(() => {
        if (!spoken) {
          spoken = true;
          window.speechSynthesis.removeEventListener('voiceschanged', onReady);
          doSpeak(msgId, cleanText, langCode);
        }
      }, 800);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // CHAT SEND
  // ─────────────────────────────────────────────────────────────────────────
  const handleSendMessage = (textToSend?: string) => {
    const q = textToSend || inputText;
    if (!q.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: q.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    setInputText('');
    setIsTyping(true);
    setVoiceError(null);

    setTimeout(() => {
      const aiReply = generateAiResponse(q, profile, soilReport, weather);
      const finalMsgs = [...updated, aiReply];
      setMessages(finalMsgs);
      saveChatHistory(finalMsgs);
      setIsTyping(false);
    }, 600);
  };

  const handleClearHistory = () => {
    clearChatHistory();
    stopSpeaking();
    const initialGreeting = generateAiResponse('hello', profile, soilReport, weather);
    setMessages([initialGreeting]);
  };

  const cropNameStr = profile.currentCrop ? formatCropDisplay(profile.currentCrop) : profile.mainCrop || 'Soybean';

  return (
    <div className="min-h-screen bg-[#F8FAF3] flex flex-col">
      <AppHeader />

      <div className="flex flex-1">
        <AppSidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-5xl flex flex-col">
          {/* Header & Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
            <div>
              <Link href="/app/dashboard" className="text-xs font-bold text-[#3F7D3A] hover:underline flex items-center gap-1 mb-1">
                <ArrowLeft className="w-3.5 h-3.5" /> {t('common.backToDashboard')}
              </Link>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-black text-[#285C32]">
                  🤖 {t('assistant.title')}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#EEF5E8] text-[#3F7D3A] text-[10px] font-extrabold border border-[#DCECCF]">
                  Multilingual AI Active
                </span>
              </div>
              <p className="text-xs text-[#667267] mt-0.5">
                {t('assistant.subtitle')}
              </p>
            </div>

            <Button variant="secondary" size="sm" onClick={handleClearHistory} icon={<Trash2 className="w-3.5 h-3.5 text-red-600" />}>
              Clear Chat History
            </Button>
          </div>

          {/* ACTIVE FARM CONTEXT SUMMARY CHIP */}
          <div className="p-4 rounded-2xl bg-white border border-[#3F7D3A]/20 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-[#285C32] font-extrabold">
              <Sparkles className="w-4 h-4 text-[#3F7D3A]" />
              <span>{t('assistant.syncedContext')}:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-xl bg-[#F8FAF3] border text-[#285C32] font-bold flex items-center gap-1">
                <Sprout className="w-3.5 h-3.5 text-[#3F7D3A]" /> Crop: {cropNameStr}
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-[#F8FAF3] border text-[#285C32] font-bold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#3F7D3A]" /> {profile.village}, {profile.district}
              </span>
              {soilReport && (
                <span className="px-2.5 py-1 rounded-xl bg-[#F8FAF3] border text-[#285C32] font-bold flex items-center gap-1">
                  🧪 Soil pH: {soilReport.ph}
                </span>
              )}
              {weather && (
                <span className="px-2.5 py-1 rounded-xl bg-[#F8FAF3] border text-[#285C32] font-bold flex items-center gap-1">
                  🌦 {weather.current.temperature}°C • Rain: {weather.current.precipitationProb}%
                </span>
              )}
            </div>
          </div>

          {/* QUICK SUGGESTED QUESTIONS BAR */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#667267] flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-[#3F7D3A]" /> {t('assistant.quickPrompts')} (सुझाए गए प्रश्न):
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => handleSendMessage(`${cropNameStr} फसल में कितना खाद डालें? (Fertilizer dosage)`)}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#EEF5E8] border border-stone-200 text-xs font-extrabold text-[#285C32] shrink-0 transition-colors"
              >
                🌾 {cropNameStr} खाद की मात्रा (Fertilizer dosage)
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage('मौसम के अनुसार आज सिंचाई करें या नहीं? (Irrigation advisory)')}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#EEF5E8] border border-stone-200 text-xs font-extrabold text-[#285C32] shrink-0 transition-colors"
              >
                💧 सिंचाई सलाह (Irrigation)
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage('कीट एवं इल्ली नियंत्रण के लिए कौनसा छिड़काव करें? (Pest spray)')}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#EEF5E8] border border-stone-200 text-xs font-extrabold text-[#285C32] shrink-0 transition-colors"
              >
                🐛 कीट एवं स्प्रे सलाह (Pest control)
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage('मिट्टी का पीएच सुधार कैसे करें? (Soil pH treatment)')}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#EEF5E8] border border-stone-200 text-xs font-extrabold text-[#285C32] shrink-0 transition-colors"
              >
                🧪 मिट्टी पीएच सुधार (Soil pH)
              </button>
            </div>
          </div>

          {/* CHAT TRANSCRIPT AREA */}
          <div className="flex-1 bg-white rounded-3xl p-6 border border-[#3F7D3A]/20 shadow-sm space-y-6 overflow-y-auto max-h-[520px]">
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
                      ? 'bg-[#3F7D3A] text-white rounded-tr-none font-semibold shadow-sm'
                      : 'bg-[#F8FAF3] border border-stone-200 text-[#285C32] rounded-tl-none shadow-sm'
                  }`}
                >
                  {/* Sender Header */}
                  <div className="flex items-center justify-between border-b border-stone-200/40 pb-2">
                    <span className="font-extrabold text-[11px]">
                      {msg.sender === 'user' ? 'You (किसान)' : 'Annadata AI Assistant'}
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
                          <div className="font-black text-xs text-[#3F7D3A]">📋 {t('assistant.dosages')}:</div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-[11px] text-left border-collapse">
                              <thead>
                                <tr className="border-b border-stone-200 text-[#667267] font-bold">
                                  <th className="py-1 px-2">Product</th>
                                  <th className="py-1 px-2">Dosage / Acre</th>
                                  <th className="py-1 px-2">Application Timing</th>
                                </tr>
                              </thead>
                              <tbody>
                                {msg.structuredData.dosages.map((d, i) => (
                                  <tr key={i} className="border-b border-stone-100">
                                    <td className="py-1.5 px-2 font-bold text-[#285C32]">{d.product}</td>
                                    <td className="py-1.5 px-2 font-bold text-[#3F7D3A]">{d.amountPerAcre}</td>
                                    <td className="py-1.5 px-2 text-stone-600">{d.timing}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* WARNING BOX */}
                      {msg.structuredData.warnings && msg.structuredData.warnings.length > 0 && (
                        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                          <div className="font-bold text-xs flex items-center gap-1 text-amber-800">
                            <AlertTriangle className="w-4 h-4 text-amber-600" /> {t('assistant.warnings')}:
                          </div>
                          {msg.structuredData.warnings.map((w, i) => (
                            <div key={i} className="text-[11px] font-semibold pl-5">• {w}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 🔊 LISTEN BUTTON — shows on EVERY assistant message */}
                  {msg.sender === 'assistant' && (
                    <div className="pt-3 flex items-center justify-between border-t border-stone-100 mt-2">
                      <button
                        type="button"
                        onClick={() => handleToggleAudio(msg.id, msg.text)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
                          speakingMsgId === msg.id
                            ? 'bg-amber-50 border-amber-400 text-amber-700 hover:bg-amber-100 shadow-sm'
                            : 'bg-white hover:bg-[#EEF5E8] border-stone-300 text-[#3F7D3A] hover:border-[#3F7D3A]'
                        }`}
                      >
                        {speakingMsgId === msg.id ? (
                          <>
                            <VolumeX className="w-4 h-4 animate-pulse" />
                            <span>Stop Speaking ⏹</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-4 h-4" />
                            <span>🔊 Listen in {getLangCode(i18n.language)}</span>
                          </>
                        )}
                      </button>
                      <span className="text-[10px] text-stone-400 font-medium">Synced with your farm</span>
                    </div>
                  )}

                  {/* SUGGESTED FOLLOW-UP BUTTONS */}
                  {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                    <div className="pt-2 border-t border-stone-200/50 space-y-1.5">
                      <span className="text-[10px] font-bold text-[#667267] block">Follow-up questions:</span>
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
                <span>Annadata AI is analyzing your crop context and generating response...</span>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* VOICE RECORDING LIVE BANNER */}
          {isRecording && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-emerald-600 animate-bounce" />
                <div>
                  <div className="font-black">🎙 {t('assistant.listeningVoice')}</div>
                  {interimText && (
                    <div className="font-normal mt-0.5 text-emerald-700 italic">"{interimText}"</div>
                  )}
                </div>
              </div>
              <Button size="sm" variant="secondary" onClick={stopRecording}>
                {t('common.cancel', 'Stop')}
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
            className="flex items-center gap-2 pt-2"
          >
            <button
              type="button"
              onClick={toggleVoiceRecording}
              title={isRecording ? 'Stop Voice Recording' : 'Start Voice Input (आवाज़ से पूछें)'}
              className={`p-3 rounded-2xl border transition-all ${
                isRecording
                  ? 'bg-red-500 text-white border-red-600 animate-pulse'
                  : 'bg-white hover:bg-[#EEF5E8] text-[#3F7D3A] border-stone-300'
              }`}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              placeholder={interimText ? `"${interimText}"` : t('assistant.askPlaceholder')}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-3.5 rounded-2xl border border-stone-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#3F7D3A] bg-white"
            />

            <Button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              icon={<Send className="w-4 h-4" />}
            >
              {t('assistant.askButton', 'Ask AI')}
            </Button>
          </form>

          {/* TTS Debug Panel */}
          <div className="rounded-2xl bg-stone-50 border border-stone-200 p-3 space-y-2">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="text-[10px] text-stone-500 font-medium">
                🔊 TTS Status: <span className="text-[#3F7D3A] font-bold">{ttsDebug || 'Ready — click Listen on any AI message'}</span>
                {' · '} Lang: <strong>{getLangCode(i18n.language)}</strong>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (typeof window === 'undefined' || !window.speechSynthesis) {
                    setTtsDebug('speechSynthesis NOT available in this browser!');
                    return;
                  }
                  window.speechSynthesis.cancel();
                  const v = window.speechSynthesis.getVoices();
                  setTtsDebug(`Test: ${v.length} voices found. Speaking now...`);
                  const u = new SpeechSynthesisUtterance('Hello! Annadata voice test successful. The audio system is working.');
                  u.lang = 'en-US';
                  u.rate = 0.9;
                  u.volume = 1.0;
                  if (v.length > 0) {
                    const en = v.find(x => x.lang.startsWith('en')) || v[0];
                    u.voice = en;
                    setTtsDebug(`Testing with voice: ${en.name} (${en.lang})`);
                  }
                  u.onend = () => setTtsDebug(`✅ Test complete! ${v.length} voices available. Click Listen on any message.`);
                  u.onerror = (e) => setTtsDebug(`❌ Test failed: ${e.error} — Try Chrome or Edge browser.`);
                  window.speechSynthesis.speak(u);
                }}
                className="px-3 py-1.5 rounded-xl bg-[#3F7D3A] text-white text-[10px] font-bold hover:bg-[#285C32] transition-colors shrink-0"
              >
                🔊 Test Speak
              </button>
            </div>
            <p className="text-[9px] text-stone-400">
              🎙 Mic input: Web Speech Recognition API · 🔊 TTS: Web Speech Synthesis API · Requires Chrome or Edge browser
            </p>
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
