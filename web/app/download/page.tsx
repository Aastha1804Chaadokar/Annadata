'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Smartphone, 
  Download, 
  QrCode, 
  ShieldCheck, 
  Zap, 
  WifiOff, 
  Mic, 
  CheckCircle2, 
  ArrowRight,
  Share2,
  Copy,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function DownloadPage() {
  const [copied, setCopied] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstallable(false);
      }
      setDeferredPrompt(null);
    } else {
      alert('To install on Android: Tap the 3 dots in Chrome and select "Install app" or "Add to Home screen". On iPhone: Tap the Share icon in Safari and select "Add to Home Screen".');
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAF3] pt-24 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8F5E9] text-[#1B4332] text-xs sm:text-sm font-bold border border-[#81C784]/40 mb-6 shadow-sm">
            <Smartphone className="w-4 h-4 text-[#2D6A4F]" />
            <span>ANNADATA MOBILE APP • अन्नदाता मोबाइल ऐप</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#173F2A] tracking-tight mb-4">
            Har Kisan Ki Jeb Mein, <br />
            <span className="text-[#2D6A4F]">Annadata Mobile App</span>
          </h1>
          <p className="text-lg sm:text-xl text-[#3F7D3A] font-medium max-w-2xl mx-auto mb-8">
            Download the official Annadata app for real-time soil analysis, weather alerts, mandi rates, and 7-language AI voice assistant directly on your phone.
          </p>
        </div>

        {/* DOWNLOAD OPTIONS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          
          {/* OPTION 1: Direct Android APK */}
          <div className="bg-white rounded-3xl p-8 border-2 border-[#2D6A4F] shadow-xl hover:shadow-2xl transition-all relative flex flex-col justify-between">
            <div className="absolute -top-3.5 right-6 bg-[#2D6A4F] text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              Most Popular
            </div>
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#E8F5E9] flex items-center justify-center text-[#2D6A4F] mb-6">
                <Download className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black text-[#173F2A] mb-2">Android APK Direct</h2>
              <p className="text-sm font-semibold text-gray-500 mb-6">
                Direct installation file (.apk) for all Android phones (Samsung, Xiaomi, Realme, Vivo, etc.).
              </p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2.5 text-sm font-semibold text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] shrink-0" />
                  <span>No Google Play account needed</span>
                </li>
                <li className="flex items-center gap-2.5 text-sm font-semibold text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] shrink-0" />
                  <span>Works offline with cached data</span>
                </li>
                <li className="flex items-center gap-2.5 text-sm font-semibold text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] shrink-0" />
                  <span>Voice assistant in 7 languages</span>
                </li>
              </ul>
            </div>

            <div>
              <a
                href="/Annadata-v1.0.0.apk"
                download="Annadata-v1.0.0.apk"
                onClick={(e) => {
                  alert('Generating download package for Annadata Android APK...');
                }}
                className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-black text-base shadow-lg shadow-[#2D6A4F]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Download className="w-5 h-5" />
                Download Android APK (v1.0)
              </a>
              <span className="block text-center text-xs font-semibold text-gray-600 mt-2">
                Size: ~18 MB • Android 8.0+
              </span>
            </div>
          </div>

          {/* OPTION 2: Instant PWA Mobile App */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-md hover:shadow-xl transition-all flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-700 mb-6">
                <Zap className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black text-[#173F2A] mb-2">Instant Web App</h2>
              <p className="text-sm font-semibold text-gray-500 mb-6">
                1-tap installation directly from Chrome or Safari on any smartphone with zero storage overhead.
              </p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2.5 text-sm font-semibold text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Instant launch with zero download wait</span>
                </li>
                <li className="flex items-center gap-2.5 text-sm font-semibold text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Auto-updates automatically</span>
                </li>
                <li className="flex items-center gap-2.5 text-sm font-semibold text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>iPhone / iOS and Android supported</span>
                </li>
              </ul>
            </div>

            <div>
              <button
                onClick={handleInstallPWA}
                className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-[#173F2A] hover:bg-black text-white font-black text-base shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Smartphone className="w-5 h-5 text-[#D8B45A]" />
                Install on Phone Screen
              </button>
              <span className="block text-center text-xs font-semibold text-gray-600 mt-2">
                Works on Chrome, Safari, Edge
              </span>
            </div>
          </div>

          {/* OPTION 3: Expo Go / Developer Scan */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-md hover:shadow-xl transition-all flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700 mb-4">
                <QrCode className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black text-[#173F2A] mb-1">Expo Go Live Scan</h2>
              <p className="text-xs font-semibold text-gray-500 mb-4">
                Scan with Expo Go on Android or iOS Camera to launch instantly:
              </p>
              
              {/* QR CODE CONTAINER */}
              <div className="flex flex-col items-center justify-center bg-gray-50 p-4 rounded-2xl border border-gray-200 mb-4">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=exp://192.168.1.241:8081"
                  alt="Annadata Expo Go QR Code"
                  className="w-40 h-40 rounded-xl shadow-sm border border-white"
                />
                <span className="text-[11px] font-mono font-bold text-gray-700 mt-2 bg-white px-2 py-1 rounded border border-gray-200">
                  exp://192.168.1.241:8081
                </span>
              </div>
            </div>

            <div>
              <a
                href="exp://192.168.1.241:8081"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Smartphone className="w-4 h-4" />
                Open Expo Go Directly
              </a>
              <span className="block text-center text-[11px] font-semibold text-gray-500 mt-2">
                Make sure your phone is connected to the same Wi-Fi
              </span>
            </div>
          </div>

        </div>

        {/* INSTALLATION GUIDE FOR FARMERS */}
        <div className="mt-16 bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-lg">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-[#173F2A] mb-2">
              किसान ऐप कैसे इंस्टॉल करें? (How to Install)
            </h2>
            <p className="text-gray-600 font-medium">
              Follow these simple 3 steps to start using Annadata on your mobile phone today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 rounded-full bg-[#1B4332] text-white font-black flex items-center justify-center text-xl mb-4 shadow">
                1
              </div>
              <h3 className="font-extrabold text-[#173F2A] text-lg mb-2">डाउनलोड करें (Download)</h3>
              <p className="text-sm text-gray-600">
                Click the <strong>Download Android APK</strong> button above to save the installation file on your phone.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 rounded-full bg-[#2D6A4F] text-white font-black flex items-center justify-center text-xl mb-4 shadow">
                2
              </div>
              <h3 className="font-extrabold text-[#173F2A] text-lg mb-2">अनुमति दें (Allow Permission)</h3>
              <p className="text-sm text-gray-600">
                Tap on the downloaded file and choose <strong>&quot;Allow installation from this source&quot;</strong> if prompted.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 rounded-full bg-[#3F7D3A] text-white font-black flex items-center justify-center text-xl mb-4 shadow">
                3
              </div>
              <h3 className="font-extrabold text-[#173F2A] text-lg mb-2">शुरू करें (Open & Login)</h3>
              <p className="text-sm text-gray-600">
                Open Annadata, select your language (Hindi, Marathi, English, etc.), and enter your farm details.
              </p>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#2D6A4F]" />
              <span className="text-xs sm:text-sm font-bold text-gray-700">
                100% Safe, Secure & Government Data Compliant (ICAR & Soil Health Card)
              </span>
            </div>

            <button
              onClick={copyShareLink}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Link Copied!' : 'Share App Link with Farmers'}
            </button>
          </div>
        </div>

      </section>
    </div>
  );
}
