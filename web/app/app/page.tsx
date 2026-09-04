'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/authService';
import { getFarmerProfile, hasCompletedOnboarding } from '@/lib/farmerService';
import { FarmerProfile } from '@/types/farmer';
import { Button } from '@/components/ui/Button';
import { Sprout, Tractor, LayoutDashboard, ArrowRight, CheckCircle, LogIn } from 'lucide-react';

export default function AppEntryPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [hasProfile, setHasProfile] = useState<boolean>(false);
  const [authed, setAuthed] = useState<boolean>(false);

  useEffect(() => {
    const isAuthed = isAuthenticated();
    setAuthed(isAuthed);

    if (!isAuthed) {
      router.replace('/login');
      return;
    }

    const isCompleted = hasCompletedOnboarding();
    setHasProfile(isCompleted);
    if (isCompleted) {
      setProfile(getFarmerProfile());
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-[#F8FAF3] pt-28 pb-16 px-4 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Welcome Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF5E8] border border-[#DCECCF] text-[#3F7D3A] text-xs font-bold shadow-sm">
            <Sprout className="w-4 h-4" />
            <span>ANNADATA FARMER APPLICATION • अन्नदाता पोर्टल</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-[#285C32]">
            Welcome to Annadata
          </h1>
          <p className="text-sm sm:text-base text-[#667267] max-w-lg mx-auto">
            Let's understand your farm and help you make better decisions.
          </p>
        </div>

        {/* Action Options Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {/* Card 1: Start My Farm Profile */}
          <div className="p-6 md:p-8 rounded-3xl bg-white border border-[#3F7D3A]/20 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EEF5E8] text-[#3F7D3A] flex items-center justify-center">
                <Tractor className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-[#285C32]">New Farmer Onboarding</h2>
              <p className="text-xs text-[#667267] leading-relaxed">
                Build your farm profile with location, land size, main crops, and irrigation details.
              </p>
            </div>

            <div className="pt-6 border-t border-stone-100 mt-6">
              <Link href="/app/onboarding">
                <Button variant="primary" size="md" className="w-full justify-between" icon={<ArrowRight className="w-4 h-4" />}>
                  <span>Start My Farm Profile</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Card 2: Go to Dashboard */}
          <div className="p-6 md:p-8 rounded-3xl bg-white border border-[#3F7D3A]/20 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF8E8] text-[#9A7048] flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-[#285C32]">Existing Farm Profile</h2>
              <p className="text-xs text-[#667267] leading-relaxed">
                Already have a farm profile? Jump straight into your central farmer decision dashboard.
              </p>

              {hasProfile && profile && (
                <div className="p-3 rounded-xl bg-[#EEF5E8] border border-[#DCECCF] text-xs text-[#3F7D3A] font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>Profile Loaded: {profile.name} ({profile.village})</span>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-stone-100 mt-6">
              <Link href="/app/dashboard">
                <Button variant="secondary" size="md" className="w-full justify-between" icon={<ArrowRight className="w-4 h-4" />}>
                  <span>Go to Dashboard</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
