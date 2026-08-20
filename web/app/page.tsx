import type { Metadata } from 'next';
import Link from 'next/link';
import { Hero } from '@/components/hero/Hero';
import { Button } from '@/components/ui/Button';
import { Sprout, ArrowRight, Sparkles, CloudSun, Mic, Smartphone, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Annadata (अन्नदाता) | AI-Powered Agriculture for Indian Farmers',
  description:
    'Smarter decisions for every Indian farmer. Understand your soil, choose the right crop, follow the weather, and get agricultural guidance in 9+ regional Indian languages.',
};

export default function HomePage() {
  const PREVIEW_CARDS = [
    {
      number: '01',
      title: 'Understand Your Soil',
      desc: 'Parse Soil Health Card metrics (N, P, K, pH) into clear fertilizer recommendations.',
      link: '/how-it-works',
      icon: <Sprout className="w-6 h-6 text-[#3F7D3A]" />,
      badge: 'Soil Intelligence',
    },
    {
      number: '02',
      title: 'Choose the Right Crop',
      desc: 'Match season, location, soil profile, and Mandi price trends for maximum yield.',
      link: '/features',
      icon: <Sparkles className="w-6 h-6 text-[#E8B94A]" />,
      badge: 'Crop Suitability',
    },
    {
      number: '03',
      title: 'Follow the Weather',
      desc: 'Real-time micro-climate alerts inform when to irrigate, sow, or spray crops.',
      link: '/features',
      icon: <CloudSun className="w-6 h-6 text-[#6FA8B8]" />,
      badge: 'Weather Alerts',
    },
    {
      number: '04',
      title: 'Ask Annadata Voice AI',
      desc: 'Ask farming questions in Hindi, Marathi, Gujarati, or your regional dialect.',
      link: '/access-options',
      icon: <Mic className="w-6 h-6 text-[#3F7D3A]" />,
      badge: 'Multilingual Voice',
    },
    {
      number: '05',
      title: 'Access It Your Way',
      desc: 'Available via 4G Smartphone, Basic Phone IVR Helpline, or SMS text alerts.',
      link: '/access-options',
      icon: <Smartphone className="w-6 h-6 text-[#9A7048]" />,
      badge: 'Universal Access',
    },
  ];

  return (
    <main className="min-h-screen bg-[#F8FAF3]">
      {/* 1. Real Wheat Field Hero Background (Photographic, No Artificial Crop Overlays) */}
      <Hero />

      {/* 2. Concise Homepage Preview Section */}
      <section className="py-20 bg-[#F8FAF3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EEF5E8] text-[#3F7D3A] border border-[#DCECCF] mb-3">
              Platform Overview
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#285C32]">
              Five ways Annadata empowers Indian farmers
            </h2>
            <p className="mt-3 text-base text-[#667267]">
              Explore our dedicated sections to learn how data-driven agricultural guidance turns uncertainty into confident decisions.
            </p>
          </div>

          {/* 5 Short Preview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {PREVIEW_CARDS.map((card) => (
              <div
                key={card.number}
                className="p-6 rounded-2xl bg-white border border-[#3F7D3A]/12 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-[#3F7D3A]/30 transition-all duration-200 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-[#DCECCF] group-hover:text-[#3F7D3A] transition-colors">
                      {card.number}
                    </span>
                    <div className="p-2.5 rounded-xl bg-[#EEF5E8]">
                      {card.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-[#285C32] mb-2 group-hover:text-[#3F7D3A] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-[#667267] leading-relaxed mb-6">
                    {card.desc}
                  </p>
                </div>

                <Link
                  href={card.link}
                  className="inline-flex items-center gap-1 text-xs font-extrabold text-[#3F7D3A] hover:text-[#285C32] transition-colors pt-3 border-t border-stone-100"
                >
                  <span>Learn More</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Homepage CTA Banner */}
      <section className="py-20 bg-[#EEF5E8] border-t border-[#DCECCF]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black text-[#285C32]">
            Ready to explore smarter farming?
          </h2>
          <p className="text-base text-[#667267] max-w-xl mx-auto">
            Discover our full journey, explore platform features, or see how Annadata connects to basic keypad phones.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link href="/how-it-works">
              <Button variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                See How It Works
              </Button>
            </Link>
            <Link href="/for-farmers">
              <Button variant="secondary" size="lg">
                For Farmers
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
