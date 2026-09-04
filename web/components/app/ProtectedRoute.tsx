'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated, getAuthUser } from '@/lib/authService';
import { getFarmerProfile } from '@/lib/farmerService';
import { Sprout, Lock, ArrowRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  const checkAuth = () => {
    // Check if token exists or local farmer profile is stored
    const authed = isAuthenticated();
    const profile = getFarmerProfile();
    const user = getAuthUser();

    if (authed || profile || user) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
      // Initiate redirection to login after slight delay for smooth UI
      setTimeout(() => {
        router.replace('/login');
      }, 800);
    }
  };

  useEffect(() => {
    checkAuth();

    const handlePageShow = () => {
      checkAuth();
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [router]);

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-[#F8FAF3] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-[#EEF5E8] flex items-center justify-center text-[#173F2A] animate-pulse">
          <Sprout className="w-7 h-7 text-[#3F7D3A]" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-black text-[#173F2A]">Annadata Farmer Portal</h3>
          <p className="text-xs text-[#5F6F62] flex items-center justify-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#3F7D3A]" />
            <span>Loading your farm profile & telemetry...</span>
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#F8FAF3] flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
          <Lock className="w-8 h-8" />
        </div>
        <div className="max-w-md space-y-2">
          <h2 className="text-2xl font-black text-[#173F2A]">Farmer Login Required</h2>
          <p className="text-xs sm:text-sm text-[#5F6F62] leading-relaxed">
            To view your farm dashboard, soil health records, and personalized crop recommendations, please sign in with your registered mobile number.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/login">
            <Button variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
              Go to Farmer Login
            </Button>
          </Link>
          <Link href="/">
            <Button variant="secondary" size="md">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
