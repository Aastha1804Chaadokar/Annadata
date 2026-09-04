'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getFarmerProfile, saveFarmerProfile } from '@/lib/farmerService';
import { FarmerProfile, FarmingType } from '@/types/farmer';
import { AppSidebar } from '@/components/app/AppSidebar';
import { AppHeader } from '@/components/app/AppHeader';
import { ProtectedRoute } from '@/components/app/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { User, MapPin, Phone, Globe, CheckCircle2, Save, Edit3, Shield } from 'lucide-react';

function ProfileContent() {
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<FarmerProfile | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const p = getFarmerProfile();
    setProfile(p);
    setEditData(p);
  }, []);

  if (!profile || !editData) return null;

  const handleSave = () => {
    saveFarmerProfile(editData);
    setProfile(editData);
    setIsEditing(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F7F6F0] flex flex-col">
      <AppHeader />

      <div className="flex flex-1">
        <AppSidebar />

        <main className="flex-1 p-6 md:p-10 space-y-8 max-w-5xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#173F2A]/10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#3F7D3A]">
                ACCOUNT & IDENTITY
              </span>
              <h1 className="text-3xl font-black text-[#173F2A]">Farmer Profile</h1>
            </div>
            {!isEditing ? (
              <Button variant="primary" size="md" onClick={() => setIsEditing(true)} icon={<Edit3 className="w-4 h-4" />}>
                Edit Profile
              </Button>
            ) : (
              <div className="flex items-center gap-3">
                <Button variant="outline" size="md" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="md" onClick={handleSave} icon={<Save className="w-4 h-4" />}>
                  Save Profile
                </Button>
              </div>
            )}
          </div>

          {success && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          {/* Profile Card */}
          <div className="p-8 rounded-3xl bg-white border border-[#173F2A]/10 shadow-sm space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-stone-100">
              <div className="w-16 h-16 rounded-full bg-[#173F2A] text-white flex items-center justify-center font-black text-2xl shadow-md">
                {profile.name ? profile.name[0].toUpperCase() : 'F'}
              </div>
              <div>
                <h2 className="text-2xl font-black text-[#173F2A]">{profile.name}</h2>
                <p className="text-xs font-semibold text-[#5F6F62] flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#3F7D3A]" />
                  <span>{profile.village}, {profile.district}, {profile.state}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-[#173F2A]">Farmer Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F7F6F0] border border-stone-300 text-xs font-bold text-[#173F2A]"
                  />
                ) : (
                  <div className="p-3.5 rounded-xl bg-[#F7F6F0] font-bold text-[#173F2A]">{profile.name}</div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#173F2A]">Mobile Number</label>
                <div className="p-3.5 rounded-xl bg-[#F7F6F0] font-bold text-[#173F2A] flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#3F7D3A]" />
                  <span>{profile.mobile}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#173F2A]">State</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.state}
                    onChange={(e) => setEditData({ ...editData, state: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F7F6F0] border border-stone-300 text-xs font-bold text-[#173F2A]"
                  />
                ) : (
                  <div className="p-3.5 rounded-xl bg-[#F7F6F0] font-bold text-[#173F2A]">{profile.state}</div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#173F2A]">District</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.district}
                    onChange={(e) => setEditData({ ...editData, district: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F7F6F0] border border-stone-300 text-xs font-bold text-[#173F2A]"
                  />
                ) : (
                  <div className="p-3.5 rounded-xl bg-[#F7F6F0] font-bold text-[#173F2A]">{profile.district}</div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#173F2A]">Village</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.village}
                    onChange={(e) => setEditData({ ...editData, village: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F7F6F0] border border-stone-300 text-xs font-bold text-[#173F2A]"
                  />
                ) : (
                  <div className="p-3.5 rounded-xl bg-[#F7F6F0] font-bold text-[#173F2A]">{profile.village}</div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#173F2A]">Preferred Language</label>
                {isEditing ? (
                  <select
                    value={editData.language}
                    onChange={(e) => setEditData({ ...editData, language: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F7F6F0] border border-stone-300 text-xs font-bold text-[#173F2A]"
                  >
                    <option value="Hindi">Hindi (हिन्दी)</option>
                    <option value="English">English</option>
                    <option value="Marathi">Marathi (मराठी)</option>
                    <option value="Bengali">Bengali (বাংলা)</option>
                    <option value="Gujarati">Gujarati (ગુજરાતી)</option>
                    <option value="Punjabi">Punjabi (ਪੰਜਾਬੀ)</option>
                    <option value="Tamil">Tamil (தமிழ்)</option>
                  </select>
                ) : (
                  <div className="p-3.5 rounded-xl bg-[#F7F6F0] font-bold text-[#173F2A]">{profile.language}</div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-[#5F6F62]">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#3F7D3A]" />
                <span>Encrypted Farmer Database</span>
              </div>
              <span>Registered: {new Date(profile.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
