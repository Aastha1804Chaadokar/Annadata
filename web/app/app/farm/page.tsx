'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getFarmerProfile, saveFarmerProfile } from '@/lib/farmerService';
import { getLatestSoilReport } from '@/lib/soilService';
import { requestDeviceCoordinates, fetchReverseGeocode } from '@/lib/locationService';
import { FarmerProfile, FarmingType, IrrigationType } from '@/types/farmer';
import { SoilReportRecord } from '@/types/soil';
import { MapPreview } from '@/components/map/MapPreview';
import { CropSelect } from '@/components/ui/CropSelect';
import { formatCropDisplay } from '@/lib/cropDataset';
import { AppSidebar } from '@/components/app/AppSidebar';
import { AppHeader } from '@/components/app/AppHeader';
import { ProtectedRoute } from '@/components/app/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { API_ENDPOINTS } from '@/lib/apiConfig';
import {
  Tractor,
  User,
  MapPin,
  Sprout,
  Droplets,
  Edit,
  Save,
  X,
  CheckCircle2,
  ArrowRight,
  Eye,
  AlertCircle,
  Navigation,
  RefreshCw,
  Compass,
} from 'lucide-react';

function MyFarmContent() {
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [soilReport, setSoilReport] = useState<SoilReportRecord | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDetectingGps, setIsDetectingGps] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Edit Form State
  const [editData, setEditData] = useState<FarmerProfile | null>(null);

  useEffect(() => {
    const p = getFarmerProfile();
    setProfile(p);
    setEditData(p);
    setSoilReport(getLatestSoilReport());
  }, []);

  if (!profile || !editData) return null;

  const handleGpsUpdate = async () => {
    setIsDetectingGps(true);
    const geoRes = await requestDeviceCoordinates();

    if (geoRes.coordinates) {
      const revRes = await fetchReverseGeocode(
        geoRes.coordinates.latitude,
        geoRes.coordinates.longitude,
        geoRes.coordinates.accuracy
      );

      setEditData((prev) =>
        prev
          ? {
              ...prev,
              village: revRes.village,
              district: revRes.district,
              state: revRes.state,
              latitude: revRes.latitude,
              longitude: revRes.longitude,
              accuracy: revRes.accuracy,
              pincode: revRes.postalCode,
              structuredLocation: {
                coordinates: {
                  latitude: revRes.latitude,
                  longitude: revRes.longitude,
                },
                accuracy: revRes.accuracy,
                village: revRes.village,
                locality: revRes.locality,
                subDistrict: revRes.subDistrict,
                district: revRes.district,
                state: revRes.state,
                country: 'India',
                postalCode: revRes.postalCode,
                formattedAddress: revRes.formattedAddress,
                source: 'device-geolocation',
                locationUpdatedAt: new Date().toISOString(),
              },
            }
          : null
      );
    }
    setIsDetectingGps(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(null);

    // Save locally
    saveFarmerProfile(editData);
    setProfile(editData);

    // Send PUT request to backend
    try {
      await fetch(API_ENDPOINTS.FARMER_PROFILE, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });
    } catch (err) {
      // Offline fallback
    }

    setIsSaving(false);
    setIsEditing(false);
    setSuccessMsg('Farm profile and location updated successfully!');
  };

  return (
    <div className="min-h-screen bg-[#F8FAF3] flex flex-col">
      <AppHeader />

      <div className="flex flex-1">
        <AppSidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-6xl">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#EEF5E8] text-[#3F7D3A] text-xs font-bold border border-[#DCECCF] mb-1">
                <Tractor className="w-3.5 h-3.5" /> Farm Profile Management
              </div>
              <h1 className="text-3xl font-black text-[#285C32]">
                My Farm Profile
              </h1>
              <p className="text-xs text-[#667267]">
                Complete farm parameters used across Soil Health, Crop Recommendation, and Weather intelligence.
              </p>
            </div>

            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} icon={<Edit className="w-4 h-4" />}>
                Edit Farm Profile
              </Button>
            ) : (
              <Button variant="secondary" onClick={() => setIsEditing(false)} icon={<X className="w-4 h-4" />}>
                Cancel Editing
              </Button>
            )}
          </div>

          {/* Success Toast */}
          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* EDIT FORM MODE */}
          {isEditing ? (
            <form onSubmit={handleSave} className="p-6 md:p-8 rounded-3xl bg-white border border-[#3F7D3A]/20 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h2 className="text-lg font-black text-[#285C32]">
                  Edit Farm Parameters & Location
                </h2>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={handleGpsUpdate}
                  disabled={isDetectingGps}
                  icon={<Navigation className={`w-3.5 h-3.5 ${isDetectingGps ? 'animate-spin' : ''}`} />}
                >
                  {isDetectingGps ? 'Detecting GPS...' : '📍 Use Current GPS Location'}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
                <div>
                  <label className="block font-bold text-[#285C32] mb-1">Farmer Name</label>
                  <input
                    type="text"
                    required
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#3F7D3A]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#285C32] mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={editData.mobile}
                    onChange={(e) => setEditData({ ...editData, mobile: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#3F7D3A]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#285C32] mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={editData.state}
                    onChange={(e) => setEditData({ ...editData, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#3F7D3A]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#285C32] mb-1">District</label>
                  <input
                    type="text"
                    required
                    value={editData.district}
                    onChange={(e) => setEditData({ ...editData, district: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#3F7D3A]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#285C32] mb-1">Village / Locality</label>
                  <input
                    type="text"
                    required
                    value={editData.village}
                    onChange={(e) => setEditData({ ...editData, village: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#3F7D3A]"
                  />
                </div>

                <CropSelect
                  value={editData.currentCrop}
                  language={editData.language}
                  onChange={(crop) => {
                    const displayStr = formatCropDisplay(crop);
                    setEditData({
                      ...editData,
                      currentCrop: crop,
                      mainCrop: displayStr,
                    });
                  }}
                />

                <div>
                  <label className="block font-bold text-[#285C32] mb-1">Land Size</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editData.landSize}
                    onChange={(e) => setEditData({ ...editData, landSize: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#3F7D3A]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#285C32] mb-1">Land Unit</label>
                  <select
                    value={editData.landUnit}
                    onChange={(e) => setEditData({ ...editData, landUnit: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#3F7D3A] bg-white font-semibold"
                  >
                    <option value="Acres">Acres</option>
                    <option value="Bigha">Bigha</option>
                    <option value="Hectares">Hectares</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#285C32] mb-1">Irrigation Type</label>
                  <select
                    value={editData.irrigation}
                    onChange={(e) => setEditData({ ...editData, irrigation: e.target.value as IrrigationType })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#3F7D3A] bg-white font-semibold"
                  >
                    <option value="Rain-fed">Rain-fed</option>
                    <option value="Borewell">Borewell</option>
                    <option value="Canal">Canal</option>
                    <option value="Drip">Drip</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Map Preview in Edit Mode if coordinates present */}
              {editData.latitude && editData.longitude && (
                <div className="pt-2">
                  <span className="font-bold text-[#285C32] text-xs block mb-2">Detected Map Preview:</span>
                  <MapPreview
                    latitude={editData.latitude}
                    longitude={editData.longitude}
                    accuracy={editData.accuracy}
                    village={editData.village}
                    district={editData.district}
                    state={editData.state}
                  />
                </div>
              )}

              <div className="pt-4 border-t border-stone-100 flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving} icon={<Save className="w-4 h-4" />}>
                  {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
                </Button>
              </div>
            </form>
          ) : (
            /* VIEW DISPLAY MODE */
            <div className="space-y-6">
              {/* Map Preview if coordinates present */}
              {profile.latitude && profile.longitude && (
                <MapPreview
                  latitude={profile.latitude}
                  longitude={profile.longitude}
                  accuracy={profile.accuracy}
                  village={profile.village}
                  district={profile.district}
                  state={profile.state}
                />
              )}

              {/* Grid Section 1: Farmer & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Farmer Info */}
                <div className="p-6 rounded-3xl bg-white border border-[#3F7D3A]/15 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
                    <User className="w-5 h-5 text-[#3F7D3A]" />
                    <h2 className="text-lg font-black text-[#285C32]">Farmer Information</h2>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-stone-50">
                      <span className="text-[#667267]">Name</span>
                      <strong className="text-[#285C32]">{profile.name}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-50">
                      <span className="text-[#667267]">Mobile Number</span>
                      <strong className="text-[#285C32]">{profile.mobile}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-50">
                      <span className="text-[#667267]">Preferred Language</span>
                      <strong className="text-[#285C32]">{profile.language}</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#667267]">Access Channel</span>
                      <strong className="text-[#285C32]">{profile.channelPreference}</strong>
                    </div>
                  </div>
                </div>

                {/* Location Info */}
                <div className="p-6 rounded-3xl bg-white border border-[#3F7D3A]/15 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#3F7D3A]" />
                      <h2 className="text-lg font-black text-[#285C32]">Farm Location</h2>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#EEF5E8] text-[#3F7D3A] text-[10px] font-bold border border-[#DCECCF]">
                      {profile.structuredLocation?.source === 'device-geolocation' ? '📍 Device GPS Verified' : 'Manual Entry'}
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-stone-50">
                      <span className="text-[#667267]">Village / Locality</span>
                      <strong className="text-[#285C32]">{profile.village}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-50">
                      <span className="text-[#667267]">District</span>
                      <strong className="text-[#285C32]">{profile.district}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-50">
                      <span className="text-[#667267]">State</span>
                      <strong className="text-[#285C32]">{profile.state}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-50">
                      <span className="text-[#667267]">Country</span>
                      <strong className="text-[#285C32]">India</strong>
                    </div>
                    {profile.latitude && profile.longitude && (
                      <div className="flex justify-between py-1">
                        <span className="text-[#667267]">GPS Pin</span>
                        <strong className="text-[#3F7D3A]">
                          {profile.latitude.toFixed(4)}°, {profile.longitude.toFixed(4)}° (~{profile.accuracy}m accuracy)
                        </strong>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Grid Section 2: Land & Soil Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Land & Agronomy Info */}
                <div className="p-6 rounded-3xl bg-white border border-[#3F7D3A]/15 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
                    <Tractor className="w-5 h-5 text-[#3F7D3A]" />
                    <h2 className="text-lg font-black text-[#285C32]">Land & Crop Details</h2>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-stone-50">
                      <span className="text-[#667267]">Total Land Area</span>
                      <strong className="text-[#285C32]">{profile.landSize} {profile.landUnit}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-50">
                      <span className="text-[#667267]">Farming Scale</span>
                      <strong className="text-[#285C32]">{profile.farmingType}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-50">
                      <span className="text-[#667267]">Current Crop / वर्तमान फसल</span>
                      <strong className="text-[#3F7D3A]">
                        {profile.currentCrop ? formatCropDisplay(profile.currentCrop) : profile.mainCrop}
                      </strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#667267]">Irrigation Availability</span>
                      <strong className="text-[#285C32]">{profile.irrigation}</strong>
                    </div>
                  </div>
                </div>

                {/* Soil Summary */}
                <div className="p-6 rounded-3xl bg-white border border-[#3F7D3A]/15 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <div className="flex items-center gap-2">
                      <Sprout className="w-5 h-5 text-[#3F7D3A]" />
                      <h2 className="text-lg font-black text-[#285C32]">Soil Profile Status</h2>
                    </div>
                    <Link href="/app/soil">
                      <Button variant="secondary" size="sm" icon={<Eye className="w-3.5 h-3.5" />}>
                        Soil Module
                      </Button>
                    </Link>
                  </div>

                  {soilReport ? (
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-stone-50">
                        <span className="text-[#667267]">Last Tested</span>
                        <strong className="text-[#285C32]">{soilReport.testDate}</strong>
                      </div>
                      <div className="flex justify-between py-1 border-b border-stone-50">
                        <span className="text-[#667267]">Soil pH</span>
                        <strong className="text-[#3F7D3A]">{soilReport.ph} ({soilReport.interpretation?.parameters.find((p) => p.parameter === 'pH')?.status})</strong>
                      </div>
                      <div className="flex justify-between py-1 border-b border-stone-50">
                        <span className="text-[#667267]">Nutrients (N-P-K)</span>
                        <strong className="text-[#285C32]">{soilReport.nitrogen.value} - {soilReport.phosphorus.value} - {soilReport.potassium.value}</strong>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-[#667267]">Soil Classification</span>
                        <strong className="text-[#285C32]">{soilReport.soilType}</strong>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 text-center rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                      <AlertCircle className="w-6 h-6 text-amber-700 mx-auto" />
                      <div className="text-xs font-bold text-amber-900">No Soil Report Added Yet</div>
                      <Link href="/app/soil">
                        <Button size="sm" className="mt-1">Add Soil Report</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function MyFarmPage() {
  return (
    <ProtectedRoute>
      <MyFarmContent />
    </ProtectedRoute>
  );
}
