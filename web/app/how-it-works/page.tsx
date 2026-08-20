import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/ui/PageHero';
import { Button } from '@/components/ui/Button';
import { DEMO_SOIL_CARD, DEMO_CROP_RECOMMENDATION, DEMO_WEATHER_ADVISORY, DEMO_VOICE_CHAT } from '@/lib/constants';
import {
  MapPin,
  FileText,
  Sprout,
  CloudRain,
  Camera,
  Mic,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Code2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'How Annadata Works | Soil, Crop, Weather & AI',
  description:
    'Discover how Annadata guides Indian farmers from soil analysis and crop recommendations to weather alerts and multilingual voice advisory.',
};

export default function HowItWorksPage() {
  const STEPS = [
    {
      num: 'STEP 01',
      title: 'Know Your Farm',
      badge: 'Profile Setup',
      desc: 'Farmers specify location, crop history, soil type, season, and available irrigation (rainfed or pump-assisted).',
      icon: <MapPin className="w-6 h-6 text-[#3F7D3A]" />,
      content: (
        <div className="p-4 rounded-xl bg-[#EEF5E8] border border-[#DCECCF] text-xs text-[#285C32] space-y-2">
          <div className="font-bold text-sm">Farm Data Inputs:</div>
          <div className="grid grid-cols-2 gap-2 text-[#667267]">
            <div>• District: Indore, MP</div>
            <div>• Soil: Black Clay Loam</div>
            <div>• Season: Kharif (Monsoon)</div>
            <div>• Water: Canal + Rainfed</div>
          </div>
        </div>
      ),
    },
    {
      num: 'STEP 02',
      title: 'Understand Your Soil',
      badge: 'Soil Intelligence',
      desc: 'Annadata parses key parameters from official Soil Health Cards — Nitrogen, Phosphorus, Potassium, Soil pH, and Organic Carbon.',
      icon: <FileText className="w-6 h-6 text-[#9A7048]" />,
      content: (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            {DEMO_SOIL_CARD.parameters.slice(0, 4).map((p) => (
              <div key={p.key} className="p-2.5 rounded-lg bg-white border border-stone-200 flex items-center justify-between">
                <span className="font-bold text-[#285C32]">{p.name} ({p.key})</span>
                <span className="font-extrabold text-[#3F7D3A]">{p.value}</span>
              </div>
            ))}
          </div>
          {/* Laboratory Test Notice Disclaimer */}
          <div className="p-3 rounded-lg bg-[#FFF8E8] border border-[#E8B94A]/40 text-[11px] text-[#667267] flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-[#E8B94A] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#285C32] block font-bold">Laboratory Test Notice:</strong>
              Normal photographs cannot replace laboratory Soil Health Card tests. Photo estimations must always be verified against certified lab analysis.
            </div>
          </div>
        </div>
      ),
    },
    {
      num: 'STEP 03',
      title: 'Choose Your Crop',
      badge: 'Suitability Engine',
      desc: 'Matches soil profile, rainfall forecast, season, and Mandi price trends to recommend suitable crops.',
      icon: <Sprout className="w-6 h-6 text-[#3F7D3A]" />,
      content: (
        <div className="p-4 rounded-xl bg-white border border-[#3F7D3A]/20 shadow-sm flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase text-[#3F7D3A]">Top Match</span>
            <div className="text-base font-black text-[#285C32]">{DEMO_CROP_RECOMMENDATION.cropName}</div>
            <div className="text-[#667267] mt-0.5">Kharif Season • High Yield Potential</div>
          </div>
          <div className="bg-[#3F7D3A] text-white px-3 py-2 rounded-xl text-center font-bold">
            92% Match
          </div>
        </div>
      ),
    },
    {
      num: 'STEP 04',
      title: 'Understand Weather',
      badge: 'Micro-Climate Alerts',
      desc: 'Timely alerts instruct farmers when to sow, irrigate, spray pesticides, or harvest before heavy rain.',
      icon: <CloudRain className="w-6 h-6 text-[#6FA8B8]" />,
      content: (
        <div className="p-4 rounded-xl bg-[#EAF5F5] border border-[#7BAFC1]/30 text-xs text-[#285C32] space-y-1">
          <div className="font-bold flex items-center gap-1 text-[#7BAFC1]">
            <CloudRain className="w-4 h-4" /> 70% Rain Probability Tonight
          </div>
          <p className="text-[#667267]">"Postpone pesticide spraying today and check field drainage channels."</p>
        </div>
      ),
    },
    {
      num: 'STEP 05',
      title: 'Monitor Crop Health (Future Vision)',
      badge: 'Leaf Image Scan',
      desc: 'Farmers upload leaf or stem photos. AI identifies visible symptom patterns, possible nutrient deficiencies, and suggested next steps.',
      icon: <Camera className="w-6 h-6 text-[#3F7D3A]" />,
      content: (
        <div className="p-4 rounded-xl bg-white border border-stone-200 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#285C32]">Sample Scan: Yellowing Leaf</span>
            <span className="text-[10px] bg-[#EEF5E8] text-[#3F7D3A] px-2 py-0.5 rounded font-bold">Symptom Match</span>
          </div>
          <p className="text-[#667267]">Possible Nitrogen deficiency. Verify soil test card before applying urea.</p>
          <div className="text-[10px] text-[#9A7048] italic border-t border-stone-100 pt-1">
            * Non-diagnostic advisory tool.
          </div>
        </div>
      ),
    },
    {
      num: 'STEP 06',
      title: 'Ask Annadata Voice AI',
      badge: 'Multilingual Assistant',
      desc: 'Farmers ask questions using text or voice in Hindi, Marathi, Gujarati, and other regional dialects.',
      icon: <Mic className="w-6 h-6 text-[#E8B94A]" />,
      content: (
        <div className="p-4 rounded-xl bg-[#F8FAF3] border border-[#DCECCF] text-xs space-y-2">
          <div className="font-bold text-[#285C32]">Voice Query: "{DEMO_VOICE_CHAT.query}"</div>
          <div className="p-2.5 rounded-lg bg-white border border-stone-200 text-[#3F7D3A] font-medium">
            "{DEMO_VOICE_CHAT.response}"
          </div>
        </div>
      ),
    },
    {
      num: 'STEP 07',
      title: 'Take Action & Harvest',
      badge: 'Empowered Decisions',
      desc: 'A continuous cycle: Understand $\\rightarrow$ Decide $\\rightarrow$ Act $\\rightarrow$ Monitor.',
      icon: <CheckCircle2 className="w-6 h-6 text-[#3F7D3A]" />,
      content: (
        <div className="flex items-center justify-between text-xs font-bold text-[#285C32] bg-[#EEF5E8] p-3 rounded-xl border border-[#DCECCF]">
          <span>Understand</span>
          <span>→</span>
          <span>Decide</span>
          <span>→</span>
          <span>Act</span>
          <span>→</span>
          <span>Monitor</span>
        </div>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-[#F8FAF3]">
      <PageHero
        badge="How Annadata Works"
        title="From understanding your farm to making better decisions."
        subtitle="A step-by-step agricultural journey combining soil science, micro-climate weather, crop suitability models, and multilingual AI advisory."
        icon={<Sprout className="w-4 h-4 text-[#3F7D3A]" />}
      />

      {/* Detailed Step-by-Step Timeline */}
      <section className="py-20 bg-[#F8FAF3]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {STEPS.map((step, idx) => (
            <div
              key={step.num}
              className="p-8 rounded-3xl bg-white border border-[#3F7D3A]/12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center hover:border-[#3F7D3A]/30 transition-all duration-200"
            >
              <div className="lg:col-span-6 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-[#EEF5E8] text-[#3F7D3A] text-xs font-black rounded-full border border-[#DCECCF]">
                    {step.num}
                  </span>
                  <span className="text-xs font-bold text-[#667267] uppercase tracking-wider">
                    {step.badge}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-[#285C32]">{step.title}</h3>
                <p className="text-sm text-[#667267] leading-relaxed">{step.desc}</p>
              </div>

              <div className="lg:col-span-6">
                {step.content}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-[#EEF5E8] border-t border-[#DCECCF]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <h2 className="text-3xl font-black text-[#285C32]">Explore Annadata Features</h2>
          <p className="text-sm text-[#667267]">Check out our comprehensive 8-feature platform breakdown.</p>
          <Link href="/features">
            <Button variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
              View Platform Features
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
