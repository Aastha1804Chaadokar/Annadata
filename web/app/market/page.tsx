import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/ui/PageHero';
import { Button } from '@/components/ui/Button';
import { TrendingUp, ArrowRight, Store, Calendar, ShieldCheck, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mandi Rates & Market Intelligence | Commodity Price Trends | Annadata',
  description:
    'Track local Mandi prices, seasonal price trends, and commodity arrival volumes across Indian APMC markets.',
};

export default function MarketPublicPage() {
  const SAMPLE_MANDI_RATES = [
    { crop: 'Soybean (सोयाबीन)', mandi: 'Indore Mandi (MP)', price: '₹4,850', unit: 'Quintal', trend: '+2.4%', date: 'Today' },
    { crop: 'Wheat (गेहूं)', mandi: 'Karnal Mandi (HR)', price: '₹2,325', unit: 'Quintal', trend: '+0.8%', date: 'Today' },
    { crop: 'Gram / Chana (चना)', mandi: 'Latur Mandi (MH)', price: '₹5,700', unit: 'Quintal', trend: '-1.1%', date: 'Today' },
    { crop: 'Mustard (सरसों)', mandi: 'Jaipur Mandi (RJ)', price: '₹5,420', unit: 'Quintal', trend: '+1.5%', date: 'Today' },
    { crop: 'Cotton (कपास)', mandi: 'Rajkot Mandi (GJ)', price: '₹7,150', unit: 'Quintal', trend: '+3.0%', date: 'Today' },
    { crop: 'Onion (प्याज)', mandi: 'Nashik Mandi (MH)', price: '₹1,950', unit: 'Quintal', trend: '-4.2%', date: 'Today' },
  ];

  return (
    <main className="min-h-screen bg-[#F7F6F0] text-[#17201A]">
      <PageHero
        badge="MARKET & COMMODITY TELEMETRY"
        title="Know the market before you sell."
        subtitle="Transparent price trends across nearby APMC Mandis to help Indian farmers optimize timing and distribution post-harvest."
        icon={<TrendingUp className="w-4 h-4 text-[#9A7048]" />}
      />

      {/* Market Telemetry Section */}
      <section className="py-24 bg-[#F7F6F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#173F2A]/10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#3F7D3A]">
                INDICATIVE MANDI TELEMETRY
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#173F2A] mt-1">
                Regional Commodity Price Streams
              </h2>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-stone-200 text-xs text-[#5F6F62] flex items-center gap-2">
              <Store className="w-4 h-4 text-[#3F7D3A]" />
              <span>APMC Integration Node Active</span>
            </div>
          </div>

          {/* Mandi Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAMPLE_MANDI_RATES.map((item, idx) => (
              <div
                key={idx}
                className="p-7 rounded-3xl bg-white border border-[#173F2A]/10 shadow-xs hover:shadow-lg transition-all duration-300 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#5F6F62] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.date}</span>
                  </span>
                  <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                    item.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                  }`}>
                    {item.trend}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-black text-[#173F2A]">{item.crop}</h3>
                  <p className="text-xs font-semibold text-[#5F6F62] mt-0.5">{item.mandi}</p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-baseline justify-between">
                  <span className="text-2xl font-black text-[#173F2A]">{item.price}</span>
                  <span className="text-xs text-[#5F6F62] font-semibold">per {item.unit}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Source Notice Box */}
          <div className="p-5 rounded-2xl bg-[#FFF8E8] border border-[#D8B45A]/40 text-xs text-[#5F6F62] flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#D8B45A] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#173F2A] block font-bold mb-0.5">Government & Agmarknet Mandi Integration:</strong>
              Mandi prices vary daily based on moisture content, grade, and local supply arrivals. Verify actual bids with your local APMC commission agents before finalizing transport.
            </div>
          </div>

        </div>
      </section>

      {/* Action Banner */}
      <section className="py-20 bg-[#EEF5E8] border-t border-[#173F2A]/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-[#173F2A]">
            Access Mandi prices in the Farmer Portal
          </h2>
          <p className="text-sm sm:text-base text-[#5F6F62] max-w-xl mx-auto">
            View customized market trackers and nearest Mandi listings based on your saved farm district.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/app/market">
              <Button variant="primary" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                Open Market Portal
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
