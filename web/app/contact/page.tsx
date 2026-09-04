import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/ui/PageHero';
import { Button } from '@/components/ui/Button';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Annadata | Agricultural Collaboration & Support',
  description:
    'Connect with the Annadata agricultural technology team for farmer support, Krishi Vigyan Kendra partnerships, or organizational inquiries.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#F7F6F0] text-[#17201A]">
      <PageHero
        badge="GET IN TOUCH"
        title="Let's build better agriculture together."
        subtitle="Whether you are a farmer seeking guidance, a Krishi Vigyan Kendra researcher, or an agricultural organization, we welcome your collaboration."
        icon={<Mail className="w-4 h-4 text-[#3F7D3A]" />}
      />

      <section className="py-24 bg-[#F7F6F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Direct Channels (5 cols) */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#3F7D3A]">
                  CONTACT INFORMATION
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-[#173F2A] mt-1">
                  Dedicated to Indian Farming Communities
                </h2>
              </div>

              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-white border border-[#173F2A]/10 shadow-xs flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#EEF5E8] flex items-center justify-center text-[#3F7D3A] shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#173F2A]">Email Support</h3>
                    <p className="text-xs text-[#5F6F62] mt-0.5">For inquiries & scientific feedback</p>
                    <a href="mailto:support@annadata.ag" className="text-sm font-bold text-[#3F7D3A] hover:underline mt-2 block">
                      support@annadata.ag
                    </a>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-[#173F2A]/10 shadow-xs flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF8E8] flex items-center justify-center text-[#D8B45A] shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#173F2A]">Kisan IVR Helpline</h3>
                    <p className="text-xs text-[#5F6F62] mt-0.5">Toll-free voice assistance for keypad phones</p>
                    <span className="text-xs font-black text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full mt-2 inline-block">
                      Coming Soon
                    </span>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-[#173F2A]/10 shadow-xs flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#EEF5E8] flex items-center justify-center text-[#3F7D3A] shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#173F2A]">AgriTech Mission</h3>
                    <p className="text-xs text-[#5F6F62] mt-0.5">Empowering smallholder farmers across India</p>
                    <span className="text-xs font-bold text-[#173F2A] mt-2 block">
                      National Coverage • 15+ Agro-Climatic Zones
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Editorial Contact Form (7 cols) */}
            <div className="lg:col-span-7">
              <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#173F2A]/10 shadow-xl space-y-6">
                <div>
                  <h3 className="text-2xl font-black text-[#173F2A]">Send a Message</h3>
                  <p className="text-xs text-[#5F6F62] mt-1">
                    Fill out the details below and our team will get in touch with you shortly.
                  </p>
                </div>

                <form className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#173F2A]">Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Ramesh Patel"
                        className="w-full px-4 py-3 rounded-2xl bg-[#F7F6F0] border border-stone-200 text-xs text-[#173F2A] focus:outline-none focus:ring-2 focus:ring-[#3F7D3A]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#173F2A]">Mobile Number</label>
                      <input
                        type="tel"
                        placeholder="e.g. 9876543210"
                        className="w-full px-4 py-3 rounded-2xl bg-[#F7F6F0] border border-stone-200 text-xs text-[#173F2A] focus:outline-none focus:ring-2 focus:ring-[#3F7D3A]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#173F2A]">Email Address</label>
                      <input
                        type="email"
                        placeholder="ramesh@example.com"
                        className="w-full px-4 py-3 rounded-2xl bg-[#F7F6F0] border border-stone-200 text-xs text-[#173F2A] focus:outline-none focus:ring-2 focus:ring-[#3F7D3A]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#173F2A]">I am a...</label>
                      <select className="w-full px-4 py-3 rounded-2xl bg-[#F7F6F0] border border-stone-200 text-xs text-[#173F2A] focus:outline-none focus:ring-2 focus:ring-[#3F7D3A]">
                        <option>Farmer / किसान</option>
                        <option>Agronomist / Scientist</option>
                        <option>Partner Organization / NGO</option>
                        <option>General Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#173F2A]">Message / Query</label>
                    <textarea
                      rows={4}
                      placeholder="Tell us about your farm, crop query, or partnership inquiry..."
                      className="w-full px-4 py-3 rounded-2xl bg-[#F7F6F0] border border-stone-200 text-xs text-[#173F2A] focus:outline-none focus:ring-2 focus:ring-[#3F7D3A]"
                    />
                  </div>

                  <Button variant="primary" size="lg" className="w-full justify-center" icon={<Send className="w-4 h-4" />}>
                    Submit Message
                  </Button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
