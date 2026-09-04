'use client';

import React from 'react';
import Link from 'next/link';
import { AppSidebar } from '@/components/app/AppSidebar';
import { AppHeader } from '@/components/app/AppHeader';
import { ProtectedRoute } from '@/components/app/ProtectedRoute';
import { FarmLocationSection } from '@/components/sections/FarmLocationSection';
import { Button } from '@/components/ui/Button';
import { MapPin, Tractor, ArrowRight } from 'lucide-react';

function AppFarmLocationContent() {
  return (
    <div className="min-h-screen bg-[#F7F6F0] flex flex-col">
      <AppHeader />

      <div className="flex flex-1">
        <AppSidebar />

        <main className="flex-1 p-6 md:p-10 space-y-8 max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#173F2A]/10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#3F7D3A]">
                GEOLOCATION TELEMETRY
              </span>
              <h1 className="text-3xl font-black text-[#173F2A]">Farm Location & GPS</h1>
            </div>
            <Link href="/app/farm">
              <Button variant="secondary" size="md" icon={<Tractor className="w-4 h-4" />}>
                View Farm Profile
              </Button>
            </Link>
          </div>

          <FarmLocationSection />
        </main>
      </div>
    </div>
  );
}

export default function AppFarmLocationPage() {
  return (
    <ProtectedRoute>
      <AppFarmLocationContent />
    </ProtectedRoute>
  );
}
