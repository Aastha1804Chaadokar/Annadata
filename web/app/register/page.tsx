'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { register } from '@/lib/authService';
import { Button } from '@/components/ui/Button';
import { INDIAN_STATES } from '@/lib/constants';
import { 
  Sprout, 
  User, 
  Phone, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Globe, 
  MapPin, 
  CheckCircle2 
} from 'lucide-react';

export default function RegisterPage() {
  const { t } = useTranslation();
  const router = useRouter();
  
  const [name, setName] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [language, setLanguage] = useState<string>('hi');
  const [state, setState] = useState<string>('Madhya Pradesh');
  const [district, setDistrict] = useState<string>('');
  
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDuplicateAccount, setIsDuplicateAccount] = useState<boolean>(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsDuplicateAccount(false);

    const cleanName = name.trim();
    const cleanMobile = mobile.replace(/\D/g, '').trim();
    const cleanPassword = password.trim();
    const cleanConfirmPassword = confirmPassword.trim();

    if (!cleanName) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!cleanMobile) {
      setErrorMessage('Please enter your mobile number.');
      return;
    }

    if (cleanMobile.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!cleanPassword) {
      setErrorMessage('Please enter a password.');
      return;
    }

    if (cleanPassword.length < 4) {
      setErrorMessage('Password must be at least 4 characters.');
      return;
    }

    if (cleanPassword !== cleanConfirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);

    const res = await register(cleanName, cleanMobile, cleanPassword, {
      language,
      state,
      district,
    });

    if (res.success) {
      router.replace('/app/onboarding');
    } else {
      const errMsg = res.error || 'Registration failed. Please try again.';
      setErrorMessage(errMsg);
      if (errMsg.toLowerCase().includes('already exists')) {
        setIsDuplicateAccount(true);
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF3] flex flex-col pt-24 sm:pt-28 pb-12">
      <main className="flex-1 flex items-center justify-center py-6 px-4">
        <div className="max-w-xl w-full">
          {/* Card Header */}
          <div className="text-center mb-8 space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EEF5E8] border border-[#DCECCF] text-[#3F7D3A] text-xs font-bold">
              <Sprout className="w-4 h-4" />
              <span>{t('auth.registerTitle', 'Farmer Registration')}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#285C32]">
              {t('navbar.register', 'Create Account')}
            </h1>
            <p className="text-xs sm:text-sm text-[#667267]">
              {t('auth.registerSubtitle', 'Join Annadata to access smart farm guidance and soil intelligence.')}
            </p>
          </div>

          {/* Form Card */}
          <form
            onSubmit={handleRegister}
            autoComplete="off"
            className="bg-white rounded-3xl p-6 sm:p-8 border border-[#3F7D3A]/15 shadow-sm space-y-5"
          >
            {/* Error / Duplicate Mobile Alert */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs font-bold text-red-700 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
                {isDuplicateAccount && (
                  <div className="pt-2">
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#285C32] text-white text-xs font-black shadow hover:bg-[#1b4332] transition-colors"
                    >
                      <span>Go to Login</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Row 1: Full Name & Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#285C32]">
                  {t('auth.fullName', 'Full Name')} *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#667267] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    autoComplete="off"
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D7E4D1] text-sm focus:outline-none focus:ring-2 focus:ring-[#3F7D3A] text-[#173F2A] placeholder:text-stone-400"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#285C32]">
                  {t('auth.mobileNumber', 'Mobile Number')} *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#667267] absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    required
                    autoComplete="off"
                    placeholder="Enter 10-digit mobile number"
                    value={mobile}
                    maxLength={10}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D7E4D1] text-sm focus:outline-none focus:ring-2 focus:ring-[#3F7D3A] text-[#173F2A] placeholder:text-stone-400"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#285C32]">
                  {t('auth.password', 'Password')} *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#667267] absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    placeholder="Create a password (min 4 chars)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-11 py-3 rounded-xl border border-[#D7E4D1] text-sm focus:outline-none focus:ring-2 focus:ring-[#3F7D3A] text-[#173F2A] placeholder:text-stone-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-[#667267] hover:text-[#285C32] focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#285C32]">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#667267] absolute left-3.5 top-3.5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-11 py-3 rounded-xl border border-[#D7E4D1] text-sm focus:outline-none focus:ring-2 focus:ring-[#3F7D3A] text-[#173F2A] placeholder:text-stone-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-3.5 text-[#667267] hover:text-[#285C32] focus:outline-none"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Row 3: Language & State */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Language */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#285C32]">
                  Preferred Language *
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-[#667267] absolute left-3.5 top-3.5" />
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D7E4D1] text-sm focus:outline-none focus:ring-2 focus:ring-[#3F7D3A] text-[#173F2A] bg-white cursor-pointer"
                  >
                    <option value="hi">हिन्दी (Hindi)</option>
                    <option value="en">English</option>
                    <option value="mr">मराठी (Marathi)</option>
                    <option value="ta">தமிழ் (Tamil)</option>
                    <option value="te">తెలుగు (Telugu)</option>
                    <option value="kn">ಕನ್ನಡ (Kannada)</option>
                    <option value="bn">বাংলা (Bengali)</option>
                  </select>
                </div>
              </div>

              {/* State */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#285C32]">
                  State *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#667267] absolute left-3.5 top-3.5" />
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D7E4D1] text-sm focus:outline-none focus:ring-2 focus:ring-[#3F7D3A] text-[#173F2A] bg-white cursor-pointer"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* District */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#285C32]">
                District
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[#667267] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  autoComplete="off"
                  placeholder="e.g. Bhopal, Indore, Nashik, etc."
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D7E4D1] text-sm focus:outline-none focus:ring-2 focus:ring-[#3F7D3A] text-[#173F2A] placeholder:text-stone-400"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isLoading || !name.trim() || !mobile.trim() || !password.trim() || !confirmPassword.trim()}
              className="w-full justify-center"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {isLoading ? t('common.loading', 'Creating Account...') : t('auth.submitRegister', 'Create Account & Continue')}
            </Button>

            {/* Bottom Login Prompt */}
            <div className="pt-4 border-t border-stone-100 text-center text-xs text-[#667267]">
              <span>{t('auth.haveAccount', 'Already have an account?')} </span>
              <Link href="/login" className="font-bold text-[#3F7D3A] hover:underline">
                {t('navbar.login', 'Login')}
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
