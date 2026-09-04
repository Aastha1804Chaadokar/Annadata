import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/ui/PageHero';
import { CropSection } from '@/components/sections/CropSection';
import { HarvestMosaicSection } from '@/components/sections/HarvestMosaicSection';
import { Button } from '@/components/ui/Button';
import { Sparkles, ArrowRight, Sprout } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Crop Recommendation Engine | Kharif, Rabi & Zaid Planning | Annadata',
  description:
    'Match soil chemistry, irrigation capacity, agro-climatic subzones, and seasonal forecasts to recommend optimal Indian crops.',
};

export default function PublicCropRecommendationPage() {
  return (
    <main className="min-h-screen bg-[#F7F6F0] text-[#17201A]">
      <PageHero
        badge="AGRONOMIC SUITABILITY"
        title="The right crop starts with the right information."
        subtitle="Match your soil profile, rainfall expectations, irrigation availability, and Mandi price trends for maximum yield and sustainability."
        icon={<Sparkles className="w-4 h-4 text-[#D8B45A]" />}
      />

      <CropSection />

      <HarvestMosaicSection />

      {/* Action Banner */}
      <section className="py-20 bg-[#EEF5E8] border-t border-[#173F2A]/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-[#173F2A]">
            Calculate suitability for your farm
          </h2>
          <p className="text-sm sm:text-base text-[#5F6F62] max-w-xl mx-auto">
            Run the Annadata crop recommendation engine on your farm coordinates and current season.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/app/crop-recommendation">
              <Button variant="primary" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                Launch Recommendation Engine
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
