import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/ui/PageHero';
import { VoiceSection } from '@/components/sections/VoiceSection';
import { Button } from '@/components/ui/Button';
import { Bot, ArrowRight, MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Ask Annadata AI Assistant | Multilingual Farming Advisory | Annadata',
  description:
    'Ask agricultural questions in Hindi, Marathi, Bengali, and regional Indian languages designed around your land, crop, and weather context.',
};

export default function AiAssistantPublicPage() {
  return (
    <main className="min-h-screen bg-[#F7F6F0] text-[#17201A]">
      <PageHero
        badge="CONVERSATIONAL AGRI-AI"
        title="Ask your farm anything."
        subtitle="A multilingual agricultural intelligence assistant calibrated on Indian extension practices, Soil Health Card metrics, and localized weather alerts."
        icon={<Bot className="w-4 h-4 text-[#3F7D3A]" />}
      />

      <VoiceSection />

      {/* Action Banner */}
      <section className="py-20 bg-[#EEF5E8] border-t border-[#173F2A]/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-[#173F2A]">
            Try Ask Annadata in your language
          </h2>
          <p className="text-sm sm:text-base text-[#5F6F62] max-w-xl mx-auto">
            Ask questions about yellowing leaves, fertilizer schedules, sowing dates, and mandi trends in Hindi, Marathi, and regional languages.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/app/assistant">
              <Button variant="primary" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                Open AI Assistant
              </Button>
            </Link>
            <Link href="/features">
              <Button variant="secondary" size="lg">
                Explore All Features
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
