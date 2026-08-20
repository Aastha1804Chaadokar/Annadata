'use client';

import React, { useEffect, useState } from 'react';
import { getFarmerProfile } from '@/lib/farmerService';
import { FarmerProfile } from '@/types/farmer';
import { MapPin, UserCheck, ShieldCheck } from 'lucide-react';

export const AppHeader: React.FC = () => {
  const [profile, setProfile] = useState<FarmerProfile | null>(null);

  useEffect(() => {
    setProfile(getFarmerProfile());
  }, []);

  if (!profile) return null;

  return (
    <div className="bg-white border-b border-[#E3EADF] px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-[#EEF5E8] text-[#3F7D3A]">
          <UserCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="text-base font-black text-[#285C32]">{profile.name}</div>
          <div className="text-xs text-[#667267] flex items-center gap-1 font-medium">
            <MapPin className="w-3 h-3 text-[#3F7D3A]" />
            <span>
              {profile.village}, {profile.district}, {profile.state}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="px-3 py-1 bg-[#EEF5E8] text-[#3F7D3A] text-xs font-bold rounded-full border border-[#DCECCF]">
          {profile.farmingType}
        </span>
        <span className="px-3 py-1 bg-[#FFF8E8] text-[#9A7048] text-xs font-bold rounded-full border border-[#E8B94A]/30">
          {profile.mainCrop}
        </span>
      </div>
    </div>
  );
};
