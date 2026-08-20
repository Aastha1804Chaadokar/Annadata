import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/ui/PageHero';
import { Button } from '@/components/ui/Button';
import {
  HeartHandshake,
  AlertTriangle,
  CheckCircle2,
  Smartphone,
  PhoneCall,
  Mic,
  ArrowRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Annadata for Farmers | Built Around the Farmer',
  description:
    'Annadata bridges technical agricultural knowledge, language barriers, and digital access tiers to empower Indian farmers with plain-spoken decisions.',
};

export default function ForFarmersPage() {
  const CHALLENGES = [
    { title: 'Scattered Information', desc: 'Soil reports, weather updates, and Mandi prices exist in separate places.' },
    { title: 'Technical Jargon', desc: 'NPK ratios, PPM metrics, and chemical names are confusing without clear guidance.' },
    { title: 'Language Barriers', desc: 'Most digital tools are available only in English or standard technical Hindi.' },
    { title: 'Weather Uncertainty', desc: 'Unpredictable rain causes wasted fertilizer and damaged crops.' },
    { title: 'Limited Internet Access', desc: 'Many rural areas rely on basic 2G feature phones without 4G data.' },
  ];

  const FARMER_JOURNEY = [
    { step: '01', title: 'My Farm', text: 'Location, land size & irrigation capability' },
    { step: '02', title: 'My Soil', text: 'Digitized Soil Health Card parameters (NPK, pH)' },
    { step: '03', title: 'My Crop', text: 'Optimal crop recommendation matching season' },
    { step: '04', title: 'My Weather', text: 'Rain & temperature alerts for field planning' },
    { step: '05', title: 'My Questions', text: 'Voice/text advisory in mother tongue' },
    { step: '06', title: 'My Decisions', text: 'Confident, informed farming choices' },
  ];

  return (
    <main className="min-h-screen bg-[#F8FAF3]">
      <PageHero
        badge="Farmer Centricity"
        title="Built around the farmer."
        subtitle="Annadata replaces fragmented agricultural information and technical jargon with simple, actionable decisions in your own language."
        icon={<HeartHandshake className="w-4 h-4 text-[#3F7D3A]" />}
      />

      {/* Section 1: Real Daily Challenges Solved */}
      <section className="py-20 bg-[#F8FAF3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-[#285C32]">
              Real challenges facing Indian farmers today
            </h2>
            <p className="text-sm text-[#667267] mt-2">
              Farmers make high-stakes financial and labor decisions every season with incomplete data.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CHALLENGES.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-[#3F7D3A]/12 shadow-sm space-y-3"
              >
                <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Challenge 0{idx + 1}</span>
                </div>
                <h3 className="text-lg font-bold text-[#285C32]">{item.title}</h3>
                <p className="text-xs text-[#667267] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: 6-Step Personal Farmer Flow */}
      <section className="py-20 bg-[#EEF5E8] border-t border-b border-[#DCECCF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#3F7D3A]">
              Simple Personal Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#285C32] mt-1">
              How Annadata simplifies your farm routine
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {FARMER_JOURNEY.map((j) => (
              <div key={j.step} className="p-5 rounded-2xl bg-white border border-[#3F7D3A]/15 text-center shadow-sm space-y-2">
                <span className="inline-block px-3 py-1 bg-[#EEF5E8] text-[#3F7D3A] text-xs font-black rounded-full">
                  {j.step}
                </span>
                <h3 className="text-base font-black text-[#285C32]">{j.title}</h3>
                <p className="text-[11px] text-[#667267]">{j.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Designed for Different Levels of Digital Access */}
      <section className="py-20 bg-[#F8FAF3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl font-bold text-[#285C32]">
              Designed for different levels of digital access
            </h2>
            <p className="text-sm text-[#667267] mt-2">
              Technology shouldn't require an expensive smartphone or high-speed internet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-[#3F7D3A]/12 shadow-sm space-y-4">
              <div className="p-3 w-fit rounded-xl bg-[#EEF5E8] text-[#3F7D3A]">
                <Smartphone className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-[#285C32]">Smartphone Farmer</h3>
              <p className="text-xs text-[#667267] leading-relaxed">
                Full visual app interface with interactive soil health card metrics, high-contrast weather maps, and crop leaf photo upload.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#9A7048]/20 shadow-sm space-y-4">
              <div className="p-3 w-fit rounded-xl bg-[#FFF8E8] text-[#9A7048]">
                <PhoneCall className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-[#285C32]">Basic Phone Farmer</h3>
              <p className="text-xs text-[#667267] leading-relaxed">
                Keypad phone access through a toll-free IVR voice helpline and morning SMS weather micro-advisories.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#E8B94A]/30 shadow-sm space-y-4">
              <div className="p-3 w-fit rounded-xl bg-[#FFF8E8] text-[#E8B94A]">
                <Mic className="w-8 h-8 text-[#E8B94A]" />
              </div>
              <h3 className="text-2xl font-bold text-[#285C32]">Voice-First Farmer</h3>
              <p className="text-xs text-[#667267] leading-relaxed">
                Speak naturally in your mother tongue without needing to type complex search terms in English.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-[#FFF8E8] border-t border-[#E8B94A]/30">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <h2 className="text-3xl font-black text-[#285C32]">Explore Access Options</h2>
          <p className="text-sm text-[#667267]">See how Annadata works across 4G smartphones and keypad IVR helplines.</p>
          <Link href="/access-options">
            <Button variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
              View Access Options
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
