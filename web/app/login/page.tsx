'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { login } from '@/lib/authService';
import { hasCompletedOnboarding } from '@/lib/farmerService';
import { Button } from '@/components/ui/Button';
import { Sprout, Phone, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [mobile, setMobile] = useState<string>('9876543210');
  const [password, setPassword] = useState<string>('123456');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    if (!mobile.trim() || mobile.trim().length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      setIsLoading(false);
      return;
    }

    const res = await login(mobile, password);

    if (res.success) {
      if (hasCompletedOnboarding()) {
        router.replace('/app/dashboard');
      } else {
        router.replace('/app/onboarding');
      }
    } else {
      setErrorMessage(res.error || 'Login failed. Please check your credentials.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF3] flex flex-col pt-24 sm:pt-28">
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          {/* Card Header */}
          <div className="text-center mb-8 space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EEF5E8] border border-[#DCECCF] text-[#3F7D3A] text-xs font-bold">
              <Sprout className="w-4 h-4" />
              <span>{t('auth.loginTitle', 'Farmer Login')}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#285C32]">
              {t('auth.welcomeBack', 'Welcome back')}
            </h1>
            <p className="text-xs sm:text-sm text-[#667267]">
              {t('auth.loginSubtitle', 'Login to your farm to view soil health, recommendations, and market intelligence.')}
            </p>
          </div>

          {/* Form Card */}
          <form
            onSubmit={handleLogin}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-[#3F7D3A]/15 shadow-sm space-y-5"
          >
            {/* Error Alert */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs font-bold text-red-700 flex items-center gap-2 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#285C32]">
                {t('auth.mobileNumber', 'Mobile Number')} *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#667267] absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D7E4D1] text-sm focus:outline-none focus:ring-2 focus:ring-[#3F7D3A]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#285C32]">
                {t('auth.password', 'Password')} *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#667267] absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D7E4D1] text-sm focus:outline-none focus:ring-2 focus:ring-[#3F7D3A]"
                />
              </div>
            </div>

            {/* Quick Demo Fill Note */}
            <div className="p-3 rounded-xl bg-[#EEF5E8] border border-[#DCECCF] text-[11px] text-[#285C32]">
              <strong>Demo Account:</strong> Mobile <code className="font-bold">9876543210</code> • Pass <code className="font-bold">123456</code>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isLoading}
              className="w-full justify-center"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {isLoading ? t('common.loading', 'Logging in...') : t('navbar.login', 'Login')}
            </Button>

            <div className="pt-4 border-t border-stone-100 text-center text-xs text-[#667267]">
              <span>{t('auth.noAccount', "Don't have an account?")} </span>
              <Link href="/register" className="font-bold text-[#3F7D3A] hover:underline">
                {t('navbar.register', 'Create Account')}
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
