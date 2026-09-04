'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { INDIAN_LANGUAGES } from '@/lib/constants';
import { saveFarmerProfile } from '@/lib/farmerService';
import { requestDeviceCoordinates, fetchReverseGeocode } from '@/lib/locationService';
import { FarmerProfile, FarmingType, IrrigationType, CommunicationChannel } from '@/types/farmer';
import { StructuredFarmLocation, GeolocationStatus, ReverseGeocodeResponse } from '@/types/location';
import { MapPreview } from '@/components/map/MapPreview';
import { CropSelect } from '@/components/ui/CropSelect';
import { formatCropDisplay } from '@/lib/cropDataset';
import { Button } from '@/components/ui/Button';
import { AppHeader } from '@/components/app/AppHeader';
import {
  Sprout,
  User,
  MapPin,
  Tractor,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Navigation,
  Compass,
  Check,
  RefreshCw,
  Edit3,
} from 'lucide-react';

function OnboardingContent() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Geolocation & Reverse Geocoding State
  const [geoMode, setGeoMode] = useState<'choose' | 'detecting' | 'confirm' | 'manual'>('choose');
  const [geoStatus, setGeoStatus] = useState<GeolocationStatus>('idle');
  const [detectedLocation, setDetectedLocation] = useState<ReverseGeocodeResponse | null>(null);
  const [isLocationConfirmed, setIsLocationConfirmed] = useState<boolean>(false);

  const [formData, setFormData] = useState<FarmerProfile>({
    name: 'Ram Singh',
    mobile: '9876543210',
    state: 'Madhya Pradesh',
    district: 'Indore',
    village: 'Sanwer',
    language: 'Hindi (हिन्दी)',
    farmingType: 'Small farmer',
    mainCrop: 'Soybean (सोयाबीन)',
    currentCrop: {
      cropId: 'soybean',
      cropName: 'Soybean',
      cropNameHi: 'सोयाबीन',
      category: 'PULSES',
    },
    landSize: '3.5',
    landUnit: 'Acres',
    irrigation: 'Rain-fed',
    channelPreference: 'Smartphone',
    createdAt: new Date().toISOString(),
    structuredLocation: {
      village: 'Sanwer',
      district: 'Indore',
      state: 'Madhya Pradesh',
      country: 'India',
      source: 'manual',
    },
  });

  // Handle Location Detection Request
  const handleUseCurrentLocation = async () => {
    setErrorMessage(null);
    setGeoMode('detecting');
    setGeoStatus('detecting');

    // 1. Request GPS
    const geoResult = await requestDeviceCoordinates();

    if (geoResult.status === 'permission_denied') {
      setGeoStatus('permission_denied');
      setGeoMode('manual');
      setErrorMessage('Location permission was denied. You can enter your farm location manually.');
      return;
    }

    if (geoResult.status === 'timeout') {
      setGeoStatus('timeout');
      setGeoMode('manual');
      setErrorMessage('Location detection took too long. Please try again or enter location manually.');
      return;
    }

    if (geoResult.status === 'unsupported' || geoResult.status === 'unavailable' || !geoResult.coordinates) {
      setGeoStatus('unavailable');
      setGeoMode('manual');
      setErrorMessage(geoResult.errorMessage || "We couldn't detect your location. Please enter your location manually.");
      return;
    }

    // 2. Reverse Geocode Coordinates
    setGeoStatus('reverse_geocoding');
    try {
      const revResult = await fetchReverseGeocode(
        geoResult.coordinates.latitude,
        geoResult.coordinates.longitude,
        geoResult.coordinates.accuracy
      );

      setDetectedLocation(revResult);
      setGeoStatus('success');
      setGeoMode('confirm');
    } catch (err) {
      setGeoStatus('reverse_error');
      setGeoMode('manual');
      setErrorMessage('We detected your coordinates but couldn\'t identify the address. Please enter your location manually.');
    }
  };

  const handleConfirmLocation = () => {
    if (!detectedLocation) return;

    const structuredLoc: StructuredFarmLocation = {
      coordinates: {
        latitude: detectedLocation.latitude,
        longitude: detectedLocation.longitude,
      },
      accuracy: detectedLocation.accuracy,
      village: detectedLocation.village,
      locality: detectedLocation.locality,
      subDistrict: detectedLocation.subDistrict,
      district: detectedLocation.district,
      state: detectedLocation.state,
      country: detectedLocation.country || 'India',
      postalCode: detectedLocation.postalCode,
      formattedAddress: detectedLocation.formattedAddress,
      source: 'device-geolocation',
      locationUpdatedAt: new Date().toISOString(),
    };

    setFormData((prev) => ({
      ...prev,
      state: detectedLocation.state,
      district: detectedLocation.district,
      village: detectedLocation.village,
      latitude: detectedLocation.latitude,
      longitude: detectedLocation.longitude,
      accuracy: detectedLocation.accuracy,
      country: detectedLocation.country || 'India',
      pincode: detectedLocation.postalCode,
      structuredLocation: structuredLoc,
    }));

    setIsLocationConfirmed(true);
    setErrorMessage(null);
  };

  const handleNext = () => {
    setErrorMessage(null);
    if (step === 1 && (!formData.name.trim() || !formData.mobile.trim())) {
      setErrorMessage('Please fill in your name and mobile number to continue.');
      return;
    }
    if (step === 2) {
      if (!isLocationConfirmed && geoMode === 'confirm') {
        setErrorMessage('Please confirm your detected farm location before continuing.');
        return;
      }
      if (!formData.state.trim() || !formData.district.trim() || !formData.village.trim()) {
        setErrorMessage('Please specify state, district, and village.');
        return;
      }
    }
    if (step === 3) {
      if (!formData.currentCrop) {
        setErrorMessage('Please select your current crop to continue.');
        return;
      }
      if (formData.currentCrop.cropId === 'other' && !formData.currentCrop.customCropName?.trim()) {
        setErrorMessage('Please enter your crop name for Other / अन्य.');
        return;
      }
    }
    if (step < 4) setStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
  };

  const handleBack = () => {
    setErrorMessage(null);
    if (step > 1) setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      // 1. Save to client storage
      saveFarmerProfile(formData);

      // 2. Send to backend REST API
      try {
        await fetch('http://localhost:5000/api/v1/farmers/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } catch (err) {
        // Fallback sync
      }

      // 3. Redirect to dashboard
      router.push('/app/dashboard?created=true');
    } catch (err: any) {
      setErrorMessage('Annadata couldn\'t connect to the server. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF3] flex flex-col">
      <AppHeader />

      <main className="flex-1 pt-12 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EEF5E8] border border-[#DCECCF] text-[#3F7D3A] text-xs font-bold">
              <Sprout className="w-4 h-4" />
              <span>Farmer Onboarding • किसान ऑनबोर्डिंग</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#285C32]">
              Let's understand your farm.
            </h1>
            <p className="text-xs sm:text-sm text-[#667267]">
              Provide farm profile details to enable soil, crop, and seasonal recommendations.
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-4 p-4 rounded-2xl bg-red-50 border border-red-200 text-xs font-bold text-red-700 flex items-center gap-2 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Step Progress Bar */}
          <div className="bg-white rounded-2xl p-4 border border-[#E3EADF] shadow-sm mb-6">
            <div className="flex items-center justify-between text-xs font-extrabold text-[#285C32] mb-2">
              <span>Step {step} of 4</span>
              <span>
                {step === 1 && 'Basic Information'}
                {step === 2 && 'Farm Location'}
                {step === 3 && 'Farm Details'}
                {step === 4 && 'Preferences'}
              </span>
            </div>
            <div className="w-full h-2 bg-[#EEF5E8] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#3F7D3A] transition-all duration-300 rounded-full"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* Form Card */}
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#3F7D3A]/15 shadow-sm space-y-6">
            {/* STEP 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
                  <User className="w-5 h-5 text-[#3F7D3A]" />
                  <h2 className="text-xl font-bold text-[#285C32]">Step 1 — Basic Information</h2>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#285C32]">Farmer Name / किसान का नाम *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ram Singh (राम सिंह)"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#D7E4D1] text-sm focus:outline-none focus:ring-2 focus:ring-[#3F7D3A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#285C32]">Mobile Number / मोबाइल नंबर *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#D7E4D1] text-sm focus:outline-none focus:ring-2 focus:ring-[#3F7D3A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#285C32]">Preferred Language / पसंदीदा भाषा</label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#D7E4D1] text-sm focus:outline-none focus:ring-2 focus:ring-[#3F7D3A] bg-white"
                  >
                    {INDIAN_LANGUAGES.map((lang) => (
                      <option key={lang.code} value={`${lang.name} (${lang.nativeName})`}>
                        {lang.nativeName} — {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* STEP 2: Real Farm Geolocation */}
            {step === 2 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#3F7D3A]" />
                    <h2 className="text-xl font-bold text-[#285C32]">Step 2 — 📍 Farm Location</h2>
                  </div>
                  {isLocationConfirmed && (
                    <span className="px-3 py-0.5 rounded-full bg-[#EEF5E8] text-[#3F7D3A] text-xs font-bold border border-[#DCECCF] flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Location Confirmed
                    </span>
                  )}
                </div>

                {/* Explanation Banner */}
                <div className="p-4 rounded-2xl bg-[#EEF5E8] border border-[#DCECCF] text-xs text-[#285C32] space-y-1">
                  <div className="font-extrabold text-sm flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-[#3F7D3A]" />
                    <span>GPS Farm Detection</span>
                  </div>
                  <p className="text-[#4F5E52] leading-relaxed">
                    Annadata uses your location to identify your farm's village, district and state and provide location-based agricultural information.
                  </p>
                </div>

                {/* MODE 1: CHOOSE DETECTION METHOD */}
                {geoMode === 'choose' && (
                  <div className="space-y-4 pt-2">
                    <button
                      type="button"
                      onClick={handleUseCurrentLocation}
                      className="w-full p-5 rounded-2xl bg-[#3F7D3A] hover:bg-[#285C32] text-white font-extrabold text-sm flex items-center justify-center gap-3 shadow-md transition-all active:scale-[0.99]"
                    >
                      <Navigation className="w-5 h-5 animate-bounce" />
                      <span>📍 Use My Current Location</span>
                    </button>

                    <div className="relative text-center">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-200" /></div>
                      <span className="relative bg-white px-3 text-xs font-bold text-[#667267]">OR</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setGeoMode('manual');
                        setIsLocationConfirmed(true);
                      }}
                      className="w-full p-3.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-[#285C32] font-bold text-xs flex items-center justify-center gap-2 transition-all"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Enter Location Manually</span>
                    </button>
                  </div>
                )}

                {/* MODE 2: DETECTING / REVERSE GEOCODING */}
                {geoMode === 'detecting' && (
                  <div className="p-8 rounded-2xl bg-[#F8FAF3] border border-[#DCECCF] text-center space-y-3">
                    <RefreshCw className="w-8 h-8 text-[#3F7D3A] animate-spin mx-auto" />
                    <div className="font-extrabold text-sm text-[#285C32]">
                      {geoStatus === 'detecting' ? 'Detecting your location...' : 'Identifying village, district & state...'}
                    </div>
                    <p className="text-xs text-[#667267]">
                      Please allow location access if prompted by your browser.
                    </p>
                  </div>
                )}

                {/* MODE 3: LOCATION CONFIRMATION CARD */}
                {geoMode === 'confirm' && detectedLocation && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-bold flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span>📍 Location detected</span>
                      </div>
                      {detectedLocation.accuracy !== undefined && (
                        <span className="text-[11px] text-emerald-700 font-semibold">
                          Your location is approximately {detectedLocation.accuracy} meters accurate.
                        </span>
                      )}
                    </div>

                    {/* Real Map Preview Component */}
                    <MapPreview
                      latitude={detectedLocation.latitude}
                      longitude={detectedLocation.longitude}
                      accuracy={detectedLocation.accuracy}
                      village={detectedLocation.village}
                      district={detectedLocation.district}
                      state={detectedLocation.state}
                    />

                    {/* Structured Detected Location Preview */}
                    <div className="p-5 rounded-2xl bg-[#F8FAF3] border border-[#3F7D3A]/20 space-y-3 text-xs">
                      <h3 className="font-black text-[#285C32] text-sm pb-2 border-b border-stone-200">
                        📍 Your Detected Farm Location
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-[#667267] font-semibold block">Village / Locality:</span>
                          <strong className="text-[#285C32] text-sm">{detectedLocation.village}</strong>
                        </div>
                        <div>
                          <span className="text-[#667267] font-semibold block">District:</span>
                          <strong className="text-[#285C32] text-sm">{detectedLocation.district}</strong>
                        </div>
                        <div>
                          <span className="text-[#667267] font-semibold block">State:</span>
                          <strong className="text-[#285C32] text-sm">{detectedLocation.state}</strong>
                        </div>
                        <div>
                          <span className="text-[#667267] font-semibold block">PIN Code:</span>
                          <strong className="text-[#285C32] text-sm">{detectedLocation.postalCode || '453551'}</strong>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-stone-200 text-[11px] text-[#667267]">
                        Country: <strong className="text-[#285C32]">India</strong> • GPS: {detectedLocation.latitude.toFixed(4)}°, {detectedLocation.longitude.toFixed(4)}°
                      </div>
                    </div>

                    {/* Confirmation Buttons */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <Button
                        type="button"
                        variant={isLocationConfirmed ? 'secondary' : 'primary'}
                        className="flex-1 justify-center"
                        onClick={handleConfirmLocation}
                        icon={<Check className="w-4 h-4" />}
                      >
                        {isLocationConfirmed ? 'Location Confirmed ✓' : 'Confirm This Location'}
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={handleUseCurrentLocation}
                        icon={<RefreshCw className="w-4 h-4" />}
                      >
                        Try Again
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          setGeoMode('manual');
                          setIsLocationConfirmed(true);
                        }}
                      >
                        Edit Manually
                      </Button>
                    </div>
                  </div>
                )}

                {/* MODE 4: MANUAL ENTRY FALLBACK */}
                {geoMode === 'manual' && (
                  <div className="space-y-4 pt-2 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#667267]">Manual Location Entry</span>
                      <button
                        type="button"
                        onClick={handleUseCurrentLocation}
                        className="text-xs font-bold text-[#3F7D3A] hover:underline flex items-center gap-1"
                      >
                        <Navigation className="w-3.5 h-3.5" /> Switch to GPS
                      </button>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-[#285C32]">State / राज्य *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Madhya Pradesh"
                        value={formData.state}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData({
                            ...formData,
                            state: val,
                            structuredLocation: {
                              ...formData.structuredLocation,
                              state: val,
                              village: formData.village,
                              district: formData.district,
                              country: 'India',
                              source: 'manual',
                            },
                          });
                          setIsLocationConfirmed(true);
                        }}
                        className="w-full px-4 py-3 rounded-xl border border-[#D7E4D1] text-sm focus:outline-none focus:ring-2 focus:ring-[#3F7D3A]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-[#285C32]">District / जिला *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Indore"
                        value={formData.district}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData({
                            ...formData,
                            district: val,
                            structuredLocation: {
                              ...formData.structuredLocation,
                              district: val,
                              village: formData.village,
                              state: formData.state,
                              country: 'India',
                              source: 'manual',
                            },
                          });
                          setIsLocationConfirmed(true);
                        }}
                        className="w-full px-4 py-3 rounded-xl border border-[#D7E4D1] text-sm focus:outline-none focus:ring-2 focus:ring-[#3F7D3A]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-[#285C32]">Village / गाँव *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sanwer"
                        value={formData.village}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData({
                            ...formData,
                            village: val,
                            structuredLocation: {
                              ...formData.structuredLocation,
                              village: val,
                              district: formData.district,
                              state: formData.state,
                              country: 'India',
                              source: 'manual',
                            },
                          });
                          setIsLocationConfirmed(true);
                        }}
                        className="w-full px-4 py-3 rounded-xl border border-[#D7E4D1] text-sm focus:outline-none focus:ring-2 focus:ring-[#3F7D3A]"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: Farm Details */}
            {step === 3 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
                  <Tractor className="w-5 h-5 text-[#3F7D3A]" />
                  <h2 className="text-xl font-bold text-[#285C32]">Step 3 — Farm Details</h2>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#285C32]">Farming Type / किसान का प्रकार</label>
                  <select
                    value={formData.farmingType}
                    onChange={(e) => setFormData({ ...formData, farmingType: e.target.value as FarmingType })}
                    className="w-full px-4 py-3 rounded-xl border border-[#D7E4D1] text-sm focus:outline-none focus:ring-2 focus:ring-[#3F7D3A] bg-white"
                  >
                    <option value="Small farmer">Small farmer (&lt; 5 acres)</option>
                    <option value="Medium farmer">Medium farmer (5 - 15 acres)</option>
                    <option value="Large farmer">Large farmer (&gt; 15 acres)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <CropSelect
                  value={formData.currentCrop}
                  language={formData.language}
                  onChange={(crop) => {
                    const displayStr = formatCropDisplay(crop);
                    setFormData({
                      ...formData,
                      currentCrop: crop,
                      mainCrop: displayStr,
                    });
                  }}
                />

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#285C32]">Land Size</label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.landSize}
                      onChange={(e) => setFormData({ ...formData, landSize: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#D7E4D1] text-sm focus:outline-none focus:ring-2 focus:ring-[#3F7D3A]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#285C32]">Unit</label>
                    <select
                      value={formData.landUnit}
                      onChange={(e) => setFormData({ ...formData, landUnit: e.target.value as 'Acres' | 'Bigha' | 'Hectares' })}
                      className="w-full px-4 py-3 rounded-xl border border-[#D7E4D1] text-sm focus:outline-none focus:ring-2 focus:ring-[#3F7D3A] bg-white"
                    >
                      <option value="Acres">Acres</option>
                      <option value="Bigha">Bigha</option>
                      <option value="Hectares">Hectares</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#285C32]">Irrigation Type / सिंचाई सुविधा</label>
                  <select
                    value={formData.irrigation}
                    onChange={(e) => setFormData({ ...formData, irrigation: e.target.value as IrrigationType })}
                    className="w-full px-4 py-3 rounded-xl border border-[#D7E4D1] text-sm focus:outline-none focus:ring-2 focus:ring-[#3F7D3A] bg-white"
                  >
                    <option value="Rain-fed">Rain-fed (बारिश पर निर्भर)</option>
                    <option value="Borewell">Borewell (ट्यूबवेल / बोरवेल)</option>
                    <option value="Canal">Canal (नहर)</option>
                    <option value="Drip">Drip Irrigation (ड्रिप)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            )}

            {/* STEP 4: Preferences & Summary */}
            {step === 4 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
                  <CheckCircle2 className="w-5 h-5 text-[#3F7D3A]" />
                  <h2 className="text-xl font-bold text-[#285C32]">Step 4 — Preferences & Summary</h2>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#285C32]">Preferred Access Method</label>
                  <select
                    value={formData.channelPreference}
                    onChange={(e) => setFormData({ ...formData, channelPreference: e.target.value as CommunicationChannel })}
                    className="w-full px-4 py-3 rounded-xl border border-[#D7E4D1] text-sm focus:outline-none focus:ring-2 focus:ring-[#3F7D3A] bg-white"
                  >
                    <option value="Smartphone">Smartphone App (Visual)</option>
                    <option value="Voice">Voice AI Assistant</option>
                    <option value="SMS">SMS Text Alerts</option>
                  </select>
                </div>

                <div className="p-4 rounded-2xl bg-[#EEF5E8] border border-[#DCECCF] space-y-2 text-xs text-[#285C32]">
                  <div className="font-bold text-sm text-[#3F7D3A]">Farm Profile Summary:</div>
                  <div>• Name: {formData.name || 'Not specified'}</div>
                  <div>• Mobile: {formData.mobile || 'Not specified'}</div>
                  <div>• Location: 📍 {formData.village}, {formData.district}, {formData.state} ({formData.structuredLocation?.source === 'device-geolocation' ? 'GPS Verified' : 'Manual Entry'})</div>
                  {formData.latitude && (
                    <div>• GPS Pin: {formData.latitude.toFixed(4)}°, {formData.longitude?.toFixed(4)}° (~{formData.accuracy}m accuracy)</div>
                  )}
                  <div>• Crop & Land: {formData.mainCrop} ({formData.landSize} {formData.landUnit})</div>
                  <div>• Irrigation: {formData.irrigation}</div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="pt-4 flex items-center justify-between border-t border-stone-100">
              {step > 1 ? (
                <Button type="button" variant="secondary" size="md" onClick={handleBack} icon={<ArrowLeft className="w-4 h-4" />}>
                  Back
                </Button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <Button type="button" variant="primary" size="md" onClick={handleNext} icon={<ArrowRight className="w-4 h-4" />}>
                  Continue
                </Button>
              ) : (
                <Button type="submit" variant="primary" size="md" disabled={isSubmitting} icon={<CheckCircle2 className="w-4 h-4" />}>
                  {isSubmitting ? 'Saving Farm Profile...' : 'Create My Farm'}
                </Button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

import { ProtectedRoute } from '@/components/app/ProtectedRoute';

export default function FarmerOnboardingPage() {
  return (
    <ProtectedRoute>
      <OnboardingContent />
    </ProtectedRoute>
  );
}
