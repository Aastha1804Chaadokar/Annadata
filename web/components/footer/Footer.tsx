import React from 'react';
import Link from 'next/link';
import { Sprout, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#F8FAF3] text-[#667267] text-xs border-t border-[#3F7D3A]/15 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-stone-200">
          {/* Column 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sprout className="w-5 h-5 text-[#3F7D3A]" />
              <span className="text-lg font-black text-[#285C32] tracking-wider">ANNADATA</span>
            </div>
            <p className="text-[#667267] text-xs leading-relaxed">
              Har Kisan, Har Fasal, Har Faisla.
              <br />
              India-focused agriculture technology platform empowering farmers through soil intelligence, localized weather guidance, and multilingual voice advisory.
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 className="text-[#285C32] font-bold mb-3 uppercase tracking-wider text-[11px]">Navigation</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-[#3F7D3A] transition-colors">Home</Link></li>
              <li><Link href="/how-it-works" className="hover:text-[#3F7D3A] transition-colors">How It Works</Link></li>
              <li><Link href="/features" className="hover:text-[#3F7D3A] transition-colors">Features</Link></li>
              <li><Link href="/for-farmers" className="hover:text-[#3F7D3A] transition-colors">For Farmers</Link></li>
              <li><Link href="/access-options" className="hover:text-[#3F7D3A] transition-colors">Access Options</Link></li>
              <li><Link href="/about" className="hover:text-[#3F7D3A] transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact & Legal */}
          <div>
            <h4 className="text-[#285C32] font-bold mb-3 uppercase tracking-wider text-[11px]">Platform Access</h4>
            <ul className="space-y-2">
              <li><Link href="/app" className="hover:text-[#3F7D3A] transition-colors">Get Started Portal</Link></li>
              <li><Link href="/access-options" className="hover:text-[#3F7D3A] transition-colors">Basic Phone IVR (Coming Soon)</Link></li>
              <li><a href="mailto:support@annadata.ag" className="hover:text-[#3F7D3A] transition-colors">contact@annadata.ag</a></li>
            </ul>
          </div>

          {/* Column 4: Mandatory Disclaimer */}
          <div>
            <h4 className="text-[#285C32] font-bold mb-3 uppercase tracking-wider text-[11px]">Important Notice</h4>
            <p className="text-[#667267] text-[11px] leading-relaxed">
              Annadata is an independent agriculture technology platform and is not a government service. Demo values and models are for illustrative presentation. Always consult official certified Soil Health Cards and local agricultural extension scientists.
            </p>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Annadata (अन्नदाता). All rights reserved.</p>
          <div className="flex items-center gap-1 text-[#667267]">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
            <span>for Indian Farmers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
