import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/ui/PageHero';
import { WeatherSection } from '@/components/sections/WeatherSection';
import { Button } from '@/components/ui/Button';
import { CloudSun, ArrowRight, Sun, Droplets, Wind } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Micro-Climate Weather Intelligence | Farm Mausam Alerts | Annadata',
  description:
    'Real-time temperature, precipitation probability, humidity, and agro-meteorological advisories based on your exact farm GPS coordinates.',
};

export default function WeatherPublicPage() {
  return (
    <main className="min-h-screen bg-[#F7F6F0] text-[#17201A]">
      <PageHero
        badge="AGRO-METEOROLOGY"
        title="Read the weather before it reads your crop."
        subtitle="Hyper-local temperature, rainfall probability, humidity, and wind warnings calibrated to your farm coordinates."
        icon={<CloudSun className="w-4 h-4 text-[#2C6B7A]" />}
      />

      <WeatherSection />

      {/* Action Banner */}
      <section className="py-20 bg-[#EEF5E8] border-t border-[#173F2A]/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-[#173F2A]">
            Check live telemetry for your GPS coordinates
          </h2>
          <p className="text-sm sm:text-base text-[#5F6F62] max-w-xl mx-auto">
            Get 7-day hourly forecasts and agricultural advisories for sowing, irrigation, spraying, and harvest.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/app/weather">
              <Button variant="primary" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                View Live Farm Weather
              </Button>
            </Link>
            <Link href="/farm-location">
              <Button variant="secondary" size="lg">
                Update Farm Coordinates
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
