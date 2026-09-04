import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/ui/PageHero';
import { FarmLocationSection } from '@/components/sections/FarmLocationSection';
import { Button } from '@/components/ui/Button';
import { MapPin, Compass, ArrowRight, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Farm Location | Hyper-Local GPS & Agro-Climatic Zones | Annadata',
  description:
    'Detect and verify your Indian farm coordinates, district, village, and agro-climatic subzone for hyper-local agricultural intelligence.',
};

export default function FarmLocationPage() {
  return (
    <main className="min-h-screen bg-[#F7F6F0] text-[#17201A]">
      <PageHero
        badge="PRECISION GEOCODING"
        title="Your farm. Precisely located."
        subtitle="Connecting exact farm coordinates with micro-climate forecasts, soil sub-types, and seasonal Mandi price trends across India."
        icon={<MapPin className="w-4 h-4 text-[#3F7D3A]" />}
      />

      <FarmLocationSection />

      {/* Action Banner */}
      <section className="py-20 bg-[#EEF5E8] border-t border-[#173F2A]/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-[#173F2A]">
            Ready to configure your full farm profile?
          </h2>
          <p className="text-sm sm:text-base text-[#5F6F62] max-w-xl mx-auto">
            Add your acreage, soil type, and current crops to receive customized fertilizer dosages and crop suitability matches.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/app/farm">
              <Button variant="primary" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                Go to Farm Profile
              </Button>
            </Link>
            <Link href="/app/dashboard">
              <Button variant="secondary" size="lg">
                View Farmer Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
