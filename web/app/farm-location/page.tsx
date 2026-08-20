'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { PageHero } from '@/components/ui/PageHero';
import { Button } from '@/components/ui/Button';
import {
  DEFAULT_INDIA_CENTER,
  searchIndianLocations,
  reverseGeocodeCoordinates,
  getCurrentBrowserLocation,
} from '@/lib/location';
import { getFarmerProfile, saveFarmerProfile } from '@/lib/farmerService';
import { GeocodedLocation } from '@/types/farmer';
import {
  MapPin,
  Search,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Map as MapIcon,
  X,
  Compass,
} from 'lucide-react';

// Dynamic import of FarmMap to avoid SSR window/Leaflet crashes
const FarmMap = dynamic(
  () => import('@/components/map/FarmMap').then((mod) => mod.FarmMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[460px] w-full rounded-3xl bg-[#EEF5E8] flex items-center justify-center text-[#3F7D3A] font-bold text-sm">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading Interactive Map...
      </div>
    ),
  }
);

export default function FarmLocationPage() {
  const [selectedLocation, setSelectedLocation] = useState<GeocodedLocation>(DEFAULT_INDIA_CENTER);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodedLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Load existing saved location from profile if available
  useEffect(() => {
    const profile = getFarmerProfile();
    if (profile.latitude && profile.longitude) {
      setSelectedLocation({
        latitude: profile.latitude,
        longitude: profile.longitude,
        accuracy: profile.accuracy,
        formattedAddress: profile.formattedAddress || `${profile.village}, ${profile.district}, ${profile.state}`,
        village: profile.village,
        locality: profile.locality || profile.village,
        postOffice: profile.postOffice,
        pinCode: profile.pincode || '',
        tehsil: profile.tehsil || profile.subDistrict || profile.district,
        taluka: profile.taluka || profile.tehsil,
        subDistrict: profile.subDistrict || profile.tehsil,
        district: profile.district,
        state: profile.state,
        country: profile.country || 'India',
      });
    }
  }, []);

  // Debounced search query handler
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchIndianLocations(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle map click or marker drag location selection
  const handleMapLocationSelect = async (lat: number, lng: number) => {
    setIsSearching(true);
    setGeoError(null);
    const geocoded = await reverseGeocodeCoordinates(lat, lng, selectedLocation.accuracy);
    setSelectedLocation(geocoded);
    setIsSearching(false);
  };

  // Handle selecting a location from search dropdown
  const handleSearchResultSelect = (location: GeocodedLocation) => {
    setSelectedLocation(location);
    setSearchResults([]);
    setSearchQuery('');
  };

  // Browser Geolocation button handler (Option A)
  const handleUseCurrentLocation = async () => {
    setGeoLoading(true);
    setGeoError(null);
    try {
      const coords = await getCurrentBrowserLocation();
      const geocoded = await reverseGeocodeCoordinates(
        coords.latitude,
        coords.longitude,
        coords.accuracy
      );
      setSelectedLocation(geocoded);
      setGeoLoading(false);
    } catch (err: any) {
      setGeoError(err.message || 'Failed to get device location.');
      setGeoLoading(false);
    }
  };

  // Save confirmed location to farmer profile & localStorage
  const handleConfirmLocation = () => {
    const profile = getFarmerProfile();
    const updatedProfile = {
      ...profile,
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      accuracy: selectedLocation.accuracy,
      formattedAddress: selectedLocation.formattedAddress,
      village: selectedLocation.village || profile.village || 'Farm Village',
      locality: selectedLocation.locality || selectedLocation.village || profile.village,
      postOffice: selectedLocation.postOffice || '',
      pincode: selectedLocation.pinCode || profile.pincode || '',
      tehsil: selectedLocation.tehsil || selectedLocation.subDistrict || profile.district,
      taluka: selectedLocation.taluka || selectedLocation.tehsil,
      subDistrict: selectedLocation.subDistrict || selectedLocation.tehsil,
      district: selectedLocation.district || profile.district || 'Indore',
      state: selectedLocation.state || profile.state || 'Madhya Pradesh',
      country: selectedLocation.country || 'India',
    };

    saveFarmerProfile(updatedProfile);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <main className="min-h-screen bg-[#F8FAF3]">
      <PageHero
        badge="Farm Geocoding & Mapping"
        title="Select Your Farm Location"
        subtitle="Search any Indian village, town, city, tehsil, district, or PIN code, or use device GPS to pinpoint your exact farm coordinates."
        icon={<MapIcon className="w-4 h-4 text-[#3F7D3A]" />}
      />

      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        {/* Controls Panel: Search Box (Option B) & Device GPS (Option A) */}
        <div className="bg-white rounded-3xl p-6 border border-[#3F7D3A]/15 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input Field with Clear (X) Button */}
            <div className="relative w-full md:w-2/3">
              <div className="relative">
                <Search className="w-5 h-5 text-[#667267] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="🔍 Search village, city, district or PIN code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-10 py-3.5 rounded-2xl border border-[#D7E4D1] text-sm focus:outline-none focus:ring-2 focus:ring-[#3F7D3A] bg-[#F8FAF3]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#667267] hover:text-[#285C32]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                {isSearching && !searchQuery && (
                  <Loader2 className="w-4 h-4 text-[#3F7D3A] animate-spin absolute right-4 top-1/2 -translate-y-1/2" />
                )}
              </div>

              {/* Autocomplete Suggestions Dropdown showing Administrative Context */}
              {searchResults.length > 0 && (
                <div className="absolute left-0 right-0 mt-2 bg-white border border-[#D7E4D1] rounded-2xl shadow-xl z-50 max-h-64 overflow-y-auto">
                  <div className="px-4 py-2 text-[10px] font-bold text-[#667267] uppercase tracking-wider border-b border-stone-100 bg-[#F8FAF3]">
                    Search Suggestions ({searchResults.length})
                  </div>
                  {searchResults.map((res, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearchResultSelect(res)}
                      className="w-full text-left px-4 py-3 text-xs border-b border-stone-100 hover:bg-[#EEF5E8] transition-colors flex items-start gap-3 text-[#285C32]"
                    >
                      <MapPin className="w-4 h-4 text-[#3F7D3A] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-sm text-[#285C32]">
                          {res.village || res.locality || res.city || 'Location Result'}
                        </div>
                        <div className="text-[11px] text-[#667267]">
                          {[res.tehsil, res.district, res.state, res.pinCode].filter(Boolean).join(', ')}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Device Geolocation Button (Option A) */}
            <Button
              variant="secondary"
              size="md"
              onClick={handleUseCurrentLocation}
              disabled={geoLoading}
              icon={
                geoLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Navigation className="w-4 h-4 text-[#3F7D3A]" />
                )
              }
              className="w-full md:w-auto font-bold shrink-0"
            >
              {geoLoading ? 'Detecting your location...' : '📍 Use My Current Location'}
            </Button>
          </div>

          {/* GPS Accuracy & Permission Error Banners */}
          {geoError && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>{geoError}</span>
            </div>
          )}

          {selectedLocation.accuracy && selectedLocation.accuracy > 100 && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Your location accuracy is low (±{selectedLocation.accuracy}m). Please move to an open area or select your farm location manually on the map.
              </span>
            </div>
          )}
        </div>

        {/* Map & Administrative Details Cards Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Interactive Leaflet Map Column */}
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#285C32] px-1">
              <span className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#3F7D3A]" />
                <span>Click anywhere on map or drag marker to select farm location</span>
              </span>
              <span className="text-[#3F7D3A]">OpenStreetMap India</span>
            </div>

            {/* Leaflet Map Canvas Component */}
            <FarmMap
              latitude={selectedLocation.latitude}
              longitude={selectedLocation.longitude}
              onLocationSelect={handleMapLocationSelect}
              className="h-[490px] w-full"
            />
          </div>

          {/* Selected Administrative Location Hierarchy Card Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-[#3F7D3A]/15 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="font-black text-lg text-[#285C32]">Selected Farm Location</h3>
                {selectedLocation.accuracy && (
                  <span className="px-2.5 py-0.5 bg-[#EEF5E8] text-[#3F7D3A] text-[10px] font-extrabold rounded-full border border-[#DCECCF]">
                    Accuracy: ±{selectedLocation.accuracy}m
                  </span>
                )}
              </div>

              {/* Administrative Parameters Hierarchy Table */}
              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-[#F8FAF3] border border-stone-200">
                  <span className="text-[#667267] font-semibold block">Full Formatted Address</span>
                  <span className="font-extrabold text-[#285C32] block mt-0.5 leading-snug">
                    {selectedLocation.formattedAddress}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-[#F8FAF3] border border-stone-200">
                    <span className="text-[#667267] font-semibold block">Village / Locality</span>
                    <span className="font-bold text-[#285C32] block mt-0.5">
                      {selectedLocation.village || selectedLocation.locality || 'Not specified'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F8FAF3] border border-stone-200">
                    <span className="text-[#667267] font-semibold block">Tehsil / Sub-district</span>
                    <span className="font-bold text-[#285C32] block mt-0.5">
                      {selectedLocation.tehsil || selectedLocation.district || 'Huzur'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-[#F8FAF3] border border-stone-200">
                    <span className="text-[#667267] font-semibold block">District</span>
                    <span className="font-bold text-[#285C32] block mt-0.5">
                      {selectedLocation.district || 'Indore'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F8FAF3] border border-stone-200">
                    <span className="text-[#667267] font-semibold block">State</span>
                    <span className="font-bold text-[#285C32] block mt-0.5">
                      {selectedLocation.state || 'Madhya Pradesh'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-[#F8FAF3] border border-stone-200">
                    <span className="text-[#667267] font-semibold block">PIN Code</span>
                    <span className="font-mono font-bold text-[#285C32] block mt-0.5">
                      {selectedLocation.pinCode || '452001'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F8FAF3] border border-stone-200">
                    <span className="text-[#667267] font-semibold block">Country</span>
                    <span className="font-bold text-[#285C32] block mt-0.5">
                      {selectedLocation.country || 'India'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2.5 rounded-xl bg-[#EEF5E8] border border-[#DCECCF]">
                    <span className="text-[#3F7D3A] font-semibold block">Latitude</span>
                    <span className="font-mono font-bold text-[#285C32] block mt-0.5">
                      {selectedLocation.latitude.toFixed(6)}° N
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#EEF5E8] border border-[#DCECCF]">
                    <span className="text-[#3F7D3A] font-semibold block">Longitude</span>
                    <span className="font-mono font-bold text-[#285C32] block mt-0.5">
                      {selectedLocation.longitude.toFixed(6)}° E
                    </span>
                  </div>
                </div>
              </div>

              {/* Confirmation Action Button */}
              <Button
                variant="primary"
                size="lg"
                onClick={handleConfirmLocation}
                className="w-full font-bold"
                icon={<CheckCircle2 className="w-5 h-5" />}
              >
                Confirm Farm Location
              </Button>

              {/* Saved Success Notification */}
              {savedSuccess && (
                <div className="p-3.5 rounded-xl bg-[#EEF5E8] border border-[#DCECCF] text-xs text-[#3F7D3A] font-bold flex items-center gap-2 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-4 h-4 text-[#3F7D3A]" />
                  <span>Farm location saved to profile!</span>
                </div>
              )}
            </div>

            {/* Consuming Features Integration Banner */}
            <div className="p-5 rounded-2xl bg-[#FFF8E8] border border-[#E8B94A]/30 space-y-2 text-xs text-[#667267]">
              <div className="font-bold text-[#285C32] flex items-center gap-1.5 text-sm">
                <MapPin className="w-4 h-4 text-[#3F7D3A]" />
                <span>Central Location Source:</span>
              </div>
              <p className="leading-relaxed">
                Saved coordinates (latitude & longitude) directly power weather forecasts, rainfall telemetry, crop suitability calculations, and farming advisories.
              </p>
              <div className="pt-2">
                <Link href="/app/dashboard" className="text-[#3F7D3A] font-bold flex items-center gap-1 hover:underline">
                  <span>Go to Farmer Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
