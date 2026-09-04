'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { MapPin, Navigation, CheckCircle2, RefreshCw, Globe, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getFarmerProfile, saveFarmerProfile } from '@/lib/farmerService';

export const FarmLocationSection: React.FC = () => {
  const { t } = useTranslation();
  const [loadingGps, setLoadingGps] = useState(false);
  const [locationData, setLocationData] = useState({
    village: 'Sanwer',
    district: 'Indore',
    state: 'Madhya Pradesh',
    country: 'India',
    latitude: 22.9734,
    longitude: 75.8118,
    accuracy: 12,
    source: 'GPS Geocoding',
  });
  const [detectedSuccess, setDetectedSuccess] = useState(false);

  useEffect(() => {
    const profile = getFarmerProfile();
    if (profile && profile.village) {
      setLocationData({
        village: profile.village,
        district: profile.district,
        state: profile.state,
        country: 'India',
        latitude: profile.structuredLocation?.coordinates?.latitude || profile.latitude || 22.9734,
        longitude: profile.structuredLocation?.coordinates?.longitude || profile.longitude || 75.8118,
        accuracy: profile.structuredLocation?.accuracy || profile.accuracy || 12,
        source: profile.structuredLocation?.source === 'device-geolocation' ? 'GPS Verified' : 'Manual Entry',
      });
    }
  }, []);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setLoadingGps(true);
    setDetectedSuccess(false);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(6));
        const lng = parseFloat(pos.coords.longitude.toFixed(6));
        const acc = Math.round(pos.coords.accuracy);

        try {
          // OpenStreetMap Nominatim reverse geocoding
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
            { headers: { 'Accept-Language': 'en' } }
          );
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const village = addr.village || addr.suburb || addr.town || addr.county || 'Local Farm';
            const district = addr.state_district || addr.county || 'District';
            const state = addr.state || 'State';

            const updated = {
              village,
              district,
              state,
              country: addr.country || 'India',
              latitude: lat,
              longitude: lng,
              accuracy: acc,
              source: 'GPS Verified (Live)',
            };
            setLocationData(updated);

            // Persist to local farmer profile
            const currentProfile = getFarmerProfile();
            if (currentProfile) {
              saveFarmerProfile({
                ...currentProfile,
                village,
                district,
                state,
                latitude: lat,
                longitude: lng,
                accuracy: acc,
                structuredLocation: {
                  coordinates: {
                    latitude: lat,
                    longitude: lng,
                  },
                  accuracy: acc,
                  village,
                  district,
                  state,
                  country: 'India',
                  source: 'device-geolocation',
                },
              });
            }
            setDetectedSuccess(true);
          }
        } catch (e) {
          console.warn('Reverse geocoding error:', e);
        } finally {
          setLoadingGps(false);
        }
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setLoadingGps(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <section className="py-28 bg-[#F7F6F0] border-b border-[#173F2A]/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Heading & Context (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EEF5E8] text-[#173F2A] text-xs font-bold uppercase tracking-widest border border-[#173F2A]/10">
              <MapPin className="w-3.5 h-3.5 text-[#3F7D3A]" />
              <span>HYPER-LOCAL GEOCODING</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-[54px] font-black text-[#173F2A] tracking-tight leading-tight">
              Your farm.<br />
              Precisely located.
            </h2>

            <p className="text-base sm:text-lg text-[#5F6F62] leading-relaxed font-normal">
              Agricultural decisions are hyper-local. A distance of 10 kilometers can change soil composition, groundwater levels, and rainfall patterns.
            </p>

            <p className="text-sm text-[#5F6F62] leading-relaxed font-normal">
              Annadata accurately identifies your coordinates and connects your land with ICAR agro-climatic zones and Open-Meteo telemetry without asking repeatedly.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={detectLocation}
                disabled={loadingGps}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#173F2A] text-white text-xs font-extrabold shadow-md hover:bg-[#3F7D3A] transition-colors disabled:opacity-75"
              >
                {loadingGps ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#D8B45A]" />
                    <span>Detecting Coordinates...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-4 h-4 text-[#D8B45A]" />
                    <span>Use My Current Location</span>
                  </>
                )}
              </button>

              <Link href="/farm-location">
                <Button variant="secondary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
                  Detailed Farm Map
                </Button>
              </Link>
            </div>

            {detectedSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center gap-2 animate-in fade-in duration-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>GPS coordinates detected and saved to your farm profile!</span>
              </div>
            )}
          </div>

          {/* Right Column: Interactive Location Telemetry Card (6 cols) */}
          <div className="lg:col-span-6">
            <div className="p-8 rounded-3xl bg-white border border-[#173F2A]/10 shadow-xl space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#EEF5E8] flex items-center justify-center text-[#3F7D3A]">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#173F2A]">Farm Telemetry Node</h3>
                    <span className="text-[11px] text-[#5F6F62] font-semibold">{locationData.source}</span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#FAF7EE] text-[#173F2A] text-xs font-bold border border-[#D8B45A]/40">
                  {locationData.state}
                </span>
              </div>

              {/* Coordinates & Administrative Breakdown */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-[#F7F6F0] border border-stone-200">
                  <span className="text-[#5F6F62] font-medium block">Village / Settlement</span>
                  <strong className="text-base font-black text-[#173F2A] block mt-0.5">{locationData.village}</strong>
                </div>

                <div className="p-4 rounded-2xl bg-[#F7F6F0] border border-stone-200">
                  <span className="text-[#5F6F62] font-medium block">District</span>
                  <strong className="text-base font-black text-[#173F2A] block mt-0.5">{locationData.district}</strong>
                </div>

                <div className="p-4 rounded-2xl bg-[#F7F6F0] border border-stone-200">
                  <span className="text-[#5F6F62] font-medium block">Latitude</span>
                  <strong className="font-mono text-sm font-bold text-[#3F7D3A] block mt-0.5">{locationData.latitude}° N</strong>
                </div>

                <div className="p-4 rounded-2xl bg-[#F7F6F0] border border-stone-200">
                  <span className="text-[#5F6F62] font-medium block">Longitude</span>
                  <strong className="font-mono text-sm font-bold text-[#3F7D3A] block mt-0.5">{locationData.longitude}° E</strong>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="p-4 rounded-2xl bg-[#EEF5E8] border border-[#DCECCF] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#3F7D3A]" />
                  <span className="font-bold text-[#173F2A]">Encrypted Geolocation</span>
                </div>
                <span className="text-[11px] font-semibold text-[#5F6F62]">
                  Accuracy: ±{locationData.accuracy}m
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
