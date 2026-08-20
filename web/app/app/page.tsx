'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { INDIAN_LANGUAGES } from '@/lib/constants';
import { saveFarmerProfile } from '@/lib/farmerService';
import { FarmerProfile, FarmingType, IrrigationType, CommunicationChannel } from '@/types/farmer';
import { Button } from '@/components/ui/Button';
import { Sprout, User, MapPin, Tractor, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [formData, setFormData] = useState<FarmerProfile>({
    name: '',
    mobile: '',
    state: 'Madhya Pradesh',
    district: 'Indore',
    village: 'Sanwer',
    language: 'Hindi (हिन्दी)',
    farmingType: 'Small farmer',
    mainCrop: 'Soybean (सोयाबीन)',
    landSize: '3.5',
    landUnit: 'Acres',
    irrigation: 'Rain-fed',
    channelPreference: 'Smartphone',
    createdAt: new Date().toISOString(),
  });

  const handleNext = () => {
    if (step < 4) setStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
  };

  const handleBack = () => {
    if (step > 1) setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveFarmerProfile(formData);
    router.push('/app/dashboard');
  };

  return (
    <main className="min-h-screen bg-[#F8FAF3] pt-28 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Onboarding Container Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EEF5E8] border border-[#DCECCF] text-[#3F7D3A] text-xs font-bold">
            <Sprout className="w-4 h-4" />
            <span>Welcome to Annadata • किसान ऑनबोर्डिंग</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#285C32]">
            Let's understand your farm.
          </h1>
          <p className="text-xs sm:text-sm text-[#667267]">
            Provide basic farm profile details to receive personalized soil, crop, and weather guidance.
          </p>
        </div>

        {/* Step Progress Bar */}
        <div className="bg-white rounded-2xl p-4 border border-[#E3EADF] shadow-sm mb-6">
          <div className="flex items-center justify-between text-xs font-extrabold text-[#285C32] mb-2">
            <span>Step {step} of 4</span>
            <span>
              {step === 1 && 'Basic Info'}
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

        {/* Multi-Step Form Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#3F7D3A]/15 shadow-sm space-y-6">
          {/* STEP 1: Basic Information */}
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

          {/* STEP 2: Farm Location */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
                <MapPin className="w-5 h-5 text-[#3F7D3A]" />
                <h2 className="text-xl font-bold text-[#285C32]">Step 2 — Farm Location</h2>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#285C32]">State / राज्य *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Madhya Pradesh"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#D7E4D1] text-sm focus:outline-none focus:ring-2 focus:ring-[#3F7D3A]"
                />
              </div>
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

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#285C32]">Main Crop / मुख्य फसल</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Soybean (सोयाबीन) or Wheat (गेहूँ)"
                  value={formData.mainCrop}
                  onChange={(e) => setFormData({ ...formData, mainCrop: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#D7E4D1] text-sm focus:outline-none focus:ring-2 focus:ring-[#3F7D3A]"
                />
              </div>

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

          {/* STEP 4: Preferences */}
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

              {/* Onboarding Summary Box */}
              <div className="p-4 rounded-2xl bg-[#EEF5E8] border border-[#DCECCF] space-y-2 text-xs text-[#285C32]">
                <div className="font-bold text-sm text-[#3F7D3A]">Farm Profile Summary:</div>
                <div>• Name: {formData.name || 'Not specified'}</div>
                <div>• Mobile: {formData.mobile || 'Not specified'}</div>
                <div>• Location: {formData.village}, {formData.district}, {formData.state}</div>
                <div>• Crop & Land: {formData.mainCrop} ({formData.landSize} {formData.landUnit})</div>
                <div>• Irrigation: {formData.irrigation}</div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
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
              <Button type="submit" variant="primary" size="md" icon={<CheckCircle2 className="w-4 h-4" />}>
                Create My Farm
              </Button>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
