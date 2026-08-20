import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/ui/PageHero';
import { Button } from '@/components/ui/Button';
import {
  Sprout,
  Target,
  Compass,
  Globe2,
  ShieldCheck,
  Cpu,
  Milestone,
  ArrowRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Annadata | Vision, Mission & Responsible AI',
  description:
    'Annadata is an independent agritech platform connecting soil health, micro-climate weather, crop suitability, and AI advisory for Indian farmers.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F8FAF3]">
      <PageHero
        badge="About Annadata"
        title="Why Annadata?"
        subtitle="Connecting soil, crops, weather, markets, and AI into one simple, accessible agricultural platform for every Indian farmer."
        icon={<Sprout className="w-4 h-4 text-[#3F7D3A]" />}
      />

      {/* The Story & Problem */}
      <section className="py-20 bg-[#F8FAF3]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="p-8 rounded-3xl bg-white border border-[#3F7D3A]/12 shadow-sm space-y-4">
            <h2 className="text-3xl font-black text-[#285C32]">The Core Problem</h2>
            <p className="text-base text-[#667267] leading-relaxed">
              Indian farmers work tirelessly to feed the nation. However, crucial agricultural information — soil health card parameters, localized weather alerts, Mandi market rates, and crop disease advisories — is often fragmented, written in complex jargon, unavailable in local dialects, or out of reach at the exact moment a decision needs to be made.
            </p>
          </div>

          {/* Vision & Mission Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-[#EEF5E8] border border-[#DCECCF] space-y-4">
              <div className="p-3 w-fit rounded-xl bg-white text-[#3F7D3A]">
                <Compass className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-[#285C32]">Our Vision</h3>
              <p className="text-sm text-[#667267] leading-relaxed">
                "Make useful, trustworthy agricultural intelligence accessible to every farmer, across every crop, in every Indian language."
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#FFF8E8] border border-[#E8B94A]/30 space-y-4">
              <div className="p-3 w-fit rounded-xl bg-white text-[#E8B94A]">
                <Target className="w-8 h-8 text-[#E8B94A]" />
              </div>
              <h3 className="text-2xl font-black text-[#285C32]">Our Mission</h3>
              <p className="text-sm text-[#667267] leading-relaxed">
                "Connect soil health science, micro-climate weather telemetry, crop suitability models, and multilingual AI into one intuitive platform."
              </p>
            </div>
          </div>

          {/* Detailed Pillars */}
          <div className="space-y-8 pt-4">
            <div className="p-8 rounded-3xl bg-white border border-[#3F7D3A]/12 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-[#3F7D3A] font-bold text-lg">
                <Globe2 className="w-5 h-5" />
                <span>Why India?</span>
              </div>
              <p className="text-sm text-[#667267] leading-relaxed">
                India features over 15 distinct agro-climatic zones, hundreds of soil sub-types, and a rich tapestry of regional languages. General global agricultural software fails to account for Indian smallholder farm realities, rainfed monsoons, or regional Mandi dynamics.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#3F7D3A]/12 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-[#3F7D3A] font-bold text-lg">
                <Cpu className="w-5 h-5" />
                <span>Technology for Inclusion</span>
              </div>
              <p className="text-sm text-[#667267] leading-relaxed">
                Annadata is designed from the ground up to ensure no farmer is left behind due to hardware or literacy constraints. Whether using a 4G smartphone or a basic 2G keypad phone, every farmer deserves clear, timely guidance.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#3F7D3A]/12 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-[#3F7D3A] font-bold text-lg">
                <ShieldCheck className="w-5 h-5" />
                <span>Responsible AI & Ethics</span>
              </div>
              <p className="text-sm text-[#667267] leading-relaxed">
                We believe in ethical, transparent AI. Normal leaf photographs are never presented as definitive laboratory measurements or official government extension diagnoses. All model advisories explicitly encourage farmers to verify test data against certified Soil Health Cards.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#3F7D3A]/12 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-[#3F7D3A] font-bold text-lg">
                <Milestone className="w-5 h-5" />
                <span>Future Vision & Roadmap</span>
              </div>
              <p className="text-sm text-[#667267] leading-relaxed">
                Our roadmap includes real-time integration with IMD weather APIs, official Mandi price streams, computer-vision leaf disease models, and toll-free voice IVR helplines across 11 Indian regional languages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-[#EEF5E8] border-t border-[#DCECCF]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <h2 className="text-3xl font-black text-[#285C32]">Try Annadata Portal</h2>
          <p className="text-sm text-[#667267]">Select your continuation path in our application portal.</p>
          <Link href="/app">
            <Button variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
              Get Started Portal
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
