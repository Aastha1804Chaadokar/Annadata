import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Sprout } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#F8FAF3] flex items-center justify-center pt-24 pb-16 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-[#3F7D3A]/15 text-center shadow-sm space-y-4">
        <div className="p-4 rounded-2xl bg-[#EEF5E8] text-[#3F7D3A] w-fit mx-auto">
          <Sprout className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-[#285C32]">404 — Page Not Found</h1>
        <p className="text-xs text-[#667267]">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="pt-2">
          <Link href="/">
            <Button variant="primary" size="md">
              Return to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
