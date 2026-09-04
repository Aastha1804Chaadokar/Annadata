import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/ui/PageHero';
import { LanguageSection } from '@/components/sections/LanguageSection';
import { Button } from '@/components/ui/Button';
import { Globe, ArrowRight, Languages } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Multilingual Agriculture Guidance | 11 Indian Languages | Annadata',
  description:
    'Annadata breaks down digital and linguistic barriers, delivering agricultural intelligence in Hindi, Marathi, Bengali, Tamil, Telugu, Kannada, Punjabi, and English.',
};

export default function LanguagesPublicPage() {
  return (
    <main className="min-h-screen bg-[#F7F6F0] text-[#17201A]">
      <PageHero
        badge="INCLUSIVE MULTILINGUAL ACCESS"
        title="Technology should speak your language."
        subtitle="Every farmer feeds the nation in their mother tongue. Annadata delivers soil reports, weather warnings, and crop intelligence in 11 Indian regional languages."
        icon={<Globe className="w-4 h-4 text-[#3F7D3A]" />}
      />

      <LanguageSection />

      {/* Action Banner */}
      <section className="py-20 bg-[#EEF5E8] border-t border-[#173F2A]/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-[#173F2A]">
            Switch languages instantly across the entire platform
          </h2>
          <p className="text-sm sm:text-base text-[#5F6F62] max-w-xl mx-auto">
            Use the top language selector to switch all navigation, forms, dashboards, and AI advisory into your preferred regional dialect.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/app/onboarding">
              <Button variant="primary" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                Get Started in Your Language
              </Button>
            </Link>
            <Link href="/access-options">
              <Button variant="secondary" size="lg">
                View Access Options
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
