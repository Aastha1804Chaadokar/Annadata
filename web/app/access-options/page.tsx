import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/ui/PageHero';
import { Button } from '@/components/ui/Button';
import { INDIAN_LANGUAGES, DEMO_VOICE_CHAT } from '@/lib/constants';
import { Smartphone, PhoneCall, Mic, Globe, ShieldCheck, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Access Annadata | Voice, Mobile & Indian Languages',
  description:
    'Access Annadata via 4G smartphones, basic keypad phone IVR helplines (coming soon), multilingual voice interaction, or 11 Indian regional languages.',
};

export default function AccessOptionsPage() {
  return (
    <main className="min-h-screen bg-[#F8FAF3]">
      <PageHero
        badge="Universal Inclusion"
        title="Access Annadata your way."
        subtitle="Designed for every farmer regardless of digital literacy, phone hardware, or language background."
        icon={<Globe className="w-4 h-4 text-[#3F7D3A]" />}
      />

      {/* 4 Major Access Channels */}
      <section className="py-20 bg-[#F8FAF3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* 01 Smartphone */}
          <div className="p-8 rounded-3xl bg-white border border-[#3F7D3A]/15 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#EEF5E8] text-[#3F7D3A]">
                  <Smartphone className="w-6 h-6" />
                </div>
                <span className="text-xs font-black text-[#3F7D3A] uppercase tracking-wider">
                  CHANNEL 01
                </span>
              </div>
              <h3 className="text-3xl font-black text-[#285C32]">📱 Smartphone Web & App</h3>
              <p className="text-sm text-[#667267] leading-relaxed">
                Full-featured visual dashboard designed for direct sunlight readability. Access Soil Health Card parameters, interactive weather telemetry, crop suitability recommendations, and photo symptom upload.
              </p>
            </div>
            <div className="lg:col-span-6 p-6 rounded-2xl bg-[#EEF5E8] border border-[#DCECCF] space-y-2 text-xs text-[#285C32]">
              <div className="font-bold text-sm mb-1">Smartphone Capabilities:</div>
              <div className="grid grid-cols-2 gap-2 text-[#667267]">
                <div>✔ High-contrast UI</div>
                <div>✔ Soil Card Digitization</div>
                <div>✔ Weather Forecast Maps</div>
                <div>✔ Multilingual Voice Chat</div>
              </div>
            </div>
          </div>

          {/* 02 Basic / Keypad Phone */}
          <div className="p-8 rounded-3xl bg-white border border-[#9A7048]/20 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-[#FFF8E8] text-[#9A7048]">
                    <PhoneCall className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-black text-[#9A7048] uppercase tracking-wider">
                    CHANNEL 02
                  </span>
                </div>
                <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-extrabold rounded-full border border-amber-300">
                  Coming Soon
                </span>
              </div>
              <h3 className="text-3xl font-black text-[#285C32]">☎️ Basic / Keypad Phone IVR</h3>
              <p className="text-sm text-[#667267] leading-relaxed">
                A toll-free phone service for basic keypad phones. Farmers dial in, select their language using phone keypads, speak their query, and listen to voice weather alerts and crop advisories.
              </p>
            </div>
            <div className="lg:col-span-6 p-6 rounded-2xl bg-[#FFF8E8] border border-[#E8B94A]/30 text-xs text-[#667267] space-y-2">
              <div className="font-bold text-sm text-[#285C32]">Toll-Free Phone Concept:</div>
              <p>1. Dial 1800-XXX-XXXX $\rightarrow$ 2. Press 1 for Hindi $\rightarrow$ 3. Speak farming query $\rightarrow$ 4. Receive automated audio answer.</p>
              <div className="text-[10px] text-[#9A7048] font-bold border-t border-amber-200/60 pt-2">
                * Future IVR voice service concept.
              </div>
            </div>
          </div>

          {/* 03 Voice Interaction */}
          <div className="p-8 rounded-3xl bg-white border border-[#E8B94A]/30 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#FFF8E8] text-[#E8B94A]">
                  <Mic className="w-6 h-6 text-[#E8B94A]" />
                </div>
                <span className="text-xs font-black text-[#E8B94A] uppercase tracking-wider">
                  CHANNEL 03
                </span>
              </div>
              <h3 className="text-3xl font-black text-[#285C32]">🎙️ Multilingual Voice AI</h3>
              <p className="text-sm text-[#667267] leading-relaxed">
                Voice-first interface allows farmers to ask queries naturally without needing to type in complex technical English terms.
              </p>
            </div>
            <div className="lg:col-span-6 p-6 rounded-2xl bg-[#F8FAF3] border border-[#DCECCF] space-y-3 text-xs">
              <div className="font-bold text-[#285C32]">Voice Query Example:</div>
              <div className="p-3 rounded-xl bg-[#EEF5E8] text-[#285C32] font-bold text-sm">
                "मेरी फसल में पत्ते पीले हो रहे हैं।"
              </div>
              <div className="p-3 rounded-xl bg-white border border-stone-200 text-[#667267]">
                Annadata parses local dialect speech and responds with advisory audio.
              </div>
            </div>
          </div>

          {/* 04 Local Languages Grid */}
          <div className="p-8 rounded-3xl bg-white border border-[#3F7D3A]/20 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#EEF5E8] text-[#3F7D3A]">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-black text-[#3F7D3A] uppercase tracking-wider block">
                  CHANNEL 04
                </span>
                <h3 className="text-2xl font-black text-[#285C32]">🌐 11 Indian Regional Languages</h3>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {INDIAN_LANGUAGES.map((lang) => (
                <div
                  key={lang.code}
                  className="p-3.5 rounded-xl bg-[#EEF5E8] border border-[#DCECCF] text-center"
                >
                  <div className="text-base font-bold text-[#285C32]">{lang.nativeName}</div>
                  <div className="text-xs text-[#3F7D3A]">{lang.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-[#EEF5E8] border-t border-[#DCECCF]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <h2 className="text-3xl font-black text-[#285C32]">About Annadata Story</h2>
          <p className="text-sm text-[#667267]">Discover our vision, mission, and why Annadata is built for Indian agriculture.</p>
          <Link href="/about">
            <Button variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
              Read Our Story
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
