import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/ui/PageHero';
import { SoilSection } from '@/components/sections/SoilSection';
import { Button } from '@/components/ui/Button';
import { Sprout, ArrowRight, ShieldCheck, Beaker } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Soil Health Intelligence | Soil Health Card & NPK Analysis | Annadata',
  description:
    'Digitize official Soil Health Card parameters — Nitrogen, Phosphorus, Potassium, Soil pH, and Organic Carbon — for balanced crop nutrition in India.',
};

export default function SoilHealthPage() {
  return (
    <main className="min-h-screen bg-[#F7F6F0] text-[#17201A]">
      <PageHero
        badge="SOIL INTELLIGENCE"
        title="Know what lies beneath your crop."
        subtitle="Translate official Soil Health Card metrics into balanced fertilizer schedules and soil conditioning practices calibrated for Indian farms."
        icon={<Sprout className="w-4 h-4 text-[#3F7D3A]" />}
      />

      <SoilSection />

      {/* Action Banner */}
      <section className="py-20 bg-[#EEF5E8] border-t border-[#173F2A]/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-[#173F2A]">
            Have a Soil Health Card report?
          </h2>
          <p className="text-sm sm:text-base text-[#5F6F62] max-w-xl mx-auto">
            Input your test values in the Farmer Soil Portal to generate crop-specific nutrient dosages and verify soil pH status.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/app/soil">
              <Button variant="primary" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                Open Soil Health Portal
              </Button>
            </Link>
            <Link href="/crop-recommendation">
              <Button variant="secondary" size="lg">
                View Crop Suitability
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
